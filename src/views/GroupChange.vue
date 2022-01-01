<template>
  <div id="app" class="container">
    <h1>Change Groups</h1>
    <div class="password-section">
      <div class="form-group">
        <div class="form-title">Group</div>
        <input 
          v-model="group1" 
          type="text" 
          class="form-control" 
          placeholder="Enter Group1">
        <input 
          v-model="group2" 
          type="text" 
          class="form-control" 
          placeholder="Enter Group2">
        <input 
          v-model="group3" 
          type="text" 
          class="form-control" 
          placeholder="Enter Group3">
        
        <div class="btn-container">
          <v-btn
            @click="changeGroups"
            dark
            color="primary"
            class="btn"
          >
            Submit
          </v-btn>
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
      group1: '',
      group2: '',
      group3: '',
    }
  },
  mounted() {
    this.fetchGroups
  },
  methods: {
    fetchGroups() {
      const loadgroups = firebase.getGroups()
      loadgroups.then((groups) => {
        this.group1 = groups[0]
        this.group2 = groups[1]
        this.group3 = groups[2]
      })
    },
    changeGroups() {
      console.log('그룹 change')
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
