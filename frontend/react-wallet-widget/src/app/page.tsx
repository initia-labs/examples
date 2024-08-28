'use client';

import { useAddress, useWallet } from '@initia/react-wallet-widget';
import { MsgSend } from '@initia/initia.js';
import type { EncodeObject } from '@cosmjs/proto-signing';
import type { Msg } from '@initia/initia.js';
import { useState } from 'react';

const toEncodeObject = (msgs: Msg[]): EncodeObject[] => {
  return msgs.map((msg) => ({ typeUrl: msg.packAny().typeUrl, value: msg.toProto() }));
};

export default function Home() {
  const address = useAddress();
  const { onboard, view, requestTx } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const send = async () => {
    if (!address) return; //check if wallet is connected
    setIsLoading(true);
    try {
      const msgs = [new MsgSend(address, address, '1000000uinit')];
      const hash = await requestTx({ messages: toEncodeObject(msgs), memo: 'Hello World' });
      setTransactionHash(hash);
      console.log(hash);
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-white">
      <div className="z-10 max-w-5xl w-full items-center justify-start font-mono text-sm flex flex-col mb-auto">
        {address ? (
          <div className="flex flex-col space-y-4">
            <button
              onClick={view}
              className="bg-transparent text-black font-bold py-2 px-4 rounded border border-black h-[10vh] flex items-center justify-center"
            >
              {address}
            </button>
            <button
              onClick={send}
              disabled={isLoading}
              className="bg-transparent text-black font-bold py-2 px-4 rounded border border-black h-[10vh] flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send 1 INIT'}
            </button>
            {transactionHash && (
              <p className="text-green-600">
                Transaction successful:{' '}
                <a
                  href={`https://scan.initia.xyz/initiation-1/txs/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {transactionHash}
                </a>
              </p>
            )}
          </div>
        ) : (
          <button
            onClick={onboard}
            className="bg-transparent text-black font-bold py-2 px-4 rounded border border-black h-[10vh] flex items-center justify-center"
          >
            Connect
          </button>
        )}
      </div>
    </main>
  );
}
