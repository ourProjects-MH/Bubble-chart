import { initializeApp } from "firebase/app"
import { getFirestore, setDoc } from "firebase/firestore"
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
// GET
// const docRef = doc(db, "test2", "data");
// getDoc(docRef).then((res) => console.log(res.metadata));


// const docSnap = getDoc(docRef);
// console.log(docSnap.data.th)

// 버블개수, 버블 키워드 받은 것 기준으로 데이터 넣는 함수
function setData(bubbleCount, keywordList) {
  keywordList.forEach(element => {
    setDoc(doc(db, "test2", "data"), {
      element: {
        "test": 1,
        "test2": 2,
      }
    });
  });
}

setData(5, ['업무', '조직', '팀', '실장', '부서'])