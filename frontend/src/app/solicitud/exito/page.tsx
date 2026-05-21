import Link from 'next/link';

export default function ExitoPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud enviada!</h1>
      <p className="text-gray-500 mb-8">
        Hemos recibido tu solicitud. El equipo de ANDES se pondrá en contacto contigo pronto.
      </p>
      <Link
        href="/"
        className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
