import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppKit, useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useAppKitConnection, type Provider } from "@reown/appkit-adapter-solana/react";
import type { authApi, NonceReq, VerifyReq } from "@/services/authApi";
import type { SolanaSignInInputWithRequiredFields } from "@solana/wallet-standard-util";
import { useAuthStore } from "@/stores/auth.store";

/**
 * useAppKitPhantomLogin
 *
 * A slim hook to orchestrate a 3-step login flow using Reown AppKit hooks (Solana + Phantom or any Solana wallet).
 * - No hard-coded messages; pass them via `messages`.
 * - No backend details; pass your API functions via `auth`.
 * - No storage; add your own (cookies/jwt/Zustand) in the TODO sections below.
 *
 * Steps:
 * 1) Connect wallet
 * 2) Show address and (optionally) pre-fetched account data; allow Sign In
 * 3) On success, call `onSuccess` (typical: navigate to /profile)
 *
 * Docs used:
 * - useAppKit / useAppKitAccount / useAppKitProvider hooks: https://docs.reown.com/appkit/next/core/hooks
 * - includeWalletIds / excludeWalletIds config for filtering wallets in modal: https://docs.reown.com/appkit/react/core/options#excludewalletids
 */

export type LoginStep = 1 | 2 | 3;

export interface Messages {
    step1?: string;
    step2?: string;
    step3?: string;
    connecting?: string;
    signing?: string;
    fetchingAccount?: string;
    idle?: string;
    needWallet?: string;
    notConnected?: string;
}

export interface AccountShape {

}

export interface AuthApi {
    getNonce: (params: NonceReq) => Promise<any>;
    verify: (params: VerifyReq) => Promise<{ access?: string; caipAddress?: string; userId: string;[k: string]: any }>;
    fetchAccount?: (params: { address: string; token?: string }) => Promise<AccountShape | null>;
}

export interface UseAppKitPhantomLoginOptions {
    messages?: Messages;
    autoPrefetchAccount?: boolean;
    onSuccess?: (ctx: { address: string; access?: string; }) => void | Promise<void>;
    onLogout?: () => void | Promise<void>;
    auth: typeof authApi;
    buildSignMessageText: (input: SolanaSignInInputWithRequiredFields) => string;
}

export function useSolanaSignIn(opts: UseAppKitPhantomLoginOptions) {
    const {
        messages,
        // autoPrefetchAccount = true,
        onSuccess,
        auth,
        buildSignMessageText,
        onLogout
    } = opts;

    const loginSuccess = useAuthStore((state) => state.loginSuccess)
    const logoutStore = useAuthStore((state) => state.logout)
    const current = useAuthStore((state) => state.current);

    // AppKit hooks
    const { open } = useAppKit();
    const { connection } = useAppKitConnection();
    const { address, isConnected, status } = useAppKitAccount({ namespace: "solana" });
    
    const { walletProvider } = useAppKitProvider<Provider>("solana");

    console.log("current address", { connection })

    // local state
    const [step, setStep] = useState<LoginStep>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [account, setAccount] = useState<any | null>(null); // TODO: define user info schema
    const [token, setToken] = useState<string | undefined>(undefined);

    const mounted = useRef(true);
    useEffect(() => () => { mounted.current = false; }, []);

    useEffect(() => {
        if (current?.address && isConnected) {
            setStep(3);
        }
    }, [current?.address, isConnected]);

    useEffect(() => {
        if (status === 'disconnected' && !current?.address) {
            setLoading(false);
            setStep(1);
        }
    }, [status, current?.address]);

    const uiMessage = useMemo(() => {
        if (loading && step === 1) return messages?.connecting ?? messages?.step1 ?? messages?.idle;
        if (loading && step === 2) return messages?.signing ?? messages?.step2 ?? messages?.idle;
        if (step === 1) return messages?.step1 ?? messages?.idle;
        if (step === 2) return messages?.step2 ?? messages?.idle;
        return messages?.step3 ?? messages?.idle;
    }, [loading, step, messages]);

    useEffect(() => {
        if (isConnected && step === 1 && !current?.address) {
            setStep(2);
        }
    }, [isConnected, step, current?.address]);

    // useEffect(() => {
    //     (async () => {
    //         if (!autoPrefetchAccount) return;
    //         if (!isConnected || !address) return;
    //         if (!auth.fetchAccount) return;
    //         try {
    //             setLoading(true);
    //             const acc = await auth.fetchAccount({ address });
    //             if (!mounted.current) return;
    //             setAccount(acc ?? null);
    //         } catch (e) {
    //             // ignore prefetch errors
    //         } finally {
    //             if (mounted.current) setLoading(false);
    //         }
    //     })();
    // }, [autoPrefetchAccount, isConnected, address, auth]);

    const connect = useCallback(async () => {
        setError(null);
        console.log({ walletProvider, isConnected, address, open })
        try {
            if (!walletProvider) {
                await open({ view: "Connect", namespace: "solana" });
                return;
            }
            if (!isConnected && typeof walletProvider.connect === "function") {
                await walletProvider.connect();
            }
            if (!isConnected) {
                await open({ view: "Connect", namespace: "solana" });
                return;
            }
            if (!address) {
                setError(messages?.notConnected ?? "not_connected");
                return;
            }
            setStep(2);
        } catch (e: any) {
            console.log({ e });
            setError(e?.message ?? "connect_failed");
        }
    }, [walletProvider, isConnected, address, open, messages?.notConnected]);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            // 1) Best-effort disconnect wallet provider (Phantom implements disconnect)
            if (walletProvider && typeof walletProvider.disconnect === "function") {
                await walletProvider.disconnect();
            }


            // 2) Clear client-side auth/session — fill per your app
            // cookies.remove("auth_token", { path: "/" });
            // localStorage.removeItem("address");
            // useAuthStore.getState().clear();


            // 3) Optional: call your backend logout endpoint
            // await authApi.logout?.();
            logoutStore();


            // 4) Reset local UI state
            setAccount(null);
            setToken(undefined);
            setError(null);
            setStep(1);


            await onLogout?.();
        } catch (e) {
            // even if disconnect fails, still clear local state
            setAccount(null);
            setToken(undefined);
            setStep(1);
        } finally {
            console.log("go finnally")
            // if (mounted.current) {
            console.log("set loading false")
            setLoading(false)
            // };
        }
    }, [walletProvider, onLogout]);

    const signIn = useCallback(async () => {
        if (!address) {
            setError(messages?.notConnected ?? "not_connected");
            return;
        }
        if (!walletProvider) {
            setError(messages?.needWallet ?? "wallet_provider_missing");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const uri = window.location.href
            const currentUrl = new URL(uri);
            const domain = currentUrl.host;

            const input = await auth.getNonce({
                protocol: "solana-sign-message",
                chainNamespace: "solana",
                chainId: "mainnet",
                domain: window.location.hostname,
                resources: [window.location.origin],
            });

            console.log({ input });

            const messageText = buildSignMessageText({
                ...input,
                domain,
                address
            });
            const message = new TextEncoder().encode(messageText);
            const signature: Uint8Array = await walletProvider.signMessage(message);

            const pubkey = walletProvider.publicKey as { toBytes?: () => Uint8Array } | undefined;
            const pubkeyBytes = pubkey?.toBytes ? pubkey.toBytes() : undefined;

            const payload = {
                message: messageText,
                signature: toBase64(signature),
                publicKey: pubkeyBytes ? toBase64(pubkeyBytes) : null,
                address,
            };

            const res = await auth.verify({
                protocol: "solana-sign-message",
                chainNamespace: "solana",
                chainId: "mainnet",
                input,
                payload,
            });

            // ---- Store auth (JWT/cookie/Zustand) — TODO ----
            // Example:
            //   cookies.set("auth_token", res.token, { path: "/", sameSite: "lax" })
            //   useAuthStore.getState().setSession({ token: res.token, account: res.account })
            //   localStorage.setItem("address", address)
            // -----------------------------------------------'

            loginSuccess({
                address,
                userId: res.userId,
                caipAddress: res.caipAddress,
                access: res.access,
                provider: walletProvider.id,
                lastLoginAt: Date.now(),
            });

            console.log({ res })

            if (res?.access) setToken(res.access);
            if (res?.caipAddress !== undefined) setAccount(res.caipAddress);

            setStep(3);

            // Navigate or callback
            await onSuccess?.({ address, access: res?.access });
        } catch (e: any) {
            setError(e?.message ?? "sign_in_failed");
        } finally {
            if (mounted.current) setLoading(false);
        }
    }, [address, walletProvider, auth, buildSignMessageText, onSuccess, messages?.notConnected, messages?.needWallet]);

    const reset = useCallback(() => {
        setStep(1);
        setLoading(false);
        setError(null);
        setAccount(null);
        setToken(undefined);
    }, []);

    return {
        step,
        status,
        isConnected,
        address,
        account,
        token,
        loading,
        error,
        message: uiMessage,
        connect,
        signIn,
        logout,
        reset,
    } as const;
}

function toBase64(bytes: Uint8Array): string {
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)) as unknown as number[]);
    }
    return btoa(binary);
}