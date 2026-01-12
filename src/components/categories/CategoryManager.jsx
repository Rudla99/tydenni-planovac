import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ColorPicker } from '../ui/ColorPicker';
import { DEFAULT_COLORS } from '../../constants/colors';

export const CategoryManager = ({ isOpen, onClose, categories, onAdd, onUpdate, onDelete }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(DEFAULT_COLORS[0]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    onAdd(newCategoryName.trim(), newCategoryColor);
    setNewCategoryName('');
    setNewCategoryColor(DEFAULT_COLORS[0]);
  };

  const handleStartEdit = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;

    onUpdate(editingId, { name: editName.trim(), color: editColor });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('');
  };

  const handleDelete = (categoryId) => {
    const result = onDelete(categoryId);
    if (!result.success) {
      alert(result.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🏷️ Správa kategorií" size="md">
      <div className="space-y-6">
        {/* Existing Categories */}
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-3">Existující kategorie</h3>
          <div className="space-y-2">
            {categories.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-sm">
                Zatím nemáš žádné kategorie
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3"
                >
                  {editingId === category.id ? (
                    // Edit Mode
                    <>
                      <div
                        className="w-6 h-6 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: editColor }}
                      />
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                      <Button variant="success" size="sm" onClick={handleSaveEdit}>
                        Uložit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                        Zrušit
                      </Button>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <div
                        className="w-6 h-6 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="flex-1 text-text-primary font-medium">{category.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(category)}
                      >
                        ✏️ Upravit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Opravdu smazat kategorii "${category.name}"?`)) {
                            handleDelete(category.id);
                          }
                        }}
                      >
                        🗑️
                      </Button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Edit Color Picker */}
        {editingId && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Změnit barvu</h3>
            <ColorPicker selectedColor={editColor} onColorSelect={setEditColor} />
          </div>
        )}

        {/* Add New Category */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">Přidat novou kategorii</h3>

          <div className="space-y-3">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddCategory();
              }}
              placeholder="Název kategorie..."
            />

            <div>
              <label className="text-xs text-text-muted mb-2 block">Vybrat barvu</label>
              <ColorPicker
                selectedColor={newCategoryColor}
                onColorSelect={setNewCategoryColor}
              />
            </div>

            <Button variant="primary" onClick={handleAddCategory} className="w-full">
              + Přidat kategorii
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
