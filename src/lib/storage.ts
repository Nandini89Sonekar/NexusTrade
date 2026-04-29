import { UserProfile, Trade, PortfolioItem } from '../types';

const STORAGE_KEYS = {
  USERS: 'nexus_users',
  TRADES: 'nexus_trades',
  PORTFOLIOS: 'nexus_portfolios',
  SESSION: 'nexus_session'
};

export const storage = {
  // Users
  getUsers: (): Record<string, UserProfile> => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : {};
  },
  saveUser: (profile: UserProfile) => {
    const users = storage.getUsers();
    users[profile.uid] = profile;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  getUser: (uid: string): UserProfile | null => {
    return storage.getUsers()[uid] || null;
  },

  // Trades
  getTrades: (userId: string): Trade[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRADES);
    const trades: Trade[] = data ? JSON.parse(data) : [];
    return trades.filter(t => t.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
  },
  addTrade: (trade: Omit<Trade, 'id'>) => {
    const data = localStorage.getItem(STORAGE_KEYS.TRADES);
    const trades: Trade[] = data ? JSON.parse(data) : [];
    const newTrade = { ...trade, id: Math.random().toString(36).substr(2, 9) };
    trades.push(newTrade);
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    return newTrade;
  },

  // Portfolios
  getPortfolios: (userId: string): PortfolioItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PORTFOLIOS);
    const items: (PortfolioItem & { userId: string })[] = data ? JSON.parse(data) : [];
    return items.filter(p => p.userId === userId);
  },
  updatePortfolio: (item: Omit<PortfolioItem, 'id' | 'currentPrice'> & { id?: string, currentPrice?: number }) => {
    const data = localStorage.getItem(STORAGE_KEYS.PORTFOLIOS);
    let items: PortfolioItem[] = data ? JSON.parse(data) : [];
    const index = items.findIndex(p => p.userId === item.userId && p.symbol === item.symbol);
    
    if (item.amount <= 0) {
      if (index > -1) items.splice(index, 1);
    } else {
      const newItem: PortfolioItem = {
        ...item,
        id: item.id || `${item.userId}_${item.symbol}`,
        currentPrice: item.currentPrice || item.averagePrice
      } as PortfolioItem;

      if (index > -1) {
        items[index] = newItem;
      } else {
        items.push(newItem);
      }
    }
    localStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(items));
  },

  // Session (Simple local session)
  getSession: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.SESSION);
  },
  setSession: (uid: string | null) => {
    if (uid) {
      localStorage.setItem(STORAGE_KEYS.SESSION, uid);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }
};
