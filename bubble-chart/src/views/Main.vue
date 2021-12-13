<template>
  <div>
    <div id="container">
      <div id="bubble-chart-container">
        <div id="bubble-chart-title-container">
          <h1 class="bubble-chart-title">긍정</h1>
          <h2 class="bubble-chart-subtitle">업무시 관련 고민</h2>
          <h1 class="bubble-chart-title">부정</h1>
        </div>
        <BubbleChart/>
        <!-- <OpinionSession/> -->
      </div>
      <OpinionSession/>
    </div>
  </div>
</template>

<script>
import BubbleChart from "@/components/BubbleChart.vue"
import OpinionSession from "@/components/OpinionSession.vue"

export default {
  name: 'App',
  components: {
    BubbleChart,
    OpinionSession,
  }
}
</script>

<style scoped>
#container {
  width: 90vw;
  margin: 0 auto;
}
#bubble-chart-title-container {
  display: flex;
  justify-content: space-evenly;
}
.bubble-chart-title {
  font-size: 3rem;
  align-self: center;
}
.bubble-chart-subtitle {
  font-size: 1rem;
  align-self: center;
}
</style>
