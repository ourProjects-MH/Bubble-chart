<template>
  <div id="bubble-chart">
    <div id="positive-bubble" class="bubble">
      <h1>긍정 버블</h1>
      <Bubble :data="data" />
    </div>
    <div id="negative-bubble" class="bubble">
      <h1>부정 버블</h1>
      <Bubble :data="data" />
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import Bubble from "@/components/Bubble.vue"

export default {
  name: "BubbleCHart",
  data() {
    return {
      data: "",
    }
  },
  components: {
    Bubble,
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      let lodadata = await d3.json("./tweets.json");
      this.data = lodadata.tweets
    }
  }
}
</script>

<style scoped>
#bubble-chart {
  display: flex;
}
.bubble {
  width: 50%;
}
</style>

