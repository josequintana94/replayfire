var admin = require("firebase-admin");

var serviceAccount = require("./replay-1b81c-firebase-adminsdk-n6mju-07c46310a1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = { admin, db };