import * as admin from "firebase-admin";

let app: admin.app.App;

if (process.env.NODE_ENV === "development") {
  const serviceAccount = require("../../.env/local-serviceAccountKey.json");
  app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
} else {
  app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
}

const adminDb = app.firestore();
const adminStorage = app.storage();

export { adminDb, adminStorage };
