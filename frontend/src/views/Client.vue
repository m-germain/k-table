<template>
  <span>
    <v-container v-if="!loadingUser">
      <v-banner v-model="banner" two-line>
        <v-avatar slot="icon" color="primary accent-4" size="40">
          <v-icon icon="mdi-lock" color="white">mdi-alert-decagram</v-icon>
        </v-avatar>Attention, il y a des mineurs à ta table. Nous pouvons refuser de vous servir certaines boisons.
        <template
          v-slot:actions="{ dismiss }"
        >
          <v-btn text color="primary" @click="dismiss">J'ai compris</v-btn>
        </template>
      </v-banner>
      <v-banner v-model="bannertuto" two-line>
        <v-avatar slot="icon" color="success" size="40">
          <v-icon icon="mdi-lock" color="white">mdi-information</v-icon>
        </v-avatar>Voici l'interface de commande à table.
        Clique sur + pour selectionner des produits. Puis clique sur le petit pannier noir qui va apparaitre en bas à droite pour passer commande.
        <br />
        <br />La
        <v-icon class="mx-1">mdi-bell</v-icon>permet d'appeler un barman pour avoir de l'aide au sujet d'une commande.
        <br />
        <br />Le
        <v-icon class="mt-n1 mx-1">mdi-exit-run</v-icon>permet d'indiquer que vous avez fini votre soirée et vous voulez avoir vos jetons.
        <br />
        <br />Le
        <v-icon class="mt-n1 mx-1">mdi-order-bool-descending-variant</v-icon>permet de visualiser tes commandes passés.
        Si tu fermes la page de ton telephone tu peux simplement scanner le qr code sur ta table, tu seras envoyé ici ! Bonne soirée.
        <template
          v-slot:actions="{ dismiss }"
        >
          <v-btn text color="success" @click="dismiss">J'ai compris</v-btn>
        </template>
      </v-banner>
      <v-row class="mx-1">
        <v-col cols="9">
          <h1 class="font-weight-bold">Hello {{clientData.username}},</h1>
          <h2 class="font-weight-medium">que souhaitez vous</h2>
          <h2>
            commander
            <span class="font-weight-medium">pour la table</span>
            {{clientData.table}}.
          </h2>
        </v-col>
        <v-col cols="3">
          <v-btn fab depressed text :class="notified ? 'success' : ''" @click="help">
            <v-icon v-if="!notified">mdi-bell</v-icon>
            <v-scroll-x-transition>
              <v-icon v-if="notified">mdi-bell-check</v-icon>
            </v-scroll-x-transition>
          </v-btn>
          <v-btn fab depressed text :class="askLeaving ? 'success' : ''" @click="askLeave">
            <v-icon class="mt-n1">mdi-exit-run</v-icon>
          </v-btn>
          <v-btn fab depressed text to="/myorders">
            <v-icon class="mt-n1">mdi-order-bool-descending-variant</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="mx-1">
        <v-col cols="12">
          <v-chip-group
            v-model="filters"
            multiple
            column
            active-class="primary--text text--accent-4"
          >
            <v-chip filter outlined v-for="categorie in categories" :key="categorie.name">
              <v-icon small left>{{categorie.icon}}</v-icon>
              {{categorie.name}}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" class="mb-15">
        <v-col block align="center" v-if="lineItemList.length < 1">
          <v-progress-circular :size="70" :width="7" color="secondary" indeterminate></v-progress-circular>
        </v-col>
        <v-col cols="12" v-else>
          <ProductList
            v-if="recomendations.length > 0 && (filters.includes(0) || filters.length == 0)"
            :listLineItem="recomendations"
            title="Recommended"
            client="true"
          />
          <ProductList
            v-if="tapBeers.length > 0 && (filters.includes(1) || filters.length == 0)"
            :listLineItem="tapBeers"
            title="Tap Beers"
            client="true"
          />
          <ProductList
            v-if="bottledBeers.length > 0 && (filters.includes(2) || filters.length == 0)"
            :listLineItem="bottledBeers"
            title="Bottled Beers"
            client="true"
          />
          <ProductList
            v-if="wines.length > 0 && (filters.includes(3) || filters.length == 0)"
            :listLineItem="wines"
            title="Wines"
            client="true"
          />
          <ProductList
            v-if="softs.length > 0  && (filters.includes(4) || filters.length == 0)"
            :listLineItem="softs"
            title="Softs"
            client="true"
          />
          <ProductList
            v-if="foods.length > 0 && (filters.includes(5) || filters.length == 0)"
            :listLineItem="foods"
            title="Foods"
            client="true"
          />
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

    <v-navigation-drawer style="min-height: 75%" app v-if="drawer" v-model="drawer" bottom>
      <v-toolbar absolute flat width="100%" class="border-bottom">
        <v-list-item>
          <v-list-item-content>
            <h2 class="font-weight-light grey-darken2--text">Votre commande</h2>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn text class @click="closeDrawer">
              <v-icon class="primary--text">mdi-arrow-down</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-toolbar>
      <v-list class="mt-12">
        <ProductListItemClient
          v-for="lineItem of lineItems"
          :inOrder="true"
          :lineItem="lineItem"
          :key="lineItem.product.id"
        />
        <v-divider class="ml-3 mr-16"></v-divider>
        <v-list-item class="mb-12">
          <v-list-item-content>
            <h3 class="font-weight-light grey-darken2--text">Total</h3>
          </v-list-item-content>
          <v-list-item-content align="end">
            <v-list-item-title>
              <span class="font-weight-bold">{{totalPrice}} €</span>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn small text disabled color="sucess"></v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-footer padless absolute class="font-weight-medium" style="background-color: transparent;">
        <v-col class="text-center" cols="12">
          <v-btn block color="primary" @click="order">
            Commander
            <v-icon right>mdi-store</v-icon>
          </v-btn>
        </v-col>
      </v-footer>
    </v-navigation-drawer>

    <transition name="slide-fade">
      <v-btn
        x-large
        v-if="lineItems.length > 0"
        class="absolute-btn ma-8"
        fab
        dark
        @click="openDrawer"
      >
        <v-badge left :content="numberItems" :value="numberItems" color="primary">
          <v-icon>mdi-basket</v-icon>
        </v-badge>
      </v-btn>
    </transition>
  </span>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { Categories, MUserData, HelpStates, MHelp } from "../models";
import LineItemHelper from "../mixins/lineItemtHelper";
import ProductList from "../components/products/ProductList.vue";
import ProductListItemClient from "../components/products/ProductListItemClient.vue";
import OrderService from "../services/order.service";
import TokenService from "../services/token.service";
import TableService from "../services/table.service";

@Component({
  components: { ProductList, ProductListItemClient },
})
export default class Barman extends Mixins(LineItemHelper) {
  // To show the client's command
  private drawer = false;
  private banner = false; // Minor banner
  private bannertuto = true;
  private categories = Categories;
  private filters = [];
  private loadingUser = true;

  // Counting everytime the user spam.
  private count = 0;
  private leave = 0;

  // Client Data
  private clientData: MUserData = {
    username: "",
    tableId: "",
    table: "",
    clientsAtTable: 0,
    minor: 0,
  };

  mounted() {
    this.checkUser();
    this.getProducts();
  }

  async checkUser() {
    await TokenService.getAndDecodeToken()
      .then((userData: MUserData) => {
        this.clientData = userData as MUserData;
        if (userData.minor > 0) {
          this.banner = true;
        }
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

  openDrawer() {
    window.scrollTo({
      left: 0,
      top: window.innerHeight,
      behavior: "smooth",
    });
    this.drawer = true;
  }

  closeDrawer() {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth",
    });
    this.drawer = false;
  }

  order() {
    TokenService.getAndDecodeToken()
      .then((userData: MUserData) => {
        OrderService.createOrder(userData, this.lineItems)
          .then(() => {
            this.$toasted.global.success({
              message: "Yes ! Ta commande en cours de préparation...",
            });
            if (this.clientData.minor > 0) {
              this.banner = true;
            }
            this.$router.push("/myorders");
            this.getProducts();
            this.closeDrawer();
          })
          .catch(() => {
            this.$toasted.global.error({
              message: "Imposible de préparer la commande, essayez plus tard..",
            });
          });
      })
      .catch(() => {
        this.$toasted.global.error({
          message:
            "Imposible de préparer la commande, ton téléphone à été désactivé..",
        });
        this.$router.push("/");
      });
  }

  notify(count: number, help: MHelp) {
    // Send the notification if the user is spaming we dont send more we just count for fun ;).
    if (count === 0 && this.clientData.tableId) {
      // We don't need to catch the fail here bcs if it fail the counter will not increment and we want this.
      // The service take in charge all the web notifications.
      TableService.askHelp(this.clientData.tableId, help).then(() => count++);
    } else count++;
  }

  help() {
    this.notify(this.count, HelpStates.helpInOrder);
  }

  askLeave() {
    this.notify(this.leave, HelpStates.leaveTable);
  }

  get notified() {
    return this.count >= 1;
  }

  get askLeaving() {
    console.log(this.leave >= 1);

    return this.leave >= 1;
  }
}
</script>


<style scoped>
.border-bottom {
  border-bottom: 0.8px solid rgba(37, 37, 37, 0.082) !important;
}

.absolute-btn {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 3;
}

.fit-screen {
  max-height: 100vh;
  overflow: scroll;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>