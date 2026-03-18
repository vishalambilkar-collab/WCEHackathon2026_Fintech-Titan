import { useMemo, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { usePortfolio } from '@/app/context/portfolio-context';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import IndicesChart from '@/app/components/indices-chart';
import { calculatePortfolio } from '@/services/portfolioService';

export default function PortfolioDashboard() {
  const {
    indianStocks,
    cryptocurrencies,
    mutualFunds,
    goldSilver,
    foreignStocks,
    usdToInr,
  } = usePortfolio();

  const [liveData, setLiveData] = useState<any>(null);

  // Convert context → assets for API
  const assets = [
    ...indianStocks.map((s) => ({
      type: "stock",
      symbol: s.symbol,
      quantity: s.quantity,
      buyPrice: s.buyPrice,
    })),
    ...cryptocurrencies.map((c) => ({
      type: "crypto",
      symbol: c.id || c.symbol,
      quantity: c.quantity,
      buyPrice: c.buyPrice,
    })),
    ...goldSilver.map((g) => ({
      type: "gold",
      symbol: "gold",
      quantity: g.grams,
      buyPrice: g.buyPricePerGram,
    })),
  ];

  const fetchLiveData = async () => {
    const result = await calculatePortfolio(assets);
    setLiveData(result);
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 10000);
    return () => clearInterval(interval);
  }, []);

  const portfolioData = useMemo(() => {
    if (!liveData) return null;

    const totalGainLossPercent =
      liveData.totalInvestment > 0
        ? (liveData.profitLoss / liveData.totalInvestment) * 100
        : 0;

    return {
      indianStocks: { value: 0, gainLoss: 0 },
      crypto: { value: 0, gainLoss: 0 },
      mutualFunds: { value: 0, gainLoss: 0 },
      goldSilver: { value: 0, gainLoss: 0 },
      foreignStocks: { value: 0, gainLoss: 0 },

      total: {
        value: liveData.totalValue,
        invested: liveData.totalInvestment,
        gainLoss: liveData.profitLoss,
        gainLossPercent: totalGainLossPercent,
      },
    };
  }, [liveData]);

  if (!portfolioData) return <div>Loading live data...</div>;

  const allocationData = [
    { name: 'Total Portfolio', value: portfolioData.total.value, color: '#3b82f6' },
  ];

  const performanceData = [
    { month: 'Jan', value: portfolioData.total.invested * 0.92 },
    { month: 'Feb', value: portfolioData.total.invested * 0.95 },
    { month: 'Mar', value: portfolioData.total.invested * 0.98 },
    { month: 'Apr', value: portfolioData.total.invested * 1.02 },
    { month: 'May', value: portfolioData.total.invested * 1.05 },
    { month: 'Jun', value: portfolioData.total.value },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <IndicesChart />

      {/* Total Portfolio */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Wallet className="h-5 w-5" />
            Total Portfolio Value
          </CardTitle>
          <CardDescription className="text-blue-100">
            Complete summary of all your investments
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="text-4xl font-bold">
            {formatCurrency(portfolioData.total.value)}
          </div>

          <div className="flex items-center gap-3 mt-2">
            {portfolioData.total.gainLoss >= 0 ? (
              <TrendingUp />
            ) : (
              <TrendingDown />
            )}

            <span>
              {formatCurrency(Math.abs(portfolioData.total.gainLoss))} (
              {portfolioData.total.gainLossPercent.toFixed(2)}%)
            </span>
          </div>

          <div className="text-sm mt-1">
            Invested: {formatCurrency(portfolioData.total.invested)}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={allocationData} dataKey="value">
                  {allocationData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}