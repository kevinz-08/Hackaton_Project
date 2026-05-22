'use client';
import '@google/model-viewer';
import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModeloGenerado } from '@/presentation/hooks/use-modelo-generado';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Step = 'upload' | 'processing' | 'result';
type ModelId = 'hitem3dv2.0' | 'hitem3dv2.1' | 'hitem3dv1.5';
type ResOption = { value: string; label: string };

const RES_BY_MODEL: Record<ModelId, ResOption[]> = {
  'hitem3dv1.5': [
    { value: '512',      label: '512 — rápido'          },
    { value: '1024',     label: '1024 — estándar'        },
    { value: '1536',     label: '1536'                   },
    { value: '1536pro',  label: '1536pro — alta calidad' },
  ],
  'hitem3dv2.0': [
    { value: '1536',     label: '1536 — estándar'        },
    { value: '1536pro',  label: '1536pro — alta calidad' },
  ],
  'hitem3dv2.1': [
    { value: '1536fast', label: '1536fast — rápido'      },
    { value: '1536pro',  label: '1536pro — alta calidad' },
  ],
};

export default function ImgA3DPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollRef      = useRef<ReturnType<typeof setInterval> | null>(null);

  const [step,       setStep]       = useState<Step>('upload');
  const [file,       setFile]       = useState<File | null>(null);
  const [preview,    setPreview]    = useState<string | null>(null);
  const [model,      setModel]      = useState<ModelId>('hitem3dv2.0');
  const [resolution, setResolution] = useState('1536');
  const [progress,   setProgress]   = useState(8);
  const [statusMsg,  setStatusMsg]  = useState('');
  const [taskId,     setTaskId]     = useState('');
  const [glbUrl,     setGlbUrl]     = useState('');
  const [imgS3Url,   setImgS3Url]   = useState('');
  const [error,      setError]      = useState('');

  const { guardarInicio, guardarResultado, marcarFallido } = useModeloGenerado();

  // ── Archivo ────────────────────────────────────────────────────────────────
  const handleFile = useCallback((f: File) => {
    if (f.size > 20 * 1024 * 1024) { setError('La imagen supera los 20 MB.'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const onModelChange = (m: ModelId) => {
    setModel(m);
    setResolution(RES_BY_MODEL[m][0].value);
  };

  // ── Progreso ───────────────────────────────────────────────────────────────
  const setProc = (p: number, msg: string) => {
    setProgress(p);
    setStatusMsg(msg);
  };

  // ── Generar ────────────────────────────────────────────────────────────────
  const generate = async () => {
    if (!file) return;
    setError('');
    setStep('processing');
    setProc(8, 'Subiendo imagen a S3...');

    try {
      const fd = new FormData();
      fd.append('images',       file, file.name);
      fd.append('request_type', '3');
      fd.append('model',        model);
      fd.append('resolution',   resolution);
      fd.append('format',       '2');

      setProc(20, 'Enviando a Hitem3D...');

      const submitRes  = await fetch('/api/hitem3d?action=submit', { method: 'POST', body: fd });
      const submitData = await submitRes.json();

      if (submitData.code !== 200 || !submitData.data?.task_id) {
        throw new Error(submitData.msg ?? submitData.error ?? JSON.stringify(submitData));
      }

      const tid         = submitData.data.task_id;
      const s3ImagenUrl = submitData.imgS3Url as string;

      setTaskId(tid);
      setImgS3Url(s3ImagenUrl);

      // Guardar en BD: estado PROCESANDO + URL imagen S3
      await guardarInicio(tid, s3ImagenUrl, file.name);

      setProc(30, 'En cola de procesamiento...');
      startPolling(tid);

    } catch (e: unknown) {
      setError('Error: ' + (e instanceof Error ? e.message : String(e)));
      setStep('upload');
    }
  };

  // ── Polling ────────────────────────────────────────────────────────────────
  const startPolling = (tid: string) => {
    const stateMsg: Record<string, string> = {
      created:    'Tarea creada, esperando...',
      queueing:   'En cola...',
      processing: 'Generando geometría y textura...',
    };
    const stateProgress: Record<string, number> = {
      created: 35, queueing: 48, processing: 74,
    };

    pollRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`/api/hitem3d?action=query&task_id=${tid}`, { method: 'POST' });
        const data = await res.json();

        if (data.code !== 200) {
          clearInterval(pollRef.current!);
          setError('Error al consultar: ' + (data.msg ?? ''));
          return;
        }

        const state: string = data.data?.state;
        if (stateMsg[state]) {
          setProc(Math.max(stateProgress[state] ?? 30, progress), stateMsg[state]);
        }

        if (state === 'success') {
          clearInterval(pollRef.current!);
          // data.data.url ya es la URL de S3 (el proxy la reemplazó)
          const glbS3 = data.data.url as string;

          // Guardar en BD: estado COMPLETADO + URL .glb S3
          await guardarResultado(tid, glbS3);

          setProc(100, '¡Completado!');
          setTimeout(() => { setGlbUrl(glbS3); setStep('result'); }, 500);

        } else if (state === 'failed') {
          clearInterval(pollRef.current!);
          await marcarFallido(tid);
          setError('Generación fallida. Intenta con otra imagen con mejor iluminación.');
          setStep('upload');
        }
      } catch (e) {
        console.warn('Poll error:', e);
      }
    }, 5000);
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const reset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setStep('upload'); setFile(null); setPreview(null);
    setProgress(8); setStatusMsg(''); setTaskId('');
    setGlbUrl(''); setImgS3Url(''); setError('');
    setModel('hitem3dv2.0'); setResolution('1536');
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#06020E] px-4 py-10 flex flex-col items-center">

      {/* Header */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-8 h-8 rounded-lg bg-[#6C3FCF] flex items-center justify-center shadow-lg shadow-[#6C3FCF]/40 shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
          <h1 className="text-white font-bold text-xl tracking-tight">Imagen a Modelo 3D</h1>
        </div>
        <p className="text-white/40 text-sm ml-11">
          Sube una foto del objeto — la imagen y el <code className="text-[#6C3FCF]">.glb</code> se guardan en S3.
        </p>
      </div>

      {/* Step nav */}
      <StepNav current={step} />

      <div className="w-full max-w-lg mt-6">
        <AnimatePresence mode="wait">

          {/* ── PASO 1: Upload ── */}
          {step === 'upload' && (
            <motion.div key="upload" {...fade}>
              <div
                className={`relative rounded-2xl border-2 border-dashed transition-colors cursor-pointer flex items-center justify-center min-h-[200px] overflow-hidden
                  ${preview ? 'border-[#6C3FCF]/60 bg-[#6C3FCF]/5' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={onDrop}
              >
                {preview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Vista previa" className="max-h-[280px] w-full object-contain rounded-xl" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <span className="text-white text-sm font-medium">Cambiar imagen</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 px-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center mx-auto mb-3">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="text-white/50 text-sm">Toca o arrastra una imagen aquí</p>
                    <p className="text-white/20 text-xs mt-1">PNG · JPG · WEBP · máx 20 MB</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onFileInput} />

              {file && (
                <div className="mt-3 flex items-center gap-3 px-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview!} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm truncate">{file.name}</p>
                    <p className="text-white/30 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <span className="text-xs bg-[#6C3FCF]/20 text-[#9B7AE8] px-2.5 py-1 rounded-full border border-[#6C3FCF]/30">Lista ✓</span>
                </div>
              )}

              <div className="mt-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-white/30 mb-1.5 block">Modelo de IA</label>
                  <select value={model} onChange={e => onModelChange(e.target.value as ModelId)}
                    className="w-full bg-white/[0.05] border border-white/10 text-white/80 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#6C3FCF]/60">
                    <option value="hitem3dv2.1">v2.1 — más detalle</option>
                    <option value="hitem3dv2.0">v2.0 — equilibrado</option>
                    <option value="hitem3dv1.5">v1.5 — rápido</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-white/30 mb-1.5 block">Resolución</label>
                  <select value={resolution} onChange={e => setResolution(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 text-white/80 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#6C3FCF]/60">
                    {RES_BY_MODEL[model].map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="mt-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">{error}</div>
              )}

              <button disabled={!file} onClick={generate}
                className="mt-4 w-full bg-[#6C3FCF] hover:bg-[#7B50DE] disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-full transition-colors shadow-lg shadow-[#6C3FCF]/30 flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5" strokeLinejoin="round"/>
                  <path d="M2 12l10 5 10-5" strokeLinejoin="round"/>
                </svg>
                Generar modelo 3D
              </button>
            </motion.div>
          )}

          {/* ── PASO 2: Procesando ── */}
          {step === 'processing' && (
            <motion.div key="processing" {...fade}>
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#6C3FCF]/15 border border-[#6C3FCF]/20 flex items-center justify-center mx-auto mb-5">
                  <motion.svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9B7AE8" strokeWidth="1.5"
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}>
                    <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinejoin="round"/>
                    <path d="M2 17l10 5 10-5" strokeLinejoin="round"/>
                    <path d="M2 12l10 5 10-5" strokeLinejoin="round"/>
                  </motion.svg>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-3">
                  <motion.div className="h-full rounded-full bg-[#6C3FCF]"
                    animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                </div>
                <p className="text-white/60 text-sm">{statusMsg}</p>
                {taskId && <p className="text-white/20 text-xs mt-2 break-all">Task: {taskId}</p>}
                {imgS3Url && (
                  <p className="text-[#6C3FCF]/60 text-xs mt-1 break-all">
                    Imagen guardada en S3
                  </p>
                )}
              </div>
              {error && (
                <div className="mt-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">{error}</div>
              )}
            </motion.div>
          )}

          {/* ── PASO 3: Resultado ── */}
          {step === 'result' && (
            <motion.div key="result" {...fade}>
              <div className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] mb-4">
                {/* @ts-expect-error model-viewer is a custom element */}
                <model-viewer src={glbUrl} alt="Modelo 3D generado" auto-rotate camera-controls
                  shadow-intensity="1" style={{ width: '100%', height: '420px', background: 'transparent' }} loading="eager" />
              </div>

              {/* Badge S3 */}
              <div className="flex items-center gap-2 mb-4 px-1">
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  Imagen guardada en S3
                </span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  .glb guardado en S3
                </span>
              </div>

              <a href={glbUrl} download="modelo.glb"
                className="flex items-center justify-center gap-2 w-full bg-[#1a3a1a] hover:bg-[#1f4a1f] text-emerald-400 border border-emerald-500/20 font-semibold text-sm py-3.5 rounded-full transition-colors mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round"/>
                </svg>
                Descargar .glb desde S3
              </a>

              <button onClick={reset}
                className="flex items-center justify-center gap-2 w-full bg-white/[0.04] hover:bg-white/[0.07] text-white/50 hover:text-white/80 border border-white/[0.06] text-sm py-3 rounded-full transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Generar otro modelo
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}

// ─── StepNav ──────────────────────────────────────────────────────────────────
const STEPS: { key: Step; label: string }[] = [
  { key: 'upload',     label: 'Imagen'     },
  { key: 'processing', label: 'Procesando' },
  { key: 'result',     label: 'Resultado'  },
];

function StepNav({ current }: { current: Step }) {
  const idx = STEPS.findIndex(s => s.key === current);
  return (
    <div className="flex items-center gap-2 w-full max-w-lg">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2 flex-1 last:flex-none">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all
            ${i < idx  ? 'bg-[#6C3FCF] border-[#6C3FCF] text-white'         : ''}
            ${i === idx ? 'bg-[#6C3FCF]/20 border-[#6C3FCF] text-[#9B7AE8]' : ''}
            ${i > idx  ? 'bg-transparent border-white/10 text-white/20'      : ''}`}>
            {i < idx ? '✓' : i + 1}
          </div>
          <span className={`text-xs transition-colors ${i === idx ? 'text-white/70' : 'text-white/20'}`}>{s.label}</span>
          {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < idx ? 'bg-[#6C3FCF]/50' : 'bg-white/[0.06]'}`} />}
        </div>
      ))}
    </div>
  );
}

const fade = {
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0  },
  exit:       { opacity: 0, y: -8 },
  transition: { duration: 0.2     },
};
