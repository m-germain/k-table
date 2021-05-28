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
        <h1 class="font-weight-bold">Voila {{client.username}} !</h1>
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
    <UserDataForm :client="client" v-if="!activated">
      <template slot="btn">
        <v-btn
          block
          outlined
          :disabled="client.username.length < 2 || client.clientsAtTable <= 0 || client.minor > client.clientsAtTable"
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
      </template>
    </UserDataForm>
    <v-row align="center" justify="center" v-else>
      <v-col cols="12" align="center">
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
import UserDataForm from "../../components/forms/UserDataForm.vue";
import TableService from "../../services/table.service";
import TokenService from "../../services/token.service";
import { MUserData } from "../../models";

@Component({
  components: { QrcodeVue, UserDataForm },
})
export default class ActivateTable extends Vue {
  private client: MUserData = {
    username: "",
    clientsAtTable: 0,
    minor: 0,
  } as MUserData;

  private loading = false;
  private activated = false;
  private activationLink = "https://k-table.kfet-insa.fr";
  private size = 300;

  async activateTable() {
    this.loading = true;
    const token = TokenService.generateToken(
      this.client.username,
      this.client.clientsAtTable,
      this.client.minor,
      this.$route.params.tableId,
      this.$route.params.tableNumber
    );
    const client: MUserData = await TokenService.decode(token);
    TableService.activateTable(this.$route.params.tableId, client, token).then(
      () => {
        {
          this.activated = true;
          this.activationLink += "/activate/" + token;
          this.loading = false;
        }
      }
    );
  }

  backToTablePage() {
    this.$router.push("/admin/tables");
  }
}
</script>


<style lang="scss">
.v-input--reverse .v-input__slot {
  flex-direction: row-reverse;
  justify-content: flex-end;
  .v-application--is-ltr & {
    .v-input--selection-controls__input {
      margin-right: 0;
      margin-left: 8px;
    }
  }
  .v-application--is-rtl & {
    .v-input--selection-controls__input {
      margin-left: 0;
      margin-right: 8px;
    }
  }
}

.v-input--expand .v-input__slot {
  // justify-content: space-between;
  .v-label {
    display: block;
    flex: 1;
  }
}
</style>