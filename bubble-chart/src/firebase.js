import { initializeApp } from "firebase/app"
import { getFirestore, addDoc, collection } from "firebase/firestore"
// import { collection,  addDoc } from "firebase/firestore";
// import { doc } from "firebase/firestore";
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
// function setData(bubbleCount, keywordList) {
//   for (let i=0; i<keywordList.length; i++) {
//     let object = new Object()
//     let word1 = keywordList[i]
//     const content = {
//         "test": 1,
//         "test2": 2,
//     }
//     object[word1] = content
//     addDoc(doc(db, "test2", "data"), object);
//   }
//   // keywordList.forEach(element => {
//   //   const content = {
//   //     element: {
//   //       "test": 1,
//   //       "test2": 2,
//   //     }
//   //   }
//   //   setDoc(doc(db, "test2", "data"), content);
//   // });
// }


// 데이터 추가 함수
// 계급, 키워드리스트, 문구,
function addData(bubbleCount, keywordList) {
  
  for (let i=0; i<keywordList.length; i++) {
    let object = new Object()
    let word1 = keywordList[i]

    let content = {
      "total_count": 24,
      "sentence": [
        {
          "hihi": 1
        },
        {
          "byebye": 2
        }
      ]
    }
    content[word1] = 
    // object[word1] = content
    addDoc(collection(db, "test3"), object);
  }
}
addData("임원", [{'업무': [{"hi": 1}, {"hihi": 2}]}, '조직', '팀', '실장', '부서'])

// 카운트 수정 api