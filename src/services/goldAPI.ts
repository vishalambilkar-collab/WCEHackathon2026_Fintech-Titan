export async function getGoldPrice() {
  const response = await fetch(
    "https://api.metals.live/v1/spot/gold"
  );

  const data = await response.json();
  return data[0].price;
}