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

export default {
  name: 'Main',
  data() {
    return {
      tmp: false, 
      children: null,
      bubble_size: 0,
      opinions: null,
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
    async fetchBubbleData() {
      // const header_loaddata = ''
      // fetch("./과장.json")
      //   .then(res => {return res.json()})
      //   .then(header_loaddata  => console.log(header_loaddata))

      const loaddata = await d3.json("./keyword.json")

      // const manager_loaddata = await d3.json("./직원.json");
      // const employee_loaddata = await d3.json("./팀장.json");

      // let loaddata = [header_loaddata, manager_loaddata, employee_loaddata]

      // 데이터 합치기
      // var result = loaddata.reduce(function(r, e) {
      //   return Object.keys(e).forEach(function(k) {
      //     if (!r[k]) r[k] = [].concat(e[k])
      //     else r[k][0].sentences = r[k][0].sentences.concat(e[k].sentences)
      //   }), r
      // }, {})
      this.children = []

      for (var element in loaddata) {
        var sentences = []
        var element_total = loaddata[element]["totalcount"]
        for (var i in loaddata[element]["sentences"]) {
          sentences.push(loaddata[element]["sentences"][i]["sentence"])
        }
        this.children.push({"name": element, "sentences": sentences, "value": element_total})
      }

      // bubble chart에 맞는 형식으로 데이터 변환
      // for (var element in result) {
      //   var sentences = result[element][0].sentences
      //   var bubble_value = 0
      //   var bubble_sentences = []
      //   for (var i in sentences) {
      //     for (const [key, value] of Object.entries(sentences[i])) {
      //       bubble_sentences.push(key)
      //       this.bubble_size += value
      //       bubble_value += value
      //     }
      //   }
      //   this.children.push({"name": element, "sentences": bubble_sentences, "value": bubble_value})
      // }
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
