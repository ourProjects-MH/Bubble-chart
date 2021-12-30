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
// import * as d3 from 'd3'
import Header from "@/components/Header.vue"
import Bubble from "@/components/Bubble.vue"
import OpinionSession from "@/components/OpinionSession.vue"
import firebase from "@/firebase.js"

export default {
  name: 'Main',
  data() {
    return {
      data: {},
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
    this.fetchLevelData();
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
            sentences.push({ 
              sentence_id: res[element]["sentences"][i]["id"], 
              sentence: res[element]["sentences"][i]["sentence"], 
              sentence_count: res[element]["sentences"][i]["count"], 
              sentence_group: res[element]["sentences"][i]["group"]
            })
          }
          this.children.push({"name": element, "sentences": sentences, "value": element_totalcount})
        }
        console.log(this.children)
  
      })

    },
    fetchLevelData() {
      const loadgroups = firebase.getGroups()
      const loaddata = firebase.getTotalData()
      loadgroups.then((groups) => {
        const group1 = groups[0]
        // const group1 = "팀장"
        const group2 = groups[1]
        // const group2 = "임원"
        const group3 = groups[2]
        // const group3 = "팀원"
        console.log(groups, group1, group2, group3)

        loaddata.then((res) => {
          console.log(res)
          var check_array = []
          const data = []
          for (var level in res) {
            for (var i in res[level]) {
              var keyword = res[level][i]["keyword"]
              
              if (!check_array.includes(keyword)) {
                check_array.push(keyword)
                var group1_rate = 0
                var group2_rate = 0
                var group3_rate = 0
    
                for (var x in res["topmanager"]) {
                  if (res["topmanager"][x]["keyword"] === keyword) {
                    group1_rate += res["topmanager"][x]["count"]
                  }
                }
                for (x in res["manager"]) {
                  if (res["manager"][x]["keyword"] === keyword) {
                    group2_rate += res["manager"][x]["count"]
                  }
                }
                for (x in res["employee"]) {
                  if (res["employee"][x]["keyword"] === keyword) {
                    group2_rate += res["employee"][x]["count"]
                  }
                }
    
                data.push({"name": keyword, "group1_rate": group1_rate, "group2_rate": group2_rate, "group3_rate": group3_rate})
              }
            }
            this.opinions = data
          }
        })
      })
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
