import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getDocs, collection } from "firebase/firestore"
import { doc } from "firebase/firestore"
import { setDoc } from "firebase/firestore"
import { deleteDoc } from "firebase/firestore"
// import { collection,  addDoc } from "firebase/firestore";
// import {  updateDoc, getDoc } from "firebase/firestore";
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

// 데이터 반환
async function getTotalData() {
  let groupNameList = await getGroups()
  let result = {}

  // 그룹 순회하며 하나씩 가져오기
  for (let i in groupNameList) {
    const collections = await getDocs(collection(db, groupNameList[i]))
    
    let docsInCollection = collections._snapshot.docChanges
      // 해당 그룹안에 있는 docs(키워드) 순회
    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let keyword = path[path.length-1]


      result[keyword] = {}
      result[keyword]["sentences"] = []

      let sentences = docsInCollection[i].doc.data.value.mapValue.fields
      
      result[keyword]["totalCount"] = sentences.totalCount.integerValue
      
      sentences = Object.entries(sentences)
      console.log("!!!!!!", sentences)

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
  }
  return result
}

// 누적 totalCount
// function setTotalCount() {
  
// }

// export default {
//   getTotalData: async function() {
//     let groupNameList = await getGroups()
//     let result = {}
    
//     // 그룹 순회하며 하나씩 가져오기
//     for (let i in groupNameList) {
//       const collections = await getDocs(collection(db, groupNameList[i]))
      
//       let docsInCollection = collections._snapshot.docChanges
//         // 해당 그룹안에 있는 docs(키워드) 순회
//       for(let i=0; i< docsInCollection.length; i++) {
//         let path = docsInCollection[i].doc.key.path.segments
//         let keyword = path[path.length-1]
  
//         result[keyword] = {}
//         result[keyword]["sentences"] = []
  
//         let sentences = docsInCollection[i].doc.data.value.mapValue.fields
//         result[keyword]["totalCount"] = sentences.totalCount.integerValue
  
//         sentences = Object.entries(sentences)
        
//         for (let j=0; j<sentences.length-1; j++) {
//           let sub = {}
//           let countValue = sentences[j][1].mapValue.fields.count.integerValue
//           let group = sentences[j][1].mapValue.fields.group.stringValue
//           let sentence = sentences[j][1].mapValue.fields.sentence.stringValue
  
//           sub["sentence"] = sentence
//           sub["group"] = group
//           sub["count"] = countValue
//           sub["id"] = j
//           result[keyword]["sentences"].push(sub)
//         }
//         console.log("=====", result)
//       }
//     }
//     return result
//   }
// }
// 비밀번호 저장/가져오는 api

// 데이터 추가
async function setData(dataCollection) {
  let groups = []
  // 기존 데이터 삭제
  for (let i in dataCollection) {
    groups.push(dataCollection[i]["group"])
  }
  groups = new Set(groups)
  groups.forEach((g) => {
    deleteDocs(g)
  })

  // 그룹별로 저장
  for (let i in dataCollection) {
    
    let data = new Object()
    let keyword = dataCollection[i]["keyword"]
    let group = dataCollection[i]["group"]

    data["totalCount"] = dataCollection[i]["totalCount"]

    for (let j in dataCollection[i]["sentences"]) {
      data[j] = {
        "sentence": dataCollection[i]["sentences"][j],
        "count": 0,
        "group": group
      }
    }
    await setDoc(doc(db, group, keyword), data)
  }

  // 키워드별로 저장
  for (let i in dataCollection) {
    
    let data = new Object()
    let keyword = dataCollection[i]["keyword"]
    let group = dataCollection[i]["group"]

    data["totalCount"] = dataCollection[i]["totalCount"]
    data["sentences"] = dataCollection[i]["sentences"]

    await setDoc(doc(db, keyword, group), data)
  }
  
}

// 키워드별 토탈카운트
async function getTotalCountByKeyword(keyword) {
  let result = 0
  const collections = await getDocs(collection(db, keyword))
  collections.forEach((document) => {
    result += document.data().totalCount
  })
  return result
}
getTotalCountByKeyword("keyword1")

async function sentencesByKeyword(keyword) {
  let result = {}
  const collections = await getDocs(collection(db, keyword))
  collections.forEach((document) => {
    let path = document._key.path.segments
    let group = path[path.length-1]

    let sentences = document.data().sentences
    result[group] = sentences
  })
  return result
}
sentencesByKeyword("keyword1")

// 계급데이터 가져오기
async function getDataByGroups() {
  let groupNameList = await getGroups()
  let result = {}

  // 그룹 순회하며 하나씩 가져오기
  for (let i in groupNameList) {
    const collections = await getDocs(collection(db, groupNameList[i]))
    let group = groupNameList[i]
    let docsInCollection = collections._snapshot.docChanges

      // 해당 그룹안에 있는 docs(키워드) 순회
    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let keyword = path[path.length-1]

      result[keyword] = []

      let pushData = {}
      let r = getTotalCountByKeyword(keyword)
      r.then((res) => {
        pushData[group] = res
      })
      result[keyword].push(pushData)
    }
  }
  console.log("======", result)
  return result
}
getDataByGroups()

// 그룹 데이터 저장
function addGroups (groups) {
  for (let group in groups) {
    setDoc(doc(db, "Groups", groups[group]), {"groupName": groups[group]})
  }
}

// 비밀번호 저장
function setPassword (password) {
  setDoc(doc(db, "Password", "password"), {"password": password})
}
setPassword("admin")

// 비밀번호 수정
function updatePassword(newPassword) {
  deleteDoc(doc(db, "Password", "password"));
  setDoc(doc(db, "Password", "password"), {"password": newPassword})
}
updatePassword("admin2")

// 그룹 가져오는 api
async function getGroups() {
  let groups = {}
  const collections = await getDocs(collection(db, "Groups"))

  let docsInCollection = collections._snapshot.docChanges

  // 해당 그룹안에 있는 docs(키워드) 순회
  for(let i=0; i< docsInCollection.length; i++) {
    let groupName = docsInCollection[i].doc.data.value.mapValue.fields.groupName.stringValue
    groups[i] = groupName
  }
  return groups
}

// 카운트 수정
// function updateCount(group, keyword, sentenceId, countNumber) {
  
//   const findDoc = getDoc(doc(db, group, keyword))
//   let changeContent = {}
  
//   findDoc.then((res) => {
//     let docInCollection = res._document.data.value.mapValue.fields
//     let fieldToModify = docInCollection[sentenceId].mapValue.fields
    
//     let cur_group = fieldToModify["group"].stringValue 
//     let cur_sentence = fieldToModify["sentence"].stringValue 
//     // let cur_count = (parseInt(fieldToModify["count"].integerValue) + 1)
    
//     changeContent[sentenceId] = {
//       "count": increment(countNumber),
//       "group": cur_group,
//       "sentence": cur_sentence
//     }

//     updateDoc(doc(db, group, keyword), changeContent)
//   })
  
//   console.log("changeContent: ", changeContent)

// }

// 키워드 삭제 api
// function deleteKeyword(group, keyword) {
//   deleteDoc(doc(db, group, keyword));
// }

// docs 데이터 삭제
async function deleteDocs(collectionName) {
  console.log("in deleteDocs", collectionName)
  const collections = await getDocs(collection(db, collectionName))

  collections.forEach((document) => {
    console.log(document.data().group)
    deleteDoc(doc(db, collectionName, document.data().groupName));
  })
}



getTotalData()
// 함수 실행
// setData(group, keyword, sentences, totalCount)
addGroups(["group1", "group2", "group3"])

setData([
  {
    "group": "group1",
    "keyword": "keyword1",
    "totalCount": 30,
    "sentences": ["어려워요", "재미있어요", "꺌꺌꺌"],
  },
  {
    "group": "group1",
    "keyword": "keyword2",
    "totalCount": 30,
    "sentences": ["어려워요2", "재미있어요2", "꺌꺌꺌2"],
  },
  {
    "group": "group2",
    "keyword": "keyword1",
    "totalCount": 30,
    "sentences": ["어려워요", "재미있어요", "꺌꺌꺌"],
  },
  {
    "group": "group3",
    "keyword": "keyword1",
    "totalCount": 30,
    "sentences": ["어려워요", "재미있어요", "꺌꺌꺌"],
  }
])
// 삭제
// deleteKeyword("임원", "팀플")
// deleteDocs("Groups")
// 카운트 수정
// updateCount("임원", "분담", 2, 1)
// updateCount("임원", "팀플", 2, 1)






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 버블차트 데이터
// setBubblechartData("keyword", ["sentence1", "sentence2", "sentence3"], [20, 20, 20])
// setBubblechartData("하이하이", ["짜릿해요", "호로록", "꺄르륵"], [20, 20, 20])
// getBubblechartData()



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


// 버블차트 데이터 저장 api
// function setBubblechartData(keyword, sentences, count) {
//   let arrayData = {}
//   for (let i = 0; i< sentences.length; i++) {
//     let sub = {}
//     sub["sentence"] = sentences[i]
//     sub["count"] = count[i]

//     arrayData[i] = sub
//   }
//   setDoc(doc(db, "bubbleChart", keyword), arrayData)
// }

// function getBubblechartData() {
//   let result = new Object()
  
//   // 키워드 { 문장: 문장, 카운트: 카운트}
//   const collections = getDocs(collection(db, "bubbleChart"))
//   collections.then((res) => {
//     let docsInCollection = res._snapshot.docChanges
    
//     // 해당 그룹안에 있는 docs(키워드) 순회
//     for(let i=0; i< docsInCollection.length; i++) {
//       let path = docsInCollection[i].doc.key.path.segments
//       let keyword = path[path.length-1]
//       result[keyword] = []

//       let fields = docsInCollection[i].doc.data.value.mapValue.fields
//       fields = Object.entries(fields)
//       for (let j=0; j<fields.length; j++) {
//         let count = fields[j][1].mapValue.fields.count.integerValue
//         let sentence = fields[j][1].mapValue.fields.sentence.stringValue
//         let sub = {
//           "sentence": sentence,
//           "count": count,
//         }
//         result[keyword].push(sub)
//       }

//     }
//   })
//   return result
// }




