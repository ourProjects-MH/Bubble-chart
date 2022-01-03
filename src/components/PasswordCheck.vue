<template>
  <div>
    <h1 class="center m-3">Enter Password</h1>
    <input 
      v-model="password" 
      type="password" 
      class="password-control block center"
      placeholder="Enter Password"
      @keyup.enter="checkPassword">
    <div class="btn-container">
      <v-btn
        @click="checkPassword"
        dark
        color="primary"
        class="btn block center"
      >
        Login
      </v-btn>
    </div>
    <router-link class="w-100 block center pt-1" :to="{name: 'PasswordChange'}">비밀번호 변경하기</router-link>
  </div>
</template>

<script>
import firebase from "@/firebase.js"

export default {
  name: "Update",
  data() {
    return {
      password: ''
    }
  },
  methods: {
    checkPassword() {
      const loadpassword = firebase.getPassword()
      loadpassword.then((res) => {
        if (this.password === res) {
          this.$emit('checkPassword')
        }
        else {
          alert('비밀번호를 잘못 입력하셨습니다.')
        }
      })
    },
  }
}
</script>

<style scoped>
.password-control {
  width: 30vw;
  min-width: 50px;
  max-width: 1000px;
  outline: 0.5px solid rgb(180, 185, 190) ;
  border-radius: 5px;
  padding: 1rem 1rem;
  margin-bottom: 0.5rem !important;
}
.block {
  display: block;
}
.w-100 {
  width: 100%;
}
.center {
  margin: 0 auto;
  padding: 0 auto;
  text-align: center;
}
.m-3 {
  margin: 3rem;
}
.pt-1 {
  padding-top: 1rem;
}
</style>
