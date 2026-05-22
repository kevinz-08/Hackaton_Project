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

  const inputClass = 'w-full bg-white/[0.06] border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9B6DFF] focus-visible:border-[#9B6DFF] transition-colors';
  const labelClass = 'block text-sm font-medium text-white/60 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre completo</label>
          <input required className={inputClass} value={form.nombre} onChange={set('nombre')} placeholder="Ej. María García" />
        </div>
        <div>
          <label className={labelClass}>Cédula</label>
          <input required className={inputClass} value={form.cedula} onChange={set('cedula')} pattern="\d{6,10}" title="6 a 10 dígitos" placeholder="1234567890" />
        </div>
        <div>
          <label className={labelClass}>Ciudad</label>
          <select required className={`${inputClass} bg-[#0F0720]`} value={form.ciudad} onChange={set('ciudad')}>
            <option value="" className="bg-[#0F0720]">Seleccionar ciudad</option>
            {CIUDADES.map((c) => <option key={c} value={c} className="bg-[#0F0720]">{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Teléfono</label>
          <input required className={inputClass} value={form.telefono} onChange={set('telefono')} pattern="\d{10}" title="10 dígitos" placeholder="3001234567" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Correo electrónico</label>
          <input required type="email" className={inputClass} value={form.correo} onChange={set('correo')} placeholder="correo@institución.edu.co" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Tipo de material</label>
          <select required className={`${inputClass} bg-[#0F0720]`} value={form.tipoMaterial} onChange={set('tipoMaterial')}>
            {(Object.keys(CATEGORIA_LABELS) as Categoria[]).map((k) => (
              <option key={k} value={k} className="bg-[#0F0720]">{CATEGORIA_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#6C3FCF] text-white py-2.5 rounded-lg font-medium hover:bg-[#7B50DE] disabled:opacity-60 transition-colors shadow-lg shadow-[#6C3FCF]/25"
      >
        {loading ? 'Enviando...' : 'Enviar solicitud'}
      </button>
    </form>
  );
}
