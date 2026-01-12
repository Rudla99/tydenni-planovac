import { useState, useCallback } from 'react';

export const useDragAndDrop = (scheduleTask, unscheduleTask, getTasksForDay) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverDay, setDragOverDay] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = useCallback((task) => {
    setDraggedTask(task);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDragOverDay(null);
    setDragOverIndex(null);
  }, []);

  const handleDragOver = useCallback((dayId, index = null) => {
    setDragOverDay(dayId);
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverDay(null);
    setDragOverIndex(null);
  }, []);

  const handleDropOnDay = useCallback(
    (dayId, dropIndex = null) => {
      if (!draggedTask) return;

      const dayTasks = getTasksForDay(dayId).filter((t) => t.id !== draggedTask.id);
      const insertIndex = dropIndex !== null ? dropIndex : dayTasks.length;

      // Přeplánovat všechny úkoly v daném dni
      dayTasks.forEach((task, idx) => {
        const newOrder = idx >= insertIndex ? idx + 1 : idx;
        if (newOrder !== task.order) {
          scheduleTask(task.id, dayId, newOrder);
        }
      });

      // Přidat/přesunout přetahovaný úkol
      scheduleTask(draggedTask.id, dayId, insertIndex);

      handleDragEnd();
    },
    [draggedTask, getTasksForDay, scheduleTask, handleDragEnd]
  );

  const handleDropOnBacklog = useCallback(() => {
    if (!draggedTask || !draggedTask.scheduledDay) return;

    unscheduleTask(draggedTask.id);
    handleDragEnd();
  }, [draggedTask, unscheduleTask, handleDragEnd]);

  return {
    draggedTask,
    dragOverDay,
    dragOverIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDropOnDay,
    handleDropOnBacklog,
  };
};
