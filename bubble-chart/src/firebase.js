// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import * as firebase from 'firebase/app'
// import 'firebase/firestore';
// import { getFirestore, collection } from 'firebase/firestore/lite';
import * as firestore from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCKZQz6LPTVvBzbG4gWiFW_mv_A-Gvqo7k",
  authDomain: "bubble-chart-89dd0.firebaseapp.com",
  projectId: "bubble-chart-89dd0",
  storageBucket: "bubble-chart-89dd0.appspot.com",
  messagingSenderId: "931764363139",
  appId: "1:931764363139:web:178bbd4673864d589660b6",
  measurementId: "${config.measurementId}"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = firestore.getFirestore(app);
const citiesCol = firestore.collection(db, 'test2');
// const citySnapshot = getDocs(citiesCol);
console.log(citiesCol)
// Get a list of cities from your database
// async function getCities(db) {
//   const citiesCol = collection(db, 'cities');
//   const citySnapshot = await getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map(doc => doc.data());
//   return cityList;
// }
// const app = initializeApp(firebaseConfig);
// firebase.initializeApp(firebaseConfig)

// firebase.firestore().collection('test').add({test:'aaa'})
//   .then(r => console.log(r))
//   .catch(e => console.error(e))
