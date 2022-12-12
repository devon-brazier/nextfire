// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { collection, getDocs, getFirestore, limit, query, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaj7rGFN87fHEzCzwdj4uud-tw8_mPfjA",
  authDomain: "nextfire-be927.firebaseapp.com",
  projectId: "nextfire-be927",
  storageBucket: "nextfire-be927.appspot.com",
  messagingSenderId: "898844199304",
  appId: "1:898844199304:web:a76cd5adc13fe1d98a123d",
  measurementId: "G-ZEB9DX76H4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics and get a reference to the service
// export const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const firestore = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Helper Functions

export async function getUserWithUsername(username) {
  const userRef = collection(firestore, "users");
  const q = query(userRef, where("username", "==", username), limit(1));
  
  return (await getDocs(q)).docs[0];
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  }
}