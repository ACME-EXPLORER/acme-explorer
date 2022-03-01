import firebase from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const credentials = require('../config/acme-explorer-firebase.json');

firebase.initializeApp({
  credential: firebase.credential.cert(credentials)
});

export default firebase;
