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
          <img src="@/assets/images/Root-consulting.png" alt="RootConsulting" class="logo-img">
          <v-spacer></v-spacer>
          <v-btn
            class="mx-2"
            dark
            icon
            @click="openLink('facebook')"
          >
            <img src="@/assets/images/facebook.png" alt="facebook link" class="sns-img">
          </v-btn>
          <v-btn
            class="mx-2"
            dark
            icon
            @click="openLink('instagram')"
          >
            <img src="@/assets/images/instagram.png" alt="instagram link" class="sns-img">
          </v-btn>
          <v-btn
            class="mx-2"
            dark
            icon
            @click="openLink(naverblog)"
          >
            <img src="@/assets/images/naverblog.png" alt="naverblog link" class="sns-img">
          </v-btn>
          <v-btn
            class="mx-2"
            dark
            icon
            @click="copyLink"
          >
            <img src="@/assets/images/copylink.png" alt="copy url" class="sns-img">
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
.sns-img {
  height: 5vh;
}
.absolute-right-top {
  position: fixed;
  right: 5px;
  top: 10px;
  z-index: 10;
}
</style>