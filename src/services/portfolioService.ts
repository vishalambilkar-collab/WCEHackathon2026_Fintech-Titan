import { getCryptoPrice } from "./cryptoAPI";
import { getStockPrice } from "./stockAPI";
import { getGoldPrice } from "./goldAPI";

type Asset = {
  type: "crypto" | "stock" | "gold";
  symbol: string;
  quantity: number;
  buyPrice: number;
};

export async function calculatePortfolio(assets: Asset[]) {
  try {
    const results = await Promise.all(
      assets.map(async (asset) => {
        let currentPrice = 0;

        if (asset.type === "crypto") {
          currentPrice = (await getCryptoPrice(asset.symbol)) || 0;
        } else if (asset.type === "stock") {
          currentPrice = (await getStockPrice(asset.symbol)) || 0;
        } else if (asset.type === "gold") {
          currentPrice = (await getGoldPrice()) || 0;
        }

        return {
          value: currentPrice * asset.quantity,
          investment: asset.buyPrice * asset.quantity,
        };
      })
    );

    const totalValue = results.reduce((sum, r) => sum + r.value, 0);
    const totalInvestment = results.reduce((sum, r) => sum + r.investment, 0);

    return {
      totalValue,
      totalInvestment,
      profitLoss: totalValue - totalInvestment,
    };
  } catch (error) {
    console.error("Portfolio calculation error:", error);
    return {
      totalValue: 0,
      totalInvestment: 0,
      profitLoss: 0,
    };
  }
}