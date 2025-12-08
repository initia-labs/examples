const { createPublicClient, createWalletClient, decodeEventLog, getContract, http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const erc20Abi = require('../abis/erc20Abi.json');
const erc20FactoryAbi = require('../abis/erc20FactoryAbi.json');
const miniEVM = require('./chain');

require('dotenv').config();

const rawPrivateKey = process.env.PRIVATE_KEY;
if (!rawPrivateKey) {
  throw new Error('PRIVATE_KEY environment variable is not set.');
}
const privateKey = rawPrivateKey.startsWith('0x') ? rawPrivateKey : `0x${rawPrivateKey}`;

const erc20FactoryAddress = process.env.ERC20_FACTORY_ADDRESS;
if (!erc20FactoryAddress) {
  throw new Error('ERC20_FACTORY_ADDRESS environment variable is not set.');
}

// Create an account from the private key.
const account = privateKeyToAccount(privateKey);

// Create a wallet client.
const client = createWalletClient({
  account,
  chain: miniEVM,
  transport: http(),
});

// Create a public client.
const publicClient = createPublicClient({
  chain: miniEVM,
  transport: http(),
});

// Send the transaction.
async function createERC20() {
  try {
    // Call createERC20 function on the factory contract to create a new ERC20 token.
    const hash = await client.writeContract({
      address: erc20FactoryAddress,
      abi: erc20FactoryAbi,
      functionName: 'createERC20',
      args: ['Test', 'TST', 18],
    });

    console.log('Transaction sent. Hash:', hash);

    // Wait briefly for the transaction to be processed.
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get the transaction receipt and parse the logs for the ERC20Created event.
    const receipt = await publicClient.getTransactionReceipt({ hash });

    const erc20CreatedLog = receipt.logs.find(
      // Check if the log is from the factory address.
      log => log.address.toLowerCase() === erc20FactoryAddress.toLowerCase()
    );

    // Check whether the ERC20Created event exists in the logs, then decode the created ERC20 address.
    if (erc20CreatedLog) {
      const decodedLog = decodeEventLog({
        abi: erc20FactoryAbi,
        data: erc20CreatedLog.data,
        topics: erc20CreatedLog.topics,
      });

      console.log('New ERC20 address:', decodedLog.args.erc20);

      // Try reading data from the new ERC20 contract.
      const erc20 = await getContract({
        address: decodedLog.args.erc20,
        abi: erc20Abi,
        client: {
          public: publicClient,
          wallet: client,
        },
      });

      console.log('ERC20 name:', await erc20.read.name());
      console.log('ERC20 symbol:', await erc20.read.symbol());
      console.log('ERC20 decimals:', await erc20.read.decimals());
    } else {
      console.log('ERC20Created event not found in logs');
    }

  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

createERC20();