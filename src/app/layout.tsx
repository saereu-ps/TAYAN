import type { Metadata } from 'next';
import { Noto_Serif_JP } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const notoSerif = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Paper Plane',
  description: 'Send anonymous questions as paper planes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={notoSerif.variable}>
      <body className="min-h-screen font-serif antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
