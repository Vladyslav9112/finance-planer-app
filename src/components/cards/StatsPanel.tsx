import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import type { StatsSummary } from "../../types/entities";
import { formatMoney } from "../../lib/utils";

const colors = ["#1dd6a4", "#8b5cf6", "#a3e635"];

export function StatsPanel({ stats }: { stats: StatsSummary }) {
  const pieData = [
    { name: "Доходи", value: stats.totalIncome },
    { name: "Витрати", value: stats.totalExpenses },
    { name: "Видано", value: stats.totalSalaryPaid },
    { name: "Баланс", value: Math.max(stats.balance, 0) },
  ];

  const barData = [
    { name: "Дохід", value: stats.totalIncome },
    { name: "Видано", value: stats.totalSalaryPaid },
    { name: "Витрати", value: stats.totalExpenses },
    { name: "Тара", value: stats.totalEarnings },
  ];

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-border bg-panel/70 p-4">
        <h3 className="mb-3 font-medium text-white">Фінансовий розподіл</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78}>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-panel/70 p-4">
        <h3 className="mb-3 font-medium text-white">Зарплата і склад</h3>
        <p className="mb-3 text-xs text-slate-400">Порівняння доходів, виданих сум, витрат і заробітку по тарі.</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                formatter={(value) => {
                  const numeric = typeof value === "number" ? value : Number(value || 0);
                  return formatMoney(numeric);
                }}
              />
              <Bar dataKey="value" fill="#1dd6a4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
