import { DAYS } from '../../constants/days';

export const StatsSummary = ({ totalHours, avgPerWeek, mostProductiveDay, completedCount }) => {
  const dayName = DAYS.find((d) => d.id === mostProductiveDay)?.name || '-';

  const stats = [
    {
      label: 'Celkem odpracováno',
      value: `${totalHours.toFixed(1)} hod`,
      icon: '⏱️',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      label: 'Průměrně za týden',
      value: `${avgPerWeek.toFixed(1)} hod`,
      icon: '📊',
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Nejproduktivnější den',
      value: dayName,
      icon: '🌟',
      color: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Dokončených úkolů',
      value: completedCount,
      icon: '✅',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:scale-105 transition-transform"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`text-3xl p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
          <div className="text-2xl font-bold text-text-primary mb-1">{stat.value}</div>
          <div className="text-xs text-text-muted">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
