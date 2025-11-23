const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

const bucketName = process.env.FB_CREDS_BUCKET; 
const keyFileName = "firebase-service-account.json";

async function initFirebase() {
  const [file] = await storage
    .bucket(bucketName)
    .file(keyFileName)
    .download();

  const serviceAccount = JSON.parse(file.toString());

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FB_BUCKET
  });

  console.log("✅ Firebase Admin initialized");
}

module.exports = initFirebase;
