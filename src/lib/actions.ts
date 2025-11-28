'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { initializeFirebase as initializeAdminFirebase } from '@/firebase/server';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';


// --- PIN Authentication ---
const pinSchema = z.object({
  pin: z.string().length(4, 'PIN must be 4 digits.'),
  // UID is no longer needed for this simplified logic
});

export async function login(prevState: any, formData: FormData) {
  const HARDCODED_PIN = '5206';
  
  const validatedFields = pinSchema.safeParse({ 
    pin: formData.get('pin'),
  });

  if (!validatedFields.success) {
    return { message: 'Invalid form data.', success: false };
  }
  
  const { pin } = validatedFields.data;

  // The server's only job is to validate the PIN.
  if (pin === HARDCODED_PIN) {
    // On success, we just tell the client it was successful.
    // The client will then show the admin dashboard.
    return { success: true, message: 'Login successful.' };
  } else {
    return { message: 'Invalid PIN.', success: false };
  }
}

export async function logout() {
  // Client will handle sign-out. This action can be a no-op.
}


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
    // This is safe because contact form submission does not require user authentication context.
    const { firestore } = initializeAdminFirebase();
    
    // Perform a non-blocking write.
    addDoc(collection(firestore, 'contact_messages'), {
        ...validatedFields.data,
        createdAt: serverTimestamp(),
    });

    revalidatePath('/ad-panel');

    return {
        message: 'Thank you for your message! We will get back to you shortly.',
        success: true,
    };

  } catch (error) {
      console.error("Error submitting contact form:", error);
      return {
          message: 'An unexpected error occurred. Please try again.',
          success: false,
      };
  }
}
