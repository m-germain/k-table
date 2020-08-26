<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon :color="item.available ? 'success' : 'error accent-4'">{{item.categorie.icon}}</v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title class="font-weight-medium">{{item.name}}</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn small text fab color="primary" v-bind="attrs" v-on="on">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <v-card>
          <HeadLine title="Ajouter un Produit" />
          <ProductForm :product="item" update="true" @closeDialog="closeDialog" />
        </v-card>
      </v-dialog>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ProductForm from "./ProductForm.vue";
import HeadLine from "../communs/HeadLine.vue";
import { MProduct } from "../../models";

@Component({
  components: { ProductForm, HeadLine },
})
export default class ProductListItemBarman extends Vue {
  @Prop() readonly item!: MProduct;

  private dialog = false;

  closeDialog() {
    this.dialog = false;
    this.$emit("closeDialog");
  }
}
</script>


<style scoped>
</style>