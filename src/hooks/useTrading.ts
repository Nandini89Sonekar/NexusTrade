import { useAuth } from '../components/AuthContext';
import { Trade, PortfolioItem } from '../types';
import { useEffect, useState } from 'react';
import { storage } from '../lib/storage';

export function useTrading() {
  const { user, profile } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  // Local state sync with storage
  useEffect(() => {
    if (!user) {
      setTrades([]);
      setPortfolio([]);
      return;
    }

    const refreshData = () => {
      setTrades(storage.getTrades(user.uid));
      setPortfolio(storage.getPortfolios(user.uid));
    };

    refreshData();
    const interval = setInterval(refreshData, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const executeTrade = async (symbol: string, type: 'BUY' | 'SELL', amount: number, price: number) => {
    if (!user || !profile) return;

    const cost = amount * price;
    if (type === 'BUY' && profile.balance < cost) {
      throw new Error('Insufficient balance');
    }

    const existing = portfolio.find(p => p.symbol === symbol);

    if (type === 'SELL' && (!existing || existing.amount < amount)) {
      throw new Error('Insufficient holdings');
    }

    // 1. Record Trade
    storage.addTrade({
      userId: user.uid,
      symbol,
      type,
      amount,
      price,
      timestamp: Date.now()
    });

    // 2. Update User Balance
    const updatedProfile = {
      ...profile,
      balance: profile.balance + (type === 'BUY' ? -cost : cost)
    };
    storage.saveUser(updatedProfile);

    // 3. Update Portfolio
    if (type === 'BUY') {
      if (existing) {
        const newAmount = existing.amount + amount;
        const newAvgPrice = ((existing.amount * existing.averagePrice) + cost) / newAmount;
        storage.updatePortfolio({
          userId: user.uid,
          symbol,
          amount: newAmount,
          averagePrice: newAvgPrice
        });
      } else {
        storage.updatePortfolio({
          userId: user.uid,
          symbol,
          amount,
          averagePrice: price
        });
      }
    } else {
      const newAmount = existing!.amount - amount;
      storage.updatePortfolio({
        userId: user.uid,
        symbol,
        amount: newAmount,
        averagePrice: existing!.averagePrice
      });
    }
  };

  return { portfolio, trades, executeTrade };
}

