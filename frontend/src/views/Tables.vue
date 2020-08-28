<template>
  <v-container>
    <HeadLine title="Nos Tables">
      <template v-slot:end>
        <v-text-field
          v-model="search"
          dense
          solo
          :clearable="search.length > 2"
          filled
          flat
          disabled
          style="max-width: 9rem"
          hide-details
          prepend-inner-icon="mdi-database-search"
          label="Search"
        ></v-text-field>
      </template>
    </HeadLine>
    <v-card class="mx-4 my-3">
      <v-row align="center" justify="space-between">
        <v-col>
          <v-btn text color="primary" @click="removeTable">
            <v-icon>mdi-minus-circle</v-icon>
          </v-btn>
        </v-col>
        <v-col align="center">
          <h2>{{numberOfTables}}</h2>
        </v-col>
        <v-col align="right">
          <v-btn text color="success" @click="addTable">
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-row class="mx-1" align="center" justify="space-between">
      <v-col>
        <v-card>
          <v-list-item two-line>
            <v-list-item-content>
              <div class="overline font-weight-bold mb-4">Disponibles</div>
              <v-list-item-title class="headline mb-1">
                <v-btn x-large block text color="success">
                  <h1>{{numberOfTablesAvailable}}</h1>
                  <v-icon class="ml-3" large right>mdi-checkbox-marked-circle-outline</v-icon>
                </v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-list-item two-line>
            <v-list-item-content>
              <div class="overline font-weight-bold mb-4">Occupées</div>
              <v-list-item-title class="headline mb-1">
                <v-btn x-large block text color="primary">
                  <h1>{{numberOfTables - numberOfTablesAvailable}}</h1>
                  <v-icon class="ml-3" large right>mdi-close-circle-outline</v-icon>
                </v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mx-1" align="center" justify="center">
      <v-col cols="4" v-if="tables.length < 1">
        <v-progress-circular :size="70" :width="7" color="secondary" indeterminate></v-progress-circular>
      </v-col>
      <v-col cols="12" v-else>
        <div class="overline font-weight-bold">Besoin d'aide aux tables</div>
        <v-row>
          <v-col cols="3" v-for="table in tablesInNeed" :key="table.name">
            <!-- <v-btn block align="center" height="3rem" color="warning" dark>
              <h2>{{table.name}}</h2>
            </v-btn>-->
            <TableTile :table="table" :color="'warning'" />
          </v-col>
        </v-row>
        <div class="overline font-weight-bold">Activitée des tables</div>
        <v-row>
          <v-col cols="3" v-for="table in tables" :key="table.name">
            <TableTile :table="table" :color="table.available ? 'success' : 'primary'" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import HeadLine from "../components/communs/HeadLine.vue";
import TableTile from "../components/tables/TableTile.vue";
import TableHelper from "../mixins/tableHelper";

@Component({
  components: { HeadLine, TableTile },
})
export default class Products extends Mixins(TableHelper) {
  private search = "";
  private filters = [];

  mounted() {
    this.getTables();
  }
}
</script>


<style scoped>
</style>