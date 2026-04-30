"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import { useStats } from "@/features/stats/hooks/useStats";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function StatsPage() {
  const { totalEvents, categoryData, monthlyData, isLoading } = useStats();

  if (isLoading) return <p className="p-8">Calculando métricas...</p>;

  return (
    <main className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Estadísticas de Eventos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500 uppercase font-bold">
            Total Eventos
          </p>
          <p className="text-4xl font-black">{totalEvents}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
        <div className="p-6 bg-white rounded-xl border shadow-sm h-[400px]">
          <h3 className="mb-4 font-semibold">Eventos por Mes</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-white rounded-xl border shadow-sm h-[400px]">
          <h3 className="mb-4 font-semibold">Distribución por Categoría</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
              >
                {categoryData.map((_, index) => (
                  <Bar
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
