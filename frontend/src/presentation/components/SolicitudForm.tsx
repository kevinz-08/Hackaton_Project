'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Categoria, CreateSolicitudPayload, CATEGORIA_LABELS, Modelo } from '@/types';
import { ApiSolicitudRepository } from '@/infrastructure/repositories/api-solicitud.repository';
import { CreateSolicitudUseCase } from '@/application/use-cases/create-solicitud.use-case';
import { useCart } from '@/presentation/context/CartContext';

const CIUDADES = ['Barranquilla', 'Bogotá', 'Medellín', 'Cali', 'Bucaramanga', 'Cartagena', 'Santa Marta', 'Otra'];

const repo = new ApiSolicitudRepository();
const createSolicitud = new CreateSolicitudUseCase(repo);

interface Props {
  modelo: Modelo;
}

export function SolicitudForm({ modelo }: Props) {
  const router = useRouter();
  const { remove } = useCart();
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
      remove(modelo.id);
      router.push('/solicitud/exito');
    } catch (err: any) {
      setError(err.status === 409 ? 'Ya existe una solicitud con esa cédula.' : err.message ?? 'Error al enviar');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full rounded-xl px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50'
    + ' bg-[#0A0E1A] border border-white/10 text-[#F9FAFB] placeholder-[#4B5563] focus:border-[#7C3AED]';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#94A3B8' }}>Nombre completo</label>
          <input required className={inputClass} value={form.nombre} onChange={set('nombre')} placeholder="Ej. María García" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#94A3B8' }}>Cédula</label>
          <input required className={inputClass} value={form.cedula} onChange={set('cedula')} pattern="\d{6,10}" title="6 a 10 dígitos" placeholder="1234567890" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#94A3B8' }}>Ciudad</label>
          <select required className={inputClass} value={form.ciudad} onChange={set('ciudad')}>
            <option value="">Seleccionar ciudad</option>
            {CIUDADES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#94A3B8' }}>Teléfono</label>
          <input required className={inputClass} value={form.telefono} onChange={set('telefono')} pattern="\d{10}" title="10 dígitos" placeholder="3001234567" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#94A3B8' }}>Correo electrónico</label>
          <input required type="email" className={inputClass} value={form.correo} onChange={set('correo')} placeholder="correo@institución.edu.co" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#94A3B8' }}>Tipo de material</label>
          <select required className={inputClass} value={form.tipoMaterial} onChange={set('tipoMaterial')}>
            {(Object.keys(CATEGORIA_LABELS) as Categoria[]).map((k) => (
              <option key={k} value={k}>{CATEGORIA_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm rounded-xl px-3 py-2" style={{ backgroundColor: '#EF444420', color: '#EF4444' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#7C3AED', color: '#F9FAFB' }}
        onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#6D28D9'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#7C3AED'; }}
      >
        {loading ? 'Enviando...' : 'Enviar solicitud'}
      </button>
    </form>
  );
}
