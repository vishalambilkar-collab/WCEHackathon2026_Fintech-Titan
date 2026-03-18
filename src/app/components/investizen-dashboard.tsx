import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { usePortfolio } from '../context/portfolio-context';

interface Asset {
  id: string;
  name: string;
  type: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

export default function InvestiZenDashboard() {
  const { indianStocks, cryptocurrencies, loadDemoPortfolio } = usePortfolio(); // ✅ NEW

  // 🔥 Convert context data → assets
  const assets: Asset[] = [
    ...indianStocks.map((s) => ({
      id: s.id,
      name: s.name,
      type: 'Stock',
      quantity: s.quantity,
      buyPrice: s.buyPrice,
      currentPrice: s.currentPrice,
    })),
    ...cryptocurrencies.map((c) => ({
      id: c.id,
      name: c.name,
      type: 'Crypto',
      quantity: c.quantity,
      buyPrice: c.buyPrice,
      currentPrice: c.currentPrice,
    })),
  ];

  // Calculations
  const totalInvestment = assets.reduce((sum, asset) => sum + asset.quantity * asset.buyPrice, 0);
  const currentValue = assets.reduce((sum, asset) => sum + asset.quantity * asset.currentPrice, 0);
  const totalPL = currentValue - totalInvestment;
  const totalPLPercent = totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;

  const getRiskLevel = () => {
    const cryptoValue = assets
      .filter((a) => a.type === 'Crypto')
      .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);

    const cryptoPercent = currentValue > 0 ? (cryptoValue / currentValue) * 100 : 0;

    if (cryptoPercent > 30) return { level: 'High', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (cryptoPercent > 15) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/10' };
  };

  const riskLevel = getRiskLevel();

  const performanceData = [
    { month: 'Jan', value: totalInvestment * 0.85 },
    { month: 'Feb', value: totalInvestment * 0.9 },
    { month: 'Mar', value: totalInvestment * 0.95 },
    { month: 'Apr', value: totalInvestment * 1.0 },
    { month: 'May', value: totalInvestment * 1.05 },
    { month: 'Jun', value: currentValue },
  ];

  const allocationData = ['Stock', 'Crypto'].map((type) => {
    const value = assets
      .filter((a) => a.type === type)
      .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);

    return { name: type, value };
  }).filter(item => item.value > 0);

  const COLORS = ['#06b6d4', '#f59e0b'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">

      {/* 🔥 CONNECT PORTFOLIO BUTTON */}
      <button
        onClick={loadDemoPortfolio}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        🔗 Connect Portfolio
      </button>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Total Wealth</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl">{formatCurrency(currentValue)}</div>
            <p>Invested: {formatCurrency(totalInvestment)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>P/L</CardTitle></CardHeader>
          <CardContent>
            <div className={totalPL >= 0 ? 'text-green-400' : 'text-red-400'}>
              {formatCurrency(totalPL)}
            </div>
            <p>{totalPLPercent.toFixed(2)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Risk</CardTitle></CardHeader>
          <CardContent>
            <div className={riskLevel.color}>{riskLevel.level}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card>
          <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v:number)=>formatCurrency(v)} />
                <Line type="monotone" dataKey="value" stroke="#06b6d4" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Allocation</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={allocationData} dataKey="value">
                  {allocationData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v:number)=>formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle>Holdings</CardTitle></CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <p>No holdings yet. Click "Connect Portfolio"</p>
          ) : (
            assets.map(a => (
              <div key={a.id} className="flex justify-between border-b py-2">
                <span>{a.name}</span>
                <span>{formatCurrency(a.quantity * a.currentPrice)}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

    </div>
  );
}