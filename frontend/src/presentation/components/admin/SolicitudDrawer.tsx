'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Solicitud,
  Estado,
  ESTADO_LABELS,
  ESTADO_COLORS,
  Prioridad,
  PRIORIDAD_LABELS,
  PRIORIDAD_COLORS,
} from '@/types';
import { ApiSolicitudRepository } from '@/infrastructure/repositories/api-solicitud.repository';
import { UpdateEstadoUseCase } from '@/application/use-cases/update-estado.use-case';

const updateEstado = new UpdateEstadoUseCase(new ApiSolicitudRepository());

interface SolicitudDrawerProps {
  solicitud: Solicitud | null;
  onClose: () => void;
  onEstadoChange: (id: string, estado: Estado) => void;
}

const ESTADOS = Object.keys(ESTADO_LABELS) as Estado[];

export function SolicitudDrawer({ solicitud, onClose, onEstadoChange }: SolicitudDrawerProps) {
  const [selectedEstado, setSelectedEstado] = useState<Estado | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (solicitud) {
      setSelectedEstado(solicitud.estado);
    }
  }, [solicitud]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (solicitud) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [solicitud, onClose]);

  async function handleSave() {
    if (!solicitud || !selectedEstado || selectedEstado === solicitud.estado) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      await updateEstado.execute(solicitud.id, selectedEstado);
      onEstadoChange(solicitud.id, selectedEstado);
      onClose();
    } catch {
      alert('Error al actualizar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {solicitud && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] flex flex-col shadow-2xl border-l"
            style={{
              backgroundColor: '#0A0E1A',
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b shrink-0"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className="min-w-0">
                <p className="text-xs font-medium" style={{ color: '#7C3AED' }}>
                  {solicitud.codigoReal ?? 'Solicitud'}
                </p>
                <h2 className="text-lg font-bold truncate" style={{ color: '#F9FAFB' }}>
                  {solicitud.nombre}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0"
                style={{ color: '#4B5563' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1A2235'; e.currentTarget.style.color = '#F9FAFB'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#4B5563'; }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Info personal */}
              <Section title="Información personal">
                <Field label="Cédula" value={solicitud.cedula} />
                <Field label="Correo" value={solicitud.correo} />
                <Field label="Teléfono" value={solicitud.telefono} />
                <Field label="Ciudad" value={solicitud.ciudad} />
                {solicitud.institucion && <Field label="Institución" value={solicitud.institucion} />}
              </Section>

              {/* Modelo */}
              <Section title="Modelo solicitado">
                <Field
                  label="Modelo"
                  value={solicitud.modelo?.nombre ?? solicitud.modeloId}
                />
                <Field
                  label="Material"
                  value={solicitud.tipoMaterial.replace(/_/g, ' ')}
                />
                {solicitud.cantidad && <Field label="Cantidad" value={String(solicitud.cantidad)} />}
              </Section>

              {/* Estado */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#4B5563' }}>
                  Estado
                </p>
                <div className="flex flex-wrap gap-2">
                  {ESTADOS.map((e) => {
                    const color = ESTADO_COLORS[e];
                    const isActive = selectedEstado === e;
                    return (
                      <button
                        key={e}
                        onClick={() => setSelectedEstado(e)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                        style={{
                          backgroundColor: isActive ? `${color}20` : 'transparent',
                          color: isActive ? color : '#4B5563',
                          border: `1px solid ${isActive ? `${color}50` : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        {ESTADO_LABELS[e]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prioridad */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#4B5563' }}>
                  Prioridad
                </p>
                <div className="flex gap-2">
                  {(Object.keys(PRIORIDAD_LABELS) as Prioridad[]).map((p) => {
                    const color = PRIORIDAD_COLORS[p];
                    const isActive = (solicitud.prioridad ?? 'MEDIA') === p;
                    return (
                      <span
                        key={p}
                        className="px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: isActive ? `${color}20` : 'transparent',
                          color: isActive ? color : '#4B5563',
                          border: `1px solid ${isActive ? `${color}50` : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        {PRIORIDAD_LABELS[p]}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Responsable / Notas */}
              <Section title="Gestión">
                <Field
                  label="Responsable"
                  value={solicitud.responsable ?? 'Sin asignar'}
                />
                <Field
                  label="Fecha de registro"
                  value={new Date(solicitud.fechaRegistro).toLocaleDateString('es-CO', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                />
              </Section>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 border-t shrink-0"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <button
                onClick={handleSave}
                disabled={saving || !selectedEstado || selectedEstado === solicitud.estado}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#7C3AED',
                  color: '#F9FAFB',
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#6D28D9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#7C3AED';
                }}
              >
                {saving ? 'Guardando…' : selectedEstado !== solicitud.estado ? 'Guardar cambios' : 'Cerrar'}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#4B5563' }}>
        {title}
      </p>
      <div
        className="rounded-xl p-4 space-y-2"
        style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs" style={{ color: '#4B5563' }}>{label}</span>
      <span className="text-sm text-right break-all" style={{ color: '#94A3B8' }}>{value}</span>
    </div>
  );
}
