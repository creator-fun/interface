import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
const PriceChart = (props: any) => {
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
                    color: '#646971',
                },
                horzLines: {
                    color: '#4b4a4a',
                },
            },
            crosshair: {
                mode: 0, // Normal crosshair mode
                vertLine: {
                    width: 1,
                    color: '#e5e7eb',
                    style: 1, // Dashed line
                },
                horzLine: {
                    width: 1,
                    color: '#e5e7eb',
                    style: 1, // Dashed line
                },
            },
            width: chartContainerRef.current?.clientWidth,
            height: 400,
        });
        chart.timeScale().fitContent();

        const newSeries = chart.addSeries(CandlestickSeries, {
            upColor: areaTopColor,
            downColor: areaBottomColor,
        });
        newSeries.setData(data);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            chart.remove();
        };
    }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);
    return <div ref={chartContainerRef}></div>;
};

export default PriceChart;
