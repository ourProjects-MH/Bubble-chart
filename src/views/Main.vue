<template>
  <div>
    <Header />
    <div id="container">
      <div id="bubble-chart-container">
        <Bubble :children="children" :changeTmp="changeTmp" id="bubble" class="bubble" />
      </div>
      <OpinionSession v-if="opinions" :opinions="opinions"/>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import Header from "@/components/Header.vue"
import Bubble from "@/components/Bubble.vue"
import OpinionSession from "@/components/OpinionSession.vue"
import firebase from "@/firebase.js"

export default {
  name: 'Main',
  data() {
    return {
      data: {
      },
      tmp: false, 
      children: null,
      bubble_size: 0,
      opinions: null,
    }
  },
  watch: {
  },
  components: {
    Header,
    Bubble,
    OpinionSession,
  },
  created() {
    
  },
  mounted() {
    this.fetchBubbleData();
    // this.fetchLevelData();
  },
  methods: {
    fetchBubbleData() {
      
      const loaddata = firebase.getTotalData()
      loaddata.then((res) => {
        
        this.children = []
  
        for (var element in res) {
          var sentences = []
          var element_totalcount = res[element]["totalCount"]
          for (var i in res[element]["sentences"]) {
            sentences.push(res[element]["sentences"][i]["sentence"])
          }
          this.children.push({"name": element, "sentences": sentences, "value": element_totalcount})
        }
        console.log(this.children)
  
      })

    },
    async fetchLevelData() {
      const loaddata = await d3.json("./separate.json")
      
      var check_array = []
      const data = []
      for (var level in loaddata) {
        for (var i in loaddata[level]) {
          var keyword = loaddata[level][i]["keyword"]
          
          if (!check_array.includes(keyword)) {
            check_array.push(keyword)
            var topmanager_rate = 0
            var manager_rate = 0
            var employee_rate = 0

            for (var x in loaddata["topmanager"]) {
              if (loaddata["topmanager"][x]["keyword"] === keyword) {
                topmanager_rate += loaddata["topmanager"][x]["count"]
              }
            }
            for (x in loaddata["manager"]) {
              if (loaddata["manager"][x]["keyword"] === keyword) {
                manager_rate += loaddata["manager"][x]["count"]
              }
            }
            for (x in loaddata["employee"]) {
              if (loaddata["employee"][x]["keyword"] === keyword) {
                employee_rate += loaddata["employee"][x]["count"]
              }
            }

            data.push({"name": keyword, "topmanager_rate": topmanager_rate, "manager_rate": manager_rate, "employee_rate": employee_rate})
          }
        }
        this.opinions = data
      }
    },
    changeTmp() {
      this.tmp = !this.tmp
    }
  }
}
</script>

<style scoped>
#container {
  width: 100%;
  margin: 3rem auto;
}
#bubble-chart-container {
  margin: 3rem 0;
}
.bubble-chart-title {
  font-size: 2rem;
  align-self: center;
}
.bubble-chart-subtitle {
  font-size: 1.3rem;
  align-self: center;
}
.bubble {
  width: 100%;
  margin: 0 auto;
}
</style>
