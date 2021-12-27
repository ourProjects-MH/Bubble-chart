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
        { text: '임원', align: 'center', value: 'topmanager_rate' },
        { text: '관리자', align: 'center', value: 'manager_rate' },
        { text: '직원', align: 'center', value: 'employee_rate' },
      ],
      desserts: [
        {
          name: 'Work',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%',
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%',
        },
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