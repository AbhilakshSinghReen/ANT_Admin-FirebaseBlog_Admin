import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

var firebaseConfig = {
};

//if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
//}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const FieldValue = firebase.firestore.FieldValue;
export const storage = firebase.storage();
