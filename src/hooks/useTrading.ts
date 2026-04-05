import { collection, addDoc, doc, updateDoc, increment, onSnapshot, query, where, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../components/AuthContext';
import { Trade, PortfolioItem } from '../types';
import { useEffect, useState } from 'react';

export function useTrading() {
  const { user, profile } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (!user) return;

    const qTrades = query(collection(db, 'trades'), where('userId', '==', user.uid));
    const unsubTrades = onSnapshot(qTrades, (snapshot) => {
      const t = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trade));
      setTrades(t.sort((a, b) => b.timestamp - a.timestamp));
    });

    const qPortfolio = query(collection(db, 'portfolios'), where('userId', '==', user.uid));
    const unsubPortfolio = onSnapshot(qPortfolio, (snapshot) => {
      setPortfolio(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem)));
    });

    return () => {
      unsubTrades();
      unsubPortfolio();
    };
  }, [user]);

  const executeTrade = async (symbol: string, type: 'BUY' | 'SELL', amount: number, price: number) => {
    if (!user || !profile) return;

    const cost = amount * price;
    if (type === 'BUY' && profile.balance < cost) {
      throw new Error('Insufficient balance');
    }

    const portfolioRef = doc(db, 'portfolios', `${user.uid}_${symbol}`);
    const existing = portfolio.find(p => p.symbol === symbol);

    if (type === 'SELL' && (!existing || existing.amount < amount)) {
      throw new Error('Insufficient holdings');
    }

    // 1. Record Trade
    await addDoc(collection(db, 'trades'), {
      userId: user.uid,
      symbol,
      type,
      amount,
      price,
      timestamp: Date.now()
    });

    // 2. Update User Balance
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      balance: increment(type === 'BUY' ? -cost : cost)
    });

    // 3. Update Portfolio
    if (type === 'BUY') {
      if (existing) {
        const newAmount = existing.amount + amount;
        const newAvgPrice = ((existing.amount * existing.averagePrice) + cost) / newAmount;
        await updateDoc(portfolioRef, {
          amount: newAmount,
          averagePrice: newAvgPrice
        });
      } else {
        await setDoc(portfolioRef, {
          userId: user.uid,
          symbol,
          amount,
          averagePrice: price
        });
      }
    } else {
      const newAmount = existing!.amount - amount;
      if (newAmount <= 0) {
        await deleteDoc(portfolioRef);
      } else {
        await updateDoc(portfolioRef, {
          amount: newAmount
        });
      }
    }
  };

  return { portfolio, trades, executeTrade };
}
