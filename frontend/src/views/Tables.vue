<template>
  <v-container>
    <HeadLine title="Nos Tables">
      <template v-slot:end>
        <v-dialog v-model="dialog" max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              color="primary"
              :disabled="!canActivateFreshStart"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-eraser</v-icon>
            </v-btn>
            <v-btn
              text
              color="primary"
              :disabled="
                !canActivateFreshStart &&
                  !(numberOfTables == numberOfTablesAvailable)
              "
              @click="blockTables"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </template>
          <v-card>
            <HeadLine
              class="my-2"
              :title="'Réinitialiser les tables'"
              weight="bold"
            >
              <template v-slot:end>
                <v-btn color="error" outlined>
                  <v-icon>mdi-alert</v-icon>
                </v-btn>
              </template>
            </HeadLine>
            <v-row align="center" justify="center" class="mx-1 my-2">
              <v-col cols="12" align="center">
                Ce bouton va retirer les notifications d'aide sur toutes les
                tables et va libérer toutes les tables.
                <br />(Ca ne touche pas au nombre de tables ni a la capacité des
                tables.)
                <br />
                <br />

                <v-btn
                  depressed
                  align="center"
                  color="black"
                  dark
                  @click="freshStart"
                >
                  Réinitialiser
                  <v-icon right>mdi-nuke</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </template>
    </HeadLine>
    <v-card class="mx-4 my-3">
      <v-row align="center" class="mx-2" justify="space-between">
        <v-col>
          <v-btn
            text
            :loading="loading"
            :disabled="loading"
            color="primary"
            @click="removeTable"
          >
            <v-icon>mdi-minus-circle</v-icon>
          </v-btn>
        </v-col>
        <v-col align="center">
          <h2>{{ numberOfTables }}</h2>
        </v-col>
        <v-col align="right">
          <v-btn
            text
            :loading="loading"
            :disabled="loading"
            color="success"
            @click="addTable"
          >
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
              <div class="overline font-weight-bold mb-4">
                Tables Disponibles
              </div>
              <v-list-item-title class="headline mb-1">
                <v-btn x-large block text color="success">
                  <h1>{{ numberOfTablesAvailable }}</h1>
                  <v-icon class="ml-3" large right
                    >mdi-checkbox-marked-circle-outline</v-icon
                  >
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
              <div class="overline font-weight-bold mb-4">Tables Occupées</div>
              <v-list-item-title class="headline mb-1">
                <v-btn x-large block text color="primary">
                  <h1>{{ numberOfTables - numberOfTablesAvailable }}</h1>
                  <v-icon class="ml-3" large right
                    >mdi-close-circle-outline</v-icon
                  >
                </v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mx-1" align="center" justify="center">
      <v-col block align="center" v-if="tables.length < 1">
        <v-progress-circular
          :size="70"
          :width="7"
          color="secondary"
          indeterminate
        ></v-progress-circular>
      </v-col>
      <v-col cols="12" v-else>
        <div v-if="tablesInNeed.length > 0" class="overline font-weight-bold">
          Besoin d'aide aux tables
        </div>

        <v-row v-if="tablesInNeed.length > 0">
          <v-col cols="3" v-for="table in tablesInNeed" :key="table.name">
            <TableTile :table="table" :color="table.help.type.color" />
          </v-col>
        </v-row>
        <div class="overline font-weight-bold">Activitée des tables</div>
        <v-row>
          <v-col cols="3" v-for="table in tables" :key="table.name">
            <TableTile
              :table="table"
              :color="table.available ? 'success' : 'primary'"
            />
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
export default class Tables extends Mixins(TableHelper) {
  private dialog = false;
  private filters = [];

  mounted() {
    this.getTables();
  }

  // The btn fresh start alow the user to liberate all tables.
  get canActivateFreshStart(): boolean {
    let canActivate = false;
    // We check only the dates
    const now = new Date();
    // Convert it to today 00h30
    const today0030 = new Date();
    const today1900 = new Date();

    today0030.setHours(0);
    today0030.setMinutes(30);
    today0030.setSeconds(0);

    today1900.setHours(19);
    today1900.setMinutes(0);
    today1900.setSeconds(0);

    if (now < today1900 && now > today0030) {
      // So we are btw 00H30 and 19H so we can manage tables.
      canActivate = true;
    }
    return canActivate;
  }
}
</script>

<style scoped></style>
