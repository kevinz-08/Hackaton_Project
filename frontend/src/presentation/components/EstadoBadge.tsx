'use client';
import { Estado, ESTADO_COLORS, ESTADO_LABELS } from '@/types';

export function EstadoBadge({ estado }: { estado: Estado }) {
  const color = ESTADO_COLORS[estado];
  const isTerminal = estado === 'ENTREGADA';

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium leading-relaxed"
      style={{
        backgroundColor: `${color}18`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {!isTerminal && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        />
      )}
      {ESTADO_LABELS[estado]}
    </span>
  );
}
