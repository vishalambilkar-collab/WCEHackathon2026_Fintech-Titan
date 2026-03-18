export async function getCryptoPrice(coin: string) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=inr`
  );

  const data = await response.json();
  return data[coin].inr;
}