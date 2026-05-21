import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-indigo-700 tracking-tight">
        ANDES 3D
      </Link>
      <div className="flex gap-6 text-sm font-medium text-gray-600">
        <Link href="/" className="hover:text-indigo-700 transition-colors">Catálogo</Link>
        <Link href="/admin" className="hover:text-indigo-700 transition-colors">Administrador</Link>
      </div>
    </nav>
  );
}
