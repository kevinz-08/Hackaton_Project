'use client';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#06020E] text-white/40 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <span className="text-white font-bold text-xl tracking-tight">ANDES 3D</span>
          <p className="text-sm leading-relaxed">
            Impresión 3D con propósito social. Materiales educativos y de accesibilidad para Colombia.
          </p>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-2">
          <span className="text-white text-sm font-semibold mb-1">Navegación</span>
          <Link href="/" className="text-sm hover:text-white transition-colors">Catálogo</Link>
          <Link href="/solicitud" className="text-sm hover:text-white transition-colors">Hacer Solicitud</Link>
          <Link href="/admin" className="text-sm hover:text-white transition-colors">Administrador</Link>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-3">
          <span className="text-white text-sm font-semibold">Mantente informado</span>
          <p className="text-sm">Recibe novedades sobre nuevos modelos y recursos.</p>
          <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#9B6DFF] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#6C3FCF] hover:bg-[#7B50DE] text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap"
            >
              Suscribir
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/[0.05] py-4 text-center text-xs text-white/20 px-4">
        © {new Date().getFullYear()} ANDES. Hecho con propósito en Colombia.
      </div>
    </footer>
  );
}
