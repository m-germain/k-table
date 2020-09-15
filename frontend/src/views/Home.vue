<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="font-weight-bold">Hello,</h1>
        <h2>
          tu veux venir
          <span class="font-weight-medium">à la</span> K-Fêt?
        </h2>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col block align="center" class="mt-10" v-if="tables.length < 1">
        <v-progress-circular :size="70" :width="7" color="secondary" indeterminate></v-progress-circular>
      </v-col>
      <v-col cols="6" align="center" style="font-size: 1.5rem" v-else-if="available">
        <v-icon
          color="success"
          class="my-8"
          style="font-size: 20vh"
        >mdi-checkbox-marked-circle-outline</v-icon>
        <br />Il reste
        <strong>{{numberOfTablesAvailable}}</strong> tables et
        <strong>{{numberOfPlacesAvailable}}</strong> places disponibles.
        <br />
        <strong>Venez vite !</strong>
      </v-col>
      <v-col cols="7" style="font-size: 1.5rem" v-else>
        <v-icon color="primary" class="my-8" style="font-size: 20vh">mdi-close-circle-outline</v-icon>
        <br />Il ne reste
        <strong>PAS</strong> de tables disponibles.
        <strong>Venez plus tard.</strong>
      </v-col>
      <v-col cols="12" align="center" style="font-size: 1.5rem" v-if="tables.length > 1">
        <v-expansion-panels popout class="mt-10">
          <v-expansion-panel>
            <v-expansion-panel-header
              style="font-size:20px"
              class="success--text"
            >Voir les tables disponibles</v-expansion-panel-header>
            <v-expansion-panel-content align="start">
              <div v-for="table in tablesAvailable" :key="table.id" class="my-3">
                <strong>La table {{table.name}}</strong>
                si vous êtes
                <strong>{{table.capacity}}</strong> personnes ou moins.
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import TableHelper from "../mixins/tableHelper";

@Component({
  components: {},
})
export default class Home extends Mixins(TableHelper) {
  mounted() {
    this.getTables();
  }
}
</script>


<style scoped>
</style>