import Rebase from 're-base';
import firebase from 'firebase';
import dotenv from 'dotenv';

dotenv.config();

const firebaseApp = firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  storageBucket: process.env.REACT_APP_STORAGE_URL
});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;
