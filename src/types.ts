export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface PortfolioItem {
  id: string;
  userId: string;
  symbol: string;
  amount: number;
  averagePrice: number;
  currentPrice: number;
}

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  timestamp: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  balance: number;
  displayName?: string;
  createdAt: number;
}

export interface DashboardLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}
