const admin = require("firebase-admin");

async function initFirebase() {
  console.log("FB_BUCKET =", process.env.FB_BUCKET);
  console.log("🔥 FB_BUCKET in Cloud Run =", process.env.FB_BUCKET);
  console.log("🔥 FB_CREDS_BUCKET in Cloud Run =", process.env.FB_CREDS_BUCKET);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: process.env.FB_BUCKET,
    });
    console.log("🔥 Firebase Admin initialized with Cloud Run IAM");
  }
}

module.exports = initFirebase;
