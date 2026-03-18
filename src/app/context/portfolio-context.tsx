import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface IndianStock {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

export interface MutualFund {
  id: string;
  name: string;
  units: number;
  buyNav: number;
  currentNav: number;
}

export interface GoldSilver {
  id: string;
  type: 'gold' | 'silver';
  grams: number;
  buyPricePerGram: number;
  currentPricePerGram: number;
}

export interface ForeignStock {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPriceUSD: number;
  currentPriceUSD: number;
}

interface PortfolioContextType {
  indianStocks: IndianStock[];
  cryptocurrencies: Cryptocurrency[];
  mutualFunds: MutualFund[];
  goldSilver: GoldSilver[];
  foreignStocks: ForeignStock[];
  usdToInr: number;

  setIndianStocks: (stocks: IndianStock[]) => void;
  setCryptocurrencies: (crypto: Cryptocurrency[]) => void;
  setMutualFunds: (funds: MutualFund[]) => void;
  setGoldSilver: (gs: GoldSilver[]) => void;
  setForeignStocks: (stocks: ForeignStock[]) => void;

  loadDemoPortfolio: () => void; // 🔥 NEW
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [indianStocks, setIndianStocks] = useState<IndianStock[]>([]);
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [mutualFunds, setMutualFunds] = useState<MutualFund[]>([]);
  const [goldSilver, setGoldSilver] = useState<GoldSilver[]>([]);
  const [foreignStocks, setForeignStocks] = useState<ForeignStock[]>([]);
  const [usdToInr] = useState(83.5);

  // 🔥 DEMAT SIMULATION FUNCTION
  const loadDemoPortfolio = () => {
    setIndianStocks([
      {
        id: '1',
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd',
        quantity: 12,
        buyPrice: 2400,
        currentPrice: 2580,
      },
      {
        id: '2',
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        quantity: 6,
        buyPrice: 3600,
        currentPrice: 3820,
      },
    ]);

    setCryptocurrencies([
      {
        id: '3',
        symbol: 'bitcoin',
        name: 'Bitcoin',
        quantity: 0.2,
        buyPrice: 4000000,
        currentPrice: 4500000,
      },
      {
        id: '4',
        symbol: 'ethereum',
        name: 'Ethereum',
        quantity: 1.5,
        buyPrice: 250000,
        currentPrice: 295000,
      },
    ]);

    setMutualFunds([
      {
        id: '5',
        name: 'SBI Blue Chip Fund',
        units: 200,
        buyNav: 65,
        currentNav: 72,
      },
    ]);

    setGoldSilver([
      {
        id: '6',
        type: 'gold',
        grams: 30,
        buyPricePerGram: 6000,
        currentPricePerGram: 6480,
      },
    ]);

    setForeignStocks([
      {
        id: '7',
        symbol: 'AAPL',
        name: 'Apple Inc',
        quantity: 4,
        buyPriceUSD: 170,
        currentPriceUSD: 185,
      },
    ]);
  };

  // 🔁 Fake live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIndianStocks(prev =>
        prev.map(stock => ({
          ...stock,
          currentPrice: stock.currentPrice * (1 + (Math.random() - 0.5) * 0.01),
        }))
      );

      setCryptocurrencies(prev =>
        prev.map(crypto => ({
          ...crypto,
          currentPrice: crypto.currentPrice * (1 + (Math.random() - 0.5) * 0.02),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        indianStocks,
        cryptocurrencies,
        mutualFunds,
        goldSilver,
        foreignStocks,
        usdToInr,
        setIndianStocks,
        setCryptocurrencies,
        setMutualFunds,
        setGoldSilver,
        setForeignStocks,
        loadDemoPortfolio, 
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};