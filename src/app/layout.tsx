import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Landmark New Homes Ltd. - Premium Real Estate and Development',
  description: 'Discover your dream home with Landmark New Homes Ltd. We specialize in luxury residential properties, commercial developments, and comprehensive IT solutions.',
  keywords: ['real estate', 'luxury homes', 'property development', 'Landmark New Homes', 'apartments for sale', 'commercial properties'],
  authors: [{ name: 'Landmark New Homes Ltd.' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://res.cloudinary.com/dj4lirc0d/image/upload/v1764409306/Artboard_1_pabijh.png" type="image/png" />
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
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
          <Link 
            href="tel:+8809649174632"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-transform hover:scale-110"
            aria-label="Call Us"
          >
            <Phone className="h-6 w-6" />
          </Link>
          <Link 
            href="http://m.me/landmarkltd.net"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
            aria-label="Chat on Messenger"
          >
            <MessageCircle className="h-6 w-6" />
          </Link>
        </div>
      </body>
    </html>
  );
}
