'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { ContactMessage, Project } from './types';
import { revalidatePath } from 'next/cache';
import { initializeFirebase as initializeFirebaseAdmin } from '@/firebase/server';

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
    // Set a simple session cookie
    cookies().set('admin-auth-token', 'true', {
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
    
    // For public-facing forms, we don't need admin privileges.
    // However, if not initialized, let's use it.
    // This part of your app does not seem to have client-side firebase submission setup
    // so we use the admin SDK here.
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

// --- Admin Data Fetching ---
export async function getProjects(): Promise<Project[]> {
  const { firestore } = await getFirebaseAdmin();
  const projectsCollection = collection(firestore, 'projects');
  const snapshot = await getDocs(projectsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
}

export async function getProjectById(id: string): Promise<Project | null> {
    const { firestore } = await getFirebaseAdmin();
    const projectDoc = doc(firestore, 'projects', id);
    const snapshot = await getDoc(projectDoc);
    if (!snapshot.exists()) {
        return null;
    }
    return { id: snapshot.id, ...snapshot.data() } as Project;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { firestore } = await getFirebaseAdmin();
  const messagesCollection = collection(firestore, 'contact_messages');
  const snapshot = await getDocs(messagesCollection);
  return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate() 
      } as ContactMessage
  });
}

// --- Admin Data Mutation ---
export async function addProject(formData: FormData) {
  // Logic to add a new project
  console.log('Adding new project:', formData.get('title'));
  // Revalidate path if necessary
}

export async function deleteMessage(id: string) {
    const { firestore } = await getFirebaseAdmin();
    const messageDoc = doc(firestore, 'contact_messages', id);
    await deleteDoc(messageDoc);
    revalidatePath('/ad-panel/dashboard');
    console.log(`Deleted message with id: ${id}`);
}
