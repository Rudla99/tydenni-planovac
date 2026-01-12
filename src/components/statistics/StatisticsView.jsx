import { Modal } from '../ui/Modal';
import { StatsSummary } from './StatsSummary';
import { WeeklyChart } from './WeeklyChart';
import { CategoryPieChart } from './CategoryPieChart';
import {
  getTotalHours,
  getAveragePerWeek,
  getMostProductiveDay,
  getCompletedTasksCount,
  getHoursByCategory,
  getWeeklyChartData,
} from '../../utils/statsHelpers';

export const StatisticsView = ({ isOpen, onClose, weeks, categories }) => {
  // Calculate statistics
  const totalHours = getTotalHours(weeks);
  const avgPerWeek = getAveragePerWeek(weeks);
  const mostProductiveDay = getMostProductiveDay(weeks);
  const completedCount = getCompletedTasksCount(weeks);

  const categoryData = getHoursByCategory(weeks, categories);
  const weeklyData = getWeeklyChartData(weeks, categories);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📊 Statistiky" size="xl">
      <div className="space-y-6">
        {/* Summary Cards */}
        <StatsSummary
          totalHours={totalHours}
          avgPerWeek={avgPerWeek}
          mostProductiveDay={mostProductiveDay}
          completedCount={completedCount}
        />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyChart data={weeklyData} categories={categories} />
          <CategoryPieChart data={categoryData} />
        </div>

        {/* Note */}
        <div className="text-center text-xs text-text-muted">
          Statistiky zahrnují pouze dokončené úkoly
        </div>
      </div>
    </Modal>
  );
};
