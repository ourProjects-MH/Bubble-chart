<template>
  <div id="app" class="container">
    <div v-if="authorized">
      <h1>Data Collections</h1>
      <div class="section">
        <div class="data" v-for="(data, idx) in data_collections" :key="idx">
          <div class="idx">{{ idx+1 }}.</div>
          <div class="form-group">
            <div class="form-title">Keyword</div>
            <input 
              v-model="data.keyword" 
              type="text" 
              class="form-control" 
              placeholder="Keyword">
          </div>
          <div class="form-group">
            <div class="form-title">Group</div>
            <select 
              v-model="data.group" 
              type="text" 
              class="form-control" 
              placeholder="Group">
              <option :value="group1">{{ group1 }}</option>
              <option :value="group2">{{ group2 }}</option>
              <option :value="group3">{{ group3 }}</option>
            </select>
          </div>
          <div class="form-group">
            <div class="form-title">Total Count</div>
            <input 
              v-model="data.totalcount" 
              type="text" 
              class="form-control" 
              placeholder="Total Count">
          </div>
          <div class="form-group">
            <div class="form-title">Sentences</div>
            <input 
              v-model="data.sentences[0]"
              type="text" 
              class="form-control" 
              placeholder="First Sentence" 
              >
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
          <div class="btn-container">
            <v-btn
              @click="removeData(idx)"
              dark
              color="error"
              class="btn"
            >
              <v-icon left>
                mdi-pencil
              </v-icon>
              Remove Data
            </v-btn>
          </div>
        </div>
      </div>

      <div class="btn-container">
        <v-btn
          @click="addData"
          dark
          color="success"
          class="btn"
        >
          <v-icon left>
            mdi-pencil
          </v-icon>
          Add Data
        </v-btn>
      </div>
      <div class="btn-container">
        <v-btn
          @click="submit"
          dark
          color="primary"
          class="btn"
        >
          <v-icon left>
            mdi-pencil
          </v-icon>
          Save
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
    this.fetchData();
  },
  methods: {
    fetchData() {
      const loadgroups = firebase.getGroups()
      const loaddata = firebase.getCurrentData()
      
      loaddata.then((res) => {
        loadgroups.then((groups) => {
          this.group1 = groups[0]
          this.group2 = groups[1]
          this.group3 = groups[2]

          for (var keyword in res) {
            for (var group in res[keyword]) {
              console.log(group)
              this.data_collections.push({
                keyword: keyword,
                group: group,
                totalcount: res[keyword][group]["totalCount"],
                sentences: res[keyword][group]["sentences"],
              })
              console.log(this.data_collections)
            }
            // var sentences = []
            // for (var i in res[el]["sentences"]) {
            //   sentences.push(res[el]["sentences"][i]["sentence"])
            // }
          }

        })
      
      })
    },
    addData () {
      this.data_collections.push({
        keyword: "new keyword",
        group: this.group1,
        totalCount: 0,
        sentences: []
      })
    },
    removeData(idx) {
      this.data_collections.splice(idx, 1)
    },
    submit () {
      var data = []
      for (var i in this.data_collections) {
        var keyword = this.data_collections[i]["keyword"]
        var totalCount = this.data_collections[i]["totalcount"]
        var group = this.data_collections[i]["group"]
        var sentences = []
        for (var s in this.data_collections[i]["sentences"]) {
          if (this.data_collections[i]["sentences"][s]) {
            sentences.push(this.data_collections[i]["sentences"][s])
          }
        }
        data.push({
          keyword: keyword,
          group: group,
          totalCount: parseInt(totalCount),
          sentences: sentences
        })
      }
      firebase.setData(data)

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
.form-group {
  padding: 0.7rem 0;
}
.form-control {
  width: 100%;
  outline: 0.5px solid rgb(180, 185, 190) ;
  border-radius: 5px;
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
}
.section {
  border-bottom: 2px solid rgb(61, 63, 65);
  margin: 3rem;
}
.password-section {
  margin: 5rem;
}
.data {
  border-bottom: 1px solid rgb(206, 212, 218);
}
.form-title {
  font-weight: bold;
}
.idx {
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1.5rem;
}
.btn-container {
  display: flex;
  justify-content: center;
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
