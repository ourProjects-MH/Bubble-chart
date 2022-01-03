<template>
  <div>
    <v-alert class="absolute-right-top" border="right" type="success" v-if="showalert">
      Link Copied
    </v-alert>
    <v-footer
      dark
      padless
    >
      <v-card
        class="flex"
        flat
        tile
        style="background-color: #f48120;"
      >
        <v-card-title>
          <img src="@/assets/images/Root-consulting.png" alt="" class="logo-img">
          <v-spacer></v-spacer>
          <v-btn
            class="mx-4"
            dark
            icon
            @click="openLink('facebook')"
          >
            <v-icon size="24px">
              mdi-facebook
            </v-icon>
          </v-btn>
          <v-btn
            class="mx-4"
            dark
            icon
            @click="openLink('instagram')"
          >
            <v-icon size="24px">
              mdi-instagram
            </v-icon>
          </v-btn>
          <v-btn
            class="mx-4"
            dark
            icon
            @click="openLink(naverblog)"
          >
            <v-icon size="24px">
              mdi-note-text
            </v-icon>
          </v-btn>
          <v-btn
            class="mx-4"
            dark
            icon
            @click="copyLink"
          >
            <v-icon size="24px">
              mdi-export-variant
            </v-icon>
          </v-btn>
        </v-card-title>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showalert: false,
    }
  },
  methods: {
    copyLink() {
      const url = window.document.location.href; 
      const link = document.createElement("textarea");
      document.body.appendChild(link);
      link.value = url;
      link.select();
      document.execCommand('copy');
      this.showalert = true
      setTimeout(this.removeAlert, 3000)
      document.body.removeChild(link);
    },
    openLink(site) {
      if (site === "facebook") {
        var url = "https://www.facebook.com/rootconsulting/"
      }
      else if (site === "instagram") {
        url = "https://www.instagram.com/rootconsulting_official/"
      }
      else {
        url ="https://blog.naver.com/consulting14"
      }
      window.open(url)
    },
    removeAlert() {
      this.showalert = false
    }
  }
}
</script>

<style scoped>
.logo-img {
  height: 5vh;
}
.absolute-right-top {
  position: fixed;
  right: 5px;
  top: 10px;
  z-index: 10;
}
</style>