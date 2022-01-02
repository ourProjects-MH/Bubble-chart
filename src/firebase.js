import { initializeApp } from "firebase/app"
import { deleteDoc, getFirestore } from "firebase/firestore"
import { doc } from "firebase/firestore"
import { setDoc } from "firebase/firestore"
import { collection, getDocs } from "firebase/firestore";
import {  updateDoc, getDoc, increment } from "firebase/firestore";
import firebaseConfig from '../firebaseConfig.js'
initializeApp(firebaseConfig);

const db = getFirestore();

// 버블 데이터 반환
async function getTotalData() {
  let groupNameList = await getGroups()
  let result = {}

  // 키워드별 센텐스 빈 배열 생성
  for (let i in groupNameList) {
    const collections = await getDocs(collection(db, groupNameList[i]))
    collections.forEach((document) => {
      let keyword = document.id
      result[keyword] = {}
      result[keyword]["sentences"] = []
    })
  }

  // 키워드별 sentence 삽입 
  for (let i in groupNameList) {
    const collections = await getDocs(collection(db, groupNameList[i]))

    let docs = collections.docs
    for(let d=0; d<docs.length; d++) {
      let keyword = docs[d].id
      result[keyword]["totalCount"]  = await getTotalCountByKeyword(keyword)

      let dataObject = docs[d].data()
      for(let i in dataObject) {
        if (i === "totalCount") continue
        let sub = {}

        sub["sentence"] = dataObject[i].sentence
        sub["group"] = dataObject[i].group
        sub["count"] = dataObject[i].count.toString()
        sub["id"] = parseInt(i)
        result[keyword]["sentences"].push(sub)
      }
    }
  }
  return result
}

// // 기존 데이터(키워드, 그룹) 삭제
async function deleteOriginalData() {
  let removeList = []
  for (let word of ["Groups", "Keywords"]) {
    const collections = await getDocs(collection(db, word))
    collections.forEach((document) => {
      let word = document.id
      removeList.push(word)
    })
  }
  for (let word of removeList) {
    const collections = await getDocs(collection(db, word))
    let docs = collections.docs
    for(let d=0; d<docs.length; d++) {
      let keyword = docs[d].id
      deleteDoc(doc(db, word, keyword))
    }
  }
}

// 데이터 추가
async function setData(dataCollection) {
  let keywords = []
  
  // 기존 데이터 삭제
  await deleteOriginalData()

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


// 계급데이터 가져오기
async function getDataByGroups() {
  let groupNameList = await getGroups()
  let result = {}

  // 키워드당 빈 배열을 만들어주기
  for (let i in groupNameList) {
    const collections = await getDocs(collection(db, groupNameList[i]))
    collections.forEach((document) => {
      result[document.id] = {}
    })
  }

  // 그룹 순회하며 하나씩 가져오기
  for (let i in groupNameList) {
    const collections = await getDocs(collection(db, groupNameList[i]))
    let group = groupNameList[i]
    collections.forEach((document) => {
      let keyword = document.id
      result[keyword][group] = document.data().totalCount
    })
  }
  return result
}

// 비밀번호 수정/저장
function setPassword (password) {
  deleteDoc(doc(db, "Password", "password"));
  setDoc(doc(db, "Password", "password"), {"password": password})
}

async function getPassword () {
  let passwordDoc = await getDoc(doc(db, "Password", "password"))
  return passwordDoc.data().password
}

// 그룹 데이터 저장
async function setGroups (groups) {
  // 원래 있던 그룹들 삭제
  const collections = await getDocs(collection(db, "Groups"))
  collections.forEach((document) => {
    deleteDoc(doc(db, "Groups", document.data().groupName))
  })
  // 들어온 그룹으로 설정
  for (let group of groups) {
    setDoc(doc(db, "Groups", group), {"groupName": group})
  }
}
// setGroups(["임원&실장", "중간관리자&팀장", "팀원"])

// 그룹 가져오는 api
async function getGroups() {
  let groups = {}
  let groupNumber = 0
  const collections = await getDocs(collection(db, "Groups"))
  collections.forEach((document) => {
    groups[groupNumber] = document.data().groupName
    groupNumber += 1
  })
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
    collections.forEach((document) => {
      let keyword = document.id
      keywordList.push(keyword)
      result[keyword] = {}
    })
  }

  // 키워드 중복 제거
  keywordList = Array.from(new Set(keywordList))

  // 그룹 순회하며 하나씩 가져오기
  for (let keyword of keywordList) {
    const collections = await getDocs(collection(db, keyword))
    collections.forEach((document) => {
      let group = document.id
      result[keyword][group] = {
        "totalCount": document.data().totalCount,
        "sentences": document.data().sentences
      }
    })
  }
  console.log(result)
  return result
}
export default { getTotalData, getGroups, getDataByGroups, getCurrentData, setData, getPassword, setPassword, updateCount, setGroups }