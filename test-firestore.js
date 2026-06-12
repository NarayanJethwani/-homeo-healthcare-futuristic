/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require('firebase-admin');
const fs = require('fs');

if (fs.existsSync('.env.local')) {
  const env = fs.readFileSync('.env.local', 'utf8');
  env.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

let serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
if (serviceAccountKey) {
  serviceAccountKey = serviceAccountKey.trim();
  if (
    (serviceAccountKey.startsWith("'") && serviceAccountKey.endsWith("'")) ||
    (serviceAccountKey.startsWith('"') && serviceAccountKey.endsWith('"'))
  ) {
    serviceAccountKey = serviceAccountKey.slice(1, -1);
  }
  const parsedKey = JSON.parse(serviceAccountKey);
  admin.initializeApp({
    credential: admin.credential.cert(parsedKey),
    databaseURL: `https://${parsedKey.project_id}.firebaseio.com`
  });
} else {
  admin.initializeApp({
    projectId: "homeo-healthcare"
  });
}

const db = admin.firestore();

async function run() {
  try {
    const snap = await db.collection('rubrics').limit(5).get();
    console.log('Total rubrics in snap:', snap.size);
    snap.forEach(doc => {
      console.log('Rubric ID:', doc.id, 'Data:', JSON.stringify(doc.data(), null, 2));
    });
  } catch (err) {
    console.error('Error:', err);
  }
  process.exit(0);
}

run();
