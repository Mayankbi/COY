import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coy — Find out if your crush likes you back',
  description: 'Double-blind, privacy-first crush matching. Adding is confidential: you only find out when it is mutual.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#edeef2] text-gray-900 antialiased flex justify-center selection:bg-rose-500 selection:text-white">
        {/* Mobile-first centered viewport with realistic Coy phone frame on desktop */}
        <div className="w-full max-w-[440px] min-h-screen flex flex-col bg-white shadow-xl relative border-x border-gray-200">
          {children}
        </div>
      </body>
    </html>
  );
}
