import { collection, addDoc, getDocs, Timestamp, orderBy, query } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../lib/firebase';

const eventId = import.meta.env.VITE_EVENT_ID;

export interface Stand {
  id: string;
  name: string;
  createdAt: Timestamp;
}

export const getDashboardData = async (): Promise<Stand[]> => {
  const standsCollectionRef = collection(db, `events/${eventId}/stands`);
  const q = query(standsCollectionRef, orderBy('createdAt', 'asc'));
  const standsSnapshot = await getDocs(q);
  return standsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Stand));
};

export const addStand = async (standName: string): Promise<void> => {
  if (!standName.trim()) {
    throw new Error('Stand name cannot be empty.');
  }
  const standsCollectionRef = collection(db, `events/${eventId}/stands`);
  await addDoc(standsCollectionRef, {
    name: standName.trim(),
    createdAt: Timestamp.now(),
  });
};

const exportWinnersFn = httpsCallable<{ eventId: string }, { csvData: string }>(functions, 'exportWinners');

export const exportWinners = async (): Promise<string> => {
  try {
    const result = await exportWinnersFn({ eventId });
    return result.data.csvData;
  } catch (error) {
    console.error("Error exporting winners:", error);
    throw new Error("Failed to export winners. Check function logs.");
  }
};

