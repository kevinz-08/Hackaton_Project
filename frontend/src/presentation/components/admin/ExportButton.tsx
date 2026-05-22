'use client';
import { Solicitud, ESTADO_LABELS, PRIORIDAD_LABELS } from '@/types';
import { useState } from 'react';

interface ExportButtonProps {
  data: Solicitud[];
}

export function ExportButton({ data }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  function handleExport() {
    if (data.length === 0) return;
    setExporting(true);

    const headers = [
      'ID', 'Código', 'Nombre', 'Cédula', 'Ciudad', 'Correo', 'Teléfono',
      'Institución', 'Material', 'Modelo', 'Estado', 'Prioridad', 'Responsable', 'Cantidad', 'Fecha',
    ];

    const rows = data.map((s) => [
      s.id,
      s.codigoReal ?? '',
      s.nombre,
      s.cedula,
      s.ciudad,
      s.correo,
      s.telefono,
      s.institucion ?? '',
      s.tipoMaterial.replace(/_/g, ' '),
      s.modelo?.nombre ?? s.modeloId,
      ESTADO_LABELS[s.estado],
      s.prioridad ? PRIORIDAD_LABELS[s.prioridad] : '',
      s.responsable ?? '',
      s.cantidad?.toString() ?? '1',
      new Date(s.fechaRegistro).toLocaleDateString('es-CO'),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `andes-solicitudes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setExporting(false), 500);
  }

  return (
    <button
      onClick={handleExport}
      disabled={data.length === 0 || exporting}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        backgroundColor: '#1A2235',
        color: '#F9FAFB',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1E2D45'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1A2235'; }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {exporting ? 'Exportando…' : `Exportar CSV (${data.length})`}
    </button>
  );
}
