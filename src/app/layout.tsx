import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { CandidateProvider } from '@/context/CandidateContext';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'Oportunidades de Empleo | Portal de Postulaciones',
  description: 'Explora nuestras posiciones disponibles y postúlate compartiendo tu repositorio de GitHub.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CandidateProvider>
          {children}
        </CandidateProvider>
      </body>
    </html>
  );
}