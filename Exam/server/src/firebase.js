const admin = require("firebase-admin");

async function initFirebase() {
  try {
    if (!admin.apps.length) {
      console.log("FB_BUCKET =", process.env.FB_BUCKET);
      admin.initializeApp({
        
        credential: admin.credential.applicationDefault(),
        storageBucket: process.env.FB_BUCKET,
      });

      console.log("🔥 Firebase Admin initialized with Cloud Run IAM");
    }
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    throw error; // Important: fail early if Firebase fails
  }
}

module.exports = initFirebase;
