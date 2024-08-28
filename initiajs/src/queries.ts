import { LCDClient, Coin } from '@initia/initia.js';

const lcdUrl = 'https://lcd.testnet.initia.xyz';
const lcd: LCDClient = new LCDClient(lcdUrl, {});

async function queryBalance(address: string) {
  const [coins] = await lcd.bank.balance(address);
  console.log(`${address} has:`);
  coins.toArray().forEach((coin: Coin) => {
    console.log(`- ${coin.amount.toString()} ${coin.denom}`);
  });
}

queryBalance('init1w4cqq6udjqtvl5xx0x6gjeyzgwtze8c05kysnu');