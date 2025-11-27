'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { collection, addDoc, serverTimestamp, doc, setDoc, deleteDoc as deleteDocFs } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { initializeFirebase } from '@/firebase/server';

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

    try {
        const { firestore } = initializeFirebase();
        await addDoc(collection(firestore, 'contact_messages'), {
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

// --- Admin Data Mutation ---
const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters long."),
  shortDescription: z.string().min(10, "Short description is required."),
  description: z.string().min(20, "Full description is required."),
  images: z.array(z.string().url()).min(1, "At least one image URL is required."),
  details: z.object({
    bedrooms: z.coerce.number().min(0, "Bedrooms must be a positive number."),
    bathrooms: z.coerce.number().min(0, "Bathrooms must be a positive number."),
    area: z.coerce.number().min(1, "Area must be greater than 0."),
    location: z.string().min(3, "Location is required."),
    status: z.enum(['Completed', 'Under Construction', 'Sold']),
  }),
});


export async function addOrUpdateProject(data: unknown) {
  const validatedFields = projectSchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid project data.' };
  }
  
  const { id, ...projectData } = validatedFields.data;

  try {
    const { firestore } = initializeFirebase();
    if (id) {
      // Update existing project
      await setDoc(doc(firestore, 'projects', id), projectData, { merge: true });
    } else {
      // Add new project
      await addDoc(collection(firestore, 'projects'), projectData);
    }
    revalidatePath('/ad-panel');
    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    console.error('Error saving project:', error);
    return { success: false, message: 'Failed to save project.' };
  }
}

export async function deleteProject(id: string) {
  if (!id) {
    return { success: false, message: 'Project ID is required.' };
  }
  try {
    const { firestore } = initializeFirebase();
    await deleteDocFs(doc(firestore, 'projects', id));
    revalidatePath('/ad-panel');
    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, message: 'Failed to delete project.' };
  }
}