import { useState } from 'react';
import { formatDuration, getHeightForDuration } from '../../utils/taskHelpers';
import { DurationEditor } from '../tasks/DurationEditor';

export const ScheduledTask = ({
  task,
  order,
  category,
  onUpdate,
  onRemove,
  onDragStart,
  isDragging,
}) => {
  const [editingDuration, setEditingDuration] = useState(false);

  const handleDurationUpdate = (duration) => {
    onUpdate(task.id, { duration });
    setEditingDuration(false);
  };

  return (
    <div
      draggable={!editingDuration}
      onDragStart={(e) => {
        if (!editingDuration) {
          onDragStart(task);
        }
      }}
      className={`
        relative bg-gradient-to-br from-accent-primary/20 to-purple-600/15
        border border-accent-primary/30 rounded-lg p-3
        cursor-grab active:cursor-grabbing
        transition-all duration-200 overflow-hidden
        ${isDragging ? 'opacity-50' : ''}
        ${task.completed ? 'opacity-60' : ''}
        hover:scale-[1.02] hover:shadow-lg hover:shadow-accent-primary/30 hover:z-10
      `}
      style={{ minHeight: `${getHeightForDuration(task.duration)}px` }}
    >
      {/* Category Indicator */}
      {category && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ background: `linear-gradient(180deg, ${category.color}, ${category.color}88)` }}
        />
      )}

      {/* Order Number */}
      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-white/10 text-text-muted rounded-full flex items-center justify-center text-[0.65rem] font-mono transition-opacity hover:opacity-0">
        {order + 1}
      </div>

      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(task.id);
        }}
        className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xs opacity-0 hover:opacity-100 hover:bg-red-500/40 hover:text-red-300 transition-all hover:scale-110"
        title="Odebrat z rozvrhu"
      >
        ✕
      </button>

      {/* Task Title */}
      <div className={`text-sm font-medium text-text-primary pl-2 pr-7 ${task.completed ? 'line-through' : ''}`}>
        {task.title}
      </div>

      {/* Duration */}
      <div className="mt-auto pt-2 pl-2">
        {!editingDuration ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingDuration(true);
            }}
            className="text-xs font-mono text-purple-300 hover:text-purple-200 transition-colors"
          >
            ⏱ {formatDuration(task.duration)}
          </button>
        ) : (
          <DurationEditor
            currentDuration={task.duration}
            onUpdate={handleDurationUpdate}
            onClose={() => setEditingDuration(false)}
          />
        )}
      </div>

      {/* Completed Checkbox */}
      <label className="absolute bottom-2 right-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => {
            e.stopPropagation();
            onUpdate(task.id, { completed: !task.completed });
          }}
          className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent-primary focus:ring-accent-primary/50"
        />
      </label>
    </div>
  );
};
