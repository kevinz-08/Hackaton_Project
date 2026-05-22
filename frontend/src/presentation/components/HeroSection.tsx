'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CATEGORIES = [
  { icon: '👁️', label: 'Accesibilidad Visual' },
  { icon: '🦾', label: 'Accesibilidad Motriz' },
  { icon: '📚', label: 'Material Didáctico' },
  { icon: '💬', label: 'Comunicación Aumentativa' },
  { icon: '🔶', label: 'Figuras Didácticas' },
  { icon: '♿', label: 'Accesorios de Accesibilidad' },
];

const STATS = [
  { value: '25+', label: 'Modelos' },
  { value: '6', label: 'Categorías' },
  { value: '100%', label: 'Sin costo' },
  { value: '🇨🇴', label: 'Hecho en Colombia' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#06020E] text-white">

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(108,63,207,0.35) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.28, 0.48, 0.28] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-60 -left-40 w-[800px] h-[800px] rounded-full bg-[#6C3FCF]/30 blur-[150px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.22, 1], opacity: [0.12, 0.25, 0.12] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute -bottom-40 -right-20 w-[700px] h-[700px] rounded-full bg-[#9B6DFF]/25 blur-[150px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#3B10AF]/40 blur-[120px] pointer-events-none"
      />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 pt-28 pb-10 flex flex-col gap-10">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2.5 bg-[#6C3FCF]/12 border border-[#6C3FCF]/30 text-[#C4A8FF] text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-2 rounded-full">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#9B6DFF]"
            />
            ANDES — Impresión 3D con propósito
          </span>
        </motion.div>

        {/* Headline — fluid type, fills the viewport width */}
        <div className="flex flex-col -mt-2">
          <motion.h1
            initial={{ opacity: 0, y: 50, skewY: 2 }}
            animate={{ opacity: 1, y: 0, skewY: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="font-extrabold tracking-tight leading-[0.93] text-white"
            style={{ fontSize: 'clamp(52px, 9.5vw, 128px)' }}
          >
            Impacto real,
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 50, skewY: 2 }}
            animate={{ opacity: 1, y: 0, skewY: 0 }}
            transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="font-extrabold tracking-tight leading-[0.93] bg-gradient-to-r from-[#C4A8FF] via-[#9B6DFF] to-[#6C3FCF] bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(52px, 9.5vw, 128px)' }}
          >
            impreso en 3D.
          </motion.h1>
        </div>

        {/* Subtitle + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10"
        >
          <p className="text-white/45 text-base sm:text-lg max-w-xs leading-relaxed">
            Materiales didácticos y de accesibilidad fabricados en impresión 3D para instituciones de toda Colombia.
          </p>

          <div className="flex flex-wrap gap-3 shrink-0">
            <motion.a
              href="#catalogo"
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(108,63,207,0.6)' }}
              whileTap={{ scale: 0.96 }}
              className="bg-[#6C3FCF] text-white font-bold px-8 py-4 rounded-full text-sm shadow-xl shadow-[#6C3FCF]/40 transition-colors hover:bg-[#7B50DE]"
            >
              Explorar catálogo
            </motion.a>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/solicitud"
                className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] text-white font-bold px-8 py-4 rounded-full border border-white/[0.12] text-sm transition-colors"
              >
                Hacer solicitud
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.62 }}
          className="flex flex-wrap items-center gap-x-10 gap-y-5 pt-8 border-t border-white/[0.07]"
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-3xl font-extrabold text-white leading-none">{value}</span>
              <span className="text-white/35 text-xs font-semibold tracking-wide uppercase">{label}</span>
            </div>
          ))}

          {/* Scroll hint */}
          <div className="ml-auto hidden sm:flex flex-col items-center gap-1.5 text-white/20">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3v12M4 10l5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span className="text-[10px] tracking-widest uppercase">scroll</span>
          </div>
        </motion.div>
      </div>

      {/* Infinite category marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative mt-2 overflow-hidden"
      >
        {/* Edge fade */}
        <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#06020E] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#06020E] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-3 animate-marquee w-max py-5 px-4">
          {[...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map((cat, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] rounded-full px-5 py-2.5 whitespace-nowrap transition-colors cursor-default"
            >
              <span className="text-base leading-none">{cat.icon}</span>
              <span className="text-sm font-medium text-white/55">{cat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
