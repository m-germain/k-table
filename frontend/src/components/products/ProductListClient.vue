<template>
  <v-container>
    <v-row dense>
      <span class="overline ml-2" v-text="categorie.name"></span>
      <v-icon class="ml-3" small>{{ categorie.icon }}</v-icon>
      <v-col v-for="(lineItem, i) in listLineItem" :key="i" cols="12">
        <v-card flat>
          <div class="d-flex flex-row justify-space-between">
            <div class="d-flex flex-row justify-start">
              <img
                :src="lineItem.product.pictureUrl"
                contain
                height="100"
                class="ma-2"
                v-if="lineItem.product.pictureUrl"
              />
              <img
                src="https://firebasestorage.googleapis.com/v0/b/k-table.appspot.com/o/K-fet_comming-soon.png?alt=media&token=aa3cabf3-7b52-47e2-a947-92c4238020e7"
                contain
                height="100"
                class="ma-2"
                v-else
              />
              <div class="d-flex flex-column mt-4">
                <div>
                  <span
                    class="font-weight-bold"
                    v-bind:class="{ 'success--text': lineItem.quantity > 0 }"
                    v-text="lineItem.product.name"
                  >
                  </span>
                  <transition name="slide-fade">
                    <v-icon
                      v-if="lineItem.quantity > 0"
                      small
                      class="ml-2 mb-1"
                      color="success"
                      >mdi-checkbox-marked-circle-outline</v-icon
                    >
                  </transition>
                </div>

                <span
                  v-if="categorie == categories[0]"
                  class="font-weight-regular"
                  style="text-color: dark-grey"
                  >{{ lineItem.product.alcohol }}° -
                  {{ lineItem.product.price }}€ l'unité</span
                >
                <span
                  v-if="categorie == categories[1]"
                  class="font-weight-regular"
                  style="text-color: dark-grey"
                  >{{ lineItem.product.alcohol }}° -
                  {{ lineItem.product.price }}€ l'unité</span
                >
                <span
                  v-if="categorie == categories[2]"
                  class="font-weight-regular"
                  style="text-color: dark-grey"
                  >{{ lineItem.product.alcohol }}° -
                  {{ lineItem.product.price }}€ l'unité</span
                >
                <span
                  v-if="categorie == categories[3]"
                  class="font-weight-regular"
                  style="text-color: dark-grey"
                  >{{ lineItem.product.alcohol }}° -
                  {{ lineItem.product.price }}€ l'unité</span
                >
                <span
                  v-if="categorie == categories[4]"
                  class="font-weight-regular"
                  style="text-color: dark-grey"
                  >{{ categorie.name }} - {{ lineItem.product.price }}€
                  l'unité</span
                >
                <span
                  v-if="categorie == categories[5]"
                  class="font-weight-regular"
                  style="text-color: dark-grey"
                  >{{ categorie.name }} - {{ lineItem.product.price }}€
                  l'unité</span
                >
                <span
                  class="font-weight-light"
                  style="
                    max-height: 40px;
                    min-width: 3rem;
                    overflow: scroll;
                    font-size: 14px;
                  "
                  v-text="lineItem.product.description"
                >
                </span>
              </div>
            </div>

            <div class="d-flex flex-column">
              <v-btn
                class="ma-2"
                fab
                dark
                elevation="0"
                v-bind:class="{ success: lineItem.quantity > 0 }"
                x-small
                @click="lineItem.quantity = lineItem.quantity + 1"
              >
                <v-icon> mdi-plus </v-icon>
              </v-btn>
              <transition name="slide-fade-invert">
                <div
                  class="text-center"
                  style="height: 20px"
                  v-if="lineItem.quantity > 0"
                >
                  x<span class="font-weight-bold">{{ lineItem.quantity }}</span>
                </div>
                <div class="text-center" style="height: 20px" v-else></div>
              </transition>
              <v-btn
                class="ma-2"
                fab
                outlined
                x-small
                @click="
                  lineItem.quantity > 0
                    ? (lineItem.quantity = lineItem.quantity - 1)
                    : (lineItem.quantity = 0)
                "
              >
                <v-icon> mdi-minus </v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
        <hr style="opacity: 0.5" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ProductListItemBarman from "./ProductListItemBarman.vue";
import ProductListItemClient from "./ProductListItemClient.vue";
import { Categories, MCategorie, MLineItem } from "../../models";

@Component({
  components: { ProductListItemBarman, ProductListItemClient },
})
export default class ProductListClient extends Vue {
  @Prop() readonly listLineItem!: MLineItem[];
  @Prop() readonly categorie!: MCategorie;
  private categories = [...Categories];

  closeDialog() {
    this.$emit("closeDialog");
  }
}
</script>


<style scoped>
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(30px);
  opacity: 0;
  position: absolute;
}

.slide-fade-invert-enter-active {
  transition: all 0.6s ease;
}
.slide-fade2-invert-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-invert-enter, .slide-fade-invert-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-10px);
  opacity: 0;
  position: absolute;
}
</style>