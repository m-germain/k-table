<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="!activated">
        <h1 class="font-weight-bold">Hello,</h1>
        <h2>
          <span class="font-weight-medium">tu est sur le point d'</span>Activer
          <br />
          <span class="font-weight-medium">la</span>
          Table {{this.$route.params.tableNumber}}.
        </h2>
      </v-col>
      <v-col cols="12" v-else>
        <h1 class="font-weight-bold">Voila {{clientName}} !</h1>
        <h2>
          <span class="font-weight-medium">La table</span>
          {{this.$route.params.tableNumber}} est Activée.
        </h2>
        <h2>
          <span class="font-weight-medium">Tu peux scanner ce</span>
          QR Code :
        </h2>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" v-if="!activated">
      <v-col cols="8" class="mt-10">
        <v-text-field
          block
          outlined
          v-model="clientName"
          align="center"
          color="success"
          black
          label="Table est au prénom de :"
          persistent-hint
          hint="Pour garder le ptit nom de la personne"
        ></v-text-field>
      </v-col>
      <v-col cols="8">
        <v-btn
          block
          outlined
          :disabled="clientName.length < 2"
          align="center"
          color="success"
          black
          height="4rem"
          @click="activateTable"
          :loading="loading"
        >
          Activer la table
          <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" v-else>
      <v-col cols="12" align="center" class="mt-10">
        <qrcode-vue :value="activationLink" :size="size" level="L"></qrcode-vue>
        <v-btn
          class="mt-10"
          text
          align="center"
          color="success"
          black
          height="4rem"
          @click="backToTablePage"
        >
          Retourner à la page des tables
          <v-icon right>mdi-view-dashboard-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import QrcodeVue from "qrcode.vue";
import TableService from "../services/table.service";
import TokenService from "../services/token.service";

@Component({
  components: { QrcodeVue },
})
export default class ActivateTable extends Vue {
  private clientName = "";
  private loading = false;
  private activated = false;
  private activationLink = "https://k-table.firebaseapp.com";
  private size = 300;

  activateTable() {
    this.loading = true;
    const token = TokenService.generateToken(
      this.clientName,
      this.$route.params.tableId,
      this.$route.params.tableNumber
    );
    TableService.activateTable(this.$route.params.tableId, token).then(() => {
      {
        this.activated = true;
        console.log(token);
        this.activationLink += "/activate/" + token;
        this.loading = false;
      }
    });
  }

  backToTablePage() {
    this.$router.push("/manager/admin/tables");
  }
}
</script>


<style scoped>
</style>