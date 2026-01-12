import { useState } from 'react';
import { DURATION_PRESETS } from '../../utils/taskHelpers';
import { Button } from '../ui/Button';

export const DurationEditor = ({ currentDuration, onUpdate, onClose }) => {
  const [customValue, setCustomValue] = useState(currentDuration.toString());

  const handleCustomUpdate = () => {
    const value = parseFloat(customValue);
    if (!isNaN(value) && value > 0 && value <= 12) {
      onUpdate(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCustomUpdate();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="bg-black/30 rounded-lg p-3 mt-2" onClick={(e) => e.stopPropagation()}>
      {/* Presets */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {DURATION_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(preset.value);
            }}
            className={`
              px-2.5 py-1 rounded-md text-xs font-mono transition-all
              ${currentDuration === preset.value
                ? 'bg-accent-primary text-white'
                : 'bg-white/8 text-text-secondary hover:bg-accent-primary/30 hover:text-purple-200'
              }
            `}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Input */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
        <span className="text-xs text-text-muted">Vlastní:</span>
        <input
          type="number"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onKeyPress={handleKeyPress}
          onClick={(e) => e.stopPropagation()}
          className="w-16 bg-white/10 border border-white/20 rounded-md px-2 py-1 text-xs text-center font-mono outline-none focus:border-accent-primary"
          placeholder="hod"
          min="0.25"
          max="12"
          step="0.25"
          autoFocus
        />
        <Button
          variant="success"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleCustomUpdate();
          }}
        >
          OK
        </Button>
      </div>
    </div>
  );
};
