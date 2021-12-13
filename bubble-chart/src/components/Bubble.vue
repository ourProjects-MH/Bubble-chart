<template>
  <div>
    <svg
     :width="500"
     :height="600"
    >
      <g v-for="c in output" :key="c.id" transform="translate(50 ,50)">
        <circle
          :r="c.r"
          :cx="c.x"
          :cy="c.y"
          :fill="c.fill"
          :stroke="None"
          class="bubble"
        >
        </circle>
        
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: "Bubble",
  props: ["data"],
  created() {
    this.colourScale = d3
      .scaleOrdinal()
      .range(["#5EAFC6", "#FE9922", "#93c464", "#75739F"]);
  },
  methods: {
    packChart() {
      const packChart = d3.pack();
      packChart.size([400, 500]);
      packChart.padding(10);
      const output = packChart(this.packData).descendants();
      output.splice(0, 1)
      return output.map((d, i) => {
        const fill = this.colourScale(d.depth);
        return {
          title: d.data[0],
          id: i + 1,
          r: d.r,
          x: d.x,
          y: d.y,
          fill,
        };
      });
    }
  },
  computed: {
    packData() {
      const nestedTweets = d3.index(this.data, d=>d.user)
      return d3
        .hierarchy(nestedTweets)
        .sum((d) =>
          d[1].count
        )
    },
    output() {
      return this.packChart();
    }
  }
}
</script>

<style scoped>
.bubble {
  cursor: pointer;
}
.bubble:hover {
  filter: brightness(50%);
}
</style>

