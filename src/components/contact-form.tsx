'use client';

import React, { useState } from 'react';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number seems too short'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validatedFields = contactSchema.safeParse(formData);

    if (!validatedFields.success) {
      setErrors(validatedFields.error.flatten().fieldErrors);
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
      const contactMessageData = {
        ...validatedFields.data,
        createdAt: serverTimestamp(),
      };

      const colRef = collection(firestore, 'contact_messages');
      await addDocumentNonBlocking(colRef, contactMessageData);

      toast({
        title: 'Success!',
        description: 'Thank you for your message! We will get back to you shortly.',
      });
      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
        {errors.name && <p className="text-sm text-destructive">{errors.name[0]}</p>}
      </div>
      <div className="space-y-2">
        <Input name="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
        {errors.email && <p className="text-sm text-destructive">{errors.email[0]}</p>}
      </div>
      <div className="space-y-2">
        <Input name="phone" placeholder="Your Phone Number" value={formData.phone} onChange={handleChange} required />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone[0]}</p>}
      </div>
      <div className="space-y-2">
        <Textarea name="message" placeholder="Your Message" rows={5} value={formData.message} onChange={handleChange} required />
        {errors.message && <p className="text-sm text-destructive">{errors.message[0]}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send Message
      </Button>
    </form>
  );
}
