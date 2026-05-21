'use client';
import dynamic from 'next/dynamic';

const ModelViewerInner = dynamic(
  () => import('./ModelViewerInner').then((m) => m.ModelViewerInner),
  { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" /> },
);

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export function ModelViewer({ src, alt, className }: Props) {
  return <ModelViewerInner src={src} alt={alt} className={className} />;
}
