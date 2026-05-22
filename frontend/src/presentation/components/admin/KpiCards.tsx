'use client';
import { motion } from 'framer-motion';

interface KpiItem {
  label: string;
  value: number;
  total?: number;
  color: string;
  icon: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

function KpiCard({ label, value, total, color, icon }: KpiItem) {
  const pct = total && total > 0 ? (value / total) * 100 : 0;

  return (
    <motion.div
      variants={item}
      className="relative group rounded-xl p-4 sm:p-5 border transition-all duration-300"
      style={{
        backgroundColor: '#111827',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at 50% 0%, ${color}12, transparent 70%)`,
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">{icon}</span>
          <span
            className="w-1 h-8 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <p className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#F9FAFB' }}>
          {value}
        </p>
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#94A3B8' }}>
          {label}
        </p>
        {total !== undefined && (
          <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#1E2D45' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface KpiCardsProps {
  total: number;
  contadores: Record<string, number>;
}

export function KpiCards({ total, contadores }: KpiCardsProps) {
  const cards: KpiItem[] = [
    { label: 'Solicitudes totales', value: total, color: '#7C3AED', icon: '📦' },
    { label: 'Recibidas', value: contadores.RECIBIDA ?? 0, total, color: '#F59E0B', icon: '📥' },
    { label: 'En producción', value: contadores.EN_PRODUCCION ?? 0, total, color: '#3B82F6', icon: '⚙️' },
    { label: 'Revisión calidad', value: contadores.REVISION_CALIDAD ?? 0, total, color: '#8B5CF6', icon: '🔍' },
    { label: 'Empaque y transporte', value: contadores.EMPAQUE_TRANSPORTE ?? 0, total, color: '#06B6D4', icon: '🚚' },
    { label: 'Entregadas', value: contadores.ENTREGADA ?? 0, total, color: '#10B981', icon: '✅' },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
    >
      {cards.map((c) => (
        <KpiCard key={c.label} {...c} />
      ))}
    </motion.div>
  );
}
