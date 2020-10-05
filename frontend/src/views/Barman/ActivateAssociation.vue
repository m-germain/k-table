<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="!activated">
        <h1 class="font-weight-bold">Hello,</h1>
        <h2>
          <span class="font-weight-medium">tu est sur le point d'</span>Activer
          <br />
          <span class="font-weight-medium">une</span>
          Association.
        </h2>
      </v-col>
      <v-col cols="12" v-else>
        <h1 class="font-weight-bold">
          {{ client.username }}
        </h1>
        <h2>
          <span class="font-weight-medium">Ton association</span>
          {{ this.$route.params.tableNumber }} est Activée.
        </h2>
        <h2>
          <span class="font-weight-medium">Tu peux scanner ce</span>
          QR Code :
        </h2>
      </v-col>
    </v-row>
    <v-row v-if="!activated">
      <v-col cols="12" align="center">
        <v-text-field
          block
          outlined
          prepend-inner-icon="mdi-account-edit"
          v-model="client.username"
          align="center"
          color="success"
          class="py-0"
          black
          label="Nom de l'association :"
          persistent-hint
          hint="Pour garder le ptit nom de l'asso"
        ></v-text-field>
        <v-btn
          block
          outlined
          :disabled="client.username.length < 2"
          align="center"
          color="success"
          black
          height="4rem"
          @click="activateAssociation"
          :loading="loading"
        >
          Activer l'Association
          <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
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
          Retourner au menu.
          <v-icon right>mdi-view-dashboard-outline</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" align="center">
        <v-btn
          text
          align="center"
          color="error"
          black
          height="4rem"
          @click="desactivate"
        >
          Désactiver Association
          <v-icon right>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import QrcodeVue from "qrcode.vue";
import UserDataForm from "../../components/forms/UserDataForm.vue";
import TokenService from "../../services/token.service";
import { MUserData } from "../../models";

@Component({
  components: { QrcodeVue, UserDataForm },
})
export default class ActivateAssociation extends Vue {
  private client: MUserData = {
    username: "",
    clientsAtTable: 0,
    minor: 0,
  } as MUserData;

  private loading = false;
  private activated = false;
  private activationLink = "https://k-table.kfet-insa.fr";
  private token = "";
  private size = 300;

  mounted() {
    TokenService.isAssociationTokeninDB()
      .then((associationData: { token: string; user: MUserData }) => {
        if (associationData.token.length > 10) {
          // If Asso activated display the QR code.
          this.client = associationData.user;
          this.token = associationData.token;
          this.activated = true;
          this.activationLink += "/activate/" + this.token;
          this.loading = false;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async activateAssociation() {
    this.loading = true;
    const token = TokenService.generateToken(
      this.client.username,
      this.client.clientsAtTable,
      this.client.minor,
      "",
      "association"
    );
    TokenService.activateAssociation(token).then(() => {
      this.token = token;
      {
        this.activated = true;
        this.activationLink += "/activate/" + token;
        this.loading = false;
      }
    });
  }

  backToTablePage() {
    this.$router.push("/admin");
  }

  desactivate() {
    TokenService.desactivateAssociation(this.token)
      .then(() => {
        this.$toasted.global.success({
          message: "Association Désactivée.",
        });
        this.backToTablePage();
      })
      .catch(() =>
        this.$toasted.global.error({
          message: "Imposible de réaliser cette action.",
        })
      );
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
