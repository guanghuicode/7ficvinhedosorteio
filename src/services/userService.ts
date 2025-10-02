import { doc, getDoc, setDoc, collection, getCountFromServer, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from 'firebase/auth';

const eventId = import.meta.env.VITE_EVENT_ID;

export interface UserProfile {
  name: string;
  email: string;
  createdAt: Timestamp;
  eventId: string;
}

export interface UserProgress {
  scannedCount: number;
  requiredScans: number;
}

export const getUserData = async (user: User | null): Promise<{ profile: UserProfile | null; progress: UserProgress | null }> => {
  if (!user) return { profile: null, progress: null };

  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    return { profile: null, progress: null };
  }
  
  const profile = userDocSnap.data() as UserProfile;


  const eventDocRef = doc(db, 'events', eventId);
  const eventDocSnap = await getDoc(eventDocRef);
  const requiredScans = eventDocSnap.exists() ? eventDocSnap.data().requiredScans : 0;

  const scansCollectionRef = collection(db, 'users', user.uid, 'scans');
  const scansSnapshot = await getCountFromServer(scansCollectionRef);
  const scannedCount = scansSnapshot.data().count;

  return { profile, progress: { scannedCount, requiredScans } };
};

export const registerUser = async ({ user, name, email }: { user: User, name: string, email: string }): Promise<void> => {
  const userDocRef = doc(db, 'users', user.uid);
  const newUserProfile: UserProfile = {
    name,
    email,
    createdAt: Timestamp.now(),
    eventId,
  };
  await setDoc(userDocRef, newUserProfile);
};

export const scanStand = async ({ userId, standId }: { userId: string, standId: string }): Promise<void> => {
    // First, verify the stand exists to prevent scanning arbitrary QR codes
    const standDocRef = doc(db, `events/${eventId}/stands`, standId);
    const standDocSnap = await getDoc(standDocRef);

    if (!standDocSnap.exists()) {
        throw new Error("Invalid stand QR code.");
    }

    const scanDocRef = doc(db, `users/${userId}/scans`, standId);
    const scanDocSnap = await getDoc(scanDocRef);

    if (scanDocSnap.exists()) {
        throw new Error("You've already scanned this stand!");
    }

    await setDoc(scanDocRef, { scannedAt: Timestamp.now() });
};
