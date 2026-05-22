'use client';
import { useState } from 'react';
import { Solicitud, Estado, ESTADO_LABELS, ESTADO_COLORS, Prioridad, PRIORIDAD_COLORS, PRIORIDAD_LABELS } from '@/types';
import { EstadoBadge } from './EstadoBadge';
import { ApiSolicitudRepository } from '@/infrastructure/repositories/api-solicitud.repository';
import { UpdateEstadoUseCase } from '@/application/use-cases/update-estado.use-case';
import { SolicitudDrawer } from '@/presentation/components/admin/SolicitudDrawer';

const updateEstado = new UpdateEstadoUseCase(new ApiSolicitudRepository());

interface Props {
  solicitudes: Solicitud[];
  onEstadoChange: (id: string, estado: Estado) => void;
}

const ESTADOS = Object.keys(ESTADO_LABELS) as Estado[];

export function AdminTable({ solicitudes, onEstadoChange }: Props) {
  const [selected, setSelected] = useState<Solicitud | null>(null);

  if (solicitudes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: '#1A2235' }}
        >
          📋
        </div>
        <p className="text-lg font-medium" style={{ color: '#94A3B8' }}>
          No hay solicitudes con los filtros aplicados
        </p>
        <p className="text-sm" style={{ color: '#4B5563' }}>
          Intenta ajustar los filtros para ver más resultados
        </p>
      </div>
    );
  }

  async function handleQuickEstado(id: string, estado: Estado) {
    try {
      await updateEstado.execute(id, estado);
      onEstadoChange(id, estado);
    } catch {
      alert('Error al actualizar el estado. Intenta de nuevo.');
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr
              className="text-xs uppercase tracking-wider"
              style={{ color: '#4B5563' }}
            >
              {['Solicitud', 'Contacto', 'Ciudad', 'Prioridad', 'Estado', 'Modelo', 'Fecha', ''].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3.5 text-left font-semibold whitespace-nowrap sticky top-0"
                  style={{
                    backgroundColor: '#0A0E1A',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s, i) => (
              <tr
                key={s.id}
                className="group transition-all duration-150"
                style={{
                  backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.06)'; }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
                }}
              >
                <td className="px-4 py-3.5">
                  <div>
                    <p className="font-medium" style={{ color: '#F9FAFB' }}>{s.nombre}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#4B5563' }}>{s.codigoReal ?? s.cedula}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-sm" style={{ color: '#94A3B8' }}>{s.correo}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#4B5563' }}>{s.telefono}</p>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: '#94A3B8' }}>
                  {s.ciudad}
                </td>
                <td className="px-4 py-3.5">
                  <PrioridadBadge prioridad={s.prioridad ?? 'MEDIA'} />
                </td>
                <td className="px-4 py-3.5">
                  <EstadoBadge estado={s.estado} />
                </td>
                <td className="px-4 py-3.5 max-w-[160px]" style={{ color: '#94A3B8' }}>
                  <p className="truncate text-sm">{s.modelo?.nombre ?? s.modeloId}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#4B5563' }}>
                    {s.tipoMaterial.replace(/_/g, ' ')}
                  </p>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-xs" style={{ color: '#4B5563' }}>
                  {new Date(s.fechaRegistro).toLocaleDateString('es-CO')}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <select
                      value={s.estado}
                      onChange={(e) => handleQuickEstado(s.id, e.target.value as Estado)}
                      className="text-xs rounded-lg px-2 py-1.5 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                      style={{
                        backgroundColor: '#1A2235',
                        color: '#94A3B8',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {ESTADOS.map((e) => (
                        <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setSelected(s)}
                      className="p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      style={{ color: '#4B5563' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1A2235'; e.currentTarget.style.color = '#94A3B8'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#4B5563'; }}
                      title="Ver detalle"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SolicitudDrawer
        solicitud={selected}
        onClose={() => setSelected(null)}
        onEstadoChange={onEstadoChange}
      />
    </>
  );
}

function PrioridadBadge({ prioridad }: { prioridad: Prioridad }) {
  const color = PRIORIDAD_COLORS[prioridad];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{
        backgroundColor: `${color}18`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {PRIORIDAD_LABELS[prioridad]}
    </span>
  );
}
