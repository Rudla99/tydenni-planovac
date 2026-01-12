import { useState, useEffect } from 'react';

const STORAGE_KEY = 'weekly-planner-data';

export const useLocalStorage = () => {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setData(JSON.parse(saved));
      } else {
        // Inicializace s výchozími daty
        const initialData = {
          categories: [],
          weeks: {},
          settings: {
            hoursPerDay: 8,
            defaultDuration: 1,
            showCompletedTasks: true,
          },
        };
        setData(initialData);
      }
    } catch (e) {
      console.error('Error loading data:', e);
      setData({
        categories: [],
        weeks: {},
        settings: {
          hoursPerDay: 8,
          defaultDuration: 1,
          showCompletedTasks: true,
        },
      });
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (!isLoaded || !data) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving data:', e);
    }
  }, [data, isLoaded]);

  const updateData = (updater) => {
    setData((prevData) => {
      if (typeof updater === 'function') {
        return updater(prevData);
      }
      return updater;
    });
  };

  return { data, updateData, isLoaded };
};
