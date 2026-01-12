// Celkové hodiny za období
export const getTotalHours = (weeks, fromWeek = null, toWeek = null) => {
  let total = 0;

  Object.keys(weeks).forEach((weekKey) => {
    if (fromWeek && weekKey < fromWeek) return;
    if (toWeek && weekKey > toWeek) return;

    const tasks = weeks[weekKey].tasks || [];
    tasks.forEach((task) => {
      if (task.scheduledDay && task.completed) {
        total += task.duration;
      }
    });
  });

  return total;
};

// Hodiny podle kategorie
export const getHoursByCategory = (weeks, categories, fromWeek = null, toWeek = null) => {
  const categoryHours = {};

  // Inicializace
  categories.forEach((cat) => {
    categoryHours[cat.id] = 0;
  });
  categoryHours['uncategorized'] = 0;

  // Sčítání hodin
  Object.keys(weeks).forEach((weekKey) => {
    if (fromWeek && weekKey < fromWeek) return;
    if (toWeek && weekKey > toWeek) return;

    const tasks = weeks[weekKey].tasks || [];
    tasks.forEach((task) => {
      if (task.scheduledDay && task.completed) {
        const catId = task.categoryId || 'uncategorized';
        categoryHours[catId] = (categoryHours[catId] || 0) + task.duration;
      }
    });
  });

  // Konverze na pole
  const total = Object.values(categoryHours).reduce((sum, hours) => sum + hours, 0);

  const result = categories
    .map((cat) => ({
      categoryId: cat.id,
      categoryName: cat.name,
      color: cat.color,
      hours: categoryHours[cat.id] || 0,
      percentage: total > 0 ? ((categoryHours[cat.id] || 0) / total) * 100 : 0,
    }))
    .filter((item) => item.hours > 0);

  if (categoryHours['uncategorized'] > 0) {
    result.push({
      categoryId: 'uncategorized',
      categoryName: 'Bez kategorie',
      color: '#6b7280',
      hours: categoryHours['uncategorized'],
      percentage: total > 0 ? (categoryHours['uncategorized'] / total) * 100 : 0,
    });
  }

  return result.sort((a, b) => b.hours - a.hours);
};

// Data pro týdenní graf
export const getWeeklyChartData = (weeks, categories, fromWeek = null, toWeek = null) => {
  const weekKeys = Object.keys(weeks)
    .filter((key) => {
      if (fromWeek && key < fromWeek) return false;
      if (toWeek && key > toWeek) return false;
      return true;
    })
    .sort();

  return weekKeys.map((weekKey) => {
    const tasks = weeks[weekKey].tasks || [];
    const dataPoint = {
      week: weekKey.split('-W')[1],
      weekKey,
      total: 0,
    };

    // Inicializace kategorií
    categories.forEach((cat) => {
      dataPoint[cat.id] = 0;
    });
    dataPoint['uncategorized'] = 0;

    // Sčítání hodin
    tasks.forEach((task) => {
      if (task.scheduledDay && task.completed) {
        const catId = task.categoryId || 'uncategorized';
        dataPoint[catId] = (dataPoint[catId] || 0) + task.duration;
        dataPoint.total += task.duration;
      }
    });

    return dataPoint;
  });
};

// Nejproduktivnější den
export const getMostProductiveDay = (weeks) => {
  const dayHours = {
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
  };

  Object.values(weeks).forEach((week) => {
    const tasks = week.tasks || [];
    tasks.forEach((task) => {
      if (task.scheduledDay && task.completed) {
        dayHours[task.scheduledDay] += task.duration;
      }
    });
  });

  let maxDay = 'mon';
  let maxHours = 0;

  Object.entries(dayHours).forEach(([day, hours]) => {
    if (hours > maxHours) {
      maxHours = hours;
      maxDay = day;
    }
  });

  return maxDay;
};

// Průměr za týden
export const getAveragePerWeek = (weeks, fromWeek = null, toWeek = null) => {
  const weekKeys = Object.keys(weeks).filter((key) => {
    if (fromWeek && key < fromWeek) return false;
    if (toWeek && key > toWeek) return false;
    return true;
  });

  if (weekKeys.length === 0) return 0;

  const total = getTotalHours(weeks, fromWeek, toWeek);
  return total / weekKeys.length;
};

// Počet dokončených úkolů
export const getCompletedTasksCount = (weeks, fromWeek = null, toWeek = null) => {
  let count = 0;

  Object.keys(weeks).forEach((weekKey) => {
    if (fromWeek && weekKey < fromWeek) return;
    if (toWeek && weekKey > toWeek) return;

    const tasks = weeks[weekKey].tasks || [];
    tasks.forEach((task) => {
      if (task.completed) {
        count++;
      }
    });
  });

  return count;
};
