import firebase from "firebase";

const CONFIG = {
    apiKey: "AIzaSyCaBY6wZvVQ8C3MxfdyjP67q-cU1yhkI68",
    authDomain: "india-against-covid-4cf30.firebaseapp.com",
    projectId: "india-against-covid-4cf30",
    storageBucket: "india-against-covid-4cf30.appspot.com",
    messagingSenderId: "914519607471",
    appId: "1:914519607471:web:55075b4635fe20bd95ac5a",
    measurementId: "G-YS18G3VMKR",
    databaseURL: "https://india-against-covid-4cf30-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(CONFIG);
export const db = firebase.database();
export const auth = firebase.auth();
