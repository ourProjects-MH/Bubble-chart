<template>
  <div>
    <div id="chart" class="chart"></div>
    <SentenceModal 
      :modal="modal" 
      :selected_keyword="selected_keyword" 
      :selected_sentences="selected_sentences" 
      v-on:closeModal="closeModal" 
    />
  </div>
</template>

<script>
import * as d3 from 'd3'
import SentenceModal from "@/components/SentenceModal.vue"

export default {
  name: "Bubble",
  data() {
    return {
      idx: 0,
      max: null,
      min: null,
      modal: false,
      selected_keyword: null,
      selected_sentences: null,
    }
  },
  watch: {
    children: {
      handler() {
        this.make_bubble()
      },
    },
  },
  components: {
    SentenceModal,
  },
  props: {
    children: Array,
  },
  mounted() {
    this.make_bubble()
  },
  methods: {
    make_bubble() {

      if (!this.children) {
        return
      } 

      var json = { 'children': this.children.slice(0) }
      // name(string), sentences(array), value(int)

      const values = json.children.map(d => d.value);

      this.min = Math.min.apply(null, values);
      this.max = Math.max.apply(null, values);

      const diameter = 600;

      var bubble = d3.pack()
        .size([diameter, diameter])
        .padding(15);
      
      var svg = d3.select('#chart').append('svg')
        .attr('width', diameter)
        .attr('height', diameter)

      var root = d3.hierarchy(json)
        .sum(function(d) { return d.value; });

      bubble(root);

      var node = svg.selectAll('.node')
        .data(root.children)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function(d) { return 'translate(' + d.x + ' ' + d.y + ')'; })
        .append('g');

      node.append("circle")
        .attr("r", function(d) { return d.r; })
        .on("click", this.getSentences)
        .style("fill", this.getItemColor)

      node.append("text")
        .style("text-anchor", "middle")
        .style('font-size', this.getFontSizeForItem)
        .on("click", this.getSentences)
        .style("font-weight", "bolder")
        .text(this.getLabel)
        .style("fill", "#ffffff")

      node.append("text")
        .attr("dy", "1.2em")
        .on("click", this.getSentences)
        .style("text-anchor", "middle")
        .style('font-size', this.getFontSizeForItem)
        .text(this.getValueText)
        .style("fill", "#ffffff")
    },
    getLabel(item) {
      return this.truncate(item.data.name);
    },
    getValueText(item) {
      return item.data.value;
    },
    truncate(label) {
      const max = 8;
      if (label.length > max) {
        label = label.slice(0, max) + '...';
      }
      return label;
    },
    getFontSizeForItem(item) {
      const minPx = 10;
      const maxPx = 16;
      const pxRange = maxPx - minPx; 
      const dataRange = this.max - this.min;
      const ratio = pxRange / dataRange;
      const size = Math.min(maxPx, Math.round(item.data.value * ratio) + minPx);
      return `${size}px`;
    },
    getItemColor() {
      // const colorList = ["#FCE4C5", "#F89928", "#FDDEB5"];
      // const color_length = colorList.length
      // var i = this.idx % color_length
      // this.idx += 1
      return "#f48120";
    },
    getSentences(item) {
      this.selected_keyword= item["target"]["__data__"]["data"]["name"]
      this.selected_sentences = item["target"]["__data__"]["data"]["sentences"]
      this.openModal()
    },
    openModal() {
      this.modal = true
    },
    closeModal() {
      this.modal = false
      this.selected_sentences = null
    },
  }
}
</script>

<style>
.chart {
  display: flex;
  justify-content: center;
}
.text {
  color: red;
}
.heavy {
  font-weight: bold;
}
.node circle {
  transition: transform 200ms ease-in-out;
}
.node:hover circle {
  transform: scale(1.05);
  filter: brightness(50%);
  cursor: pointer;
}
.node:hover text {
  cursor: pointer;
}


</style>

