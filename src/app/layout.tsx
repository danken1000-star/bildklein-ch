import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'bildklein.ch - Swiss Image Compression',
  description: 'Compress your images quickly and easily. Made in Switzerland.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}