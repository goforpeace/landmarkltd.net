'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { projects, contactMessages as mockMessages } from './data';
import type { ContactMessage } from './types';

// --- PIN Authentication ---
const PIN = '5206';
export async function checkPin(prevState: any, formData: FormData) {
  const pin = formData.get('pin') as string;
  if (pin === PIN) {
    cookies().set('admin-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    redirect('/ad-panel/dashboard');
  }
  return {
    message: 'Invalid PIN. Please try again.',
  };
}

export async function logout() {
  cookies().delete('admin-auth');
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
    
    // In a real app, you would save this to a database (e.g., Firestore)
    console.log('New contact form submission:', validatedFields.data);
    
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      ...validatedFields.data,
      createdAt: new Date(),
    };
    mockMessages.unshift(newMessage);

    return {
      message: 'Thank you for your message! We will get back to you shortly.',
      success: true,
    };

  } catch (e) {
    return {
      message: 'An unexpected error occurred.',
    };
  }
}

// --- Admin Data Fetching ---
export async function getProjects() {
  // In a real app, fetch from Firestore
  return projects;
}

export async function getProjectById(id: string) {
    // In a real app, fetch from Firestore
    return projects.find(p => p.id === id);
}

export async function getContactMessages() {
  // In a real app, fetch from Firestore
  return mockMessages;
}

// --- Admin Data Mutation ---
export async function addProject(formData: FormData) {
  // Logic to add a new project
  // In a real app, write to Firestore
  console.log('Adding new project:', formData.get('title'));
  // Revalidate path if necessary
}

export async function deleteMessage(id: string) {
    // In a real app, delete from Firestore
    const index = mockMessages.findIndex(msg => msg.id === id);
    if (index > -1) {
        mockMessages.splice(index, 1);
    }
    console.log(`Deleted message with id: ${id}`);
}
