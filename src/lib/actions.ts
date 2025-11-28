'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { initializeFirebase as initializeAdminFirebase } from '@/firebase/server';
import { addDoc, collection, serverTimestamp, setDoc, doc } from 'firebase/firestore';


// --- PIN Authentication ---
const pinSchema = z.object({
  pin: z.string().length(4, 'PIN must be 4 digits.'),
  uid: z.string().min(1, 'User ID is missing.'), // Add UID to the schema
});

export async function login(prevState: any, formData: FormData) {
  const HARDCODED_PIN = '5206';
  
  const validatedFields = pinSchema.safeParse({ 
    pin: formData.get('pin'),
    uid: formData.get('uid'),
  });

  if (!validatedFields.success) {
    return { message: 'Invalid form data.', success: false, token: null };
  }
  
  const { pin, uid } = validatedFields.data;

  if (pin === HARDCODED_PIN) {
    try {
        // Use the Admin SDK to grant the admin role by creating a document
        // in the roles_admin collection. This is a secure server-side operation.
        const { firestore } = initializeAdminFirebase();
        const adminRoleRef = doc(firestore, 'roles_admin', uid);
        await setDoc(adminRoleRef, { grantedAt: serverTimestamp() });

        // Signal success to the client. The client is already authenticated
        // and its UID now has admin rights according to the security rules.
        return { success: true, message: 'Login successful. Admin role granted.', token: 'mock-success-token' };

    } catch (error) {
        console.error("Error granting admin role:", error);
        return { message: 'Server error while granting admin role.', success: false, token: null };
    }
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
