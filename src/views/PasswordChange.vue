<template>
  <div>
    <h1 class="center m-3">Change Your Password</h1>
    <input 
      v-model="password" 
      type="password" 
      class="password-control block center"
      placeholder="Enter Your Current Password">
    <input 
      v-model="new_password" 
      type="password" 
      class="password-control block center"
      placeholder="Enter Your New Password"
      @keyup.enter="changePassword">
    <div class="btn-container">
      <v-btn
        @click="changePassword"
        dark
        color="primary"
        class="btn"
      >
        Submit
      </v-btn>
    </div>
  </div>
</template>

<script>
import firebase from "@/firebase.js"

export default {
  name: "PasswordChange",
  data() {
    return {
      authorized: false,
      password: '',
      new_password: '',
    }
  },
  methods: {
    changePassword() {
      const loadpassword = firebase.getPassword()
      loadpassword.then((res) => {
        if (this.password === res) {
          this.authorized = true
          if (this.new_password.trim() === "") {
            return alert('새로운 비밀번호를 입력해주세요.')
          }
          else {
            firebase.setPassword(this.new_password)
            alert('변경이 완료되었습니다.')
          }
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
</style>
