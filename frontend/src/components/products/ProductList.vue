<template>
  <v-list subheader v-if="!client">
    <v-subheader>{{title}}</v-subheader>
    <ProductListItemBarman
      v-for="item in listProduct"
      :key="item.title"
      :item="item"
      @closeDialog="closeDialog"
    />
    <v-divider></v-divider>
  </v-list>
  <v-list two-line subheader v-else>
    <v-subheader>{{title}}</v-subheader>
    <ProductListItemClient v-for="item in listLineItem" :key="item.product.id" :lineItem="item" />
    <v-divider></v-divider>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ProductListItemBarman from "../products/ProductListItemBarman.vue";
import ProductListItemClient from "../products/ProductListItemClient.vue";
import { MProduct, MLineItem } from "../../models";

@Component({
  components: { ProductListItemBarman, ProductListItemClient },
})
export default class ProductList extends Vue {
  @Prop() readonly listProduct!: MProduct[];
  @Prop() readonly listLineItem!: MLineItem[];
  @Prop() readonly title!: string;
  @Prop({ default: false }) readonly client!: boolean;

  closeDialog() {
    this.$emit("closeDialog");
  }
}
</script>


<style scoped>
</style>