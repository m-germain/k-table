<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-badge
        :content="table.clientsAtTable"
        :value="table.clientsAtTable"
        :color="color"
        style="width:100%"
        class="pa-0 ma-0"
        overlap
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
          <v-btn block outlined align="center" color="success" height="3rem" @click="dismissNotify">
            <v-icon>mdi-account-multiple-check-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" class="mx-1">
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
            <v-icon right>{{table.available ? "mdi-checkbox-marked-circle-outline": "mdi-exit-run"}}</v-icon>
          </v-btn>
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
}
</script>


<style scoped>
</style>