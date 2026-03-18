export async function getStockPrice(symbol: string) {
  const apiKey = import.meta.env.VITE_TWELVEDATA_API_KEY;

  const response = await fetch(
    `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`
  );

  const data = await response.json();
  return data.price;
}