import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const WeeklyChart = ({ data, categories }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        Zatím nejsou k dispozici data pro graf
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6">
        📈 Hodiny podle týdnů
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="week"
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            label={{ value: 'Týden', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.5)' }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            label={{ value: 'Hodiny', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(22, 33, 62, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#e4e4e7',
            }}
          />
          <Legend
            wrapperStyle={{ color: '#e4e4e7' }}
            iconType="circle"
          />

          {categories.map((cat) => (
            <Bar
              key={cat.id}
              dataKey={cat.id}
              name={cat.name}
              stackId="a"
              fill={cat.color}
            />
          ))}
          <Bar
            dataKey="uncategorized"
            name="Bez kategorie"
            stackId="a"
            fill="#6b7280"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
