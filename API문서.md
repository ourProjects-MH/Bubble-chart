# 📃 API

| Description          | Function                                       | parameter                                                    | return                                                       | 비고           |
| -------------------- | ---------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------------- |
| 전체 데이터 가져오기 | getTotalData()                                 |                                                              | {키워드: {<br />"sentences": [<br />idx: {<br />"sentence": string,<br />"group": string,<br />"count": string,<br />"id": integer<br />}]<br />"totalCount": string<br />}<br />} |                |
| 데이터 저장          | setData(group, keyword, sentences, totalCount) | group: 그룹이름(string)<br />keyword: 키워드(string)<br />sentences: 키워드 관련 문구(Array)<br />totalCount: 키워드 카운트 |                                                              |                |
| 그룹 데이터 저장하기 | addGroups (group)                              | group: 그룹이름(string)                                      |                                                              |                |
| 그룹 데이터 가져오기 | getGroups()                                    |                                                              | [<br />idx: 그룹이름<br />]                                  | 백에서만 사용  |
| 카운트 수정          | updateCount(group, keyword, sentenceId)        | group: 그룹이름(string),<br />keyword: 키워드(string),<br />sentenceId: 문장 id(integer) |                                                              | count 1씩 증가 |
| 키워드 삭제          | deleteKeyword(group, keyword)                  | group: 그룹이름(string)<br />keyword: 키워드(string)         |                                                              |                |



## getTotalData()

![getTotalData](img/getTotalData.PNG)