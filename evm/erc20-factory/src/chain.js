const { defineChain } = require('viem');

const miniEVM = defineChain({
  id: 2594729740794688,
  name: 'MiniEVM',
  nativeCurrency: {
    decimals: 18,
    name: 'Gas Token',
    symbol: 'GAS',
  },
  rpcUrls: {
    default: {
      http: ['https://json-rpc.stoneevm-16.initia.xyz'],
    },
  },
})

module.exports = miniEVM;