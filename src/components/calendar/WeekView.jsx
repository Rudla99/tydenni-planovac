import { DayColumn } from './DayColumn';
import { getWeekDays } from '../../utils/weekHelpers';

export const WeekView = ({
  currentWeek,
  getTasksForDay,
  getTotalHoursForDay,
  categories,
  onUpdateTask,
  onRemoveFromSchedule,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  draggedTask,
  dragOverDay,
  dragOverIndex,
  getCategoryById,
}) => {
  const weekDays = getWeekDays(currentWeek);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      {weekDays.map((day) => {
        const tasks = getTasksForDay(day.id);
        const totalHours = getTotalHoursForDay(day.id);

        return (
          <DayColumn
            key={day.id}
            day={day}
            date={day.date}
            tasks={tasks}
            totalHours={totalHours}
            categories={categories}
            onUpdateTask={onUpdateTask}
            onRemoveFromSchedule={onRemoveFromSchedule}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            draggedTask={draggedTask}
            dragOverDay={dragOverDay}
            dragOverIndex={dragOverIndex}
            getCategoryById={getCategoryById}
          />
        );
      })}
    </div>
  );
};
