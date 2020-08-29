<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="loading">
        <h1 class="font-weight-bold">Patientez,</h1>
        <h2>
          <span class="font-weight-medium">
            l'activation de votre
            <br />telephone est en
          </span>cours.
        </h2>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" v-if="loading">
      <v-col cols="3" class="mt-10">
        <v-progress-circular :size="70" :width="7" color="secondary" indeterminate></v-progress-circular>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" v-else>
      <v-col cols="12" align="center" class="mt-10">
        <v-btn class="mt-10" text align="center" color="success" black height="4rem">
          Retourner à la page des tables
          <v-icon right>mdi-view-dashboard-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TokenService from "../services/token.service";
import { error } from "console";
import { MUserData } from "../models";

@Component({
  components: {},
})
export default class ActivatePhone extends Vue {
  private loading = true;

  mounted() {
    TokenService.decode(this.$route.params.token)
      .then((userData: MUserData) => {
        if (userData.username === "admin") {
          this.$toasted.global.success({
            message: "Téléphone barman Activé.",
          });
          this.$router.push("/admin");
        } else {
          this.$toasted.global.success({
            message:
              "C'est tout bon " +
              userData.username +
              ", ton télephone est maintenant activé pour la table " +
              userData.table +
              ".",
          });
          this.$router.push("/order");
        }
      })
      .catch((error) => {
        this.$toasted.global.error({
          message: "Accès refusé !" + error,
        });
        this.$router.push("/");
      });
  }
}
</script>


<style scoped>
</style>