const lcdUrl = `https://lcd.stoneevm-16.initia.xyz`;

const erc20Address = "0x5E5f1a92eECA58053E8364630b66763aa6265Ab0"

async function erc20ToCoinDenom(contractAddress) {
  const response = await fetch(`${lcdUrl}/minievm/evm/v1/denoms/${contractAddress}`);
  const data = await response.json();
  return data;
}
async function coinDenomToErc20(denom) {
  const response = await fetch(`${lcdUrl}/minievm/evm/v1/contracts/by_denom?denom=${denom}`);
  const data = await response.json();
  return data;
}

(async () => {
  const coinDenomResponse = await erc20ToCoinDenom(erc20Address);
  console.log(coinDenomResponse.denom);
  const erc20Response = await coinDenomToErc20(coinDenomResponse.denom);
  console.log(erc20Response.address);
})();