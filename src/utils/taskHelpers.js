// Formátování délky úkolu
export const formatDuration = (hours) => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  if (hours === Math.floor(hours)) {
    return `${hours} hod`;
  }
  return `${hours} hod`;
};

// Výška úkolu podle délky
export const getHeightForDuration = (duration) => {
  const baseHeight = 56;
  const heightPerHour = 44;
  return baseHeight + (duration - 0.5) * heightPerHour;
};

// Předvolby délek úkolů
export const DURATION_PRESETS = [
  { value: 0.5, label: '30m' },
  { value: 1, label: '1h' },
  { value: 1.5, label: '1.5h' },
  { value: 2, label: '2h' },
  { value: 3, label: '3h' },
  { value: 4, label: '4h' },
  { value: 6, label: '6h' },
  { value: 8, label: '8h' },
];

// Generování jedinečného ID
export const generateTaskId = () => {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Vytvoření nového úkolu
export const createTask = (title, categoryId = null, duration = 1) => {
  return {
    id: generateTaskId(),
    title,
    categoryId,
    duration,
    scheduledDay: null,
    order: 0,
    completed: false,
    createdAt: new Date().toISOString(),
  };
};

// Kopírování úkolu pro přenos do nového týdne
export const copyTaskForTransfer = (task) => {
  return {
    ...task,
    id: generateTaskId(),
    scheduledDay: null,
    completed: false,
    createdAt: new Date().toISOString(),
  };
};
