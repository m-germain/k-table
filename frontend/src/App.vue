<template>
  <v-app>
    <v-app-bar color="white" flat hide-on-scroll absolute scroll-target="#scrolling-techniques-app">
      <img class="mr-3" src="@/assets/logo.png" height="40" />
      <v-spacer></v-spacer>

      <v-toolbar-title>
        <span class="font-weight-medium">Vous êtes Table 3</span>
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-sheet id="scrolling-techniques-app" class="overflow-y-auto" max-height="95vh" min-height="100vh">
        <router-view />
      </v-sheet>
    </v-main>

    <v-navigation-drawer v-model="drawer" absolute bottom temporary>
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <!-- <v-list-item-title> -->
            <h2 class="font-weight-bold grey-darken2--text">Votre commande</h2>
            <!-- </v-list-item-title> -->
          </v-list-item-content>
          <v-list-item-action>
            <v-icon class="mt-1 primary--text">mdi-basket</v-icon>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
              
            <span class="font-weight-bold"><v-icon left>mdi-beer</v-icon>HG Demi</span>
          </v-list-item-content>
          <v-list-item-action>
            <span>
              3.50
              <v-icon rigth class="primary--text">mdi-currency-eur</v-icon>
            </span>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-spacer></v-spacer>
          <v-list-item-action>
            <v-btn text color="sucess">
              Commander
              <v-icon right>mdi-store</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer padless absolute class="font-weight-medium my-3">
      <v-btn block color="primary" @click="drawer = !drawer">Voir ma commande</v-btn>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class App extends Vue {
  collapseOnScroll = true;
  drawer = false;
}
</script>

<style lang="css">
body {
  overflow: hidden
}
</style>