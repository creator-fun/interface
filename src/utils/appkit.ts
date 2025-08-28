import { createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana, solanaDevnet } from '@reown/appkit/networks'

const projectId = 'b44bf50885384cf4f0c7e4f9eaf5ec33'

const solanaAdapter = new SolanaAdapter({ registerWalletStandard: true })

export const modal = createAppKit({
    projectId,
    networks: [solana, solanaDevnet],
    adapters: [solanaAdapter],
    metadata: {
        name: 'Creator Funs',
        description: 'Social x Launchpad app',
        url: 'https://interface-self-one.vercel.app',
        icons: []
    }
})
