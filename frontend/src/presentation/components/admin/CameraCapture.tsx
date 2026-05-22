'use client';
import { useRef, useState, useEffect, useCallback } from 'react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

type CameraState = 'opening' | 'streaming' | 'captured' | 'error';

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<CameraState>('opening');
  const [errorMsg, setErrorMsg] = useState('');
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setState('streaming');
      } catch (err: unknown) {
        setState('error');
        if (err instanceof DOMException) {
          if (err.name === 'NotAllowedError') {
            setErrorMsg('Permite el acceso a la cámara en la configuración de tu navegador.');
          } else if (err.name === 'NotFoundError') {
            setErrorMsg('No se detectó ninguna cámara en este dispositivo.');
          } else if (err.name === 'NotReadableError') {
            setErrorMsg('La cámara está siendo usada por otra aplicación.');
          } else {
            setErrorMsg(err.message);
          }
        } else {
          setErrorMsg('Error al abrir la cámara.');
        }
      }
    }
    start();
    return () => stopCamera();
  }, [stopCamera]);

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const url = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedUrl(url);
    setState('captured');
  }

  function usePhoto() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], 'captura.jpg', { type: 'image/jpeg' });
        stopCamera();
        onCapture(file);
      },
      'image/jpeg',
      0.92,
    );
  }

  function retake() {
    setCapturedUrl(null);
    setState('streaming');
  }

  const handleCancel = () => {
    stopCamera();
    onClose();
  };

  return (
    <div>
      {/* Error state */}
      {state === 'error' && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-red-400 text-sm mb-3">{errorMsg}</p>
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg text-sm bg-white/10 text-white/70 hover:bg-white/15 transition-colors"
          >
            Volver
          </button>
        </div>
      )}

      {/* Opening state */}
      {state === 'opening' && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="text-white/30">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-white/50 text-sm animate-pulse">Abriendo cámara…</p>
        </div>
      )}

      {/* Streaming state */}
      {state === 'streaming' && (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-h-[300px] object-cover"
          />
          <div className="flex gap-2 p-3 bg-black/60">
            <button
              onClick={capture}
              className="flex-1 bg-[#6C3FCF] hover:bg-[#7B50DE] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Capturar foto
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Captured state */}
      {state === 'captured' && capturedUrl && (
        <div className="rounded-2xl overflow-hidden border border-[#6C3FCF]/40 bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={capturedUrl} alt="Foto capturada" className="w-full max-h-[300px] object-contain bg-black" />
          <div className="flex gap-2 p-3 bg-black/60">
            <button
              onClick={usePhoto}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Usar esta foto
            </button>
            <button
              onClick={retake}
              className="flex-1 bg-white/10 hover:bg-white/15 text-white/70 text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Repetir
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
