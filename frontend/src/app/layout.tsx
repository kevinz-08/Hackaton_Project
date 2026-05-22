import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { CartProvider } from '@/presentation/context/CartContext';
import { Navbar } from '@/presentation/components/Navbar';
import { Footer } from '@/presentation/components/Footer';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'ANDES 3D',
  description: 'Recursos didacticos y de accesibilidad impresos en 3D',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${jakarta.variable} font-sans bg-[#06020E] min-h-screen flex flex-col`}>
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
