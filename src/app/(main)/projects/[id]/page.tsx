'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import { useDoc, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Project, FlatType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Square, MapPin, Loader2, ArrowRight, Home, Phone, MessageSquare, PhoneCall } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useMemoFirebase } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectImageGallery from '@/components/project-image-gallery';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { serverTimestamp } from 'firebase/firestore';


function CallbackRequestForm({ projectId, projectName }: { projectId: string; projectName: string }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please enter both your name and phone number.',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const callbackRequestData = {
                name,
                phone,
                projectId,
                projectName,
                status: 'New',
                createdAt: serverTimestamp(),
            };
            
            const colRef = collection(firestore, 'callback_requests');
            await addDocumentNonBlocking(colRef, callbackRequestData);

            toast({
                title: 'Request Sent!',
                description: "We've received your request and will call you back shortly.",
            });
            setName('');
            setPhone('');
            // Close the dialog
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        } catch (error) {
            console.error("Error submitting callback request:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Something went wrong. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" required />
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Request Call
                </Button>
            </DialogFooter>
        </form>
    );
}

function FlatTypeDetails({ flatType }: { flatType: FlatType }) {
  return (
    <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground"><BedDouble className="h-5 w-5 text-primary" /> Bedrooms</span>
            <span className="font-semibold">{flatType.bedrooms}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground"><Bath className="h-5 w-5 text-primary" /> Bathrooms</span>
            <span className="font-semibold">{flatType.bathrooms}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground"><Home className="h-5 w-5 text-primary" /> Verandas</span>
            <span className="font-semibold">{flatType.verandas}</span>
        </div>
    </div>
  );
}


export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const firestore = useFirestore();
  
  const projectRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'projects', id);
  }, [firestore, id]);

  const { data: project, isLoading } = useDoc<Project>(projectRef);

  if (isLoading) {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  if (!project) {
    notFound();
  }
  
  const images = Array.isArray(project.images) ? project.images.filter(img => img && typeof img === 'string') : [];
  const phoneNumber = "+8801920709034";
  const whatsappLink = `https://wa.me/${phoneNumber.replace('+', '')}`;

  return (
    <div className="bg-background py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
          <div className="lg:col-span-1">
             <ProjectImageGallery images={images} title={project.title} />
          </div>

          <div className="lg:col-span-1">
            <div className="mb-6">
                <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">{project.title}</h1>
                <p className="mt-2 text-lg text-muted-foreground">{project.shortDescription}</p>
            </div>

            <Card className="mb-8 bg-card/50">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl font-semibold text-primary">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-5 w-5 text-primary" /> Location</span>
                        <Button asChild variant="outline" size="sm">
                        <Link href={project.location} target="_blank" rel="noopener noreferrer">
                            View Location <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-muted-foreground">Status</span>
                        <Badge variant={project.status === 'Completed' ? 'default' : project.status === 'Sold' ? 'destructive' : 'secondary'} className="bg-primary/80 text-primary-foreground">
                            {project.status}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {project.flatTypes && project.flatTypes.length > 0 && (
              <div className="mb-8 space-y-4">
                  <h2 className="font-headline text-2xl font-semibold text-primary">Available Units</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {project.flatTypes.map((flatType, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border-b">
                        <AccordionTrigger className="flex w-full items-center justify-between py-4 text-left font-semibold text-lg hover:no-underline">
                           <div className="flex items-baseline gap-3">
                            <span className="text-primary">{flatType.name}</span>
                            <span className="text-sm font-normal text-muted-foreground">{flatType.area.toLocaleString()} sqft</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <FlatTypeDetails flatType={flatType} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
              </div>
            )}

            <Card className="mb-8 bg-secondary">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl font-semibold text-primary">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <a href={`tel:${phoneNumber}`}>
                            <Phone className="mr-2 h-4 w-4" /> Call Now
                        </a>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-500 hover:text-white">
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                            <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
                        </a>
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="default" className="w-full sm:col-span-2 lg:col-span-1">
                                <PhoneCall className="mr-2 h-4 w-4" /> Request a Call
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Request a Callback</DialogTitle>
                                <DialogDescription>
                                    Enter your details below and we'll call you back as soon as possible.
                                </DialogDescription>
                            </DialogHeader>
                            <CallbackRequestForm projectId={project.id} projectName={project.title} />
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
            
            <div>
                <h2 className="mb-4 font-headline text-2xl font-semibold text-primary">Project Description</h2>
                <div className="prose max-w-none text-lg leading-relaxed text-foreground/80" dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
