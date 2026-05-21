'use client';
import { Solicitud, Estado, ESTADO_LABELS } from '@/types';
import { EstadoBadge } from './EstadoBadge';
import { ApiSolicitudRepository } from '@/infrastructure/repositories/api-solicitud.repository';
import { UpdateEstadoUseCase } from '@/application/use-cases/update-estado.use-case';

const updateEstado = new UpdateEstadoUseCase(new ApiSolicitudRepository());

interface Props {
  solicitudes: Solicitud[];
  onEstadoChange: (id: string, estado: Estado) => void;
}

export function AdminTable({ solicitudes, onEstadoChange }: Props) {
  if (solicitudes.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No hay solicitudes con los filtros aplicados.</p>
      </div>
    );
  }

  async function handleChange(id: string, estado: Estado) {
    try {
      await updateEstado.execute(id, estado);
      onEstadoChange(id, estado);
    } catch {
      alert('Error al actualizar el estado. Intenta de nuevo.');
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            {['Nombre', 'Cédula', 'Ciudad', 'Correo', 'Teléfono', 'Material', 'Modelo', 'Fecha', 'Estado'].map((h) => (
              <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {solicitudes.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{s.nombre}</td>
              <td className="px-4 py-3 text-gray-600">{s.cedula}</td>
              <td className="px-4 py-3 text-gray-600">{s.ciudad}</td>
              <td className="px-4 py-3 text-gray-600">{s.correo}</td>
              <td className="px-4 py-3 text-gray-600">{s.telefono}</td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.tipoMaterial.replace(/_/g, ' ')}</td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.modelo?.nombre ?? s.modeloId}</td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {new Date(s.fechaRegistro).toLocaleDateString('es-CO')}
              </td>
              <td className="px-4 py-3">
                <select
                  value={s.estado}
                  onChange={(e) => handleChange(s.id, e.target.value as Estado)}
                  className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {(Object.keys(ESTADO_LABELS) as Estado[]).map((e) => (
                    <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
