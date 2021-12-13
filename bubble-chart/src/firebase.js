import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// import { collection,  addDoc } from "firebase/firestore";
import { getDoc, doc } from "firebase/firestore";
initializeApp({
  apiKey: "AIzaSyCKZQz6LPTVvBzbG4gWiFW_mv_A-Gvqo7k",
  authDomain: "bubble-chart-89dd0.firebaseapp.com",
  projectId: "bubble-chart-89dd0",
  storageBucket: "bubble-chart-89dd0.appspot.com",
  messagingSenderId: "931764363139",
  appId: "1:931764363139:web:178bbd4673864d589660b6",
  measurementId: "${config.measurementId}"
});

const db = getFirestore();
// function setData() {
//   try {
//     const docRef = setDoc(doc(db, "test2", "data"), {
//       word1: {
//         "내일 뭐먹지": 1,
//         "혜은이는": 2,
//         "오늘": 3,
//         "간다": 5,
//         "낼 넘 외로울 것 같다 흑흑": 5,
//       },
//       word2: {
//         "내일 뭐먹지": 1,
//         "혜은이는": 2,
//         "오늘": 3,
//         "간다": 4,
//         "낼 넘 외로울 것 같다 흑흑": 5,
//       }
//     });
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// }

// GET
const docRef = doc(db, "test2", "data");
getDoc(docRef).then((res) => console.log(res.metadata));


// const docSnap = getDoc(docRef);
// console.log(docSnap.data.th)