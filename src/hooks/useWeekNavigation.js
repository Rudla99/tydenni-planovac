import { useState, useCallback } from 'react';
import { getCurrentWeekKey, getNextWeek, getPrevWeek } from '../utils/weekHelpers';

export const useWeekNavigation = () => {
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekKey());

  const goToNextWeek = useCallback(() => {
    setCurrentWeek((prev) => getNextWeek(prev));
  }, []);

  const goToPrevWeek = useCallback(() => {
    setCurrentWeek((prev) => getPrevWeek(prev));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentWeek(getCurrentWeekKey());
  }, []);

  const goToWeek = useCallback((weekKey) => {
    setCurrentWeek(weekKey);
  }, []);

  return {
    currentWeek,
    goToNextWeek,
    goToPrevWeek,
    goToToday,
    goToWeek,
  };
};
