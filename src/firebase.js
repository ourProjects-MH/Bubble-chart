import { initializeApp } from "firebase/app"
import { deleteDoc, getFirestore } from "firebase/firestore"
// import { getDocs, collection } from "firebase/firestore"
import { doc } from "firebase/firestore"
import { setDoc } from "firebase/firestore"
// import { deleteDoc } from "firebase/firestore"
import { collection, getDocs } from "firebase/firestore";
import {  updateDoc, getDoc, increment } from "firebase/firestore";
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

  // 키워드별 센텐스 빈 배열 생성
  for (let i in groupNameList) {
    const collections = await getDocs(collection(db, groupNameList[i]))
    let docsInCollection = collections._snapshot.docChanges

    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let keyword = path[path.length-1]

      result[keyword] = {}
      result[keyword]["sentences"] = []
    }
  }

  // 키워드별 sentence 삽입 
  for (let i in groupNameList) {
    const collections = await getDocs(collection(db, groupNameList[i]))
    
    let docsInCollection = collections._snapshot.docChanges
      // 해당 그룹안에 있는 docs(키워드) 순회
    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let keyword = path[path.length-1]

      let sentences = docsInCollection[i].doc.data.value.mapValue.fields
      
      result[keyword]["totalCount"] = await getTotalCountByKeyword(keyword)
      
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
  }
  console.log("버블데이터", result)
  return result
}

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

// 기존 데이터 삭제
async function deleteOriginalData() {
  let removeList = []
  for (let word of ["Groups", "Keywords"]) {
    const collections = await getDocs(collection(db, word))
    let docsInCollection = collections._snapshot.docChanges
  
    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let word = path[path.length-1]
      removeList.push(word)
    }
  }
  for (let word of removeList) {
    const collections = await getDocs(collection(db, word))
    let docsInCollection = collections._snapshot.docChanges
  
    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let docName = path[path.length-1]
      await deleteDoc(doc(db, word, docName))
    }
  }
}

// 데이터 추가
async function setData(dataCollection) {
  console.log(dataCollection)
  // 그룹이랑 키워드 collection 돌면서 다 삭제한다.
  // 만약 키워드 네임을 수정했을 경우, 기존 키워드는 컬렉션에 남아있음.
  // 하지만 문제될거는 없을 것 같음
  // 그룹만 변동사항 없으면 될 것 같음.
  // 키워드 컬렉션 하나 만들어서 키워드 넣기.
  
  // 기존 데이터 삭제
  await deleteOriginalData()
  let keywords = []
  // 그룹별로 저장
  for (let i in dataCollection) {
    
    let data = new Object()
    let keyword = dataCollection[i]["keyword"]
    let group = dataCollection[i]["group"]

    // 키워드 따로 저장
    keywords.push(keyword)

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
  
  // 키워드만 저장
  keywords = Array.from(new Set(keywords))
  for (let i in keywords) {
    await setDoc(doc(db, "Keywords", keywords[i]), {"keywords": keywords[i]})
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

// 키워드별 문장들
// async function sentencesByKeyword(keyword) {
//   let result = {}
//   const collections = await getDocs(collection(db, keyword))
//   collections.forEach((document) => {
//     let path = document._key.path.segments
//     let group = path[path.length-1]

//     let sentences = document.data().sentences
//     result[group] = sentences
//   })
//   return result
// }
// sentencesByKeyword("keyword1")

// 계급데이터 가져오기
// async function getDataByGroups() {
//   let groupNameList = await getGroups()
//   let result = {}

//   // 키워드당 빈 배열을 만들어주기
//   for (let i in groupNameList) {
//     const collections = await getDocs(collection(db, groupNameList[i]))
//     let docsInCollection = collections._snapshot.docChanges
    
//     for(let i=0; i< docsInCollection.length; i++) {
//       let path = docsInCollection[i].doc.key.path.segments
//       let keyword = path[path.length-1]
//       result[keyword] = {}
//     }
//   }

//   // 그룹 순회하며 하나씩 가져오기
//   for (let i in groupNameList) {
//     const collections = await getDocs(collection(db, groupNameList[i]))
//     let group = groupNameList[i]
//     let docsInCollection = collections._snapshot.docChanges
    
//     // 해당 그룹안에 있는 docs(키워드) 순회
//     for(let i=0; i< docsInCollection.length; i++) {
//       let path = docsInCollection[i].doc.key.path.segments
//       let keyword = path[path.length-1]

//       // let pushData = {}
//       let value = await getTotalCountByKeyword(keyword)
//       result[keyword][group] = value
//       // pushData[group] = value
//       // console.log(pushData)
//       // result[keyword].push(pushData)
//     }
//   }
//   console.log("계급데이터", result)
//   return result
// }
// getDataByGroups()

// 그룹 데이터 저장
// function addGroups (groups) {
//   for (let group in groups) {
//     setDoc(doc(db, "Groups", groups[group]), {"groupName": groups[group]})
//   }
// }
// 비밀번호 저장
// function setPassword (password) {
//   setDoc(doc(db, "Password", "password"), {"password": password})
// }
// setPassword("admin")

// async function getPassword () {
//   let passwordDoc = await getDoc(doc(db, "Password", "password"))
//   console.log(passwordDoc)
// }

// 비밀번호 수정
// function updatePassword(newPassword) {
//   deleteDoc(doc(db, "Password", "password"));
//   setDoc(doc(db, "Password", "password"), {"password": newPassword})
// }
// updatePassword("admin2")

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
async function updateCount(group, keyword, sentenceId) {
  const findDoc = await getDoc(doc(db, group, keyword))
  let changeContent = {}

  let fieldToModify = findDoc.data()[sentenceId]
    
    let cur_group = fieldToModify["group"]
    let cur_sentence = fieldToModify["sentence"]
    let cur_count = (parseInt(fieldToModify["count"]) + 1)
    
    changeContent[sentenceId] = {
      "count": increment(cur_count),
      "group": cur_group,
      "sentence": cur_sentence
    }

    updateDoc(doc(db, group, keyword), changeContent)
  
  console.log("changeContent: ", changeContent)

}

// ======= 수정할 때 보여줄 데이터 ======
// 키워드1 : {
//   직급1,
//   토탈카운트,
//   문장
//   }

async function getCurrentData() {
  // 키워드 배열 생성
  let groupNameList = await getGroups()
  let result = {}
  let keywordList = []

  // 키워드당 빈 배열을 만들어주기
  for (let i in groupNameList) {
    const collections = await getDocs(collection(db, groupNameList[i]))
    let docsInCollection = collections._snapshot.docChanges
    
    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let keyword = path[path.length-1]
      keywordList.push(keyword)
      result[keyword] = {}
    }
  }
  // 키워드 중복 제거
  keywordList = Array.from(new Set(keywordList))

  // 그룹 순회하며 하나씩 가져오기
  for (let i in keywordList) {
    const collections = await getDocs(collection(db, keywordList[i]))
    let keyword = keywordList[i]
    let docsInCollection = collections._snapshot.docChanges

    // 해당 그룹안에 있는 docs(키워드) 순회
    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let group = path[path.length-1]
      let fieldsInDoc = docsInCollection[i].doc.data.value.mapValue.fields

      let totalCount = fieldsInDoc.totalCount.integerValue
      let sentencesObject = fieldsInDoc.sentences.arrayValue.values
      let sentences = []
      for (let i in sentencesObject) {
        sentences.push(sentencesObject[i].stringValue)
      }
      result[keyword][group] = {
        "totalCount": totalCount,
        "sentences": sentences
      }
    }
  }
  console.log("result: ", result)
}
getCurrentData()
// 키워드 삭제 api
// function deleteKeyword(group, keyword) {
//   deleteDoc(doc(db, group, keyword));
// }

// docs 데이터 삭제
// async function deleteDocs(collectionName) {
//   const collections = await getDocs(collection(db, collectionName))

//   collections.forEach((document) => {
//     console.log(document.data().group)
//     deleteDoc(doc(db, collectionName, document.data().groupName));
//   })
// }



// addGroups(["group1", "group2", "group3"])
setData([
  {
    "group": "group1",
    "keyword": "keyword1",
    "totalCount": 10,
    "sentences": ["어려워요group1", "재미있어요", "꺌꺌꺌"],
  },
  {
    "group": "group1",
    "keyword": "keyword2",
    "totalCount": 10,
    "sentences": ["어려워요2group1", "재미있어요2", "꺌꺌꺌2"],
  },
  {
    "group": "group2",
    "keyword": "keyword1",
    "totalCount": 20,
    "sentences": ["어려워요group2", "재미있어요", "꺌꺌꺌"],
  },
  {
    "group": "group3",
    "keyword": "keyword1",
    "totalCount": 30,
    "sentences": ["어려워요group3", "재미있어요", "꺌꺌꺌"],
  }
])
getTotalData()

updateCount("group1", "keyword1", 0)
updateCount("group1", "keyword1", 0)
updateCount("group1", "keyword1", 0)
// 삭제
// deleteKeyword("임원", "팀플")
// deleteDocs("Groups")
// 카운트 수정
// updateCount("임원", "분담", 2, 1)
// updateCount("임원", "팀플", 2, 1)






