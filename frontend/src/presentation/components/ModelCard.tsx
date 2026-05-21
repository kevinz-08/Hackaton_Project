'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Modelo, CATEGORIA_LABELS } from '@/types';
import { ModelViewer } from './ModelViewer';

export function ModelCard({ modelo }: { modelo: Modelo }) {
  const [visorAbierto, setVisorAbierto] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="relative h-48 bg-gray-50">
          <Image
            src={modelo.imagen}
            alt={modelo.nombre}
            fill
            className="object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/imagenes/placeholder.jpg'; }}
          />
        </div>

        <div className="p-4 flex flex-col flex-1 gap-2">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit">
            {CATEGORIA_LABELS[modelo.categoria]}
          </span>
          <h3 className="font-semibold text-gray-900 leading-tight">{modelo.nombre}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 flex-1">{modelo.descripcion}</p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setVisorAbierto(true)}
              className="flex-1 text-sm bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition-colors"
            >
              Ver en 3D
            </button>
            <Link
              href={`/solicitud?modeloId=${modelo.id}`}
              className="flex-1 text-sm border border-indigo-600 text-indigo-600 rounded-lg py-2 text-center hover:bg-indigo-50 transition-colors"
            >
              Solicitar
            </Link>
          </div>
        </div>
      </div>

      {visorAbierto && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setVisorAbierto(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg h-[480px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h4 className="font-semibold text-gray-900">{modelo.nombre}</h4>
              <button onClick={() => setVisorAbierto(false)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>
            <div className="flex-1">
              <ModelViewer src={modelo.archivoGlb} alt={modelo.nombre} className="rounded-b-2xl" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
