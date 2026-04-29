import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { useMarketData } from '../hooks/useMarketData';
import { useTrading } from '../hooks/useTrading';
import { useAuth } from './AuthContext';
import { useLearning } from './LearningContext';
import { Tooltip } from './Tooltip';
import { PriceTicker } from './widgets/PriceTicker';
import { MarketChart } from './widgets/MarketChart';
import { PortfolioWidget } from './widgets/PortfolioWidget';
import { TradingPanel } from './widgets/TradingPanel';
import { NewsFeed } from './widgets/NewsFeed';
import { NewsSection } from './NewsSection';
import { Layout, LogIn, History as HistoryIcon, GraduationCap, Play, Info, Newspaper } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts = {
  lg: [
    { i: 'ticker', x: 0, y: 0, w: 12, h: 2 },
    { i: 'chart', x: 0, y: 2, w: 8, h: 10 },
    { i: 'trading', x: 8, y: 2, w: 4, h: 10 },
    { i: 'portfolio', x: 0, y: 12, w: 6, h: 8 },
    { i: 'news', x: 6, y: 12, w: 6, h: 8 },
  ]
};

export function Dashboard() {
  const { data: marketData, loading } = useMarketData();
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [layouts, setLayouts] = useState(defaultLayouts);
  const [view, setView] = useState<'dashboard' | 'history' | 'news'>('dashboard');
  const { trades } = useTrading();
  const { logout, profile } = useAuth();
  const { mode, setMode, completeMission, currentMissionIndex, missions } = useLearning();

  useEffect(() => {
    if (mode === 'guided' && missions[currentMissionIndex]?.id === 'select_btc' && selectedCoin === 'bitcoin') {
      completeMission('select_btc');
    }
  }, [selectedCoin, mode, currentMissionIndex, missions, completeMission]);

  const activeCoin = marketData.find(c => c.id === selectedCoin) || marketData[0];

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-mono">INITIALIZING TERMINAL...</p>
      </div>
    </div>
  );

  if (!activeCoin && !loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
      <div className="text-center p-8 bg-slate-900 border border-slate-800 rounded-2xl max-w-md">
        <p className="text-red-400 font-mono mb-4">CRITICAL ERROR: MARKET DATA DISCONTINUITY</p>
        <p className="text-slate-400 text-sm mb-6">The connection to global liquidity markets was interrupted. NexusTrade is attempting to reconnect...</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-all">
          FORCE RECONNECT
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4">
      <header className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">NEXUS<span className="text-blue-500">TRADE</span></h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setView('dashboard')}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                view === 'dashboard' ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setView('history')}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                view === 'history' ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Trade History
            </button>
            <button 
              onClick={() => setView('news')}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                view === 'news' ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              News
            </button>
          </nav>

          <div className="hidden xl:flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 ml-4">
            <button 
              onClick={() => setMode('none')}
              className={cn(
                "px-3 py-1.5 text-[10px] font-bold rounded-md transition-all flex items-center gap-2",
                mode === 'none' ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Pro
            </button>
            <button 
              onClick={() => setMode('beginner')}
              className={cn(
                "px-3 py-1.5 text-[10px] font-bold rounded-md transition-all flex items-center gap-2",
                mode === 'beginner' ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Info className="w-3 h-3" />
              Beginner
            </button>
            <button 
              onClick={() => setMode('guided')}
              className={cn(
                "px-3 py-1.5 text-[10px] font-bold rounded-md transition-all flex items-center gap-2",
                mode === 'guided' ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <GraduationCap className="w-3 h-3" />
              Guided
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col items-end gap-0.5 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-green-500">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              LIVE MARKET
            </span>
            <span className="text-slate-600">DEMO ENVIRONMENT</span>
          </div>
          
          <div className="flex items-center gap-4 pl-6 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-end gap-1">
                Demo Balance
                <Tooltip content="This is virtual currency for learning purposes. No real money is involved." enabled={mode === 'beginner'}>
                  <Info className="w-3 h-3 text-blue-500 cursor-help" />
                </Tooltip>
              </div>
              <div className="text-sm font-mono font-bold text-blue-400">{formatCurrency(profile?.balance || 0)}</div>
            </div>
            <button 
              onClick={logout}
              className="p-2 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-red-400 transition-all"
              title="Logout"
            >
              <LogIn className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </div>
      </header>

      {view === 'dashboard' ? (
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          draggableHandle=".drag-handle"
          onLayoutChange={(current, all: any) => setLayouts(all)}
        >
          <div key="ticker" className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
            <PriceTicker data={marketData} onSelect={setSelectedCoin} activeId={selectedCoin} />
          </div>
          
          <div key="chart" className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm flex flex-col">
            <div className="drag-handle p-3 border-b border-slate-800 flex items-center justify-between cursor-move">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Market Analysis</span>
              <span className="text-xs font-mono text-blue-400">{activeCoin?.name} / USD</span>
            </div>
            <div className="flex-1 p-4 min-h-0">
              <MarketChart coin={activeCoin} />
            </div>
          </div>

          <div key="trading" className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm flex flex-col">
            <div className="drag-handle p-3 border-b border-slate-800 cursor-move">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Execution Terminal</span>
            </div>
            <div className="flex-1 p-4">
              <TradingPanel coin={activeCoin} />
            </div>
          </div>

          <div key="portfolio" className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm flex flex-col">
            <div className="drag-handle p-3 border-b border-slate-800 cursor-move">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Portfolio Overview</span>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <PortfolioWidget marketData={marketData} />
            </div>
          </div>

          <div key="news" className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm flex flex-col">
            <div className="drag-handle p-3 border-b border-slate-800 cursor-move">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Market Intelligence</span>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <NewsFeed />
            </div>
          </div>
        </ResponsiveGridLayout>
      ) : view === 'history' ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-blue-500" />
            Order History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">
                  <th className="pb-4 px-4">Time</th>
                  <th className="pb-4 px-4">Asset</th>
                  <th className="pb-4 px-4">Type</th>
                  <th className="pb-4 px-4">Amount</th>
                  <th className="pb-4 px-4">Price</th>
                  <th className="pb-4 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm font-mono">
                {trades.map(trade => (
                  <tr key={trade.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 text-slate-400">{new Date(trade.timestamp).toLocaleString()}</td>
                    <td className="py-4 px-4 font-bold text-white">{trade.symbol.toUpperCase()}</td>
                    <td className="py-4 px-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold",
                        trade.type === 'BUY' ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                      )}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">{trade.amount.toFixed(4)}</td>
                    <td className="py-4 px-4">{formatCurrency(trade.price)}</td>
                    <td className="py-4 px-4 text-right font-bold text-slate-200">{formatCurrency(trade.amount * trade.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {trades.length === 0 && (
              <div className="text-center py-12 text-slate-600 italic">No trades recorded yet.</div>
            )}
          </div>
        </div>
      ) : (
        <NewsSection />
      )}
    </div>
  );
}
