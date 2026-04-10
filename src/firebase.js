import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBNMpeRRm_JQ3FUcpDX8f7sU8S8Rj35aG0',
  authDomain: 'list-tracker-6e3aa.firebaseapp.com',
  projectId: 'list-tracker-6e3aa',
  storageBucket: 'list-tracker-6e3aa.firebasestorage.app',
  messagingSenderId: '100033625937',
  appId: '1:100033625937:web:75d2917fd65bbe15f51d70',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)
