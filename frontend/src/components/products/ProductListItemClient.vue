<template>
  <v-list-item :key="lineItem.product.id" v-if="lineItem.product.available">
    <template>
      <transition name="slide-fade">
        <v-list-item-icon
          class="ma-0 mr-4 ma-auto success--text"
          v-if="lineItem.quantity > 0 && !inPreparation && !hideBtns"
        >
          <h3 :class="inOrder ? 'mt-2' :'mt-3' ">x</h3>
          <h1>{{lineItem.quantity}}</h1>
        </v-list-item-icon>
      </transition>

      <v-list-item-icon class="ma-0 mr-4 ma-auto success--text" v-if="hideBtns">
        <v-icon>{{lineItem.product.categorie.icon}}</v-icon>
      </v-list-item-icon>

      <transition name="slide-fade-invert">
        <v-list-item-icon
          class="ma-0 mr-4 ma-auto"
          v-if="lineItem.quantity <= 0 && lineItem.product.alcohol > 0 && !showIcon"
        >
          <h1>{{parseFloat(lineItem.product.alcohol)}}</h1>
          <h2>°</h2>
        </v-list-item-icon>
        <v-list-item-icon
          class="ma-0 mr-4 ma-auto"
          v-if="lineItem.quantity <= 0 && lineItem.product.alcohol <= 0"
        >
          <v-icon color="black">{{lineItem.product.categorie.icon}}</v-icon>
        </v-list-item-icon>
      </transition>
      <v-list-item-content
        align="end"
        v-if="!inPreparation"
        :class="lineItem.quantity > 0 ? 'success--text' : ''"
      >
        <v-list-item-title>
          <transition name="slide-fade">
            <v-icon
              v-if="lineItem.quantity > 0"
              small
              left
              color="success"
            >mdi-checkbox-marked-circle-outline</v-icon>
          </transition>
          <span v-if="hideBtns" style="font-size: 12px">x</span>
          <span v-if="hideBtns" class="font-weight-medium mr-2">{{lineItem.quantity}}</span>
          <span class="font-weight-medium">{{lineItem.product.name}}</span>
          <span
            v-if="!hideBtns && !lineItem.quantity > 0 && (lineItem.product.categorie.name == 'Softs' || lineItem.product.categorie.name == 'Foods' )"
            class="ml-1"
          >| {{lineItem.product.price}} €</span>
        </v-list-item-title>
        <v-list-item-subtitle v-if="inOrder">
          <span
            class="font-weight-bold"
          >{{( parseFloat(lineItem.product.price) * parseFloat(lineItem.quantity) ) }} €</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle v-if="inOrder === false">
          <span class="font-weight-ligth">{{lineItem.product.description}}</span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content align="end" v-if="inPreparation">
        <v-list-item-title>
          <h1 class="font-weight-bold">
            <span style="font-size: 20px">x</span>
            {{lineItem.quantity}} | {{lineItem.product.name}}
          </h1>
        </v-list-item-title>
        <v-list-item-subtitle v-if="inOrder === false">
          <span class="font-weight-ligth">{{lineItem.product.description}}</span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action v-if="!hideBtns">
        <v-btn small text class="pa-0" @click="lineItem.quantity = lineItem.quantity + 1">
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>
        <v-btn
          small
          text
          class="pa-0"
          @click="lineItem.quantity > 0 ? lineItem.quantity = lineItem.quantity - 1 : lineItem.quantity = 0"
        >
          <v-icon>mdi-minus-circle-outline</v-icon>
        </v-btn>
      </v-list-item-action>
      <!-- <v-list-item-icon align="end" v-else class="ml-4 ma-auto">
        <h2 class="mt-5">x</h2>
        <h2 style="font-size: 42px">{{lineItem.quantity}}</h2>
      </v-list-item-icon>-->
    </template>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ProductForm from "./ProductForm.vue";
import HeadLine from "../communs/HeadLine.vue";
import { MLineItem } from "../../models";

@Component({
  components: { ProductForm, HeadLine },
})
export default class ProductListItemClient extends Vue {
  @Prop() lineItem!: MLineItem;
  @Prop({ default: false }) inOrder!: boolean;
  @Prop({ default: false }) hideBtns!: boolean;
  @Prop({ default: false }) showIcon!: boolean;
  @Prop({ default: false }) inPreparation!: boolean;
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