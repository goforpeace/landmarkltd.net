'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { collection, getDocs, doc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { ContactMessage, Project } from './types';
import { revalidatePath } from 'next/cache';
import { initializeFirebase as initializeFirebaseAdmin } from '@/firebase/server';
import { getAuth } from 'firebase-admin/auth';

// Server actions should use the admin SDK when appropriate for privileged operations
async function getFirebaseAdmin() {
  return initializeFirebaseAdmin();
}


// --- PIN Authentication ---
const pinSchema = z.object({
  pin: z.string().length(4, 'PIN must be 4 digits.'),
});

export async function login(prevState: any, formData: FormData) {
  const HARDCODED_PIN = '5206';
  const validatedFields = pinSchema.safeParse({ pin: formData.get('pin') });

  if (!validatedFields.success) {
    return { message: 'Invalid PIN format.' };
  }

  if (validatedFields.data.pin === HARDCODED_PIN) {
    const { auth } = await getFirebaseAdmin();
    // Create a generic UID for this session. In a real app, this might be a stable user ID.
    const uid = `admin_pin_user_${Date.now()}`; 
    
    // Create a custom token with an `isAdmin` claim.
    const customToken = await auth.createCustomToken(uid, { isAdmin: true });

    // Set the custom token in a cookie to be used by the client.
    cookies().set('admin-auth-token', customToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
    
    redirect('/ad-panel/dashboard');
  } else {
    return { message: 'Invalid PIN.' };
  }
}

export async function logout() {
  cookies().delete('admin-auth-token');
  redirect('/ad-panel');
}


// --- Contact Form ---
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number seems too short'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
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
      };
    }
    
    const { firestore } = await getFirebaseAdmin();
    const docRef = doc(collection(firestore, 'contact_messages'));
    
    await addDoc(collection(firestore, 'contact_messages'), {
      ...validatedFields.data,
      id: docRef.id,
      createdAt: serverTimestamp(),
    });

    revalidatePath('/ad-panel/dashboard');

    return {
      message: 'Thank you for your message! We will get back to you shortly.',
      success: true,
    };

  } catch (e) {
    console.error('Failed to submit contact form:', e);
    return {
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

// --- Admin Data Mutation ---
export async function deleteMessage(id: string) {
    const { firestore } = await getFirebaseAdmin();
    const messageDoc = doc(firestore, 'contact_messages', id);
    await deleteDoc(messageDoc);
    revalidatePath('/ad-panel/dashboard');
    console.log(`Deleted message with id: ${id}`);
}
