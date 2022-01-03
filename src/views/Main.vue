<template>
  <div>
    <Header />
    <div id="container">
      <div class="center">
        <h1 class="bold">2021 설문조사 결과</h1>
      </div>
      <div v-if="!fetch_bubble_data" class="center">
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
          :data="bubble_data" 
          id="bubble" 
          class="center" 
        />
      </div>
      <LevelChart 
        v-if="fetch_level_data"
        :data="level_data" 
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
import LevelChart from "@/components/LevelChart.vue"
import firebase from "@/firebase.js"

export default {
  name: 'Main',
  data() {
    return {
      fetch_bubble_data: false,
      fetch_level_data: false,
      bubble_data: [],
      level_data: [],
      group1: '',
      group2: '',
      group3: '',
    }
  },
  components: {
    Header,
    Bubble,
    LevelChart,
  },
  mounted() {
    this.fetchBubbleData();
    this.fetchGroupData();
  },
  methods: {
    fetchBubbleData() {
      const loaddata = firebase.getTotalData()
      loaddata.then((res) => {
        Object.entries(res).forEach(([keyword, keyword_data]) => {
          var sentences = []
          keyword_data["sentences"].forEach((sentence_data) => {
            sentences.push({
              id: keyword + '-' + sentence_data["group"] + '-' + sentence_data["id"],
              sentence: sentence_data["group"] + ' - ' + sentence_data["sentence"],
              sentence_id: sentence_data["id"],
              sentence_count: sentence_data["count"],
              sentence_group: sentence_data["group"]
            })
          })
          this.bubble_data.push({"name": keyword, "sentences": sentences, "value": keyword_data["totalCount"]})
        })
        this.fetch_bubble_data = true
      })
    },
    fetchLevelData() {
      const loaddata = firebase.getDataByGroups()
      loaddata.then((res) => {
        Object.entries(res).forEach(([keyword, keyword_data]) => {
          var group1_rate = 0
          var group2_rate = 0
          var group3_rate = 0
          Object.entries(keyword_data).forEach(([level, level_count]) => {
            if (this.group1 === level) {
              group1_rate = level_count
            }
            if (this.group2 === level) {
              group2_rate = level_count
            }
            if (this.group3 === level) {
              group3_rate = level_count
            }
          })
          this.level_data.push({"name": keyword, "group1_rate": group1_rate, "group2_rate": group2_rate, "group3_rate": group3_rate})
        })
        this.fetch_level_data = true
      })
    },
    fetchGroupData() {
      const loadgroups = firebase.getGroups()
      loadgroups.then((groups) => {
        this.group1 = groups[0]
        this.group2 = groups[1]
        this.group3 = groups[2]
        this.fetchLevelData()
      })
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
.center {
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
.bubble-chart-title {
  font-size: 2rem;
  align-self: center;
}
.bubble-chart-subtitle {
  font-size: 1.3rem;
  align-self: center;
}
</style>
