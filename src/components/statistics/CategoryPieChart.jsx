import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const CategoryPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        Zatím nejsou k dispozici data pro graf
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.categoryName,
    value: item.hours,
    color: item.color,
  }));

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6">
        🥧 Rozdělení podle kategorií
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(22, 33, 62, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#e4e4e7',
            }}
            formatter={(value) => `${value} hod`}
          />
          <Legend
            wrapperStyle={{ color: '#e4e4e7' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Category Table */}
      <div className="mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 text-text-muted font-medium">Kategorie</th>
              <th className="text-right py-2 text-text-muted font-medium">Hodiny</th>
              <th className="text-right py-2 text-text-muted font-medium">%</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-white/5">
                <td className="py-2 flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-text-primary">{item.categoryName}</span>
                </td>
                <td className="text-right text-text-primary font-mono">{item.hours.toFixed(1)}</td>
                <td className="text-right text-text-secondary">{item.percentage.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
