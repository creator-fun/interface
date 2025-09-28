import { tokenInfoApi } from '@/services/tokenInfo';
import { useMutation, useQuery } from '@tanstack/react-query';

export interface TokenInfo {
    id?: string;
    address?: string;
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
    launchpad: string;
    usdPrice: number;
    mcap: number;
}

export const useGetTokenInfo = () => {
    return useMutation({
        mutationFn: (address: string) => tokenInfoApi.getTokenInfoByAddress(address),
    });
};

export const useGetTokenInfoByAddress = (address: string) => {
    return useQuery({
        queryKey: ['tokenInfoByAddress', address],
        queryFn: () => tokenInfoApi.getTokenInfoByAddress(address),
        enabled: !!address,
    });
};
