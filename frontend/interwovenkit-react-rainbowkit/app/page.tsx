"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useState } from "react"
import { truncate } from "@initia/utils"
import { useInterwovenKit } from "@initia/interwovenkit-react"

export default function Home() {
  const { address, username, openWallet, openBridge, requestTxBlock } = useInterwovenKit()

  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  const send = async () => {
    const messages = [
      {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
          fromAddress: address,
          toAddress: address,
          amount: [{ amount: "1000000", denom: "uinit" }],
        },
      },
    ]

    const { transactionHash } = await requestTxBlock({ messages })
    setTransactionHash(transactionHash)
  }

  const bridgeTransferDetails = {
    srcChainId: "interwoven-1",
    srcDenom: "move/edfcddacac79ab86737a1e9e65805066d8be286a37cb94f4884b892b0e39f954",
    dstChainId: "interwoven-1",
    dstDenom: "ibc/6490A7EAB61059BFC1CDDEB05917DD70BDF3A611654162A1A47DB930D40D8AF4",
    quantity: "1",
  }

  if (!address) {
    return <ConnectButton />
  }

  return (
    <>
      <button onClick={send}>Send</button>
      <button onClick={() => openBridge(bridgeTransferDetails)}>Bridge</button>
      <button onClick={openWallet}>{truncate(username ?? address)}</button>
      {transactionHash && <p>Transaction hash: {transactionHash}</p>}
    </>
  )
}
