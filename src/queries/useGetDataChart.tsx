import { useQuery } from '@tanstack/react-query';
import { chartApi } from '@/services/chartApi';

export interface IChartData {
    data: {
        area: [time: any, value: number];
        volume: [time: any, value: number, color: string];
        last_price: number;
        total_volume: number;
    };
}

export const useGetDataChart = (params: { tokenAddress: string }) => {
    console.log('params', params);
    return useQuery({
        queryKey: ['get-data-chart', params.tokenAddress],
        queryFn: () => chartApi.getDataChart(params.tokenAddress),
        enabled: !!params.tokenAddress,
    });
};
