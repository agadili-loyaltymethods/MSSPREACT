import { useState, useCallback, useEffect } from 'react';
import { useActivity } from './useActivity';
import { useMember } from './useMember';
import { StreaksConstants } from '../constants/streaks-constants';

export const useStreaks = (memberId: string) => {
  const [streaks, setStreaks] = useState(StreaksConstants);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { streakPolicy } = useActivity();
  const { getStreaks } = useMember();

  const calculateProgress = useCallback((current: number, target: number): string => {
    const percentage = (current / target) * 100;
    return percentage >= 100 ? 'completed' : percentage > 0 ? 'in-progress' : 'not-started';
  }, []);

  const updateStreakStatus = useCallback((streakData: any[]) => {
    return streaks.map(streak => {
      const matchingStreak = streakData.find(s => s.name === streak.name);
      if (matchingStreak) {
        return {
          ...streak,
          value: matchingStreak.currentValue || 0,
          target: matchingStreak.targetValue || 0,
          status: calculateProgress(matchingStreak.currentValue || 0, matchingStreak.targetValue || 0)
        };
      }
      return streak;
    });
  }, [streaks, calculateProgress]);

  const loadStreaks = useCallback(async () => {
    if (!memberId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const streakData = await getStreaks(memberId);
      const updatedStreaks = updateStreakStatus(streakData);
      setStreaks(updatedStreaks);
    } catch (err: any) {
      setError(err.message || 'Failed to load streaks');
    } finally {
      setIsLoading(false);
    }
  }, [memberId, getStreaks, updateStreakStatus]);

  useEffect(() => {
    loadStreaks();
  }, [loadStreaks]);

  return {
    streaks,
    isLoading,
    error,
    refreshStreaks: loadStreaks
  };
};