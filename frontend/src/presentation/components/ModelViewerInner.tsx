'use client';
import { useEffect } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export function ModelViewerInner({ src, alt, className = '' }: Props) {
  useEffect(() => {
    import('@google/model-viewer');
  }, []);

  return (
    // @ts-expect-error model-viewer is a custom element
    <model-viewer
      src={src}
      alt={alt}
      auto-rotate
      camera-controls
      shadow-intensity="1"
      class={`w-full h-full ${className}`}
    />
  );
}
