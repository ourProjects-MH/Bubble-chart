<template>
  <div id="app" class="container">
    <div v-if="authorized">
      <h1 class="center section-title">Data Collections</h1>
      <div class="w-80 center">
        <h2 class="center section-title">Group Name</h2>
        <v-row>
          <v-col cols="4">
            <input 
              v-model="group1" 
              type="text" 
              class="w-80 outline form-control" 
              placeholder="Enter Group1">
          </v-col>
          <v-col cols="4">
            <input 
              v-model="group2" 
              type="text" 
              class="w-80 outline form-control" 
              placeholder="Enter Group2">
          </v-col>
          <v-col cols="4">
            <input 
              v-model="group3" 
              type="text" 
              class="w-80 outline form-control" 
              placeholder="Enter Group3">
          </v-col>
        </v-row>
      </div>
      <div class="w-80 center">
        <v-row class="under-line" v-for="(data, idx) in data_collections" :key="idx">
          <v-col class="col-12">
            <div class="idx">{{ idx+1 }}번 데이터</div>
          </v-col>
          <v-col class="col-4">
            <div class="form-title">Keyword</div>
            <input 
              v-model="data.keyword" 
              type="text" 
              class="w-80 outline form-control" 
              placeholder="Keyword">
          </v-col>
          <v-col class="col-4">
            <div class="form-title">Group</div>
            <select 
              v-model="data.group" 
              type="text" 
              class="w-80 outline form-control" 
              placeholder="Group">
              <option :value="group1">{{ group1 }}</option>
              <option :value="group2">{{ group2 }}</option>
              <option :value="group3">{{ group3 }}</option>
            </select>
          </v-col>
          <v-col class="col-4">
            <div class="form-title">Total Count</div>
            <input 
              v-model="data.totalcount" 
              type="text" 
              class="w-80 outline form-control" 
              placeholder="Total Count">
          </v-col>
          <v-col class="col-12">
            <div class="form-group">
              <div class="form-title">Sentences</div>
              <input 
                v-model="data.sentences[0]"
                type="text" 
                class="form-control" 
                placeholder="First Sentence" >
              <input 
                v-model="data.sentences[1]" 
                type="text" 
                class="form-control" 
                placeholder="Second Sentence" >
              <input 
                v-model="data.sentences[2]" 
                type="text" 
                class="form-control" 
                placeholder="Third Sentence">
            </div>
          </v-col>
          <div class="btn-container center">
            <v-btn
              fab
              @click="removeData(idx)"
              dark
              color="error"
              class="btn"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-row>
      </div>
      <div class="btn-container">
        <v-btn
          dark
          color="primary"
          class="btn"
          @click="submit"
        >
          <v-icon left>mdi-pencil</v-icon>
          SAVE
        </v-btn>
        <v-btn
          dark
          color="indigo"
          class="btn"
          @click="addData"
        >
          <v-icon left>mdi-plus</v-icon>
          NEW DATA
        </v-btn>
        <v-btn
          dark
          color="red"
          class="btn"
          @click="refreshData"
        >
          <v-icon left>mdi-delete</v-icon>
          DELETE ALL DATA
        </v-btn>
      </div>
    </div>
    <div v-else>
      <h1>Enter Your Password</h1>
      <div class="password-section">
        <div class="form-group">
          <div class="form-title">Password</div>
            <input 
              v-model="password" 
              type="password" 
              class="form-control" 
              placeholder="Enter Password">

            <div class="btn-container">
              <v-btn
                @click="checkPassword"
                dark
                color="primary"
                class="btn"
              >
                Login
              </v-btn>
            </div>
            <router-link :to="{name: 'PasswordChange'}">비밀번호 변경하기</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "@/firebase.js"

export default {
  name: "App",
  
  data() {
    return {
      authorized: false,
      password: '',
      group1: null,
      group2: null,
      group3: null,
      data_collections: [],
    }
  },
  mounted() {
    this.fetchGroup();
  },
  methods: {
    fetchGroup() {
      const loadgroups = firebase.getGroups()
      loadgroups.then((groups) => {
        this.group1 = groups[0]
        this.group2 = groups[1]
        this.group3 = groups[2]
        this.fetchData()
      })
    },
    fetchData() {
      const loaddata = firebase.getCurrentData()
      loaddata.then((res) => {
        Object.entries(res).forEach(([keyword, keyword_data]) => {
          Object.entries(keyword_data).forEach(([level, data]) => {
            this.data_collections.push({
              keyword: keyword,
              group: level,
              totalcount:data["totalCount"],
              sentences: data["sentences"],
            })
          })
        });
      })
    },
    addData () {
      this.data_collections.push({
        keyword: "",
        group: this.group1,
        totalCount: 0,
        sentences: []
      })
    },
    removeData(idx) {
      this.data_collections.splice(idx, 1)
    },
    refreshData() {
      this.data_collections = []
    },
    submit () {
      if (!this.authorized) {
        return alert('비밀번호를 먼저 확인해주세요.')
      }
      var data = []
      this.data_collections.forEach(element => {
        var keyword = element["keyword"]
        var totalCount = element["totalcount"]
        var group = element["group"]
        var sentences = []
        element["sentences"].forEach(sentence => {
          if (sentence) {
            sentences.push(sentence)
          }
        });
        data.push({
          keyword: keyword,
          group: group,
          totalCount: parseInt(totalCount),
          sentences: sentences
        })
      });
      firebase.setData(data)
      alert('변경이 완료되었습니다.')
    },
    checkPassword() {
      const loadpassword = firebase.getPassword()
      loadpassword.then((res) => {
        if (this.password === res) {
          this.authorized = true
        }
        else {
          alert('비밀번호를 잘못 입력하셨습니다.')
        }
      })
    }
  }
};
</script>

<style>
.w-80 {
  width: 80%;
  max-width: 1000px;
}
.outline {
  outline: 0.5px solid rgb(180, 185, 190) ;
  border-radius: 5px;
}
.form-control {
  padding: 0.3rem 0.5rem;
  margin: 0.2rem;
}
.center {
  margin: 0 auto;
  text-align: center;
}
.section {
  border-bottom: 2px solid rgb(61, 63, 65);
  padding: 2rem 0;
}
.password-section {
  margin: 5rem;
}
.under-line {
  border-bottom: 1px solid rgb(206, 212, 218);
}
.section-title { 
  font-weight: bold;
  margin: 1rem;
}
.idx {
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1.5rem;
}
.btn-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  align-items: flex-end;
}
.btn {
  margin: 0 auto;
  margin-bottom: 1rem;
}
.password-control {
  width: 30vw;
  min-width: 50px;
  max-width: 1000px;
  outline: 0.5px solid rgb(180, 185, 190) ;
  border-radius: 5px;
  padding: 1rem 1rem;
}
</style>
