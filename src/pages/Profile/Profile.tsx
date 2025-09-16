import { LoginCard } from "@/components/LoginCard/LoginCard";
import { useSolanaSignIn } from "@/hooks/useSolanaSignIn";
import { authApi } from "@/services/authApi";
import { createSignInMessageText, type SolanaSignInInputWithRequiredFields } from "@solana/wallet-standard-util";

export default function Profile() {
  const hook = useSolanaSignIn({
    messages: {
      step1: "Step 1, connect wallet",
      step2: "Step 2, Sign In",
      step3: "Login success",
      connecting: "Connecting wallet…",
      signing: "Signing message…",
      fetchingAccount: "Fetching account…",
      idle: "",
      needWallet: "Wallet provider missing",
      notConnected: "Not connected",
    },
    auth: authApi,
    buildSignMessageText: (input: SolanaSignInInputWithRequiredFields) => createSignInMessageText(input),
    onSuccess: async ({ address, access }: any) => {
      console.log({ address, access })
      // TODO: persist session (cookie / JWT / Zustand)
      // navigate("/profile");
    },
    onLogout: async () => {
      // e.g., navigate("/");
    }
  });

  return <LoginCard hook={hook} />;
}
