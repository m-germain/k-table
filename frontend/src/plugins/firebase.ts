import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyATo8aWHGDpag_XWgh0Vl_bTabmerXhLm0",
  authDomain: "k-table.firebaseapp.com",
  databaseURL: "https://k-table.firebaseio.com",
  projectId: "k-table",
  storageBucket: "k-table.appspot.com",
  messagingSenderId: "480682690180",
  appId: "1:480682690180:web:4141a90c14703c3ff164d1"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const firestore = firebaseApp.firestore();

export default firestore;
