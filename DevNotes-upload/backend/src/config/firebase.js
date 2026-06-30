import admin from 'firebase-admin';

let firebaseApp = null;

/**
 * Lazily initialise the Firebase Admin SDK using credentials from env vars.
 * Used to verify Google ID tokens sent from the frontend.
 */
export const initFirebase = () => {
  if (firebaseApp) return firebaseApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      '[firebase] Missing Firebase Admin credentials. Google auth will fail until configured.'
    );
    return null;
  }

  // Env vars often store the private key with escaped newlines.
  privateKey = privateKey.replace(/\\n/g, '\n');

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });

  console.log('[firebase] Admin SDK initialised');
  return firebaseApp;
};

/**
 * Verify a Google ID token and return the decoded token.
 * @param {string} idToken
 */
export const verifyGoogleToken = async (idToken) => {
  const app = initFirebase();
  if (!app) {
    throw new Error('Firebase Admin is not configured on the server');
  }
  return admin.auth().verifyIdToken(idToken);
};

export default admin;
