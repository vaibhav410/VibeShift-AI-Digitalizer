import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { collection, addDoc, serverTimestamp };

export enum OperationType {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
}

export function handleFirestoreError(error: unknown, operation: OperationType, collectionName: string): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Firestore ${operation} failed on "${collectionName}": ${message}`);
  throw new Error(`Failed to ${operation} data in "${collectionName}": ${message}`);
}
