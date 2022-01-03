<template>
  <div id="app" class="container">
    <div v-if="authorized">
      <h1 class="center m-3">Data Collections</h1>
      <div class="w-60 center pb-3 under-line">
        <h2 class="center p-2">Group Name</h2>
        <v-row>
          <v-col cols="4">
            <input 
              v-model="group1" 
              type="text" 
              class="w-100 outline p-1" 
              placeholder="Enter Group1">
          </v-col>
          <v-col cols="4">
            <input 
              v-model="group2" 
              type="text" 
              class="w-100 outline p-1" 
              placeholder="Enter Group2">
          </v-col>
          <v-col cols="4">
            <input 
              v-model="group3" 
              type="text" 
              class="w-100 outline p-1"  
              placeholder="Enter Group3">
          </v-col>
        </v-row>
      </div>
      <div class="w-60 center">
        <v-row class="p-2 under-line" v-for="(data, idx) in data_collections" :key="idx">
          <v-col class="col-12">
            <h2 class="idx">{{ idx+1 }}번 데이터</h2>
          </v-col>
          <v-col class="col-4">
            <h3>Keyword</h3>
            <input 
              v-model="data.keyword" 
              type="text" 
              class="w-100 outline p-1" 
              placeholder="Keyword">
          </v-col>
          <v-col class="col-4">
            <h3>Group</h3>
            <select 
              v-model="data.group" 
              type="text" 
              class="w-100 outline p-1" 
              placeholder="Group">
              <option :value="group1">{{ group1 }}</option>
              <option :value="group2">{{ group2 }}</option>
              <option :value="group3">{{ group3 }}</option>
            </select>
          </v-col>
          <v-col class="col-4">
            <h3>Total Count</h3>
            <input 
              v-model="data.totalcount" 
              type="text" 
              class="w-100 outline p-1" 
              placeholder="Total Count">
          </v-col>
          <v-col class="col-12">
            <h3>Sentences</h3>
            <v-col class="col-12">
            <input 
              v-model="data.sentences[0]"
              type="text" 
              class="w-100 outline p-1" 
              placeholder="First Sentence" >
            </v-col>
            <v-col class="col-12">
            <input 
              v-model="data.sentences[1]" 
              type="text" 
              class="w-100 outline p-1" 
              placeholder="Second Sentence" >
            </v-col>
            <v-col class="col-12">  
            <input 
              v-model="data.sentences[2]" 
              type="text" 
              class="w-100 outline p-1" 
              placeholder="Third Sentence">
            </v-col>
          </v-col>
          <div class="center">
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
      <div class="right m-3 absolute">
        <v-btn
          dark
          color="indigo"
          class="btn m-1"
          @click="addData"
        >
          <v-icon left>mdi-plus</v-icon>
          NEW DATA
        </v-btn>
        <v-btn
          dark
          color="red"
          class="btn m-1"
          @click="refreshData"
        >
          <v-icon left>mdi-delete</v-icon>
          DELETE ALL DATA
        </v-btn>
        <v-btn
          dark
          color="primary"
          class="btn m-1"
          @click="submit"
        >
          <v-icon left>mdi-pencil</v-icon>
          SAVE
        </v-btn>
      </div>
    </div>
    <PasswordCheck v-else v-on:checkPassword="checkPassword" />
  </div>
</template>

<script>
import firebase from "@/firebase.js"
import PasswordCheck from "@/components/PasswordCheck.vue"

export default {
  name: "Update",
  data() {
    return {
      authorized: false,
      group1: null,
      group2: null,
      group3: null,
      data_collections: [],
    }
  },
  components: {
    PasswordCheck
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
      else {
        var data = []
        var error = false
        this.data_collections.forEach(element => {
          var keyword = element["keyword"]
          var totalCount = element["totalcount"]
          var group = element["group"]
          var sentences = []
          if (!keyword || !totalCount || !group) {
            error = true
          }
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
        if (error) {
          return alert('입력 데이터를 확인해주세요.')
        }
        else {
          firebase.setData(data)
          alert('변경이 완료되었습니다.')
        }
      }
    },
    checkPassword() {
      this.authorized = true
    }
  }
};
</script>

<style scoped>
.w-100 {
  width: 100%;
  max-width: 1000px;
}
.w-60 {
  width: 60%;
  max-width: 1000px;
}
.outline {
  outline: 0.5px solid rgb(180, 185, 190) ;
  border-radius: 5px;
}
.center {
  margin: 0 auto;
  text-align: center;
}
.m-3 {
  margin: 3rem!important;
}
.m-1 {
  margin: 0.2rem;
}
.p-2 {
  padding: 2rem 0;
}
.p-1 {
  padding: 0.5rem;
}
.pb-3 {
  padding-bottom: 3rem !important;
}
.under-line {
  border-bottom: 0.1rem solid rgb(168, 168, 168);
}
.right {
  display: flex;
  flex-direction: column;
}
.absolute {
  position: fixed;
  right: 5px; bottom: 5px;
}
</style>
