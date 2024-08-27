const { createPublicClient, createWalletClient, decodeEventLog, getContract, http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const erc20Abi = require('./abis/erc20Abi.json');
const erc20FactoryAbi = require('./abis/erc20factoryabi.json');
const miniEVM = require('./chain');

const privateKey = process.env.PRIVATE_KEY;
const erc20FactoryAddress = '0xd53506E20eA25122aC6adc6462D9D1cf810Ef5a4';

// Create an account from the private key
const account = privateKeyToAccount(privateKey);

// Create a wallet client
const client = createWalletClient({
  account,
  chain: miniEVM,
  transport: http(),
});

// create a public client
const publicClient = createPublicClient({
  chain: miniEVM,
  transport: http(),
});

// Send the transaction
async function createERC20() {
  try {
    // call createERC20 function on the factory contract to create a new ERC20 token
    const hash = await client.writeContract({
      address: erc20FactoryAddress, // Factory address
      abi: erc20FactoryAbi,
      functionName: 'createERC20',
      args: ['Test', 'TST', 18],
    })
    console.log('Transaction sent. Hash:', hash);

    // Wait for the transaction to be confirmed
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get the transaction receipt and parse the logs for the ERC20Created event
    const receipt = await publicClient.getTransactionReceipt({
      hash: hash
    });
    const erc20CreatedLog = receipt.logs.find(log => 
      log.address.toLowerCase() === erc20FactoryAddress.toLowerCase() // Check if the log is from the factory address
    );

    // Check if the ERC20Created event was found in the logs and decode the created ERC20 address
    if (erc20CreatedLog) {
      const decodedLog = decodeEventLog({
        abi: erc20FactoryAbi,
        data: erc20CreatedLog.data,
        topics: erc20CreatedLog.topics,
      });
      console.log('New ERC20 address:', decodedLog.args.erc20);

      // Try reading the new ERC20 contract
      const erc20 = await getContract({
        address: decodedLog.args.erc20,
        abi: erc20Abi,
        client: {
          public: publicClient,
          wallet: client
        }
      });
      console.log('ERC20 name:', await erc20.read.name());
      console.log('ERC20 symbol:', await erc20.read.symbol());
      console.log('ERC20 decimals:', await erc20.read.decimals());
    } else {
      console.log('ERC20Created event not found in the logs');
    }

  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

createERC20();