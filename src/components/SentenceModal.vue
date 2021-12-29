<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        max-width="600"
      >
        <v-card>
          <div class="between">

          <v-card-title class="text-h5 title">
            {{ selected_keyword }}
          </v-card-title>
          <v-btn
            class="ma-2"
            text
            icon
            color="red lighten-2"
            @click="closeModal"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          </div>

          <v-card-text class="between" v-for="(sentence, idx) in selected_sentences" :key="idx" >
            <div class="align-center">
              {{ sentence["sentence"] }}
            </div>
            <div>
              <v-btn
                class="ma-2"
                text
                icon
                color="red lighten-2"
                @click="likeSentence(sentence, idx)"
              >
                <v-icon :id="selected_keyword + 'btn'+ idx">mdi-heart-outline</v-icon>
              </v-btn>
              {{ sentence["sentence_count"] }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
// import firebase from "@/firebase.js"

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
  computed: {
  },
  methods: {
    closeModal() {
      this.$emit('changeModal')
    },
    likeSentence(data, idx) {
      console.log(data, idx)
      var id = this.selected_keyword + "btn" + String(idx)
      var btn = document.getElementById(id)
      console.log(btn)
      // var group = data["sentence_group"]
      // var count = parseInt(data["sentence_count"])+1
      if (btn.classList.contains("mdi-heart")) {
        alert('이미 좋아요를 누르셨습니다.')
        return
        }
      // firebase.updateCount(group, this.selected_keyword, id, count)
        data["sentence_count"] = parseInt(data["sentence_count"])+1
        console.log(btn)
        btn.classList.remove("mdi-heart-outline")
        btn.classList += " mdi-heart"

    }
  }
}
</script>

<style scoped>
.between {
  display: flex;
  justify-content: space-between;
}
.align-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.title {
  font-weight: bold;
}
</style>