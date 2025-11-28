'use client';

import React, { useState } from 'react';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

interface CallbackRequestFormProps {
  projectId?: string;
  projectName?: string;
}

export default function CallbackRequestForm({ projectId, projectName }: CallbackRequestFormProps) {
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
        if (!firestore) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Database connection not available.',
            });
            return;
        }


        setIsSubmitting(true);
        try {
            const callbackRequestData = {
                name,
                phone,
                projectId: projectId || 'N/A',
                projectName: projectName || 'General Inquiry',
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
