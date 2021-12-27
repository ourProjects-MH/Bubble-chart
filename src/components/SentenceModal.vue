<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        max-width="600"
      >
        <v-card>
          <v-card-title class="text-h5">
            {{ selected_keyword }}
          </v-card-title>

          <v-card-text v-for="(sentence, idx) in selected_sentences" :key="idx" >
            {{ sentence }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              text
              @click="closeModal"
            >
              Disagree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    dialog: Boolean,
    selected_keyword: String,
    selected_sentences: Array,
  },
  methods: {
    closeModal() {
      this.$emit('changeModal')
    }
  }
}
</script>