'use client';
import { motion } from 'framer-motion';
import { REVIEWS_BY_CODIGO, Review } from '@/lib/reviews-data';
import { StarRating } from './StarRating';

const TIPO_COLORS: Record<Review['tipo'], string> = {
  'Institución': '#6C3FCF',
  'Docente':     '#0891B2',
  'Cuidador':    '#059669',
  'Beneficiario':'#D97706',
};

const TIPO_BG: Record<Review['tipo'], string> = {
  'Institución': 'rgba(108,63,207,0.12)',
  'Docente':     'rgba(8,145,178,0.12)',
  'Cuidador':    'rgba(5,150,105,0.12)',
  'Beneficiario':'rgba(217,119,6,0.12)',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const color = TIPO_COLORS[review.tipo];
  const bg    = TIPO_BG[review.tipo];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3 p-4 rounded-2xl border border-white/[0.07] bg-[#0F0720]"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0"
          style={{ backgroundColor: bg, color }}
        >
          {getInitials(review.autor)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white/85 leading-tight truncate">{review.autor}</p>
          <span
            className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide"
            style={{ backgroundColor: bg, color }}
          >
            {review.tipo}
          </span>
        </div>
        <StarRating rating={review.calificacion} />
      </div>

      {/* Comment */}
      <p className="text-[13px] text-white/50 leading-relaxed">
        &ldquo;{review.comentario}&rdquo;
      </p>
    </motion.div>
  );
}

export function ReviewsSection({ codigoReal }: { codigoReal: string }) {
  const reviews = REVIEWS_BY_CODIGO[codigoReal] ?? [];

  if (reviews.length === 0) return null;

  const promedio = reviews.reduce((sum, r) => sum + r.calificacion, 0) / reviews.length;

  return (
    <section className="mt-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h3 className="text-[15px] font-bold text-white/90">Reseñas del producto</h3>
          <span className="text-[12px] text-white/30">{reviews.length} evaluación{reviews.length !== 1 ? 'es' : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[22px] font-bold text-[#C4A8FF]">{promedio.toFixed(1)}</span>
          <div className="flex flex-col gap-0.5">
            <StarRating rating={promedio} />
            <span className="text-[10px] text-white/25">promedio general</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mb-5" />

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {reviews.map((review, i) => (
          <ReviewCard key={review.id} review={review} index={i} />
        ))}
      </div>
    </section>
  );
}
