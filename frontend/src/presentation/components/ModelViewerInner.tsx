'use client';
import { useEffect, useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export function ModelViewerInner({ src, alt, className = '' }: Props) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    import('@google/model-viewer')
      .then(() => setLoaded(true))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 gap-2">
        <span className="text-5xl">🧩</span>
        <p className="text-sm text-gray-400">No se pudo cargar el visor 3D</p>
      </div>
    );
  }

  if (!loaded) {
    return <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />;
  }

  return (
    // @ts-expect-error model-viewer is a custom element
    <model-viewer
      src={src}
      alt={alt}
      auto-rotate
      camera-controls
      shadow-intensity="1"
      style={{ width: '100%', height: '100%' }}
      class={className}
      onError={() => setError(true)}
    />
  );
}
