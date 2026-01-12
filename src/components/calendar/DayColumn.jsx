import { ScheduledTask } from './ScheduledTask';
import { formatDayDate } from '../../utils/weekHelpers';
import { DEFAULT_HOURS_PER_DAY } from '../../constants/days';

export const DayColumn = ({
  day,
  date,
  tasks,
  totalHours,
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
  const isOver = totalHours > DEFAULT_HOURS_PER_DAY;
  const isDragOver = dragOverDay === day.id;

  return (
    <div
      className={`
        bg-white/2 border-2 border-dashed rounded-2xl p-4
        min-h-[450px] transition-all duration-300
        ${isDragOver ? 'border-accent-primary bg-accent-primary/10 shadow-lg shadow-accent-primary/20' : 'border-white/8'}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(day.id, tasks.length);
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(day.id, tasks.length);
      }}
    >
      {/* Day Header */}
      <div className="text-center mb-4 pb-3 border-b border-white/8">
        <div className="font-semibold text-text-primary mb-1">{day.name}</div>
        <div className="text-xs text-text-muted mb-2">{formatDayDate(date)}</div>
        <div className="text-xs font-mono">
          <span className={isOver ? 'text-red-400' : 'text-cyan-400'}>
            {totalHours}
          </span>
          <span className="text-text-muted"> / {DEFAULT_HOURS_PER_DAY} hod</span>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-10 text-text-muted/50">
            <div className="text-3xl mb-2 opacity-50">📭</div>
            <div className="text-xs">Přetáhni sem</div>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div key={task.id}>
              {/* Drop Indicator */}
              {isDragOver && dragOverIndex === index && draggedTask?.id !== task.id && (
                <div className="h-0.5 bg-gradient-to-r from-transparent via-accent-primary to-transparent rounded mb-2 animate-pulse" />
              )}

              {/* Task */}
              <ScheduledTask
                task={task}
                order={index}
                category={getCategoryById(task.categoryId)}
                onUpdate={onUpdateTask}
                onRemove={onRemoveFromSchedule}
                onDragStart={onDragStart}
                isDragging={draggedTask?.id === task.id}
              />
            </div>
          ))
        )}

        {/* Drop Indicator at end */}
        {isDragOver && dragOverIndex === tasks.length && tasks.length > 0 && (
          <div className="h-0.5 bg-gradient-to-r from-transparent via-accent-primary to-transparent rounded animate-pulse" />
        )}
      </div>
    </div>
  );
};
