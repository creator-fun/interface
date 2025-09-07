import { useState } from "react";
import { useAppKit, useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import type { Provider } from "@reown/appkit-adapter-solana/react";
import { authApi } from '@/services/authApi';

const APP_DOMAIN = import.meta.env.VITE_APP_DOMAIN as string;
const APP_URL = import.meta.env.VITE_APP_URL as string;

function buildSignMessage(input: any, address: string) {
  return [
    `${APP_DOMAIN} wants you to sign in with your Solana account:`,
    `${address}`,
    ``,
    input.statement || "Secure sign-in. This action does not create an on-chain transaction.",
    ``,
    `Domain: ${input.domain}`,
    `URI: ${input.uri}`,
    `Version: ${input.version || "1"}`,
    `Chain ID: ${input.chainId || "mainnet"}`,
    `Nonce: ${input.nonce}`,
    `Issued At: ${input.issuedAt}`,
    input.expirationTime ? `Expiration Time: ${input.expirationTime}` : undefined,
    ...(Array.isArray(input.resources) && input.resources.length
      ? [`Resources:`, ...input.resources.map((r: string) => `- ${r}`)]
      : [])
  ].filter(Boolean).join("\n");
}

export default function SignInButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setErr(null);
    try {
      if (!walletProvider) {
        await open();
        return;
      }
      if (!isConnected && typeof walletProvider.connect === "function") {
        await walletProvider.connect();
      }
      if (!isConnected) {
        await open();
        return;
      }

      if (!address) {
        console.log("Not connected!");
        return;
      }

      const input = await authApi.getNonce({
        protocol: "solana-sign-message",
        chainNamespace: "solana",
        chainId: "mainnet",
        domain: APP_DOMAIN,
        resources: [APP_URL]
      });

      const pubkey = walletProvider.publicKey!;

      const pubkeyBytes = pubkey.toBytes();

      const msg = buildSignMessage(input, address);
      console.log({ msg });
      const encoder = new TextEncoder();
      const signature: Uint8Array = await walletProvider.signMessage(encoder.encode(msg));

      console.log({ signature });

      const data = await authApi.verify({
        protocol: "solana-sign-message",
        chainNamespace: "solana",
        chainId: "mainnet",
        input,
        payload: {
          message: msg,
          signature: Buffer.from(signature).toString("base64"),
          publicKey: pubkeyBytes ? Buffer.from(pubkeyBytes).toString("base64") : null,
          address
        }
      });

      console.log("Signed in:", data);
    } catch (e: any) {
      console.log({ e })
      setErr(e?.message ?? "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <button onClick={() => {}}>Connect</button>
      {/* <button
        disabled={loading}
        onClick={onClick}
        style={{ padding: "10px 16px", borderRadius: 12, background: "#4f46e5", color: "#fff" }}
      >
        {loading ? "Signing…" : "Sign in with Phantom"}
      </button>
      {isConnected && address && (
        <span style={{ fontSize: 12, color: "#9ca3af" }}>Connected: {address}</span>
      )}
      {err && <span style={{ color: "#fca5a5", fontSize: 12 }}>{err}</span>} */}
    </div>
  );
}
