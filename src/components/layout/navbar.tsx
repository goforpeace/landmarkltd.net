'use client';

import Link from 'next/link';
import { Building, Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const navLinks = [
  { href: '/#projects', label: 'Projects' },
  { href: '/#services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Image
              src="https://scontent.fdac207-1.fna.fbcdn.net/v/t39.30808-6/591497575_122094253281151503_7652116043221707060_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=g6ZmrSsA2ogQ7kNvwGtu9e2&_nc_oc=AdkzFdJIRbJPrl1Yxq3cTLBKQP4Kul15HiP7mKGIjXy7aP1y4QurCAv4XxA2qSlkWQk&_nc_zt=23&_nc_ht=scontent.fdac207-1.fna&_nc_gid=-CyoR6V_lfLyvG-FxblL8Q&oh=00_AfhLVrwwfl6koCrogQKimxGmWu7jE0SnPatsBDzduN8MPQ&oe=693065DA"
              alt="Landmark New Homes Ltd. Logo"
              width={180}
              height={40}
              className="h-14 w-auto object-contain"
              priority
            />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-semibold text-gray-600 transition-colors hover:text-primary"
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-gray-800" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Building className="h-7 w-7 text-primary" />
                  <span className="font-headline text-xl font-bold text-primary">
                    Landmark
                  </span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-foreground/70 transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
