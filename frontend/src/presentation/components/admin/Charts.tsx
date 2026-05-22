'use client';
import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { Solicitud, ESTADO_LABELS, ESTADO_COLORS, PRIORIDAD_LABELS, PRIORIDAD_COLORS } from '@/types';

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

  const porPrioridad = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach((s) => {
      const p = s.prioridad ?? 'MEDIA';
      map[p] = (map[p] ?? 0) + 1;
    });
    return (Object.keys(PRIORIDAD_LABELS) as (keyof typeof PRIORIDAD_LABELS)[]).map((k) => ({
      name: PRIORIDAD_LABELS[k],
      value: map[k] ?? 0,
      color: PRIORIDAD_COLORS[k],
    }));
  }, [data]);

  const total = data.length;
  const stats = useMemo(() => {
    if (total === 0) return null;
    const ciudades = new Set(data.map((s) => s.ciudad)).size;
    const estadosUsados = new Set(data.map((s) => s.estado)).size;
    const conPrioridadAlta = data.filter((s) => (s.prioridad ?? 'MEDIA') === 'ALTA').length;
    return { ciudades, estadosUsados, conPrioridadAlta };
  }, [data, total]);

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

      {/* Estadístico — Prioridad */}
      <ChartCard title="Distribución por prioridad">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={porPrioridad} margin={{ left: 0, right: 0, top: 5, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={36}>
              {porPrioridad.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {/* Statistical summary */}
        {stats && (
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: '#F9FAFB' }}>{total}</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: '#4B5563' }}>Total</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: '#EF4444' }}>{stats.conPrioridadAlta}</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: '#4B5563' }}>
                Alta {total > 0 ? `(${Math.round((stats.conPrioridadAlta / total) * 100)}%)` : ''}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: '#3B82F6' }}>{stats.ciudades}</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: '#4B5563' }}{...{}}>Ciudades</p>
            </div>
          </div>
        )}
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
