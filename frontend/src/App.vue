<template>
  <v-app>
    <!-- <v-app-bar app dark flat src="https://www.touristisrael.com/wp-content/uploads/Israeli-Beer.jpg"> -->
    <v-app-bar app dark>
      <img src="@/assets/logo.png" height="35" />
      <v-spacer></v-spacer>
      <v-toolbar-title class="grey-darken2--text" v-if="!$route.meta.hideSideBar">
        <span
          class="text-uppercase font-weight-bold"
        >{{this.$route.name}} {{this.$route.params.number}}</span>
      </v-toolbar-title>
    </v-app-bar>
    <v-main class="fit-screen">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class App extends Vue {}
</script>

<style lang="css">
body {
  overflow: hidden;
  height: 100vh;
}
</style>