import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All India Villages API Platform',
  description: 'A Next.js dashboard for village data with Prisma, PostgreSQL, and Vercel API routes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
