'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Categoria, CreateSolicitudPayload, CATEGORIA_LABELS, Modelo } from '@/types';
import { ApiSolicitudRepository } from '@/infrastructure/repositories/api-solicitud.repository';
import { CreateSolicitudUseCase } from '@/application/use-cases/create-solicitud.use-case';

const CIUDADES = ['Barranquilla', 'Bogotá', 'Medellín', 'Cali', 'Bucaramanga', 'Cartagena', 'Santa Marta', 'Otra'];

const repo = new ApiSolicitudRepository();
const createSolicitud = new CreateSolicitudUseCase(repo);

interface Props {
  modelo: Modelo;
}

export function SolicitudForm({ modelo }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<CreateSolicitudPayload, 'modeloId'>>({
    nombre: '',
    cedula: '',
    ciudad: '',
    correo: '',
    telefono: '',
    tipoMaterial: modelo.categoria as Categoria,
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createSolicitud.execute({ ...form, modeloId: modelo.id });
      router.push('/solicitud/exito');
    } catch (err: any) {
      setError(err.status === 409 ? 'Ya existe una solicitud con esa cédula.' : err.message ?? 'Error al enviar');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <input required className={inputClass} value={form.nombre} onChange={set('nombre')} placeholder="Ej. María García" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
          <input required className={inputClass} value={form.cedula} onChange={set('cedula')} pattern="\d{6,10}" title="6 a 10 dígitos" placeholder="1234567890" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
          <select required className={inputClass} value={form.ciudad} onChange={set('ciudad')}>
            <option value="">Seleccionar ciudad</option>
            {CIUDADES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input required className={inputClass} value={form.telefono} onChange={set('telefono')} pattern="\d{10}" title="10 dígitos" placeholder="3001234567" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
          <input required type="email" className={inputClass} value={form.correo} onChange={set('correo')} placeholder="correo@institución.edu.co" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de material</label>
          <select required className={inputClass} value={form.tipoMaterial} onChange={set('tipoMaterial')}>
            {(Object.keys(CATEGORIA_LABELS) as Categoria[]).map((k) => (
              <option key={k} value={k}>{CATEGORIA_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Enviando...' : 'Enviar solicitud'}
      </button>
    </form>
  );
}
