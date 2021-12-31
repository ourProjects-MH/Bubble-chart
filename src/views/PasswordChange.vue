<template>
  <div id="app" class="container">
    <h1>Change Your Password</h1>
    <div class="password-section">
      <div class="form-group">
        <div class="form-title">Password</div>
        <input 
          v-model="password" 
          type="password" 
          class="form-control" 
          placeholder="Enter Your Current Password">
        <input 
          v-model="new_password" 
          type="password" 
          class="form-control" 
          placeholder="Enter Tour New Password">
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
      new_password: '',
    }
  },
  methods: {
    changePassword() {
      const loadpassword = firebase.getPassword()
      loadpassword.then((res) => {
        console.log(res)
        if (this.password === res) {
          this.authorized = true
          if (this.new_password.trim() === "") {
            return alert('새로운 비밀번호를 입력해주세요.')
          }
          else {
            firebase.setPassword(this.new_password)
            console.log(this.new_password)
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
