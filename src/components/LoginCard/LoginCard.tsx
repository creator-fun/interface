import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import type { useSolanaSignIn } from "@/hooks/useSolanaSignIn";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";

type LoginCardProps = {
    hook: ReturnType<typeof useSolanaSignIn>;
};

export function LoginCard({ hook }: LoginCardProps) {
    const { step, message, address, isConnected, loading, error, connect, signIn, account, logout } = hook;

    return (
        <Card className="mx-auto mt-6 w-full max-w-xl shadow-sm">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Login</CardTitle>
                    <Badge variant="secondary">Step {step} / 3</Badge>
                </div>
                {message && <CardDescription>{message}</CardDescription>}
            </CardHeader>

            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {step === 1 && (
                    <Button onClick={connect} disabled={loading} className="w-full">
                        {loading ? "Connecting…" : "Connect Wallet"}
                    </Button>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                            <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                                <span className="font-medium text-foreground">Connected:</span>
                                <Badge variant={isConnected ? "default" : "secondary"}>{isConnected ? "Yes" : "No"}</Badge>
                            </div>
                            <div className="truncate">
                                <span className="font-medium text-foreground">Address:</span>{" "}
                                <span className="truncate align-middle">{address ?? "—"}</span>
                            </div>
                        </div>

                        {account && (
                            <div className="rounded-xl border bg-muted/30 p-3">
                                <pre className="max-h-60 overflow-auto text-xs">{JSON.stringify(account, null, 2)}</pre>
                            </div>
                        )}

                        <Button onClick={signIn} disabled={loading || !isConnected} className="w-full">
                            {loading ? "Signing…" : "Sign In"}
                        </Button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-3">
                        <Alert className="border-emerald-300 bg-emerald-50 text-emerald-800">
                            <AlertDescription>Signed in successfully.</AlertDescription>
                        </Alert>
                        <Button onClick={logout} variant="outline" className="w-full">
                            Logout
                        </Button>
                    </div>
                )}
            </CardContent>

            {/* <CardFooter>
                <details className="w-full text-sm text-muted-foreground">
                    <summary className="cursor-pointer select-none py-1">Developer notes</summary>
                    <ul className="list-disc space-y-1 pl-5">
                        <li>
                            To exclude wallets, configure <code>excludeWalletIds</code> in your <code>createAppKit</code> setup.
                        </li>
                        <li>
                            This component opens the modal with <code>open({`{ view: "Connect", namespace: "solana" }`})</code> so only
                            Solana wallets appear.
                        </li>
                        <li>Fill the TODOs to persist auth (cookie/JWT/Zustand) and navigate after success.</li>
                    </ul>
                </details>
            </CardFooter> */}
        </Card>
    );
}