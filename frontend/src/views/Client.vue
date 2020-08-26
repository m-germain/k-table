<template>
  <span>
    <v-container>
      <v-row class="mx-1">
        <v-col cols="12">
          <h2 class="font-weight-medium">Que souhaitez vous</h2>
          <h2>
            déguster
            <span class="font-weight-medium">ce soir ?</span>
          </h2>
        </v-col>
        <!-- <v-col cols="12">
          <h3 class="font-weight-medium">Nos Softs</h3>
          <v-list>
            <v-list-item-group v-model="selected" multiple active-class="secondary--text">
              <template v-for="(item, index) in items">
                <v-list-item :key="item.name" v-if="item.alcohol < 1">
                  <template v-slot:default="{ active }">
                    <v-list-item-icon class="ma-0 mr-4">
                      <h1>{{item.alcohol}}</h1>
                      <h4>%</h4>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        <span class="font-weight-medium">{{item.name}}</span>
                        <span class="ml-3 font-weight-ligth">{{item.description}}</span>
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-list-item-action-text v-text="item.action"></v-list-item-action-text>
                      <v-icon
                        v-if="!active"
                        color="grey lighten-1"
                      >mdi-checkbox-blank-circle-outline</v-icon>

                      <v-icon v-else color="success">mdi-checkbox-marked-circle-outline</v-icon>
                    </v-list-item-action>
                  </template>
                </v-list-item>

                <v-divider
                  v-if="index + 1 < items.length && item.alcohol < 1"
                  :key="item.id + index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-col>-->
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
        <v-col cols="4" v-if="lineItemList.length < 1">
          <v-progress-circular :size="70" :width="7" color="secondary" indeterminate></v-progress-circular>
        </v-col>
        <v-col cols="12" v-else>
          <ProductList
            v-if="recomendations.length > 0 && filters.includes(3) || filters.length == 0"
            :listLineItem="recomendations"
            title="Recommended"
            client="true"
          />
          <ProductList
            v-if="beers.length > 0 && filters.includes(0) || filters.length == 0"
            :listLineItem="beers"
            title="Beers"
            client="true"
          />
          <ProductList
            v-if="softs.length > 0 && filters.includes(1) || filters.length == 0"
            :listLineItem="softs"
            title="Softs"
            client="true"
          />
          <ProductList
            v-if="foods.length > 0 && filters.includes(2) || filters.length == 0"
            :listLineItem="foods"
            title="Foods"
            client="true"
          />
        </v-col>
      </v-row>
    </v-container>

    <v-navigation-drawer v-if="drawer" v-model="drawer" absolute bottom temporary>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <h2 class="font-weight-light grey-darken2--text">Votre commande</h2>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn text class @click="drawer = !drawer">
              <v-icon class="primary--text">mdi-arrow-down</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <ProductListItemClient
          v-for="lineItem of lineItems"
          :inOrder="true"
          :lineItem="lineItem"
          :key="lineItem.product.id"
        />
        <v-divider class="ml-3 mr-16"></v-divider>
        <v-list-item>
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
        <v-row justify="end" class="mr-13" v-if="totalPrice > 0 ">
          <v-col align="end" cols="6">
            <v-btn text color="primary">
              Commander
              <v-icon right>mdi-store</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-list>
    </v-navigation-drawer>

    <transition name="slide-fade">
      <v-btn v-if="lineItems.length > 0" class="absolute-btn ma-5" fab dark @click="openDrawer">
        <v-badge left :content="numberItems" :value="numberItems" color="primary">
          <v-icon>mdi-basket</v-icon>
        </v-badge>
      </v-btn>
    </transition>
  </span>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { Categories, MOrder } from "../models";
import LineItemHelper from "../mixins/lineItemtHelper";
import ProductList from "../components/products/ProductList.vue";
import ProductListItemClient from "../components/products/ProductListItemClient.vue";

@Component({
  components: { ProductList, ProductListItemClient },
})
export default class Barman extends Mixins(LineItemHelper) {
  // To show the client's command
  private drawer = false;
  private categories = Categories;
  private filters = [];

  created() {
    this.getProducts();
  }

  openDrawer() {
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    this.drawer = true;
  }
}
</script>


<style scoped>
.absolute-btn {
  position: fixed;
  bottom: 0;
  right: 0;
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