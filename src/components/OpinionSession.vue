<template>
  <div class="level-container">
    <v-card>
      <v-card-title>
        직급별 키워드
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="opinions"
        :search="search"
        hide-default-footer
      ></v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "OpinionSession",
  props: {
    opinions: Array,
    group1: String,
    group2: String,
    group3: String,
  },
  data() {
    return {
      search: '',
      headers: [
        {
          text: '구분',
          align: 'center',
          sortable: false,
          value: 'name',
        },
        { text: this.group1, align: 'center', value: 'group1_rate' },
        { text: this.group2, align: 'center', value: 'group2_rate' },
        { text: this.group3, align: 'center', value: 'group3_rate' },
      ],
    }
  }
}
</script>

<style scoped>
.level-container {
  width: 80%;
  max-width: 1000px;
  margin: 0 auto;
}
</style>