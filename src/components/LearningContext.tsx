import React, { createContext, useContext, useState, useEffect } from 'react';

export type LearningMode = 'none' | 'beginner' | 'guided';

interface Mission {
  id: string;
  title: string;
  description: string;
  targetId?: string; // ID of the element to highlight
  actionRequired?: string; // e.g. 'select_coin', 'buy_crypto'
  completed: boolean;
}

interface LearningContextType {
  mode: LearningMode;
  setMode: (mode: LearningMode) => void;
  currentMissionIndex: number;
  missions: Mission[];
  completeMission: (id: string) => void;
  resetMissions: () => void;
}

const missionsData: Mission[] = [
  {
    id: 'select_btc',
    title: 'Market Exploration',
    description: 'Welcome to NexusTrade! Start by selecting Bitcoin (BTC) from the price ticker to view its details.',
    targetId: 'ticker-bitcoin',
    actionRequired: 'select_coin',
    completed: false,
  },
  {
    id: 'analyze_chart',
    title: 'Chart Analysis',
    description: 'The chart shows price movements. Green candles mean the price went up, red means it went down. Hover over a candle to see details.',
    targetId: 'market-chart',
    completed: false,
  },
  {
    id: 'first_buy',
    title: 'Your First Trade',
    description: 'Ready to trade? Use your $100,000 demo balance to buy 0.1 BTC in the Execution Terminal.',
    targetId: 'trading-panel',
    actionRequired: 'buy_crypto',
    completed: false,
  },
  {
    id: 'check_portfolio',
    title: 'Portfolio Tracking',
    description: 'Great job! Now check your Portfolio Overview to see your holdings and profit/loss.',
    targetId: 'portfolio-widget',
    completed: false,
  }
];

const LearningContext = createContext<LearningContextType | null>(null);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<LearningMode>('none');
  const [missions, setMissions] = useState<Mission[]>(missionsData);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);

  const completeMission = (id: string) => {
    setMissions(prev => {
      const index = prev.findIndex(m => m.id === id);
      if (index === -1 || prev[index].completed) return prev;
      
      const newMissions = [...prev];
      newMissions[index] = { ...newMissions[index], completed: true };
      
      // Auto-advance if it's the current mission
      if (index === currentMissionIndex && currentMissionIndex < prev.length - 1) {
        setCurrentMissionIndex(currentMissionIndex + 1);
      }
      
      return newMissions;
    });
  };

  const resetMissions = () => {
    setMissions(missionsData.map(m => ({ ...m, completed: false })));
    setCurrentMissionIndex(0);
  };

  return (
    <LearningContext.Provider value={{ 
      mode, 
      setMode, 
      currentMissionIndex, 
      missions, 
      completeMission,
      resetMissions
    }}>
      {children}
    </LearningContext.Provider>
  );
}

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) throw new Error('useLearning must be used within LearningProvider');
  return context;
};
