import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { MarketData } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { useLearning } from '../LearningContext';
import { Tooltip } from '../Tooltip';
import { Info } from 'lucide-react';

interface Props {
  coin: MarketData;
}

export function MarketChart({ coin }: Props) {
  const { mode, completeMission } = useLearning();
  if (!coin) return null;

  const data = coin.sparkline_in_7d.price.map((price, index) => ({
    time: index,
    price: price
  }));

  const isPositive = coin.price_change_percentage_24h >= 0;
  const color = isPositive ? '#22c55e' : '#ef4444';

  return (
    <div 
      className="w-full h-full min-h-[200px] relative" 
      id="market-chart"
      onMouseEnter={() => mode === 'guided' && completeMission('analyze_chart')}
    >
      {mode === 'beginner' && (
        <div className="absolute top-0 right-0 z-10">
          <Tooltip content="This chart shows the price history. A rising line means the asset is gaining value.">
            <div className="p-1 bg-blue-600/20 rounded-full cursor-help">
              <Info className="w-4 h-4 text-blue-400" />
            </div>
          </Tooltip>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right"
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickFormatter={(val) => `$${val.toLocaleString()}`}
            axisLine={false}
            tickLine={false}
          />
          <RechartsTooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#f8fafc' }}
            labelStyle={{ display: 'none' }}
            formatter={(val: number) => [formatCurrency(val), 'Price']}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
