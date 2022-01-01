<template>
  <div>
    <Header />
    <div id="container">
      <div class="center">
        <h1>2021 설문조사 결과</h1>
      </div>
      <div v-if="!children" class="text-center">
        <v-progress-circular
          :size="100"
          :width="10"
          indeterminate
          color="red"
          style="margin-top: 4rem; margin-bottom: 2rem;"
        ></v-progress-circular>
        <h3>Loading...</h3>
      </div>
      <div id="bubble-chart-container">
        <Bubble 
          :children="children" 
          id="bubble" 
          class="bubble" 
        />
      </div>
      <OpinionSession 
        v-if="opinions"
        :opinions="opinions" 
        :group1="group1" 
        :group2="group2" 
        :group3="group3" 
      />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue"
import Bubble from "@/components/Bubble.vue"
import OpinionSession from "@/components/OpinionSession.vue"
import firebase from "@/firebase.js"

export default {
  name: 'Main',
  data() {
    return {
      data: {},
      children: null,
      bubble_size: 0,
      opinions: null,
      group1: '',
      group2: '',
      group3: '',
    }
  },
  components: {
    Header,
    Bubble,
    OpinionSession,
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
        var id = 0
        for (var element in res) {
          var sentences = []
          var element_totalcount = res[element]["totalCount"]
          for (var i in res[element]["sentences"]) {
            sentences.push({ 
              id: id,
              sentence_id: res[element]["sentences"][i]["id"], 
              sentence: res[element]["sentences"][i]["group"] + ' - ' + res[element]["sentences"][i]["sentence"], 
              sentence_count: res[element]["sentences"][i]["count"], 
              sentence_group: res[element]["sentences"][i]["group"]
            })
            id += 1
          }
          this.children.push({"name": element, "sentences": sentences, "value": element_totalcount})
        }
      })
    },
    fetchLevelData() {
      const loadgroups = firebase.getGroups()
      const loaddata = firebase.getDataByGroups()
      var data = []
      loaddata.then((res) => {
        loadgroups.then((groups) => {
          this.group1 = groups[0]
          this.group2 = groups[1]
          this.group3 = groups[2]
          for (var keyword in res) {
            if (res[keyword][this.group1]) {
              var group1_rate = res[keyword][this.group1]
            }
            else {
              group1_rate = 0
            }
            if (res[keyword][this.group2]) {
              var group2_rate = res[keyword][this.group2]
            }
            else {
              group2_rate = 0
            }
            if (res[keyword][this.group3]) {
              var group3_rate = res[keyword][this.group3]
            }
            else {
              group3_rate = 0
            }
            data.push({"name": keyword, "group1_rate": group1_rate, "group2_rate": group2_rate, "group3_rate": group3_rate})
          }
          this.opinions = data
        })
      })
    },
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
.center {
  text-align: center;
}
</style>