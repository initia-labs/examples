const { createPublicClient, createWalletClient, decodeEventLog, getContract, http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const erc20Abi = require('./erc20Abi.json');
const erc20FactoryAbi = require('./erc20factoryabi.json');
const miniEVM = require('./chain');

const privateKey = '0x2278858f8769f3dc1eeaff80c2fb073f6a0a6739fb2a1a018e2570017ab89263';
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
    const hash = await client.writeContract({
      address: erc20FactoryAddress, // Factory address
      abi: erc20FactoryAbi,
      functionName: 'createERC20',
      args: ['Test', 'TST', 18],
    })
    console.log('Transaction sent. Hash:', hash);
    const receipt = await publicClient.getTransactionReceipt({
      hash: hash
    });
    // Sleep for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    const erc20CreatedLog = receipt.logs.find(log => 
      log.address.toLowerCase() === erc20FactoryAddress.toLowerCase() // Check if the log is from the factory address
    );

    if (erc20CreatedLog) {
      const decodedLog = decodeEventLog({
        abi: erc20FactoryAbi,
        data: erc20CreatedLog.data,
        topics: erc20CreatedLog.topics,
      });

      console.log('New ERC20 address:', decodedLog.args.erc20);

      // Read the ERC20 contract
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