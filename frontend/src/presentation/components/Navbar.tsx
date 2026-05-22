'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/presentation/context/CartContext';

export function Navbar() {
  const { count, items } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[#06020E]/85 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-7 h-7 rounded-lg bg-[#6C3FCF] flex items-center justify-center shadow-lg shadow-[#6C3FCF]/40">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-lg font-bold text-white tracking-tight">ANDES 3D</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex gap-6 text-sm font-medium text-white/40">
          <Link href="/" className="hover:text-white transition-colors">Catálogo</Link>
          <Link href="/solicitud" className="hover:text-white transition-colors">Solicitar</Link>
          <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          <Link href="/admin/Img_a_3d" className="hover:text-white transition-colors">Imagen a 3D</Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Cart — count comes from CartContext */}
          <button
            onClick={() => setCartOpen(v => !v)}
            className="relative flex items-center gap-1.5 bg-white/[0.07] hover:bg-white/[0.12] text-white/70 hover:text-white text-sm font-semibold px-3.5 py-2 rounded-full border border-white/[0.08] transition-all"
            aria-label="Ver solicitudes seleccionadas"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h1.5l1.8 7.2a1 1 0 0 0 .97.8H12a1 1 0 0 0 .97-.76L14 5H4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6.5" cy="13" r="1" fill="currentColor" />
              <circle cx="11.5" cy="13" r="1" fill="currentColor" />
            </svg>
            <span className="hidden sm:inline">Solicitudes</span>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#6C3FCF] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md shadow-[#6C3FCF]/50"
              >
                {count}
              </motion.span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="sm:hidden p-2 rounded-lg hover:bg-white/[0.07] text-white/60 hover:text-white transition-colors"
            aria-label="Menú"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="sm:hidden fixed top-[57px] inset-x-0 z-30 bg-[#0F0720] border-b border-white/[0.06] px-4 py-5 flex flex-col gap-4 shadow-2xl"
          >
            {[
              { href: '/', label: 'pruebas' },
              { href: '/solicitud', label: 'Solicitar' },
              { href: '/admin', label: 'Admin' },
              { href: '/admin/Img_a_3d', label: 'Imagen a 3D' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-white/60 hover:text-white py-0.5 transition-colors"
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-[#0F0720] border-l border-white/[0.06] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <h2 className="font-bold text-white text-sm">Solicitudes seleccionadas</h2>
                <button onClick={() => setCartOpen(false)} className="text-white/30 hover:text-white text-xl leading-none transition-colors">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <p className="text-sm text-white/25 text-center mt-14">Ningún modelo seleccionado aún.</p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {items.map(({ modelo, quantity }) => (
                      <li key={modelo.id} className="flex gap-3 items-start">
                        <div className="w-10 h-10 rounded-xl bg-[#6C3FCF]/15 flex items-center justify-center shrink-0 text-lg">🧩</div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="text-sm font-medium text-white/90 truncate leading-tight">{modelo.nombre}</p>
                          <p className="text-white/30 text-xs mt-0.5">×{quantity}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <div className="px-5 py-4 border-t border-white/[0.06]">
                  <Link
                    href="/solicitud"
                    onClick={() => setCartOpen(false)}
                    className="block w-full bg-[#6C3FCF] hover:bg-[#7B50DE] text-white font-bold text-sm text-center py-3.5 rounded-full transition-colors shadow-lg shadow-[#6C3FCF]/30"
                  >
                    Ir a solicitar →
                  </Link>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
