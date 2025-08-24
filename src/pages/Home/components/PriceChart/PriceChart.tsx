import { createChart, ColorType, CandlestickSeries, CrosshairMode } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import type { CandlestickData } from '@/mocks/chart-data';

interface PriceChartProps {
    data: CandlestickData[];
    colors: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
}
const PriceChart = (props: PriceChartProps) => {
    const {
        data,
        colors: {
            backgroundColor = 'black',
            lineColor = '#2962FF',
            textColor = 'black',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;
    const chartContainerRef = useRef<HTMLDivElement>(null);

    const candleStickDataSource = data.map((datapoint) => {
        if (datapoint.close < 205) {
            return datapoint;
        }
        return { ...datapoint, color: 'orange', wickColor: 'orange' };
    });

    useEffect(() => {
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
        };

        const chart = createChart(chartContainerRef.current as HTMLElement, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            grid: {
                vertLines: {
                    color: '#646971', //màu của các đường thẳng dọc
                },
                horzLines: {
                    color: '#4b4a4a', //màu của các đường thẳng ngang
                },
            },
            crosshair: {
                mode: CrosshairMode.Normal, // Normal crosshair mode
                vertLine: {
                    width: 1,
                    color: '#e5e7eb',
                    style: 1, // Dashed line,
                    labelBackgroundColor: '#9B7DFF',
                },
                horzLine: {
                    width: 1,
                    color: '#e5e7eb',
                    style: 1, // Dashed line
                    labelBackgroundColor: '#9B7DFF',
                },
            },
            width: chartContainerRef.current?.clientWidth,
            height: 400,
        });

        chart.priceScale('right').applyOptions({
            borderColor: '#71649C', //màu của viền của trục y bên phải
        });

        chart.timeScale().applyOptions({
            borderColor: '#71649C', //màu của viền của trục x
            barSpacing: 10, //khoảng cách giữa các thanh
        });

        const currentLocale = window.navigator.languages[0];
        const myPriceFormatter = Intl.NumberFormat(currentLocale, {
            style: 'currency',
            currency: 'EUR', // Currency for data points
        }).format;

        chart.applyOptions({
            localization: {
                priceFormatter: myPriceFormatter,
            },
        });

        chart.timeScale().fitContent();

        const candlestickSeries = chart.addSeries(CandlestickSeries);
        candlestickSeries.setData(candleStickDataSource);

        candlestickSeries.applyOptions({
            wickUpColor: areaTopColor, //màu của thanh tăng - màu của thanh trên của thanh tăng
            upColor: areaTopColor, //màu của thanh tăng - màu của cái hình chữ nhật
            wickDownColor: areaBottomColor, //màu của thanh giảm - màu của thanh dưới của thanh giảm
            downColor: areaBottomColor, //màu của thanh giảm - màu của cái hình chữ nhật
            borderVisible: false, //nếu True thì có viền của thanh, nếu False thì không có viền của thanh
        });

        candlestickSeries.priceScale().applyOptions({
            autoScale: false, //nếu True thì giá trị của trục y sẽ thay đổi theo giá trị max-min của dữ liệu mà chart đang hiểm thị, nếu False thì giá trị của trục y sẽ không tự thay đổi theo giá trị của chart đang hiểm thị
            scaleMargins: {
                top: 0.1, //giá trị này là phần trăm của khoảng trống trên cùng của trục y
                bottom: 0.2, //giá trị này là phần trăm của khoảng trống dưới cùng của trục y
            },
        });

        // const areaSeries = chart.addSeries(AreaSeries, {
        //     lastValueVisible: false, // hide the last value marker for this series
        //     crosshairMarkerVisible: false, // hide the crosshair marker for this series
        //     lineColor: 'transparent', // hide the line
        //     topColor: 'rgba(41, 98, 255, 0.6)', // xanh dương với độ trong suốt 60%
        //     bottomColor: 'rgba(41, 98, 255, 0.05)', // xanh dương rất nhạt
        // });

        // areaSeries.setData(lineData);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            chart.remove();
        };
    }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);
    return <div ref={chartContainerRef}></div>;
};

export default PriceChart;
