import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { getPrevWeek } from '../../utils/weekHelpers';

export const TransferTasksModal = ({ isOpen, onClose, currentWeek, previousWeekTasks, onTransfer }) => {
  const [mode, setMode] = useState('all'); // 'all', 'unscheduled', 'incomplete', 'selected'
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  const prevWeekKey = getPrevWeek(currentWeek);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedTaskIds([]);
  };

  const handleToggleTask = (taskId) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleTransfer = () => {
    onTransfer(prevWeekKey, mode, selectedTaskIds);
    onClose();
  };

  const handleStartEmpty = () => {
    onClose();
  };

  const getTaskCount = () => {
    switch (mode) {
      case 'all':
        return previousWeekTasks.length;
      case 'unscheduled':
        return previousWeekTasks.filter((t) => !t.scheduledDay).length;
      case 'incomplete':
        return previousWeekTasks.filter((t) => !t.completed).length;
      case 'selected':
        return selectedTaskIds.length;
      default:
        return 0;
    }
  };

  if (!previousWeekTasks || previousWeekTasks.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="🔄 Přenos úkolů" size="sm">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-text-muted mb-6">
            V minulém týdnu nejsou žádné úkoly k přenosu.
          </p>
          <Button variant="primary" onClick={onClose}>
            Začít s prázdným týdnem
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔄 Přenos úkolů z minulého týdne" size="md">
      <div className="space-y-6">
        {/* Mode Selection */}
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-3">Vybrat režim přenosu</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/8 transition-colors">
              <input
                type="radio"
                name="transfer-mode"
                value="all"
                checked={mode === 'all'}
                onChange={() => handleModeChange('all')}
                className="w-4 h-4 text-accent-primary"
              />
              <div className="flex-1">
                <div className="text-text-primary font-medium">Přenést všechny úkoly</div>
                <div className="text-xs text-text-muted">
                  Zkopíruje všechny úkoly ({previousWeekTasks.length})
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/8 transition-colors">
              <input
                type="radio"
                name="transfer-mode"
                value="unscheduled"
                checked={mode === 'unscheduled'}
                onChange={() => handleModeChange('unscheduled')}
                className="w-4 h-4 text-accent-primary"
              />
              <div className="flex-1">
                <div className="text-text-primary font-medium">Jen nezařazené</div>
                <div className="text-xs text-text-muted">
                  Úkoly, které nebyly naplánované ({previousWeekTasks.filter((t) => !t.scheduledDay).length})
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/8 transition-colors">
              <input
                type="radio"
                name="transfer-mode"
                value="incomplete"
                checked={mode === 'incomplete'}
                onChange={() => handleModeChange('incomplete')}
                className="w-4 h-4 text-accent-primary"
              />
              <div className="flex-1">
                <div className="text-text-primary font-medium">Jen nedokončené</div>
                <div className="text-xs text-text-muted">
                  Úkoly, které nebyly dokončeny ({previousWeekTasks.filter((t) => !t.completed).length})
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/8 transition-colors">
              <input
                type="radio"
                name="transfer-mode"
                value="selected"
                checked={mode === 'selected'}
                onChange={() => handleModeChange('selected')}
                className="w-4 h-4 text-accent-primary"
              />
              <div className="flex-1">
                <div className="text-text-primary font-medium">Vybrat ručně</div>
                <div className="text-xs text-text-muted">Vyber konkrétní úkoly k přenosu</div>
              </div>
            </label>
          </div>
        </div>

        {/* Task Selection */}
        {mode === 'selected' && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Vybrat úkoly</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {previousWeekTasks.map((task) => (
                <label
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/8 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.includes(task.id)}
                    onChange={() => handleToggleTask(task.id)}
                    className="w-4 h-4 rounded border-white/20 text-accent-primary"
                  />
                  <div className="flex-1">
                    <div className="text-text-primary text-sm">{task.title}</div>
                    <div className="text-xs text-text-muted mt-0.5">
                      {task.duration} hod
                      {task.completed && ' • Dokončeno'}
                      {task.scheduledDay && ' • V plánu'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-accent-primary/10 border border-accent-primary/20 rounded-lg p-4">
          <div className="text-center text-text-primary">
            Bude přeneseno <span className="font-bold text-accent-primary">{getTaskCount()}</span> úkolů
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleStartEmpty} className="flex-1">
            Začít s prázdným týdnem
          </Button>
          <Button
            variant="primary"
            onClick={handleTransfer}
            disabled={mode === 'selected' && selectedTaskIds.length === 0}
            className="flex-1"
          >
            🔄 Přenést úkoly
          </Button>
        </div>
      </div>
    </Modal>
  );
};
