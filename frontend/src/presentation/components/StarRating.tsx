export function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) return null;

  const stars = Array.from({ length: 5 }, (_, i) => {
    const fill = Math.min(1, Math.max(0, rating - i));
    if (fill >= 0.75) return 'full';
    if (fill >= 0.25) return 'half';
    return 'empty';
  });

  return (
    <div className="flex items-center gap-0.5" title={`${rating.toFixed(1)} / 5`}>
      {stars.map((type, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
          {type === 'full' && (
            <polygon
              points="6,1 7.5,4.5 11,4.8 8.5,7.2 9.3,11 6,9.2 2.7,11 3.5,7.2 1,4.8 4.5,4.5"
              fill="#FBBF24"
            />
          )}
          {type === 'half' && (
            <>
              <defs>
                <linearGradient id={`half-${i}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="50%" stopColor="#ffffff20" />
                </linearGradient>
              </defs>
              <polygon
                points="6,1 7.5,4.5 11,4.8 8.5,7.2 9.3,11 6,9.2 2.7,11 3.5,7.2 1,4.8 4.5,4.5"
                fill={`url(#half-${i})`}
              />
            </>
          )}
          {type === 'empty' && (
            <polygon
              points="6,1 7.5,4.5 11,4.8 8.5,7.2 9.3,11 6,9.2 2.7,11 3.5,7.2 1,4.8 4.5,4.5"
              fill="#ffffff20"
            />
          )}
        </svg>
      ))}
      <span className="text-[10px] text-white/30 ml-0.5">{rating.toFixed(1)}</span>
    </div>
  );
}
