import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type WalletProviderId = "phantom" | "solflare" | string;

export interface AuthAccount {
  address: string;             // base58 Solana address
  userId: string;              // backend user id
  caipAddress?: string;        // e.g. "solana:mainnet:..."
  access?: string;             // access/JWT token (optional)
  provider?: WalletProviderId; // wallet provider id/name
  lastLoginAt: number;         // epoch ms
}

export interface AuthState {
  current: AuthAccount | null;
  byAddress: Record<string, AuthAccount>;

  // actions
  loginSuccess: (payload: AuthAccount) => void;
  updateToken: (address: string, access?: string) => void;
  removeAccount: (address: string) => void;
  logout: () => void;
  hydrateFromAddress: (address: string) => void;
}

// Safe storage for SSR (Next.js):
const storage = createJSONStorage(() => {
  if (typeof window === "undefined") {
    // no-op storage for server
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    } as any;
  }
  return window.localStorage;
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      current: null,
      byAddress: {},

      loginSuccess: (payload) => {
        set((s) => {
          const byAddress = { ...s.byAddress, [payload.address]: payload };
          return { byAddress, current: payload };
        });
      },

      updateToken: (address, access) => {
        set((s) => {
          const existing = s.byAddress[address];
          if (!existing) return {} as any;
          const updated = { ...existing, access } as AuthAccount;
          const byAddress = { ...s.byAddress, [address]: updated };
          const current = s.current?.address === address ? updated : s.current;
          return { byAddress, current };
        });
      },

      removeAccount: (address) => {
        set((s) => {
          const byAddress = { ...s.byAddress };
          delete byAddress[address];
          const current = s.current?.address === address ? null : s.current ?? null;
          return { byAddress, current };
        });
      },

      logout: () => {
        set(() => ({ current: null }));
      },

      hydrateFromAddress: (address) => {
        const acc = get().byAddress[address] || null;
        set(() => ({ current: acc }));
      },
    }),
    {
      name: "auth-store:v1",
      version: 1,
      storage,
      // Only persist these keys
      partialize: (state) => ({ byAddress: state.byAddress, current: state.current }),
      // If you later change shapes, add a migrate() here.
    }
  )
);

export const useCurrentAccount = () => useAuthStore((s) => s.current);
export const useIsLoggedIn = () => !!useAuthStore((s) => s.current?.access);
