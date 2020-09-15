<template>
  <span>
    <v-banner v-model="bannertuto" two-line>
      <v-avatar slot="icon" color="success" size="40">
        <v-icon icon="mdi-lock" color="white">mdi-information</v-icon>
      </v-avatar>Ici tu peux visualiser les commandes que tu as passés. Pour passer une nouvelle commande clique sur :
      <v-icon class="mx-1">mdi-basket</v-icon>
      <template v-slot:actions="{ dismiss }">
        <v-btn text color="success" @click="dismiss">J'ai compris</v-btn>
      </template>
    </v-banner>
    <v-container v-if="!loadingUser">
      <v-row class="mx-1">
        <v-col cols="9">
          <h1 class="font-weight-bold">Hello {{clientData.username}},</h1>
          <h2 class="font-weight-medium">voici vos dernières</h2>
          <h2>
            Commandes
            <span class="font-weight-medium">sur la table</span>
            {{clientData.table}}.
          </h2>
        </v-col>
        <v-col cols="3">
          <v-btn fab depressed text :color="notified ? 'success' : ''" @click="notify">
            <v-icon v-if="!notified">mdi-bell</v-icon>
            <v-scroll-x-transition>
              <v-icon v-if="notified">mdi-bell-check</v-icon>
            </v-scroll-x-transition>
          </v-btn>
          <v-btn fab depressed text to="/order">
            <v-icon>mdi-basket</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" class="mb-15">
        <v-col block align="center" v-if="myOrders.length < 1">
          <v-progress-circular :size="70" :width="7" color="secondary" indeterminate></v-progress-circular>
          <br />
          <br />En attente de commandes.
          <br />Vous n'avez peut etre pas encore passé de commandes...
        </v-col>
        <v-col cols="12" v-for="order in myOrders" :key="order.id">
          <OrderTile :client="true" :order="order" />
        </v-col>
      </v-row>
      <v-footer padless absolute class="font-weight-thin" style="background-color: transparent;">
        <v-col class="text-center" cols="12">
          Made with
          <v-icon small class="mr-1" color="primary">mdi-heart</v-icon>by m.g.
        </v-col>
      </v-footer>
    </v-container>
    <v-container v-else>
      <v-row align="center" justify="center" class="mt-16">
        <v-col block align="center" class="mt-10">
          <v-progress-circular :size="70" :width="7" color="secondary" indeterminate></v-progress-circular>
        </v-col>
      </v-row>
    </v-container>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { HelpStates, MOrder, MUserData } from "../models";
import OrderTile from "../components/orders/OrderTile.vue";
import OrderService from "../services/order.service";
import TokenService from "../services/token.service";
import TableService from "../services/table.service";

@Component({
  components: { OrderTile },
})
export default class MyOrders extends Vue {
  private loadingUser = true;
  private myOrders: MOrder[] = [];
  private bannertuto = true;

  // Counting everytime the user spam.
  private count = 0;

  // Set an Interval to fetch the orders every 2 min
  private interval = setInterval(() => {
    this.getOrders();
  }, 120000);

  // Client Data
  private clientData: MUserData = {
    username: "",
    tableId: "",
    table: "",
    minor: false,
    iat: -1,
    exp: -1,
  };

  mounted() {
    this.checkUser();
  }

  async checkUser() {
    await TokenService.getAndDecodeToken()
      .then((userData: MUserData) => {
        this.clientData = userData as MUserData;
        this.getOrders();
        this.loadingUser = false;
      })
      .catch(() => {
        // If there is no token or it is expiered or invalid for this table.
        this.$toasted.global.error({
          message: "Télephone n'est plus activé. Si besoin demandez de l'aide.",
        });
        this.$router.push("/");
      });
  }

  async getOrders() {
    // Get orders of a given client.
    this.myOrders = await OrderService.getOrdersOfClient(this.clientData);
    console.log(this.myOrders);
  }

  notify() {
    // Send the notification if the user is spaming we dont send more we just count for fun ;).
    if (this.count === 0 && this.clientData.tableId) {
      // We don't need to catch the fail here bcs if it fail the counter will not increment and we want this.
      // The service take in charge all the web notifications.
      TableService.askHelp(this.clientData.tableId, HelpStates.helpInOrder).then(() => this.count++);
    } else this.count++;
  }

  get notified() {
    return this.count >= 1;
  }
}
</script>


<style scoped>
</style>