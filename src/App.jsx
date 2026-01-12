import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { WeekView } from './components/calendar/WeekView';
import { CategoryManager } from './components/categories/CategoryManager';
import { TransferTasksModal } from './components/weekTransfer/TransferTasksModal';
import { StatisticsView } from './components/statistics/StatisticsView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useWeekNavigation } from './hooks/useWeekNavigation';
import { useTasks } from './hooks/useTasks';
import { useCategories } from './hooks/useCategories';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { getPrevWeek } from './utils/weekHelpers';

function App() {
  const { data, updateData, isLoaded } = useLocalStorage();
  const { currentWeek, goToNextWeek, goToPrevWeek, goToToday } = useWeekNavigation();

  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [transferModalShown, setTransferModalShown] = useState(false);

  // Initialize categories if needed
  const {
    categories,
    initializeCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  } = useCategories(data, updateData);

  useEffect(() => {
    if (isLoaded && categories.length === 0) {
      initializeCategories();
    }
  }, [isLoaded, categories.length, initializeCategories]);

  // Tasks management
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    scheduleTask,
    unscheduleTask,
    transferTasksFromPreviousWeek,
    getTasksForDay,
    getTotalHoursForDay,
    getWeek,
  } = useTasks(data, updateData, currentWeek);

  // Check if current week is empty and show transfer modal
  useEffect(() => {
    if (isLoaded && !transferModalShown) {
      const currentWeekData = data?.weeks[currentWeek];
      const prevWeekKey = getPrevWeek(currentWeek);
      const prevWeekData = data?.weeks[prevWeekKey];

      if (
        (!currentWeekData || currentWeekData.tasks.length === 0) &&
        prevWeekData &&
        prevWeekData.tasks.length > 0
      ) {
        setShowTransferModal(true);
        setTransferModalShown(true);
      } else {
        // Make sure week exists
        getWeek(currentWeek);
      }
    }
  }, [isLoaded, currentWeek, data, transferModalShown, getWeek]);

  // Drag and drop
  const {
    draggedTask,
    dragOverDay,
    dragOverIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDropOnDay,
    handleDropOnBacklog,
  } = useDragAndDrop(scheduleTask, unscheduleTask, getTasksForDay);

  const handleAddTask = (title) => {
    addTask(title);
  };

  const handleTransfer = (fromWeekKey, mode, selectedTaskIds) => {
    transferTasksFromPreviousWeek(fromWeekKey, mode, selectedTaskIds);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-primary text-xl">Načítání...</div>
      </div>
    );
  }

  const prevWeekKey = getPrevWeek(currentWeek);
  const previousWeekTasks = data?.weeks[prevWeekKey]?.tasks || [];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <Header
          currentWeek={currentWeek}
          onPrevWeek={goToPrevWeek}
          onNextWeek={goToNextWeek}
          onToday={goToToday}
          onOpenStats={() => setShowStats(true)}
          onOpenCategories={() => setShowCategoryManager(true)}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar */}
          <Sidebar
            tasks={tasks}
            categories={categories}
            onAddTask={handleAddTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onDragStart={handleDragStart}
            onDrop={handleDropOnBacklog}
            draggedTask={draggedTask}
            dragOverBacklog={dragOverDay === 'backlog'}
            onDragOver={(e) => {
              if (draggedTask?.scheduledDay) {
                e.preventDefault();
                handleDragOver('backlog');
              }
            }}
            onDragLeave={handleDragLeave}
            getCategoryById={getCategoryById}
          />

          {/* Week View */}
          <div onDragEnd={handleDragEnd}>
            <WeekView
              currentWeek={currentWeek}
              getTasksForDay={getTasksForDay}
              getTotalHoursForDay={getTotalHoursForDay}
              categories={categories}
              onUpdateTask={updateTask}
              onRemoveFromSchedule={unscheduleTask}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDropOnDay}
              draggedTask={draggedTask}
              dragOverDay={dragOverDay}
              dragOverIndex={dragOverIndex}
              getCategoryById={getCategoryById}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CategoryManager
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        categories={categories}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
      />

      <TransferTasksModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        currentWeek={currentWeek}
        previousWeekTasks={previousWeekTasks}
        onTransfer={handleTransfer}
      />

      <StatisticsView
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        weeks={data?.weeks || {}}
        categories={categories}
      />
    </div>
  );
}

export default App;
