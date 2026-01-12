import { TaskList } from '../tasks/TaskList';

export const Sidebar = ({
  tasks,
  categories,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onDragStart,
  onDrop,
  draggedTask,
  dragOverBacklog,
  onDragOver,
  onDragLeave,
  getCategoryById,
}) => {
  return (
    <div
      className={`
        bg-white/3 backdrop-blur-xl border rounded-2xl p-5
        transition-all duration-300 h-fit sticky top-6
        ${draggedTask?.scheduledDay ? 'border-amber-500/40' : 'border-white/8'}
        ${dragOverBacklog ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20' : ''}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/8">
        <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
        <h2 className="text-text-secondary font-semibold text-base">
          Všechny úkoly
          <span className="ml-2 text-text-muted text-sm">({tasks.length})</span>
        </h2>
      </div>

      <TaskList
        tasks={tasks}
        categories={categories}
        onAddTask={onAddTask}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onDragStart={onDragStart}
        draggedTask={draggedTask}
        getCategoryById={getCategoryById}
      />
    </div>
  );
};
