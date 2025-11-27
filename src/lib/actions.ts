'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { collection, addDoc, deleteDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
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
  // A static, predictable UID for the admin to ensure consistency.
  const STATIC_ADMIN_UID = 'the-one-and-only-admin-user'; 

  const validatedFields = pinSchema.safeParse({ pin: formData.get('pin') });

  if (!validatedFields.success) {
    return { message: 'Invalid PIN format.', success: false, token: null };
  }

  if (validatedFields.data.pin === HARDCODED_PIN) {
    const { auth, firestore } = await getFirebaseAdmin();
    
    // Ensure the admin role document exists for our static admin UID.
    // This is idempotent and safe to call on every login.
    const adminRoleRef = doc(firestore, 'roles_admin', STATIC_ADMIN_UID);
    await setDoc(adminRoleRef, { grantedAt: serverTimestamp() }, { merge: true });

    // Create a custom token for the static admin user.
    const customToken = await auth.createCustomToken(STATIC_ADMIN_UID);

    // No longer using cookies for this part of the flow.
    // The token is returned directly to the client form for immediate sign-in.
    
    return { success: true, message: 'Login successful', token: customToken };
  } else {
    return { message: 'Invalid PIN.', success: false, token: null };
  }
}

export async function logout() {
  // This can be simplified as we are not using cookies for auth session management in the same way.
  // The client will handle sign-out. We can keep this action in case we need to do server-side cleanup later.
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
        success: false,
      };
    }
    
    const { firestore } = await getFirebaseAdmin();
    const docData = {
        ...validatedFields.data,
        createdAt: serverTimestamp(),
    };
    
    await addDoc(collection(firestore, 'contact_messages'), docData);

    revalidatePath('/ad-panel/dashboard');

    return {
      message: 'Thank you for your message! We will get back to you shortly.',
      success: true,
    };

  } catch (e) {
    console.error('Failed to submit contact form:', e);
    return {
      message: 'An unexpected error occurred. Please try again.',
      success: false,
    };
  }
}

// --- Admin Data Mutation ---
export async function deleteMessage(id: string) {
    const { firestore } = await getFirebaseAdmin();
    const messageDoc = doc(firestore, 'contact_messages', id);
    await deleteDoc(messageDoc);
revalidatePath('/ad-panel/dashboard');
}
