"use client"

import { PropsWithChildren, useEffect } from "react"
import { createConfig, http, WagmiProvider } from "wagmi"
import { mainnet } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { initiaPrivyWalletConnector, injectStyles, InterwovenKitProvider } from "@initia/interwovenkit-react"
import InterwovenKitStyles from "@initia/interwovenkit-react/styles.js"

const wagmiConfig = createConfig({
  connectors: [initiaPrivyWalletConnector],
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
        <InterwovenKitProvider defaultChainId="interwoven-1">{children}</InterwovenKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
