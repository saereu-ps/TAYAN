import type { Metadata } from 'next';
import { Noto_Serif_JP, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const notoSerif = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Paper Plane',
  description: 'Send anonymous questions as paper planes — Modern ZEN x Bangkok Mood',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSerif.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
