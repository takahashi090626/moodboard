import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmwBfrkhsQEB9N-VOnA58bkjkND69666I",
  authDomain: "moodboard-2.firebaseapp.com",
  projectId: "moodboard-2",
  storageBucket: "moodboard-2.appspot.com",
  messagingSenderId: "877021735439",
  appId: "1:877021735439:web:3d9178f943715a24d4117a",
  measurementId: "G-E6CX0M6Y8C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
