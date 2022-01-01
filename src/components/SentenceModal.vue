<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="modal"
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

          <v-card-text class="between no-padding-bottom" v-for="(sentence) in selected_sentences" :key="sentence['id']" >
            <div class="align-center">
              {{ sentence["sentence"] }}
            </div>
            <div>
              <v-btn
                class="ma-2"
                text
                icon
                color="red lighten-2"
                @click="likeSentence(sentence)"
              >
                <v-icon 
                  :id="'btn-'+ String(sentence['id'])"
                >
                  mdi-heart-outline
                </v-icon>
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
import firebase from "@/firebase.js"

export default {
  data () {
    return {
    }
  },
  props: {
    modal: Boolean,
    selected_keyword: String,
    selected_sentences: Array,
  },
  computed: {
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    likeSentence(data) {
     
      var id = "btn-" + String(data['id'])
      var btn = document.getElementById(id)

      var group = data["sentence_group"]
      if (btn.classList.contains("mdi-heart")) {
        alert('이미 좋아요를 누르셨습니다.')
        return
      }
      firebase.updateCount(group, this.selected_keyword, parseInt(data["sentence_id"]))
      data["sentence_count"] = parseInt(data["sentence_count"])+1
      btn.classList.remove("mdi-heart-outline")
      btn.classList += " mdi-heart"
      console.log(group, this.selected_keyword,data, parseInt(data["sentence_id"]))
      // btn을 x후 페이지 리렌더링을 하지 않으면 같은 인덱스 번호를 가진 btn icon이 같이 바뀜
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
.no-padding-bottom {
  padding-bottom: 0 !important;
}
</style>