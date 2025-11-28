'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { initializeFirebase as initializeAdminFirebase } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';


// --- Contact Form ---
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number seems too short'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    // Use the admin SDK for this server-side operation.
    const { firestore } = initializeAdminFirebase();
    
    // Use the Admin SDK's 'add' method which returns a promise.
    await firestore.collection('contact_messages').add({
        ...validatedFields.data,
        createdAt: FieldValue.serverTimestamp(),
    });

    // Revalidate the path to the admin panel to show the new message.
    revalidatePath('/ad-panel');

    return {
        message: 'Thank you for your message! We will get back to you shortly.',
        success: true,
        errors: {},
    };

  } catch (error) {
      console.error("Error submitting contact form:", error);
      return {
          message: 'An unexpected error occurred. Please try again.',
          success: false,
          errors: {},
      };
  }
}
