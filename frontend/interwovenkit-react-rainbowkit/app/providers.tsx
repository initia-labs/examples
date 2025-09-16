"use client"

import { PropsWithChildren, useEffect } from "react"
import { createConfig, http, WagmiProvider } from "wagmi"
import { mainnet } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import "@rainbow-me/rainbowkit/styles.css"
import { initiaPrivyWallet, injectStyles, InterwovenKitProvider } from "@initia/interwovenkit-react"
import InterwovenKitStyles from "@initia/interwovenkit-react/styles.js"

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [initiaPrivyWallet],
    },
  ],
  {
    appName: "Privy",
    projectId: "Demo",
  }
)

const wagmiConfig = createConfig({
  connectors,
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
})
const queryClient = new QueryClient()

export default function Providers({ children }: PropsWithChildren) {
  useEffect(() => {
    // Inject styles into the shadow DOM used by Initia Wallet
    injectStyles(InterwovenKitStyles)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>
          <InterwovenKitProvider defaultChainId="interwoven-1">{children}</InterwovenKitProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
