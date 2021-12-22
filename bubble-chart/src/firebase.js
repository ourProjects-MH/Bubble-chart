import { initializeApp } from "firebase/app"
import {  getFirestore, setDoc, getDocs, collection, updateDoc } from "firebase/firestore"
// import { collection,  addDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
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

// 초기 데이터 추가
function setData(group, keyword, sentences, count) {
  let data = new Object()
  for (let i=0; i < sentences.length; i++) {
    data[i] = {
      "sentence": sentences[i],
      "count": count[i],
    }
  }
  
  setDoc(doc(db, group, keyword), data)
}
setData("임원", "팀플", ["어려워요", "재미있어요", "꺌꺌꺌"], [10, 10, 10])
setData("임원", "분담", ["짜릿해요", "호로록", "꺄르륵"], [20, 20, 20])
setData("팀원", "업무", ["힘들어요", "뭔소린지", "모르겠어요"], [30, 30, 30])

// 데이터 반환
// 컬렉션 즉 그룹이 뭔지 알아야함
function getTotalData() {
  let result = new Object()
  // let groups = getGroups()
  // groups = new Set(groups)

  const collections = getDocs(collection(db, "임원"))
  result["임원"] = new Object()

  collections.then((res) => {
    let docsInCollection = res._snapshot.docChanges
    result["임원"] = []
    
    // 해당 그룹안에 있는 docs(키워드) 순회
    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let keyword = path[path.length-1]

      let sentences = docsInCollection[i].doc.data.value.mapValue.fields
      sentences = Object.entries(sentences)

      
      // 키워드 안의 문구 순회하며 카운트 더하기
      let totalCount = 0
      for (let j=0; j<sentences.length; j++) {
        let countValue = sentences[j][1].mapValue.fields.count.integerValue
        countValue = parseInt(countValue)
        totalCount += countValue
      }
        
      let sub = new Object()
      sub["keyword"] = keyword
      sub["count"] = totalCount
      result["임원"].push(sub)
    }
  })
  return result
}
console.log(getTotalData())

// 그룹 데이터 저장
function addGroups (group) {
  setDoc(doc(db, "Groups", group), {"groupName": group})
}
addGroups("임원")
addGroups("팀원")
// 계급 가져오는 api
function getGroups() {
  const collections = getDocs(collection(db, "Groups"))
  collections.then((res) => {
    let docsInCollection = res._snapshot.docChanges
    
    // 해당 그룹안에 있는 docs(키워드) 순회
    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let keyword = path[path.length-1]
      console.log(keyword)
    }
  })
}
getGroups()
// 버블차트 데이터 저장 api
function setBubblechartData(keyword, sentences, count) {
  let arrayData = {}
  for (let i = 0; i< sentences.length; i++) {
    let sub = {}
    sub["sentence"] = sentences[i]
    sub["count"] = count[i]

    arrayData[i] = sub
  }
  setDoc(doc(db, "bubbleChart", keyword), arrayData)
}

setBubblechartData("keyword", ["sentence1", "sentence2", "sentence3"], [20, 20, 20])
setBubblechartData("하이하이", ["짜릿해요", "호로록", "꺄르륵"], [20, 20, 20])

// 카운트 수정 api
function putCount(group, keyword, sentenceIdx, sentence) {
  const findDoc = doc(db, group, keyword);
  console.log(findDoc)
  let putData = new Object()
  putData[sentenceIdx] = {
    count: 100,
    "sentence": sentence
  }
  try {
    updateDoc(findDoc, putData)
  } catch (e) {
    console.log(e)
  }
  
}
putCount("임원", "팀플", 0, "짜릿해요")







// 그룹 함수, 데이터 반환 함수

















// function setData(group, keyword, sentences) {
//   let data = new Object()
//   data[keyword] = new Object()
//   data[keyword]["sentences"] = new Object()
//   for (let i=0; i < sentences.length; i++) {
//     data[keyword]["sentences"][i] = {
//       "sentence": sentences[i],
//       "count": 0,
//     }
//   }
  
//   setDoc(doc(db, "data", group), data)
// }


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

// let sentence = sentences[j][1].mapValue.fields.sentence.stringValue
        
// result["임원"][keyword][j] = {
//   "count": count,
//   "sentence": sentence
// }