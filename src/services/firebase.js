import firebase from "firebase";

const FIREBASE_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = process.env.REACT_APP_FIREBASE_DOMAIN;
const FIREBASE_PROJECT_ID = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = process.env.REACT_APP_FIREBASE_APP_ID;
const FIREBASE_MEASUREMENT_ID = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;
const FIREBASE_DATABASE_URL = process.env.REACT_APP_FIREBASE_DATABASE_URL;

const CONFIG = {
	apiKey: FIREBASE_API_KEY,
	authDomain: FIREBASE_AUTH_DOMAIN,
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
	appId: FIREBASE_APP_ID,
	measurementId: FIREBASE_MEASUREMENT_ID,
	databaseURL: FIREBASE_DATABASE_URL
};

const FIREBASE_CONFIG_ERROR = Object.values(CONFIG).some((val) => !val);
let FIREBASE_CONNECTION_ERROR = false;

let firebaseDb = null;
let firebaseAuth = null;
let firebaseStorage = null;

try {
	if (!FIREBASE_CONFIG_ERROR) {
		firebase.initializeApp(CONFIG);
		firebaseDb = firebase?.database() || null;
		firebaseAuth = firebase?.auth() || null;
		firebaseStorage = firebase?.storage() || null;
	}
} catch (e) {
	console.error(e);
	FIREBASE_CONNECTION_ERROR = true;
}

export const FIREBASE_ERROR = FIREBASE_CONFIG_ERROR || FIREBASE_CONNECTION_ERROR;
export const db = firebaseDb;
export const auth = firebaseAuth;
export const storage = firebaseStorage;
