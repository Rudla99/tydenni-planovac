import { useState, useRef, useEffect } from 'react';
import { CategoryBadge } from './CategoryBadge';

export const CategoryPicker = ({ categories, selectedCategoryId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (categoryId) => {
    onSelect(categoryId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* Trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        {selectedCategory ? (
          <>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedCategory.color }}
            />
            <span className="text-xs text-text-secondary">{selectedCategory.name}</span>
          </>
        ) : (
          <span className="text-xs text-text-muted">Kategorie</span>
        )}
        <svg
          className={`w-3 h-3 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-bg-secondary border border-white/10 rounded-lg shadow-xl z-50 min-w-[200px] py-1">
          {/* No Category Option */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(null);
            }}
            className="w-full px-3 py-2 text-left text-xs text-text-muted hover:bg-white/5 transition-colors"
          >
            Bez kategorie
          </button>

          {/* Categories */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(category.id);
              }}
              className="w-full px-3 py-2 text-left hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-xs text-text-primary">{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
