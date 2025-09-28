import { createChart, ColorType, CrosshairMode, AreaSeries, LastPriceAnimationMode } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { useGetDataChart } from '@/queries/useGetDataChart';
import dayjs from 'dayjs';
interface Props {
    tokenAddress?: string;
}

const PriceChart = ({ tokenAddress }: Props) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const areaSeriesRef = useRef<any>(null);
    const currentDataRef = useRef<any[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    console.log('tokenAddress 123', tokenAddress);

    const { data } = useGetDataChart({ tokenAddress: tokenAddress || '' });
    console.log('data chart', data);

    const formatTimeByFilter = (time: any) => {
        if (!time) return '';

        const timeObj = typeof time === 'string' ? dayjs(time) : dayjs(time * 1000);

        return timeObj.format('HH:mm');
    };

    // Format giá trị cho trục Y
    const formatPrice = (price: number) => {
        if (price === 0) return '0';

        const absPrice = Math.abs(price);

        // Nếu giá trị rất nhỏ (< 0.0001), hiển thị scientific notation
        if (absPrice < 0.0001) {
            return price.toExponential(2);
        }

        // Nếu giá trị nhỏ (< 0.01), hiển thị với 8 chữ số thập phân
        if (absPrice < 0.01) {
            return price.toFixed(8);
        }

        // Nếu giá trị nhỏ (< 1), hiển thị với 6 chữ số thập phân
        if (absPrice < 1) {
            return price.toFixed(6);
        }

        // Nếu giá trị lớn hơn 1, hiển thị với 4 chữ số thập phân
        return price.toFixed(4);
    };

    function formatDataForChart(data: any[]): any[] {
        return data.map((item) => ({
            time: Math.floor(new Date(item.timestamp).getTime() / 1000), // UNIX seconds
            value: item.usdPrice,
        }));
    }

    // Function để cập nhật điểm cuối với giá trị random ±1%
    const updateLastDataPoint = () => {
        if (!areaSeriesRef.current || currentDataRef.current.length === 0) return;

        const lastPoint = currentDataRef.current[currentDataRef.current.length - 1];
        if (!lastPoint) return;

        // Tạo random percentage từ -1% đến +1%
        const randomPercentage = (Math.random() - 0.5) * 2 * 0.01; // -0.01 to 0.01
        const newValue = lastPoint.value * (1 + randomPercentage);

        // Tạo timestamp mới (hiện tại)
        const newTime = Math.floor(Date.now() / 1000);

        const newPoint = {
            time: newTime,
            value: newValue,
        };

        // Cập nhật currentDataRef
        currentDataRef.current = [...currentDataRef.current, newPoint];

        // Cập nhật chart với điểm mới
        areaSeriesRef.current.update(newPoint);
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;
        if (!data) return;
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
        };

        const chartOptions = {
            layout: {
                textColor: '#7A7A83',
                background: { type: ColorType.Solid, color: 'transparent' },
            },
            grid: {
                vertLines: {
                    color: 'rgba(255, 255, 255, 0.03)',
                },
                horzLines: {
                    color: 'rgba(255, 255, 255, 0.03)',
                },
            },
        };

        const chart = createChart(chartContainerRef.current, {
            ...chartOptions,
            crosshair: {
                mode: CrosshairMode.Normal,
                horzLine: {
                    color: '#44444B',
                },
                vertLine: {
                    color: '#44444B',
                },
            },
            width: chartContainerRef.current?.clientWidth,
            height: 240,
        });

        chart.applyOptions({
            rightPriceScale: {
                visible: true,
                borderVisible: true,
                borderColor: '#1B1B1C',
                autoScale: true,
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
            },
            leftPriceScale: {
                visible: false,
            },
            // handleScroll: {
            //     mouseWheel: false, // tắt cuộn bằng wheel
            //     pressedMouseMove: false, // tắt kéo bằng chuột
            //     horzTouchDrag: false, // tắt kéo ngang trên mobile
            //     vertTouchDrag: false, // tắt kéo dọc trên mobile
            // },
            // handleScale: {
            //     axisPressedMouseMove: false, // tắt scale bằng kéo trục
            //     mouseWheel: false, // tắt zoom bằng wheel
            //     pinch: false, // tắt pinch zoom trên mobile
            // },
            timeScale: {
                tickMarkFormatter: (time: any) => {
                    return formatTimeByFilter(time);
                },
            },
        });

        const areaSeries = chart.addSeries(AreaSeries, {
            topColor: 'rgba(22, 194, 132, 0.50)',
            bottomColor: 'rgba(22, 194, 132, 0.00)',
            lineColor: '#16C284',
            lineWidth: 1,
            lastPriceAnimation: LastPriceAnimationMode.OnDataUpdate,
            priceFormat: {
                type: 'custom',
                formatter: (price: number) => formatPrice(price),
                minMove: 0.00000001,
            },
        });

        const dataReturn = formatDataForChart((data?.data as any)?.points as any);
        areaSeries.setData(dataReturn || []);

        // Lưu areaSeries và data vào ref
        areaSeriesRef.current = areaSeries;
        currentDataRef.current = dataReturn || [];

        chart.timeScale().fitContent();

        // Setup interval để cập nhật mỗi 5 giây
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            updateLastDataPoint();
        }, 5000);

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);

            // Cleanup interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            chart.remove();
        };
    }, [data]);
    return <div ref={chartContainerRef}></div>;
};

export default PriceChart;
