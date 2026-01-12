import { DEFAULT_COLORS } from '../../constants/colors';

export const ColorPicker = ({ selectedColor, onColorSelect, colors = DEFAULT_COLORS }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onColorSelect(color)}
          className={`
            w-8 h-8 rounded-lg transition-all duration-200
            ${selectedColor === color
              ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-secondary scale-110'
              : 'hover:scale-110'
            }
          `}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
};
