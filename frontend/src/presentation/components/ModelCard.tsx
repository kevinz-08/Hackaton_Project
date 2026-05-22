'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Modelo, CATEGORIA_LABELS } from '@/types';
import { ModelViewer } from './ModelViewer';
import { StarRating } from './StarRating';
import { useCart } from '@/presentation/context/CartContext';

const CATEGORY_ICONS: Record<string, string> = {
  ACCESIBILIDAD_VISUAL: '👁️',
  ACCESIBILIDAD_MOTRIZ: '🦾',
  MATERIAL_DIDACTICO: '📚',
  COMUNICACION_AUMENTATIVA: '💬',
  FIGURAS_DIDACTICAS: '🔶',
  ACCESORIOS_ACCESIBILIDAD: '♿',
};

export function ModelCard({ modelo, index = 0 }: { modelo: Modelo; index?: number }) {
  const [visorAbierto, setVisorAbierto] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  // useCart() reads from CartContext — CartProvider lives in layout.tsx
  const { add } = useCart();

  function handleAdd() {
    add(modelo);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -5 }}
        className="group bg-[#0F0720] rounded-2xl border border-white/[0.07] overflow-hidden flex flex-col hover:border-[#6C3FCF]/40 hover:shadow-2xl hover:shadow-[#6C3FCF]/15 transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="relative h-48 bg-[#1A0F35] overflow-hidden">
          {imgError ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-60">{CATEGORY_ICONS[modelo.categoria] ?? '🧩'}</span>
            </div>
          ) : (
            <Image
              src={modelo.imagen}
              alt={modelo.nombre}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          )}

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0720]/60 to-transparent pointer-events-none" />

          {/* 3D badge */}
          <button
            onClick={() => setVisorAbierto(true)}
            className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 hover:bg-[#6C3FCF]/80 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full backdrop-blur-md border border-white/10 hover:border-[#6C3FCF] transition-all"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L11 3.5V8.5L6 11L1 8.5V3.5L6 1Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            3D
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1 gap-2.5">
          <span className="inline-flex text-[10px] font-bold text-[#C4A8FF] bg-[#6C3FCF]/12 border border-[#6C3FCF]/20 px-2.5 py-0.5 rounded-full w-fit tracking-widest uppercase">
            {CATEGORIA_LABELS[modelo.categoria]}
          </span>

          <h3 className="font-bold text-white/90 leading-snug text-[15px]">{modelo.nombre}</h3>
          <p className="text-[13px] text-white/35 line-clamp-2 flex-1 leading-relaxed">{modelo.descripcion}</p>

          <div className="flex items-center justify-between">
            <p className="text-[15px] font-bold text-[#C4A8FF]">
              ${modelo.costoBase.toLocaleString('es-CO')} <span className="text-[11px] font-normal text-white/30">COP</span>
            </p>
            <StarRating rating={modelo.calificacion} />
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-1">
            {/* Seleccionar → pushes to CartContext (count visible in Navbar) */}
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.93 }}
              className="flex-1 relative text-sm font-bold py-2.5 rounded-xl overflow-hidden text-white transition-all duration-300"
              style={{ background: added ? '#16a34a' : '#6C3FCF' }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="ok"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center justify-center gap-1.5"
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Agregado
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    Seleccionar
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.div whileTap={{ scale: 0.93 }}>
              <Link
                href={`/solicitud?modeloId=${modelo.id}`}
                className="flex items-center justify-center h-full px-3 py-2.5 rounded-xl border border-white/[0.08] hover:border-[#9B6DFF]/60 hover:bg-[#6C3FCF]/10 text-white/30 hover:text-[#9B6DFF] transition-all"
                title="Solicitar directamente"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.article>

      {/* 3D Viewer Modal */}
      <AnimatePresence>
        {visorAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setVisorAbierto(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#0F0720] border border-white/[0.08] rounded-2xl w-full max-w-lg h-[500px] flex flex-col overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div>
                  <h4 className="font-bold text-white/90 leading-tight">{modelo.nombre}</h4>
                  <span className="text-[11px] text-[#9B6DFF] font-semibold tracking-wide uppercase">{CATEGORIA_LABELS[modelo.categoria]}</span>
                </div>
                <button
                  onClick={() => setVisorAbierto(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/50 hover:text-white transition-all text-sm leading-none"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1">
                <ModelViewer src={modelo.archivoGlb} alt={modelo.nombre} className="rounded-b-2xl" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
