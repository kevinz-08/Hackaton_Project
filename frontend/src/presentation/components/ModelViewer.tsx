'use client';
import dynamic from 'next/dynamic';
import { Component, ReactNode } from 'react';

const ModelViewerInner = dynamic(
  () => import('./ModelViewerInner').then((m) => m.ModelViewerInner),
  { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" /> },
);

interface Props {
  src: string;
  alt: string;
  className?: string;
}

class ErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  render() {
    if (this.state.crashed) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 gap-2">
          <span className="text-5xl">🧩</span>
          <p className="text-sm text-gray-400">Visor no disponible</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ModelViewer({ src, alt, className }: Props) {
  return (
    <ErrorBoundary>
      <ModelViewerInner src={src} alt={alt} className={className} />
    </ErrorBoundary>
  );
}
