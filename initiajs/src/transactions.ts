  import { Wallet, LCDClient, MnemonicKey, MsgSend, Tx, WaitTxBroadcastResult } from '@initia/initia.js';

  const mnemonic = process.env.MNEMONIC;
  const lcdUrl = process.env.LCD_URL || "https://lcd.testnet.initia.xyz";
  const gasPrices = process.env.GAS_PRICES || "0.15move/944f8dd8dc49f96c25fea9849f16436dcfa6d564eec802f3ef7f8b3ea85368ff"; // Will be INIT for mainnet

  const senderAddress = process.env.SENDER_ADDRESS || 'init1w4cqq6udjqtvl5xx0x6gjeyzgwtze8c05kysnu';
  const recipientAddress = process.env.RECIPIENT_ADDRESS || 'init1w4cqq6udjqtvl5xx0x6gjeyzgwtze8c05kysnu';
  const amount = process.env.AMOUNT || '1000uinit';

  const key: MnemonicKey = new MnemonicKey({ mnemonic });
  const lcd: LCDClient = new LCDClient(lcdUrl, { gasPrices });
  const wallet: Wallet = new Wallet(lcd, key);
  const sendMsg: MsgSend = new MsgSend(senderAddress, recipientAddress, amount);

  async function sendTransaction(): Promise<WaitTxBroadcastResult> {
    try {
      const signedTx: Tx = await wallet.createAndSignTx({
        msgs: [sendMsg],
        memo: 'memo',
      });
      
      const result: WaitTxBroadcastResult = await lcd.tx.broadcast(signedTx);
      console.log('Transaction successful');
      console.log('Transaction hash:', result.txhash);
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Transaction failed:', error.message);
      } else {
        console.error('Transaction failed with an unknown error');
      }
      throw error;
    }
  }

  sendTransaction()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));