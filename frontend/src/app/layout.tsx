import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/presentation/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ANDES — Catálogo 3D',
  description: 'Recursos didácticos y de accesibilidad impresos en 3D',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
