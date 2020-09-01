<template>
  <v-app>
    <!-- <v-app-bar app dark flat src="https://www.touristisrael.com/wp-content/uploads/Israeli-Beer.jpg"> -->
    <v-app-bar app dark>
      <v-app-bar-nav-icon
        class="ml-1"
        active-class="no-active"
        :to="this.$route.path.includes('admin') ? '/admin' : ''"
      >
        <img src="@/assets/logo.png" height="35" />
      </v-app-bar-nav-icon>

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
/* This Patch the double tap zoom on mobile, Works Nicely everywhere and on all devices tested*/
* {
  touch-action: manipulation;
}

.v-btn--active.no-active::before {
  opacity: 0 !important;
}

/* toast action */
.toasted .primary .action,
.toasted.toasted-primary .action {
  color: #ffffff !important;
}

/* toast container */
.toasted .primary,
.toasted.toasted-primary {
  font-weight: 800 !important;
  max-width: 200px;
  padding: 6px 30px !important;
  /* border-radius: 999px !important; */
}

.toasted .primary.success,
.toasted.toasted-primary.success {
  background: #26a68afd !important;
  box-shadow: 0px 6px 16px rgba(77, 182, 142, 0.5) !important;
}

.toasted .primary.error,
.toasted.toasted-primary.error {
  background: #ef5350 !important;
  box-shadow: 0px 6px 16px rgba(255, 111, 106, 0.5) !important;
}
</style>