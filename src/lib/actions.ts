'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { initializeFirebase as initializeAdminFirebase } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';

// All server actions have been removed from this file.
// The contact form functionality is now handled on the client-side.
