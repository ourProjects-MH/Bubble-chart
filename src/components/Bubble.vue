<template>
  <div>
    <div id="chart" class="chart"></div>
    <SentenceModal v-if="openModal" :dialog="openModal"/>
  </div>
</template>

<script>
import * as d3 from 'd3'
import SentenceModal from "@/components/SentenceModal.vue"

export default {
  name: "Bubble",
  data() {
    return {
      openModal: false, 
      selected_keyword: null,
      selected_sentences: null,
    }
  },
  watch: {
    children: {
      handler() {
        this.make_bubble()
      },
    }
  },
  computed: {
  },
  components: {
    SentenceModal,
  },
  props: {
    children: Array,
  },
  created() {
   
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

  
      console.log('make bubble')
      const values = json.children.map(d => d.value);

      const min = Math.min.apply(null, values);
      const max = Math.max.apply(null, values);
      
      var idx = 1

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
        .attr("cursor", "pointer")
        .attr("class", function(d) { return d.data.name; })
        .on("click", getSentences)
        .style("fill", getItemColor)

      node.append("text")
        .style("text-anchor", "middle")
        .style('font-size', getFontSizeForItem)
        .style("font-weight", "bolder")
        .text(getLabel)
        .style("fill", "#ffffff")

      node.append("text")
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .style('font-size', getFontSizeForItem)
        .text(getValueText)
        .style("fill", "#ffffff")
      
        
      function getLabel(item) {
        return truncate(item.data.name);
      }
      function getValueText(item) {
        return item.data.value;
      }
      function truncate(label) {
        const max = 8;
        if (label.length > max) {
          label = label.slice(0, max) + '...';
        }
        return label;
      }
      function getFontSizeForItem(item) {
        const minPx = 10;
        const maxPx = 16;
        const pxRange = maxPx - minPx; 
        const dataRange = max - min;
        const ratio = pxRange / dataRange;
        const size = Math.min(maxPx, Math.round(item.data.value * ratio) + minPx);
        return `${size}px`;
      }
      function getItemColor() {
        const colorList = ["89B5AF", "DED9C4", "D57E7E", "8E806A"];
        const color_length = colorList.length
        var i = idx % color_length
        idx += 1
        return '#' + colorList[i];
      }
      function getSentences(item) {
        this.selected_keyword= item["target"]["__data__"]["data"]["name"]
        this.selected_sentences = item["target"]["__data__"]["data"]["sentences"]
        this.openModal = true 
        console.log(this.selected_keyword, this.selected_sentences, this.openModal)
      }
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
  transform: scale(1.1);
  filter: brightness(50%);
}


</style>

