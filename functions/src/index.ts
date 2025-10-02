import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as Papa from "papaparse";

admin.initializeApp();
const db = admin.firestore();

export const exportWinners = functions.https.onCall(async (data, context) => {
  // 1. Authentication & Authorization Check
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated.",
    );
  }

  const adminDoc = await db.collection("admins").doc(context.auth.uid).get();
  if (!adminDoc.exists) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You must be an administrator to perform this action.",
    );
  }

  const eventId = data.eventId;
  if (!eventId || typeof eventId !== "string") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a valid \'eventId\'.",
    );
  }

  try {
    // 2. Fetch Event Requirements
    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Event not found.",
      );
    }
    const requiredScans = eventDoc.data()?.requiredScans || 0;

    // 3. Query Users and their Scans
    const usersSnapshot = await db.collection("users").where("eventId", "==", eventId).get();
    const winners: { name: string; email: string; totalScans: number }[] = [];

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const scansSnapshot = await db.collection("users").doc(userDoc.id).collection("scans").get();
      const totalScans = scansSnapshot.size;

      if (totalScans >= requiredScans) {
        winners.push({
          name: userData.name,
          email: userData.email,
          totalScans: totalScans,
        });
      }
    }

    // 4. Convert to CSV and Return
    const csvData = Papa.unparse(winners);
    return { csvData };
  } catch (error) {
    console.error("Error in exportWinners Cloud Function:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to export winners due to an internal server error.",
      error.message,
    );
  }
});

