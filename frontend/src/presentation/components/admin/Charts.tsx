'use client';
import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import { Solicitud, ESTADO_LABELS, ESTADO_COLORS } from '@/types';

interface ChartsProps {
  data: Solicitud[];
}

const TOOLTIP_STYLE = {
  backgroundColor: '#1A2235',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  color: '#F9FAFB',
  fontSize: '12px',
};

export function Charts({ data }: ChartsProps) {
  const porEstado = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach((s) => { map[s.estado] = (map[s.estado] ?? 0) + 1; });
    return (Object.keys(ESTADO_LABELS) as (keyof typeof ESTADO_LABELS)[]).map((k) => ({
      name: ESTADO_LABELS[k],
      value: map[k] ?? 0,
      color: ESTADO_COLORS[k],
    }));
  }, [data]);

  const porCiudad = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach((s) => { map[s.ciudad] = (map[s.ciudad] ?? 0) + 1; });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  const porFecha = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach((s) => {
      const key = new Date(s.fechaRegistro).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
      map[key] = (map[key] ?? 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* Donut — Estado */}
      <ChartCard title="Por estado">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={porEstado}
              cx="50%" cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {porEstado.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {porEstado.map((e) => (
            <div key={e.name} className="flex items-center gap-1.5 text-xs" style={{ color: '#94A3B8' }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
              {e.name}: <span style={{ color: '#F9FAFB' }}>{e.value}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Barras — Ciudad */}
      <ChartCard title="Por ciudad (top 10)">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={porCiudad} layout="vertical" margin={{ left: 10, right: 10 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#4B5563', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#7C3AED" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Línea — Tiempo */}
      <ChartCard title="En el tiempo">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={porFecha} margin={{ left: 0, right: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#4B5563', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fill: '#4B5563', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#7C3AED"
              strokeWidth={2}
              dot={{ fill: '#7C3AED', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#9B6DFF' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#4B5563' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
