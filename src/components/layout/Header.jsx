import { Button } from '../ui/Button';
import { formatWeekRange, formatWeekNumber } from '../../utils/weekHelpers';

export const Header = ({
  currentWeek,
  onPrevWeek,
  onNextWeek,
  onToday,
  onOpenStats,
  onOpenCategories,
}) => {
  return (
    <div className="mb-8">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-accent-secondary to-accent-primary bg-clip-text text-transparent">
        📅 Týdenní Plánovač
      </h1>

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Week Navigation */}
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-2">
          <Button variant="ghost" size="sm" onClick={onPrevWeek}>
            ← Předchozí
          </Button>

          <div className="px-4 py-2 text-center min-w-[280px]">
            <div className="text-text-primary font-semibold">
              {formatWeekRange(currentWeek)}
            </div>
            <div className="text-text-muted text-xs mt-0.5">
              {formatWeekNumber(currentWeek)}
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={onNextWeek}>
            Další →
          </Button>
        </div>

        {/* Today Button */}
        <Button variant="secondary" size="sm" onClick={onToday}>
          📍 Dnes
        </Button>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onOpenStats}>
            📊 Statistiky
          </Button>
          <Button variant="secondary" size="sm" onClick={onOpenCategories}>
            🏷️ Kategorie
          </Button>
        </div>
      </div>
    </div>
  );
};
