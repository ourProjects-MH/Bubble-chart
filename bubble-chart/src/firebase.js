import { initializeApp } from "firebase/app"
import {  getFirestore, setDoc, getDocs, collection, getDoc, updateDoc } from "firebase/firestore"
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

// 데이터 추가
function setData(group, keyword, sentences, totalCount) {
  let data = new Object()
  data["totalCount"] = totalCount

  for (let i=0; i < sentences.length; i++) {
    data[i] = {
      "sentence": sentences[i],
      "count": 0,
      "group": group
    }
  }
  
  setDoc(doc(db, group, keyword), data)
}

// 데이터 반환
function getTotalData() {
  let result = new Object()
  let groups = getGroups()
  console.log(groups, typeof(groups), Object.keys(groups))
  console.log(Object.entries(groups))

  // 그룹 순회하며 하나씩 가져오기
  for (let g=0; g<groups.length; g++) {
    console.log(groups[g])
  }
  const collections = getDocs(collection(db, "임원"))
  result = {}

  collections.then((res) => {
    let docsInCollection = res._snapshot.docChanges
    // 해당 그룹안에 있는 docs(키워드) 순회
    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let keyword = path[path.length-1]

      result[keyword] = {}
      result[keyword]["sentences"] = []

      let sentences = docsInCollection[i].doc.data.value.mapValue.fields
      result[keyword]["totalCount"] = sentences.totalCount.integerValue

      sentences = Object.entries(sentences)
      
      for (let j=0; j<sentences.length-1; j++) {
        let sub = {}
        let countValue = sentences[j][1].mapValue.fields.count.integerValue
        let group = sentences[j][1].mapValue.fields.group.stringValue
        let sentence = sentences[j][1].mapValue.fields.sentence.stringValue

        sub["sentence"] = sentence
        sub["group"] = group
        sub["count"] = countValue
        sub["id"] = j
        result[keyword]["sentences"].push(sub)
      }
        
    }
  })
  return result
}

// 그룹 데이터 저장
function addGroups (group) {
  setDoc(doc(db, "Groups", group), {"groupName": group})
}

// 그룹 가져오는 api
function getGroups() {
  let groups = new Array()
  const collections = getDocs(collection(db, "Groups"))
  collections.then((res) => {
    let docsInCollection = res._snapshot.docChanges

    // 해당 그룹안에 있는 docs(키워드) 순회
    for(let i=0; i< docsInCollection.length; i++) {
      let groupName = docsInCollection[i].doc.data.value.mapValue.fields.groupName.stringValue
      groups.push(groupName)
    }
  })
  console.log("==", groups)
  return groups
}

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

function getBubblechartData() {
  let result = new Object()
  
  // 키워드 { 문장: 문장, 카운트: 카운트}
  const collections = getDocs(collection(db, "bubbleChart"))
  collections.then((res) => {
    let docsInCollection = res._snapshot.docChanges
    
    // 해당 그룹안에 있는 docs(키워드) 순회
    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let keyword = path[path.length-1]
      result[keyword] = []

      let fields = docsInCollection[i].doc.data.value.mapValue.fields
      fields = Object.entries(fields)
      for (let j=0; j<fields.length; j++) {
        let count = fields[j][1].mapValue.fields.count.integerValue
        let sentence = fields[j][1].mapValue.fields.sentence.stringValue
        let sub = {
          "sentence": sentence,
          "count": count,
        }
        result[keyword].push(sub)
      }

    }
  })
  return result
}

// 카운트 수정
function updateCount(group, keyword, sentenceId) {
  // console.log(doc(db, group, keyword))
  let a = getDocs(collection(db, group))
  a.then((res) => {
    console.log("++", res)
  })

  const findDoc = getDoc(doc(db, group, keyword))
  let changeContent = new Object()
  changeContent[sentenceId] = new Object()

  // console.log(findDoc)
  findDoc.then((res) => {
    console.log(res)
    // let docsInCollection = res._document.data.value.mapValue.fields.values()
    // console.log(docsInCollection)
    // // let docToModify = docsInCollection[sentenceId].mapValue.fields
    // console.log("+++", docsInCollection)
    // changeContent[sentenceId]["group"] = docToModify["group"]
    // changeContent[sentenceId]["sentence"] = docToModify["sentence"]
    // changeContent[sentenceId]["count"] = docToModify["count"]
    // console.log(changeContent, docToModify["group"])
    // changeContent[sentenceId]["count"]["integerValue"] = (parseInt(docToModify["count"].integerValue) + 1).toString()
  })
  updateDoc(doc(db, group, keyword), changeContent)
  
  console.log(group, keyword, sentenceId)
}

// 키워드 삭제 api
// function deleteKeyword(group, keyword) {
//   deleteDoc(doc(db, group, keyword));
// }


// // 데이터 수정 => 문장 수정할시..?
// function modifyData(group, keyword, sentenceId, changeCount, changeGroup, changeSentence) {
//   console.log("들와따")
//   // const findDoc = getDocs(collection(db, group));
//   const findDoc = getDoc(doc(db, group, keyword))
//   findDoc.then((res) => {
//     let docsInCollection = res._document.data.value.mapValue.fields
//     let docToModify = docsInCollection[sentenceId]
//     console.log("== 변경 전", docToModify)

//     // 수정
//     docToModify[count] = changeCount
//     docToModify[group] = changeGroup
//     docToModify[sentence] = changeSentence

//     console.log("== 변경 후", docToModify)
//   })
// }


// 함수 실행
// setData(group, keyword, sentences, totalCount)
setData("임원", "팀플", ["어려워요", "재미있어요", "꺌꺌꺌"], 30)
setData("임원", "분담", ["짜릿해요", "호로록", "꺄르륵"], 30)
setData("팀원", "업무", ["힘들어요", "뭔소린지", "모르겠어요"], 30)

console.log("getTotalData", getTotalData())

// addGroups (group)
addGroups("임원")
addGroups("팀원")

// 버블차트 데이터
setBubblechartData("keyword", ["sentence1", "sentence2", "sentence3"], [20, 20, 20])
setBubblechartData("하이하이", ["짜릿해요", "호로록", "꺄르륵"], [20, 20, 20])
getBubblechartData()

// 삭제
// deleteKeyword("임원", "팀플")

// 카운트 수정
updateCount("임원", "분담", 0)
updateCount("임원", "분담", 0)

// function setTotalData(id, group, keyword, sentenceList, totalCount) {
//   // collection: data, doc: id, 필드안에 다 넣기
//   let data = {}
  
//   data[group] = []
//   for (let i=0; i < sentenceList.length; i++) {
//     let sub = {}
//     sub[i] = {
//       "sentence": sentenceList[i],
//       "count": 0,
//       "group": group
//     }
//     data[group].push(sub)
//   }

//   data["keyword"] = keyword
//   data["totalCount"] = totalCount
//   setDoc(doc(db, "DATA", id), data)
// }
// setTotalData("0", "group1", "keyword1", ["sentence1", "sentence2", "sentence3"], 30)
// setTotalData("0", "group2", "keyword1", ["sentence1", "sentence2", "sentence3"], 30)
// setTotalData("1", "group2", "keyword2", ["sentence1", "sentence2", "sentence3"], 30)
// setTotalData("2", "group3", "keyword3", ["sentence1", "sentence2", "sentence3"], 30)




// 그룹 함수, 

















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