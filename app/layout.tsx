import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coy — Privacy-First Crush Matching',
  description: 'Double-blind, privacy-first crush matching. You only find out when it is mutual.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0b0d14] text-gray-100 antialiased flex justify-center">
        {/* Mobile-first centered container with desktop luxury frame */}
        <div className="w-full max-w-md min-h-screen flex flex-col bg-[#121624] shadow-2xl relative border-x border-slate-800/60">
          {children}
        </div>
      </body>
    </html>
  );
}
