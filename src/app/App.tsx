import PortfolioDashboard from './components/portfolio-dashboard';
import { useState, useEffect } from 'react';
import InvestiZenLogin from './components/investizen-login';
import InvestiZenPortfolio from './components/investizen-portfolio';
import InvestiZenAssets from './components/investizen-assets';
import InvestiZenRiskAnalysis from './components/investizen-risk-analysis';
import InvestiZenInsights from './components/investizen-insights';
import InvestiZenAlerts from './components/investizen-alerts';
import InvestiZenSettings from './components/investizen-settings';
import InvestiZenProfile from './components/investizen-profile';
import { Input } from './components/ui/input';
import { 
  LayoutDashboard, 
  PieChart, 
  Briefcase, 
  AlertTriangle, 
  Lightbulb, 
  Bell, 
  Settings, 
  User,
  Search,
  LogOut,
  TrendingUp
} from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Asset {
  id: string;
  name: string;
  type: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

interface UserData {
  email: string;
  name: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [user, setUser] = useState<UserData>({ email: '', name: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('investizen_token');
      const userData = localStorage.getItem('investizen_user');
      const storedAssets = localStorage.getItem('investizen_assets');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setAuthToken(token);
          setUser(user);
          setIsAuthenticated(true);
          
          if (storedAssets) {
            setAssets(JSON.parse(storedAssets));
          }
        } catch (error) {
          console.error('Session restore failed:', error);
          localStorage.clear();
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const handleLogin = (token: string, userData: UserData) => {
    localStorage.setItem('investizen_token', token);
    localStorage.setItem('investizen_user', JSON.stringify(userData));
    setAuthToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('investizen_token');
    localStorage.removeItem('investizen_user');
    localStorage.removeItem('investizen_assets');
    setAuthToken('');
    setUser({ email: '', name: '' });
    setIsAuthenticated(false);
    setAssets([]);
  };

  const handleAddAsset = (assetData: Omit<Asset, 'id'>) => {
    const newAsset = {
      ...assetData,
      id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const updatedAssets = [...assets, newAsset];
    setAssets(updatedAssets);
    localStorage.setItem('investizen_assets', JSON.stringify(updatedAssets));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'assets', label: 'Assets', icon: Briefcase },
    { id: 'risk-analysis', label: 'Risk Analysis', icon: AlertTriangle },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <div className="text-cyan-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <InvestiZenLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#0f172a] border-r border-slate-800 fixed h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">InvestiZen</h1>
              <p className="text-xs text-slate-400">Portfolio Intelligence</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <div className="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search assets, insights..."
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4 ml-4">
              {/* Notifications */}
              <button className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-cyan-400 transition-colors relative">
                <Bell className="h-5 w-5" />
                {assets.filter(a => a.currentPrice < a.buyPrice).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {assets.filter(a => a.currentPrice < a.buyPrice).length}
                  </span>
                )}
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{user.name}</p>
                  <p className="text-slate-400 text-xs">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'dashboard' && <PortfolioDashboard />}
          {activeTab === 'portfolio' && <InvestiZenPortfolio assets={assets} />}
          {activeTab === 'assets' && <InvestiZenAssets assets={assets} onAddAsset={handleAddAsset} />}
          {activeTab === 'risk-analysis' && <InvestiZenRiskAnalysis assets={assets} />}
          {activeTab === 'insights' && <InvestiZenInsights assets={assets} />}
          {activeTab === 'alerts' && <InvestiZenAlerts assets={assets} />}
          {activeTab === 'settings' && <InvestiZenSettings />}
          {activeTab === 'profile' && <InvestiZenProfile user={user} />}
        </div>
      </div>
    </div>
  );
}