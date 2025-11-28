import Link from 'next/link';
import { Building, Twitter, Facebook, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" prefetch={false}>
              <Building className="h-8 w-8 text-primary" />
              <span className="font-headline text-2xl font-bold text-primary">
                Landmark
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Where every square foot tells a story
            </p>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/#projects" className="text-sm hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/#services" className="text-sm hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/#faq" className="text-sm hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>House:4/C, Road: 7/B, Sector:09 Uttara Dhaka</li>
              <li>info@landmarkltd.net</li>
              <li>+880-123-456789</li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Landmark New Homes Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
