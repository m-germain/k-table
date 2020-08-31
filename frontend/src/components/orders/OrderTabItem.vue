<template>
  <v-tab-item :value="'tab-' + number">
    <v-card>
      <v-row class="mx-1" align="center" justify="center">
        <v-col block align="center" v-if="orders.length < 1">
          <v-progress-circular :size="70" :width="7" color="secondary" indeterminate class="mb-6"></v-progress-circular>
          <br />
          <h3>En attente de {{title}}...</h3>
        </v-col>
        <v-col cols="12" v-else>
          <div class="overline font-weight-bold">{{title}}</div>
          <v-row v-if="orders.length > 0">
            <v-col cols="12" v-for="order in orders" :key="order.id">
              <OrderTile :detailed="edit ? false : true" :edit="edit" :order="order" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-tab-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import HeadLine from "../communs/HeadLine.vue";
import OrderTile from "../orders/OrderTile.vue";
import { MOrder } from "../../models";

@Component({
  components: { HeadLine, OrderTile },
})
export default class OrderTabItem extends Vue {
  @Prop() orders!: MOrder[];
  @Prop() title!: string;
  @Prop() number!: number;
  @Prop({ default: false }) edit!: boolean;
}
</script>


<style scoped>
</style>