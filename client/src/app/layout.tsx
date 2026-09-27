import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Golang Blog',
  description: 'A simple blog powered by Golang and Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <nav className="bg-white shadow-sm py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              GoBlog
            </Link>
            <div className="space-x-4">
              <Link href="/" className="hover:text-blue-500">Home</Link>
              <Link href="/login" className="hover:text-blue-500">Login</Link>
              <Link href="/admin" className="hover:text-blue-500 text-red-500 font-semibold">Admin</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
