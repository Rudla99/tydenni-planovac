import { useState } from 'react';
import { TaskCard } from './TaskCard';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const TaskList = ({
  tasks,
  categories,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onDragStart,
  draggedTask,
  getCategoryById,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    onAddTask(newTaskTitle.trim());
    setNewTaskTitle('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div>
      {/* Add Task Form */}
      <div className="flex gap-2 mb-4">
        <Input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nový úkol..."
          className="flex-1"
        />
        <Button onClick={handleAddTask} size="md">
          +
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-0">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-text-muted text-sm">
            Přidej první úkol ☝️
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              categories={categories}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onDragStart={onDragStart}
              isDragging={draggedTask?.id === task.id}
              getCategoryById={getCategoryById}
            />
          ))
        )}
      </div>
    </div>
  );
};
