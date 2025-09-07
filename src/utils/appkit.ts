import { createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana, solanaDevnet, solanaTestnet } from '@reown/appkit/networks'
import appMetadata from '@/constants/metadata'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID as string
const solanaAdapter = new SolanaAdapter({ registerWalletStandard: true })

export const modal = createAppKit({
    projectId,
    networks: [solana, solanaDevnet, solanaTestnet],
    adapters: [solanaAdapter],
    metadata: appMetadata,
    themeMode: "dark",
    features: {
        email: false,
        socials: []
    },
});
