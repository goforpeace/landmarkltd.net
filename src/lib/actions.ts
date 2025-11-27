'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { initializeFirebase } from '@/firebase/server';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { ContactMessage, Project } from './types';
import { revalidatePath } from 'next/cache';

async function getFirebase() {
  return initializeFirebase();
}

// --- Firebase Authentication ---
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(prevState: any, formData: FormData) {
  try {
    const validatedFields = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return { message: 'Invalid email or password format.' };
    }
    
    const { auth } = await getFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, validatedFields.data.email, validatedFields.data.password);
    const idToken = await userCredential.user.getIdToken();

    cookies().set('admin-auth-token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential') {
      return { message: 'Invalid email or password.' };
    }
    return { message: 'An unexpected error occurred during login.' };
  }
  redirect('/ad-panel/dashboard');
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
    
    const { firestore } = await getFirebase();
    const messagesCollection = collection(firestore, 'contact_messages');
    
    await addDoc(messagesCollection, {
      ...validatedFields.data,
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
  const { firestore } = await getFirebase();
  const projectsCollection = collection(firestore, 'projects');
  const snapshot = await getDocs(projectsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
}

export async function getProjectById(id: string): Promise<Project | null> {
    const { firestore } = await getFirebase();
    const projectDoc = doc(firestore, 'projects', id);
    const snapshot = await getDoc(projectDoc);
    if (!snapshot.exists()) {
        return null;
    }
    return { id: snapshot.id, ...snapshot.data() } as Project;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { firestore } = await getFirebase();
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
    const { firestore } = await getFirebase();
    const messageDoc = doc(firestore, 'contact_messages', id);
    await deleteDoc(messageDoc);
    revalidatePath('/ad-panel/dashboard');
    console.log(`Deleted message with id: ${id}`);
}
