'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pages: (number | 'ellipsis')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  const btnBase =
    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent';

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 pt-4">
      <p className="text-xs sm:text-sm" style={{ color: '#4B5563' }}>
        Mostrando <span style={{ color: '#94A3B8' }}>{start}–{end}</span> de{' '}
        <span style={{ color: '#94A3B8' }}>{totalItems}</span> resultados
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
          style={{ color: '#94A3B8' }}
        >
          ← Anterior
        </button>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e-${i}`} className="px-2 text-xs" style={{ color: '#4B5563' }}>…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={btnBase}
              style={{
                backgroundColor: p === currentPage ? '#7C3AED' : 'transparent',
                color: p === currentPage ? '#F9FAFB' : '#94A3B8',
              }}
              onMouseEnter={(e) => {
                if (p !== currentPage) {
                  e.currentTarget.style.backgroundColor = '#1A2235';
                }
              }}
              onMouseLeave={(e) => {
                if (p !== currentPage) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : ''}`}
          style={{ color: '#94A3B8' }}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
