<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-badge
        :content="table.available ? table.capacity : table.clientsAtTable "
        :value="table.available ? table.capacity : table.clientsAtTable "
        :color="color"
        style="width:100%"
        class="pa-0 ma-0"
        overlap
        :left="table.available"
      >
        <v-btn
          style="width:100%"
          align="center"
          height="3rem"
          :color="color"
          dark
          v-bind="attrs"
          v-on="on"
        >
          <h2>{{table.name}}</h2>
        </v-btn>
      </v-badge>
    </template>
    <v-card>
      <HeadLine class="my-2" :title="'T-' + table.name" weight="bold">
        <template v-slot:start>
          <v-btn
            text
            align="center"
            class="mr-2"
            :to="{path: '/qrcode/'+ table.name}"
            target="_blank"
          >
            <v-icon left>mdi-printer</v-icon>
            <v-icon right>mdi-qrcode</v-icon>
          </v-btn>
        </template>
        <template v-slot:end>
          <v-btn depressed align="center" :color="table.available ? 'success' : 'primary'" dark>
            <h3>{{table.available ? "Disponible": "Occupée"}}</h3>
            <v-icon
              right
            >{{table.available ? "mdi-checkbox-marked-circle-outline": "mdi-close-circle-outline"}}</v-icon>
          </v-btn>
        </template>
      </HeadLine>
      <v-row align="center" justify="center" class="mx-1 my-2">
        <v-col cols="12">
          <v-tabs background-color="white" color="primary" right>
            <v-tab>Manager</v-tab>
            <v-spacer></v-spacer>
            <v-tab>
              <v-icon>mdi-settings</v-icon>
            </v-tab>

            <v-tab-item :key="1">
              <v-container fluid>
                <v-row align="center" justify="center">
                  <v-col v-if="!table.available" cols="12" class="headline">
                    Table de {{table.clientsAtTable}} personnes, au nom de
                    <strong>{{table.clientName}}.</strong>
                  </v-col>
                  <v-col>
                    <v-btn
                      block
                      depressed
                      :outlined="!table.help"
                      align="center"
                      :color="!table.help ? 'success': 'warning'"
                      height="3rem"
                    >
                      {{!table.help ? "tout est ok": helpMessage}}
                      <v-icon small right>{{!table.help ? "mdi-bell": "mdi-bell-ring"}}</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="3" v-if="table.help">
                    <v-btn
                      block
                      outlined
                      align="center"
                      color="success"
                      height="3rem"
                      @click="dismissNotify"
                    >
                      <v-icon>mdi-account-multiple-check-outline</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row align="center" justify="center">
                  <v-col cols="12">
                    <v-btn
                      block
                      outlined
                      align="center"
                      black
                      height="3rem"
                      @click="table.available ? activateTable() : liberateTable() "
                    >
                      {{table.available ? "Activer la table": "Libérer la table"}}
                      <v-icon
                        right
                      >{{table.available ? "mdi-checkbox-marked-circle-outline": "mdi-exit-run"}}</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
            <v-tab-item :key="2">
              <v-container fluid>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      block
                      outlined
                      class="py-0"
                      v-model="table.capacity"
                      align="center"
                      color="success"
                      type="number"
                      pattern="\d*"
                      black
                      label="Capacitée de la table."
                      persistent-hint
                      hint="Pour calculer et afficher les tables et places restantes"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" v-if="table.clientsAtTable != ''">
                    <v-text-field
                      block
                      outlined
                      class="py-0"
                      v-model="table.clientsAtTable"
                      align="center"
                      color="success"
                      type="number"
                      pattern="\d*"
                      black
                      label="Nombres de personnes à la table."
                      persistent-hint
                      hint="Si des personnes se rajoutend tu peux les ajouter ici."
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col cols="12">
                    <v-switch
                      inset
                      v-model="table.minor"
                      
                      color="success"
                      black
                      class="py-0 v-input--reverse v-input--expand"
                      persistent-hint
                      hint="Pas encore disponible..."
                    >
                      <template #label>Mineurs à la table</template>
                    </v-switch>
                  </v-col>-->
                  <v-col cols="12" align="end">
                    <v-btn depressed align="center" color="success" dark @click="saveChanges">
                      Enregistrer
                      <v-icon right>mdi-check</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import HeadLine from "../communs/HeadLine.vue";
import { MTable } from "../../models";
import TableService from "../../services/table.service";

@Component({
  components: { HeadLine },
})
export default class ProductListItemClient extends Vue {
  @Prop() table!: MTable;
  @Prop() color!: string;

  private dialog = false;
  private helpMessage = "Besoin d'aide";
  private tableUrl = "";

  mounted() {
    if (this.table.available) {
      this.helpMessage = "Attente Validation";
    }
  }

  dismissNotify() {
    TableService.resolveHelp(this.table.id);
  }

  activateTable() {
    this.$router.push("activate/" + this.table.id + "/" + this.table.name);
  }

  liberateTable() {
    // Liberate the table if everything go well, we close the dialog.
    TableService.liberateTable(this.table.id).then(() => (this.dialog = false));
  }

  saveChanges() {
    TableService.updateTable(this.table);
  }
}
</script>


<style scoped>
</style>