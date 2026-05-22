import Link from 'next/link';

export default function ExitoPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#6C3FCF]/15 border border-[#6C3FCF]/30 flex items-center justify-center text-4xl">
        ✅
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">¡Solicitud enviada!</h1>
      <p className="text-white/50 mb-8">
        Hemos recibido tu solicitud. El equipo de ANDES se pondrá en contacto contigo pronto.
      </p>
      <Link
        href="/"
        className="inline-block bg-[#6C3FCF] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#7B50DE] transition-colors shadow-lg shadow-[#6C3FCF]/25"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
