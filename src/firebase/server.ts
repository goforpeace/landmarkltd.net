import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// IMPORTANT: DO NOT MODIFY THIS FILE
// This file is used for server-side Firebase operations.
// It uses the Firebase Admin SDK, which has elevated privileges.

function getServiceAccount() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
  }
  return JSON.parse(serviceAccount);
}

function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }
  
  const serviceAccount = getServiceAccount();

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

export function initializeFirebase() {
  const app = getFirebaseAdminApp();
  return {
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}
