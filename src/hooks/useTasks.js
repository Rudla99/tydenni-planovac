import { useCallback } from 'react';
import { createTask, copyTaskForTransfer } from '../utils/taskHelpers';

export const useTasks = (data, updateData, currentWeek) => {
  // Získání týdne (vytvoří ho, pokud neexistuje)
  const getWeek = useCallback(
    (weekKey) => {
      if (!data?.weeks[weekKey]) {
        updateData((prev) => ({
          ...prev,
          weeks: {
            ...prev.weeks,
            [weekKey]: { tasks: [] },
          },
        }));
        return { tasks: [] };
      }
      return data.weeks[weekKey];
    },
    [data, updateData]
  );

  // Získání úkolů aktuálního týdne
  const tasks = data?.weeks[currentWeek]?.tasks || [];

  // Přidání úkolu
  const addTask = useCallback(
    (title, categoryId = null, duration = 1) => {
      const newTask = createTask(title, categoryId, duration);

      updateData((prev) => {
        const currentWeekData = prev.weeks[currentWeek] || { tasks: [] };
        return {
          ...prev,
          weeks: {
            ...prev.weeks,
            [currentWeek]: {
              ...currentWeekData,
              tasks: [...currentWeekData.tasks, newTask],
            },
          },
        };
      });

      return newTask;
    },
    [currentWeek, updateData]
  );

  // Úprava úkolu
  const updateTask = useCallback(
    (taskId, updates) => {
      updateData((prev) => ({
        ...prev,
        weeks: {
          ...prev.weeks,
          [currentWeek]: {
            ...prev.weeks[currentWeek],
            tasks: prev.weeks[currentWeek].tasks.map((task) =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
          },
        },
      }));
    },
    [currentWeek, updateData]
  );

  // Smazání úkolu
  const deleteTask = useCallback(
    (taskId) => {
      updateData((prev) => ({
        ...prev,
        weeks: {
          ...prev.weeks,
          [currentWeek]: {
            ...prev.weeks[currentWeek],
            tasks: prev.weeks[currentWeek].tasks.filter((task) => task.id !== taskId),
          },
        },
      }));
    },
    [currentWeek, updateData]
  );

  // Naplánování úkolu
  const scheduleTask = useCallback(
    (taskId, dayId, order) => {
      updateTask(taskId, { scheduledDay: dayId, order });
    },
    [updateTask]
  );

  // Odebrání úkolu z rozvrhu
  const unscheduleTask = useCallback(
    (taskId) => {
      updateTask(taskId, { scheduledDay: null, order: 0 });
    },
    [updateTask]
  );

  // Označení úkolu jako dokončeného
  const toggleTaskComplete = useCallback(
    (taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        updateTask(taskId, { completed: !task.completed });
      }
    },
    [tasks, updateTask]
  );

  // Změna délky úkolu
  const updateTaskDuration = useCallback(
    (taskId, duration) => {
      updateTask(taskId, { duration });
    },
    [updateTask]
  );

  // Přenos úkolů z minulého týdne
  const transferTasksFromPreviousWeek = useCallback(
    (fromWeekKey, mode = 'all', selectedTaskIds = []) => {
      const fromWeek = data?.weeks[fromWeekKey];
      if (!fromWeek) return;

      let tasksToTransfer = [];

      switch (mode) {
        case 'all':
          tasksToTransfer = fromWeek.tasks;
          break;
        case 'unscheduled':
          tasksToTransfer = fromWeek.tasks.filter((t) => !t.scheduledDay);
          break;
        case 'incomplete':
          tasksToTransfer = fromWeek.tasks.filter((t) => !t.completed);
          break;
        case 'selected':
          tasksToTransfer = fromWeek.tasks.filter((t) => selectedTaskIds.includes(t.id));
          break;
        default:
          tasksToTransfer = [];
      }

      const copiedTasks = tasksToTransfer.map(copyTaskForTransfer);

      updateData((prev) => ({
        ...prev,
        weeks: {
          ...prev.weeks,
          [currentWeek]: {
            tasks: copiedTasks,
          },
        },
      }));
    },
    [data, currentWeek, updateData]
  );

  // Vyčištění rozvrhu týdne
  const clearWeekSchedule = useCallback(() => {
    updateData((prev) => ({
      ...prev,
      weeks: {
        ...prev.weeks,
        [currentWeek]: {
          ...prev.weeks[currentWeek],
          tasks: prev.weeks[currentWeek].tasks.map((task) => ({
            ...task,
            scheduledDay: null,
            order: 0,
          })),
        },
      },
    }));
  }, [currentWeek, updateData]);

  // Získání úkolů pro konkrétní den
  const getTasksForDay = useCallback(
    (dayId) => {
      return tasks.filter((t) => t.scheduledDay === dayId).sort((a, b) => a.order - b.order);
    },
    [tasks]
  );

  // Celkové hodiny za den
  const getTotalHoursForDay = useCallback(
    (dayId) => {
      return getTasksForDay(dayId).reduce((sum, task) => sum + task.duration, 0);
    },
    [getTasksForDay]
  );

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    scheduleTask,
    unscheduleTask,
    toggleTaskComplete,
    updateTaskDuration,
    transferTasksFromPreviousWeek,
    clearWeekSchedule,
    getTasksForDay,
    getTotalHoursForDay,
    getWeek,
  };
};
