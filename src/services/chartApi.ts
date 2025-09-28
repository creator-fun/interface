import type { IChartData } from '@/queries/useGetDataChart';
import http from '@/utils/http';

export const chartApi = {
    getDataChart(address: string) {
        return http.get<IChartData>(`/tokens/${address}/history`);
    },
};
