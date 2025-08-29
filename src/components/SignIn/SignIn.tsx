import { useAppKit } from '@reown/appkit/react'
import { useAppKitProvider, useAppKitAccount } from '@reown/appkit/react'
import type { Provider } from '@reown/appkit-adapter-solana/react'

export default function SignIn() {
  const { open } = useAppKit()
  const { isConnected, address } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider<Provider>('solana')

  const connect = async () => open() 

  const signIn = async () => {
    if (!isConnected || !address || !walletProvider) return
    const { message, nonce } = await fetch('/api/auth/create', { method: 'POST' }).then(r => r.json())
    const bytes = new TextEncoder().encode(message)
    const signature = await walletProvider.signMessage(bytes) 
    const ok = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        address, 
        signature: Array.from(signature),
        message, nonce,
        chain: 'solana:mainnet'
      })
    }).then(r => r.ok)
    if (!ok) throw new Error('verify failed')
    // -> server set-cookie httpOnly / JWT
  }

  return (
    <div>
      {!isConnected ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <button onClick={signIn}>Sign in</button>
      )}
    </div>
  )
}
