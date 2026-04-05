import React, { useState } from 'react';
import { MarketData } from '../../types';
import { useTrading } from '../../hooks/useTrading';
import { useLearning } from '../LearningContext';
import { Tooltip } from '../Tooltip';
import { formatCurrency, cn } from '../../lib/utils';
import { ArrowUpCircle, ArrowDownCircle, AlertCircle, Info } from 'lucide-react';

interface Props {
  coin: MarketData;
}

export function TradingPanel({ coin }: Props) {
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { executeTrade } = useTrading();
  const { mode, completeMission } = useLearning();

  if (!coin) return null;

  const handleTrade = async () => {
    if (!amount || isNaN(Number(amount))) return;
    setLoading(true);
    setError(null);
    try {
      await executeTrade(coin.symbol, type, Number(amount), coin.current_price);
      setAmount('');
      if (mode === 'guided' && type === 'BUY') {
        completeMission('first_buy');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  const total = Number(amount) * coin.current_price;

  return (
    <div className="space-y-6" id="trading-panel">
      <div className="flex p-1 bg-slate-950 rounded-lg border border-slate-800">
        <Tooltip 
          content="Buying means you expect the price to go up. You exchange your USD for crypto." 
          enabled={mode === 'beginner'}
          className="flex-1"
        >
          <button
            onClick={() => setType('BUY')}
            className={cn(
              "w-full py-2 text-xs font-bold rounded-md transition-all",
              type === 'BUY' ? "bg-green-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
            )}
          >
            BUY
          </button>
        </Tooltip>
        <Tooltip 
          content="Selling means you exchange your crypto back for USD, hopefully at a higher price than you bought it." 
          enabled={mode === 'beginner'}
          className="flex-1"
        >
          <button
            onClick={() => setType('SELL')}
            className={cn(
              "w-full py-2 text-xs font-bold rounded-md transition-all",
              type === 'SELL' ? "bg-red-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
            )}
          >
            SELL
          </button>
        </Tooltip>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Amount ({coin.symbol.toUpperCase()})
            <Tooltip content="How much of the cryptocurrency you want to trade." enabled={mode === 'beginner'}>
              <Info className="w-3 h-3 text-blue-500 cursor-help" />
            </Tooltip>
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              onClick={() => setAmount('1')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-500 hover:text-blue-400"
            >
              MAX
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Price</span>
            <span className="font-mono text-slate-300">{formatCurrency(coin.current_price)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Estimated Total</span>
            <span className="font-mono text-white font-bold">{formatCurrency(total || 0)}</span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          onClick={handleTrade}
          disabled={loading || !amount}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-sm tracking-widest transition-all flex items-center justify-center gap-2",
            type === 'BUY' 
              ? "bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
              : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]",
            (loading || !amount) && "opacity-50 cursor-not-allowed grayscale"
          )}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              {type === 'BUY' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
              EXECUTE {type} ORDER
            </>
          )}
        </button>
      </div>
    </div>
  );
}
