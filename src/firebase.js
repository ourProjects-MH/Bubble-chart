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
  return result
}

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


// 계급데이터 가져오기
async function getDataByGroups() {
  let groupNameList = await getGroups()
  let result = {}

  // 키워드당 빈 배열을 만들어주기
  for (let i in groupNameList) {
    const collections = await getDocs(collection(db, groupNameList[i]))
    let docsInCollection = collections._snapshot.docChanges
    
    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let keyword = path[path.length-1]
      result[keyword] = {}
    }
  }

  // 그룹 순회하며 하나씩 가져오기
  for (let i in groupNameList) {
    const collections = await getDocs(collection(db, groupNameList[i]))
    let group = groupNameList[i]
    let docsInCollection = collections._snapshot.docChanges
    
    // 해당 그룹안에 있는 docs(키워드) 순회
    for(let i=0; i< docsInCollection.length; i++) {
      let path = docsInCollection[i].doc.key.path.segments
      let keyword = path[path.length-1]

      let value = docsInCollection[i].doc.data.value.mapValue.fields
      result[keyword][group] = value["totalCount"].integerValue
    }
  }
  return result
}

// 비밀번호 저장
function setPassword (password) {
  deleteDoc(doc(db, "Password", "password"));
  setDoc(doc(db, "Password", "password"), {"password": password})
}

async function getPassword () {
  let passwordDoc = await getDoc(doc(db, "Password", "password"))
  return passwordDoc.data().password
}

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
  
}

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
  return result
}

export default { getTotalData, getGroups, getDataByGroups, getCurrentData, setData, getPassword, setPassword }