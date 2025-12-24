import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Stats {
  mcqSets: number;
  typingMinutes: number;
  subjectiveAnswers: number;
  syllabusProgress: number;
}

interface StatsContextType {
  stats: Stats;
  updateStats: (newStats: Partial<Stats>) => void;
  incrementStat: (key: keyof Stats, amount?: number) => void;
}

const defaultStats: Stats = {
  mcqSets: 0,
  typingMinutes: 0,
  subjectiveAnswers: 0,
  syllabusProgress: 0,
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>(defaultStats);

  useEffect(() => {
    if (user) {
      const savedStats = localStorage.getItem(`loksewa_stats_${user.email}`);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      } else {
        setStats(defaultStats);
      }
    }
  }, [user]);

  const updateStats = (newStats: Partial<Stats>) => {
    if (!user) return;
    
    setStats(prev => {
      const updated = { ...prev, ...newStats };
      localStorage.setItem(`loksewa_stats_${user.email}`, JSON.stringify(updated));
      return updated;
    });
  };

  const incrementStat = (key: keyof Stats, amount = 1) => {
    if (!user) return;
    
    setStats(prev => {
      const updated = { ...prev, [key]: prev[key] + amount };
      localStorage.setItem(`loksewa_stats_${user.email}`, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <StatsContext.Provider value={{ stats, updateStats, incrementStat }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
