import React from 'react';
import { useAuth } from '../AuthContext';
import { useTrading } from '../../hooks/useTrading';
import { useLearning } from '../LearningContext';
import { Tooltip } from '../Tooltip';
import { MarketData } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';
import { Wallet, TrendingUp, TrendingDown, History, Info } from 'lucide-react';

interface Props {
  marketData: MarketData[];
}

export function PortfolioWidget({ marketData }: Props) {
  const { profile } = useAuth();
  const { portfolio, trades } = useTrading();
  const { mode, completeMission } = useLearning();

  const totalHoldingsValue = portfolio.reduce((acc, item) => {
    const coin = marketData.find(c => c.symbol.toLowerCase() === item.symbol.toLowerCase());
    return acc + (item.amount * (coin?.current_price || item.averagePrice));
  }, 0);

  const totalValue = (profile?.balance || 0) + totalHoldingsValue;
  const initialBalance = 100000;
  const totalPnL = totalValue - initialBalance;
  const pnlPercent = (totalPnL / initialBalance) * 100;

  return (
    <div 
      className="space-y-6" 
      id="portfolio-widget"
      onMouseEnter={() => mode === 'guided' && completeMission('check_portfolio')}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Wallet className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Available Cash</span>
            <Tooltip content="Your remaining virtual money to buy more crypto." enabled={mode === 'beginner'}>
              <Info className="w-3 h-3 text-blue-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="text-xl font-mono font-bold text-white">
            {formatCurrency(profile?.balance || 0)}
          </div>
        </div>
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            {totalPnL >= 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
            <span className="text-[10px] font-bold uppercase tracking-widest">Total P&L</span>
            <Tooltip content="Profit and Loss. Shows how much money you've made or lost overall." enabled={mode === 'beginner'}>
              <Info className="w-3 h-3 text-blue-500 cursor-help" />
            </Tooltip>
          </div>
          <div className={cn(
            "text-xl font-mono font-bold",
            totalPnL >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
            <span className="text-xs ml-1 opacity-70">({pnlPercent.toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <History className="w-3 h-3" />
          Active Holdings
        </h3>
        {portfolio.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-sm italic">
            No active positions.
          </div>
        ) : (
          <div className="space-y-2">
            {portfolio.map(item => {
              const coin = marketData.find(c => c.symbol.toLowerCase() === item.symbol.toLowerCase());
              const currentPrice = coin?.current_price || item.averagePrice;
              const value = item.amount * currentPrice;
              const pnl = (currentPrice - item.averagePrice) * item.amount;

              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-950/30 rounded-lg border border-slate-800/50">
                  <div className="flex items-center gap-3">
                    {coin && <img src={coin.image} className="w-6 h-6 rounded-full" alt="" referrerPolicy="no-referrer" />}
                    <div>
                      <div className="text-sm font-bold uppercase">{item.symbol}</div>
                      <div className="text-[10px] text-slate-500">{item.amount.toFixed(4)} units</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold">{formatCurrency(value)}</div>
                    <div className={cn("text-[10px] font-bold", pnl >= 0 ? "text-green-500" : "text-red-500")}>
                      {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
