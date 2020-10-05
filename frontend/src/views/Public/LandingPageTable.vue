<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="font-weight-bold">Hello,</h1>
        <h2>
          welcome
          <span class="font-weight-medium">à la</span> K-Fêt !
        </h2>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" class="mt-16">
      <v-col block align="center" class="mt-10" v-if="loading">
        <v-progress-circular :size="70" :width="7" color="secondary" indeterminate></v-progress-circular>
      </v-col>
      <v-col cols="6" align="center" v-if="!loading && !unavailable">
        <v-btn x-large fab :color="notified ? 'success' : ''" @click="notify">
          <v-icon v-if="!notified">mdi-bell</v-icon>
          <v-scroll-x-transition>
            <v-icon v-if="notified">mdi-bell-check</v-icon>
          </v-scroll-x-transition>
        </v-btn>
        <span v-if="notified" style="font-size: 1.5rem">
          <br />
          <br />Un
          <strong>Bénevole</strong>
          de la
          <strong>K-Fêt.</strong> est en train de venir pour
          <strong>activer</strong>
          la table {{this.$route.params.tableNumber}}.
        </span>
        <span v-else style="font-size: 1.5rem">
          <br />
          <br />Click ici pour appeler un
          <strong>Bénevole</strong>
          de la
          <strong>K-Fêt.</strong>
        </span>
        <span v-if="count > 17">
          <br />
          <br />Mdr tu as cliqué
          <strong>{{count}} fois</strong>
          <br />Tqt pas on arrive!
          <br />
          <strong>Bisous du dev.</strong>
        </span>
      </v-col>
      <v-col cols="8" align="center" v-if="!loading && unavailable">
        <v-icon color="primary" class="mt-3" style="font-size: 20vh">mdi-close-circle-outline</v-icon>
        <br />
        <strong style="font-size: 1.5rem" class="mr-1">Oups,</strong>
        <span
          style="font-size: 1.5rem"
        >la table {{this.$route.params.tableNumber}} est deja occupée.</span>
        <br />
        <strong class="mb-3">Commande sur le telephone Activé!</strong>
        <br />
        {{notified ? "Vous avez demandé de l'aide, On arrive vers ta table !" : 'Un autre problème ? Clique ici.'}}
        <br />
        <v-btn text class="mt-3" :color="notified ? 'success' : 'warning'" @click="notify">
          {{notified ? 'Notification envoyé' : 'Help Me'}}
          <v-icon small right class="my-8">{{!notified ? 'mdi-bell' : 'mdi-bell-check'}}</v-icon>
        </v-btn>
        <span v-if="count > 17">
          <br />
          <br />Mdr tu as cliqué
          <strong>{{count}} fois</strong>
          <br />Tqt pas on arrive!
          <br />
          <strong>Des Bisous. m.g.</strong>
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { HelpStates } from "../../models";
import TableService from "../../services/table.service";
import TokenService from "../../services/token.service";

@Component({
  components: {},
})
export default class LandingPageTable extends Vue {
  // Counting everytime the user spam.
  private count = 0;
  // Loading content.
  private loading = true;
  // Table Unavailable.
  private unavailable = false;
  // keep the table id
  private tableId = "";

  mounted() {
    this.getClientTable();
    const token = TokenService.getToken();
    if (token) {
      this.$router.push("/order");
    }
  }

  async getClientTable() {
    await TableService.getTableByNumber(
      parseInt(this.$route.params.tableNumber)
    )
      .then((table) => {
        // Keep the table id on the device.
        this.tableId = table.id;
        if (table.help.type.state != HelpStates.noNeed.state) {
          this.count = 1;
        }
        // if table is unavailable.
        if (!table.available) {
          // We activate the unavailable on this page to display a special message
          this.unavailable = true;
        }
      })
      .catch(() => {
        this.$toasted.global.error({
          message:
            "Bien essayé mais la table " +
            this.$route.params.tableNumber +
            " n'existe pas..",
        });
        this.$router.push("/");
      });
    this.loading = false;
  }

  notify() {
    // Send the notification if the user is spaming we dont send more we just count for fun ;).
    if (this.count === 0) {
      // We don't need to catch the fail here bcs if it fail the counter will not increment and we want this.
      // The service take in charge all the web notifications.
      TableService.askHelp(
        this.tableId,
        this.unavailable ? HelpStates.helpTableLock : HelpStates.activationTable
      ).then(() => this.count++);
    } else this.count++;
  }

  get notified() {
    return this.count >= 1;
  }
}
</script>


<style scoped>
</style>