<template>
  <v-list subheader>
    <v-subheader>{{title}}</v-subheader>
    <ProductListItemBarman
      v-for="item in list"
      :key="item.title"
      :item="item"
      @closeDialogAndFetch="closeDialogAndFetch"
    />
    <v-divider></v-divider>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ProductListItemBarman from "../products/ProductListItemBarman.vue";
import { MProduct } from "../../models";

@Component({
  components: { ProductListItemBarman },
})
export default class ProductListBarman extends Vue {
  @Prop() readonly list!: MProduct[];
  @Prop() readonly title!: string;

  closeDialogAndFetch() {
    this.$emit("closeDialogAndFetch");
  }
}
</script>


<style scoped>
</style>