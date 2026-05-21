'use client';
import { Estado, ESTADO_COLORS, ESTADO_LABELS } from '@/types';

export function EstadoBadge({ estado }: { estado: Estado }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ESTADO_COLORS[estado]}`}>
      {ESTADO_LABELS[estado]}
    </span>
  );
}
