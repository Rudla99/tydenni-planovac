import { getISOWeek, getYear, startOfISOWeek, endOfISOWeek, addWeeks, subWeeks, format, parseISO } from 'date-fns';
import { cs } from 'date-fns/locale';

// Vrátí ISO klíč týdne pro dané datum
export const getWeekKey = (date = new Date()) => {
  const year = getYear(date);
  const week = getISOWeek(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

// Vrátí datum pondělí a pátku daného týdne
export const getWeekRange = (weekKey) => {
  const [year, weekNum] = weekKey.split('-W').map(Number);
  const date = new Date(year, 0, 1 + (weekNum - 1) * 7);
  const start = startOfISOWeek(date);
  const end = endOfISOWeek(date);
  return { start, end };
};

// Vrátí pole dnů s daty pro daný týden
export const getWeekDays = (weekKey) => {
  const { start } = getWeekRange(weekKey);
  const days = [
    { id: 'mon', name: 'Pondělí', short: 'Po' },
    { id: 'tue', name: 'Úterý', short: 'Út' },
    { id: 'wed', name: 'Středa', short: 'St' },
    { id: 'thu', name: 'Čtvrtek', short: 'Čt' },
    { id: 'fri', name: 'Pátek', short: 'Pá' },
  ];

  return days.map((day, index) => {
    const date = addWeeks(start, 0);
    date.setDate(date.getDate() + index);
    return { ...day, date };
  });
};

// Vrátí aktuální týden
export const getCurrentWeekKey = () => {
  return getWeekKey(new Date());
};

// Posun o týden
export const getNextWeek = (weekKey) => {
  const { start } = getWeekRange(weekKey);
  const nextWeek = addWeeks(start, 1);
  return getWeekKey(nextWeek);
};

export const getPrevWeek = (weekKey) => {
  const { start } = getWeekRange(weekKey);
  const prevWeek = subWeeks(start, 1);
  return getWeekKey(prevWeek);
};

// Formátování pro zobrazení
export const formatWeekRange = (weekKey) => {
  const { start, end } = getWeekRange(weekKey);
  // Vrátí formát "13. - 17. ledna 2025"
  const startDay = format(start, 'd.', { locale: cs });
  const endDay = format(end, 'd.', { locale: cs });
  const month = format(end, 'LLLL', { locale: cs });
  const year = format(end, 'yyyy', { locale: cs });
  return `${startDay} - ${endDay} ${month} ${year}`;
};

export const formatWeekNumber = (weekKey) => {
  const weekNum = weekKey.split('-W')[1];
  return `Týden ${parseInt(weekNum)}`;
};

// Formátování data pro DayColumn
export const formatDayDate = (date) => {
  return format(date, 'd.M.', { locale: cs });
};
