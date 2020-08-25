<template>
  <span>
    <v-card-text>
      <v-form ref="productForm" v-model="productFormValid" lazy-validation>
        <v-row>
          <v-col cols="12" sm="6" md="6" class="py-0">
            <v-autocomplete
              class="ma-0 pa-0"
              v-model="formProduct.categorie"
              color="secondary"
              :items="categories"
              :rules="[v => !!v || 'La catégorie est obligatoire']"
              chips
              label="Choix de la catégorie du produit"
              item-text="name"
              return-object
            >
              <template v-slot:selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  class="text-capitalize"
                  dark
                  @click="data.select"
                >
                  <v-icon left>{{data.item.icon}}</v-icon>
                  {{ data.item.name }}
                </v-chip>
              </template>
              <template v-slot:item="data">
                <template v-if="typeof data.item !== 'object'">
                  <v-list-item-content v-text="data.item"></v-list-item-content>
                </template>
                <template v-else>
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-icon left>{{data.item.icon}}</v-icon>
                      {{data.item.name}}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="6" class="py-0">
            <v-text-field
              class="pt-0"
              label="Nom du Produit*"
              color="secondary"
              hint="exemple : St-Stefanus Blonde"
              persistent-hint
              :rules="[v => !!v || 'Le nom est obligatoire']"
              required
              v-model="formProduct.name"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="6" md="6">
            <v-text-field
              label="Degré d'alcool*"
              hint="exemple : 5.5 (Avec un point)"
              color="secondary"
              append-icon="°"
              type="number"
              persistent-hint
              :rules="[v => !!v || 'Le prix est obligatoire']"
              required
              v-model="formProduct.alcohol"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="6" md="6">
            <v-text-field
              label="Prix*"
              hint="exemple : 3.50 (Avec un point)"
              color="secondary"
              append-icon="mdi-currency-eur"
              persistent-hint
              type="number"
              :rules="[v => !!v || 'Le prix est obligatoire']"
              required
              v-model="formProduct.price"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Description*"
              hint="exemple : Une bière légère et sucrée"
              color="secondary"
              persistent-hint
              :rules="[v => !!v || 'La description est obligatoire, respect un peu ;)']"
              required
              v-model="formProduct.description"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field
              label="Url Image du Produit"
              color="secondary"
              hint="exemple : htts://monimagede4K.png"
              persistent-hint
              v-model="formProduct.pictureUrl"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-switch
              v-model="formProduct.available"
              color="teal ligthen-2"
              label="Disponible à la vente"
            ></v-switch>
          </v-col>
        </v-row>
      </v-form>
      <small>*champs obligatoires</small>
    </v-card-text>

    <v-card-actions v-if="!update">
      <v-spacer></v-spacer>
      <v-btn text @click="close">Annuler</v-btn>
      <v-btn
        color="primary"
        :disabled="!productFormValid"
        depressed
        class="mx-6"
        @click="createNewProduct()"
      >Créer</v-btn>
    </v-card-actions>

    <v-card-actions v-else>
      <v-spacer></v-spacer>
      <v-btn text @click="close">Annuler</v-btn>
      <v-btn
        depressed
        color="primary"
        class="mx-6 mb-2"
        :disabled="!productFormValid"
        @click="updateProduct()"
      >Enregistrer</v-btn>
    </v-card-actions>
  </span>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */

import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import ProductService from "../../services/product.service";
import { MProduct, VForm, Categories } from "../../models";

@Component({
  components: {},
})
export default class ProductForm extends Vue {
  private categories = Categories;
  @Prop() readonly product!: MProduct;
  @Prop({ default: false }) update!: boolean;

  //The form product is a copy of the product passed
  // C'est ce form qui sera envoyé.
  private formProduct = JSON.parse(JSON.stringify(this.product));

  private productFormValid = false;
  @Ref("productForm") readonly productForm!: VForm;

  async createNewProduct() {
    if (this.productForm.validate()) {
      ProductService.addProduct(this.formProduct).then(() => this.close());
    }
  }

  close() {
    this.productForm.resetValidation();
    this.$emit("closeDialogAndFetch");
  }

  async updateProduct() {
    ProductService.updateProduct(this.formProduct).then(() => this.close());
  }
}
</script>

<style>
</style>