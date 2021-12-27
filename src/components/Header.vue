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
        style="background-color: #11324D;"
      >
        <v-card-title>
          <strong class="subheading">Get connected with us on social networks!</strong>
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
    ],
  }),
}
</script>