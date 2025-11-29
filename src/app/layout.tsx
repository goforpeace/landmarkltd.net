import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Landmark New Homes Ltd.',
  description: 'Your Dream Home Awaits',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://scontent.fdac207-1.fna.fbcdn.net/v/t39.30808-6/591497575_122094253281151503_7652116043221707060_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=g6ZmrSsA2ogQ7kNvwGtu9e2&_nc_oc=AdkzFdJIRbJPrl1Yxq3cTLBKQP4Kul15HiP7mKGIjXy7aP1y4QurCAv4XxA2qSlkWQk&_nc_zt=23&_nc_ht=scontent.fdac207-1.fna&_nc_gid=-CyoR6V_lfLyvG-FxblL8Q&oh=00_AfhLVrwwfl6koCrogQKimxGmWu7jE0SnPatsBDzduN8MPQ&oe=693065DA" type="image/jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
