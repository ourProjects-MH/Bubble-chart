<template>
  <div id="app" class="container">
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
          <input 
            v-model="data.group" 
            type="text" 
            class="form-control" 
            placeholder="Group">
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
</template>

<script>

export default {
  name: "App",
  
  data() {
    return {
      data_collections: [
        {
          keyword: "Foxconn",
          totalcount: 11,
          group: "Engineer",
          sentences: ['hi1', 'hi2', 'hi3']
        },
        {
          keyword: "Cherri Tech",
          totalcount: 14,
          group: "Software Engineer",
          sentences: ['by1', 'bu2']
        }
      ]
    }
  },
  methods: {
    addData () {
      this.data_collections.push({
        keyword: '',
        group: '',
        sentences: []
      })
    },
    removeData(idx) {
      this.data_collections.splice(idx, 1)
    },
    submit () {
      const data = {
        data_collections: this.data_collections
      }
      console.log(data)
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
</style>
