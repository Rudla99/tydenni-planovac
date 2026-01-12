import { useState } from 'react';
import { formatDuration } from '../../utils/taskHelpers';
import { DurationEditor } from './DurationEditor';
import { CategoryPicker } from '../categories/CategoryPicker';
import { DAYS } from '../../constants/days';

export const TaskCard = ({
  task,
  categories,
  onUpdate,
  onDelete,
  onDragStart,
  isDragging,
  getCategoryById,
}) => {
  const [editingDuration, setEditingDuration] = useState(false);

  const category = getCategoryById(task.categoryId);
  const scheduledDayName = task.scheduledDay
    ? DAYS.find((d) => d.id === task.scheduledDay)?.short
    : null;

  const handleDurationUpdate = (duration) => {
    onUpdate(task.id, { duration });
    setEditingDuration(false);
  };

  const handleCategorySelect = (categoryId) => {
    onUpdate(task.id, { categoryId });
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
        bg-white/5 border rounded-xl p-3 mb-2
        cursor-grab active:cursor-grabbing
        transition-all duration-200 relative
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${task.scheduledDay ? 'border-l-4 border-l-green-500' : 'border-white/8'}
        ${task.completed ? 'opacity-60' : ''}
        hover:bg-white/8 hover:translate-x-1 hover:border-accent-primary/30
      `}
    >
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm('Opravdu smazat tento úkol?')) {
            onDelete(task.id);
          }
        }}
        className="absolute top-2 right-2 text-text-muted hover:text-red-400 opacity-0 hover:opacity-100 transition-all p-1"
      >
        ✕
      </button>

      {/* Task Title */}
      <div className={`text-sm font-medium text-text-primary pr-6 ${task.completed ? 'line-through' : ''}`}>
        {task.title}
      </div>

      {/* Meta Information */}
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {/* Duration Badge */}
        {!editingDuration ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingDuration(true);
            }}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-primary/20 text-purple-300 text-xs font-mono hover:bg-accent-primary/40 transition-colors"
          >
            ⏱ {formatDuration(task.duration)}
          </button>
        ) : null}

        {/* Category Picker */}
        <CategoryPicker
          categories={categories}
          selectedCategoryId={task.categoryId}
          onSelect={handleCategorySelect}
        />

        {/* Scheduled Badge */}
        {task.scheduledDay && (
          <>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
              ✓ V plánu
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-medium">
              {scheduledDayName}
            </span>
          </>
        )}

        {/* Completed Checkbox */}
        <label className="inline-flex items-center gap-1 cursor-pointer ml-auto" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => {
              e.stopPropagation();
              onUpdate(task.id, { completed: !task.completed });
            }}
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent-primary focus:ring-accent-primary/50"
          />
          <span className="text-xs text-text-muted">Hotovo</span>
        </label>
      </div>

      {/* Duration Editor */}
      {editingDuration && (
        <DurationEditor
          currentDuration={task.duration}
          onUpdate={handleDurationUpdate}
          onClose={() => setEditingDuration(false)}
        />
      )}
    </div>
  );
};
