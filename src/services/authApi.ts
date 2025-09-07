import http from '@/utils/http';
import type { SolanaSignInInput } from '@solana/wallet-standard-features';
import { z } from "zod";

export type NonceReq = {
    protocol: 'solana-sign-message';
    chainNamespace: 'solana';
    chainId: string;
    domain: string;
    resources?: string[];
    statement?: string;
    version?: string;
    uri?: string;
};

export type VerifyReq = {
    protocol: 'solana-sign-message';
    chainNamespace: 'solana';
    chainId: string;
    input: any;
    payload: {
        message: string;
        signature: string;
        publicKey: string | null;
        address: string;
    };
};

export const SolanaSignInInputWithRequiredFieldsSchema: z.ZodType<SolanaSignInInput> = z.looseObject({
    statement: z.string().optional(),
    uri: z.string().url().optional(),
    version: z.string().min(1),
    chainId: z.string().optional(),
    nonce: z.string().min(1),
    issuedAt: z.iso.datetime().optional(),
    expirationTime: z.iso.datetime().optional(),
    notBefore: z.iso.datetime().optional(),
    requestId: z.string().optional(),
    resources: z.array(z.string()).optional(),
});


export type SolanaSignInInputWithRequiredFieldsParsed = z.infer<typeof SolanaSignInInputWithRequiredFieldsSchema>;


export const VerifyResponseSchema = z.looseObject({
    access: z.string().optional(),
    caipAddress: z.string().optional(),
    userId: z.string(),
});


export type VerifyResponse = z.infer<typeof VerifyResponseSchema>;

export const authApi = {
    async getNonce(body: NonceReq): Promise<SolanaSignInInputWithRequiredFieldsParsed> {
        const res = await http.post("/auth/nonce", body, { withCredentials: true });
        const parsed = SolanaSignInInputWithRequiredFieldsSchema.parse(res.data);
        return parsed;
    },


    async verify(body: VerifyReq): Promise<VerifyResponse> {
        const res = await http.post("/auth/verify", body, { withCredentials: true });
        const parsed = VerifyResponseSchema.parse(res.data);
        return parsed;
    },

    async fetchAccount({ address }: { address: string }) {
        return address
    }
};

export function isZodError(e: unknown): e is z.ZodError {
    return e instanceof z.ZodError;
}