import type { TokenInfo } from '@/queries/useGetTokenInfo';
import http from '@/utils/http';

const baseURL = 'https://lite-api.jup.ag/';

export const tokenInfoApi = {
    getTokenInfo(params: { address: string }) {
        return http.get<TokenInfo[]>('/tokens/v2/search', {
            baseURL: baseURL,
            params: {
                query: params.address,
            },
        });
    },
    getTokenInfoByAddress(address: string) {
        return http.get<TokenInfo[]>('/tokens/v2/search', {
            baseURL: baseURL,
            params: {
                query: address,
            },
        });
    },
};
