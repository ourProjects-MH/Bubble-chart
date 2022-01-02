<template>
  <div>
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
            v-for="icon in icons"
            :key="icon"
            class="mx-4"
            dark
            icon
          >
            <v-icon size="24px">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-card-title>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
export default {
  data: () => ({
    icons: [
      'mdi-facebook',
      'mdi-twitter',
      'mdi-linkedin',
      'mdi-instagram',
      'mdi-export-variant',
    ],
  }),
}
</script>

<style scoped>
.logo-img {
  height: 5vh;
}
</style>