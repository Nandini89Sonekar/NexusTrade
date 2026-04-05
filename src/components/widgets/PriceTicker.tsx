import React from 'react';
import { MarketData } from '../../types';
import { cn, formatCurrency } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Tooltip } from '../Tooltip';
import { useLearning } from '../LearningContext';

interface Props {
  data: MarketData[];
  onSelect: (id: string) => void;
  activeId: string;
}

export function PriceTicker({ data, onSelect, activeId }: Props) {
  const { mode } = useLearning();
  return (
    <div className="flex items-center gap-4 p-2 overflow-x-auto no-scrollbar h-full">
      {data.map((coin) => {
        const isPositive = coin.price_change_percentage_24h >= 0;
        const isActive = coin.id === activeId;

        return (
          <button
            key={coin.id}
            id={`ticker-${coin.id}`}
            onClick={() => onSelect(coin.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg transition-all whitespace-nowrap border",
              isActive 
                ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
            )}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{coin.symbol}</span>
              </div>
              <Tooltip content="The current price of 1 unit of this cryptocurrency in USD." enabled={mode === 'beginner'}>
                <span className="text-sm font-mono font-medium">{formatCurrency(coin.current_price)}</span>
              </Tooltip>
            </div>
            <Tooltip content="The percentage change in price over the last 24 hours. Green is up, red is down." enabled={mode === 'beginner'}>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded",
                isPositive ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
              )}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </div>
            </Tooltip>
          </button>
        );
      })}
    </div>
  );
}

// Add CSS for hiding scrollbar
const style = document.createElement('style');
style.textContent = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;
document.head.appendChild(style);
