<template>
  <v-container>
    <HeadLine title="Nos Produits">
      <template v-slot:end> 
        <!-- <v-text-field
          v-model="search"
          dense
          solo
          :clearable="search.length > 2"
          filled
          flat
          style="max-width: 7rem"
          hide-details
          disabled
          prepend-inner-icon="mdi-database-search"
          label="Search"
        ></v-text-field>  -->
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small text fab color="primary" v-bind="attrs" v-on="on">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </template>
          <v-card>
            <HeadLine title="Ajouter un Produit" />
            <ProductForm :product="newProduct" @closeDialog="closeDialog" />
          </v-card>
        </v-dialog>
      </template>
    </HeadLine>
    <v-row class="mx-1">
      <v-col cols="12">
        <v-chip-group v-model="filters" multiple column active-class="primary--text text--accent-4">
          <v-chip filter outlined v-for="categorie in categories" :key="categorie.name">
            <v-icon small left>{{categorie.icon}}</v-icon>
            {{categorie.name}}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col block align="center" v-if="products.length < 1">
        <v-progress-circular :size="70" :width="7" color="secondary" indeterminate></v-progress-circular>
      </v-col>
      <v-col cols="12" v-else>
        <ProductList
          v-if="recomendations.length > 0 && filters.includes(3) || filters.length == 0"
          :listProduct="recomendations"
          title="Recommended"
          @closeDialog="closeDialog"
        />
        <ProductList
          v-if="beers.length > 0 && filters.includes(0) || filters.length == 0"
          :listProduct="beers"
          title="Beers"
          @closeDialog="closeDialog"
        />
        <ProductList
          v-if="softs.length > 0 && filters.includes(1) || filters.length == 0"
          :lilistProductst="softs"
          title="Softs"
          @closeDialog="closeDialog"
        />
        <ProductList
          v-if="foods.length > 0 && filters.includes(2) || filters.length == 0"
          :listProduct="foods"
          title="Foods"
          @closeDialog="closeDialog"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import HeadLine from "../components/communs/HeadLine.vue";
import ProductForm from "../components/products/ProductForm.vue";
import ProductList from "../components/products/ProductList.vue";
import ProductHelper from "../mixins/productHelper";
import { MProduct, Categories } from "../models";

const defaultProduct: MProduct = {
  name: "",
  id: "-1",
  price: -1,
  alcohol: -1,
  pictureUrl: "",
  description: "",
  available: true,
  categorie: { name: "", icon: "" },
};

@Component({
  components: { HeadLine, ProductForm, ProductList },
})
export default class Products extends Mixins(ProductHelper) {
  // private search = "";
  private categories = Categories;
  private filters = [];
  private newProduct = JSON.parse(JSON.stringify(defaultProduct));
  private dialog = false; // To open the modal

  mounted() {
    this.getProducts();
  }

  closeDialog() {
    this.dialog = false;
    this.newProduct = JSON.parse(JSON.stringify(defaultProduct));
  }
}
</script>


<style scoped>
</style>