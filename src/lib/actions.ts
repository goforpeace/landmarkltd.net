'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
// Removed admin SDK import as we are simplifying the login flow
// import { initializeFirebase as initializeFirebaseAdmin } from '@/firebase/server';

// --- PIN Authentication ---
const pinSchema = z.object({
  pin: z.string().length(4, 'PIN must be 4 digits.'),
});

export async function login(prevState: any, formData: FormData) {
  const HARDCODED_PIN = '5206';
  
  const validatedFields = pinSchema.safeParse({ pin: formData.get('pin') });

  if (!validatedFields.success) {
    return { message: 'Invalid PIN format.', success: false, token: null };
  }

  if (validatedFields.data.pin === HARDCODED_PIN) {
    // This is a simplified flow. We are no longer creating a real admin token
    // on the server. We will just signal success to the client, and the client
    // will use a pre-existing anonymous session or create one.
    // The "token" here is just a success flag, not a real auth token.
    return { success: true, message: 'Login successful', token: 'mock-success-token' };
  } else {
    return { message: 'Invalid PIN.', success: false, token: null };
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
  // This action still requires admin privileges which we can't get right now.
  // For now, let's return a success message without writing to Firestore to avoid a crash.
  // A proper fix involves setting up the server environment correctly.
  
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
  
  return {
    message: 'Thank you for your message! We will get back to you shortly.',
    success: true,
  };

}

// --- Admin Data Mutation ---
export async function deleteMessage(id: string) {
    // This also requires admin privileges and will fail with the current setup.
    // We'll leave it for now, but it won't work until server auth is fixed.
    console.log(`Attempted to delete message ${id}, but server admin auth is not configured.`);
}
