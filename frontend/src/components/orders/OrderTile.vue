<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <!-- <v-btn block align="center" height="3rem" :color="color" dark v-bind="attrs" v-on="on">
        <h2>{{order.timestamp}}</h2>
      </v-btn>-->
      <v-card>
        <v-list-item
          two-line
          v-if="order.state !== localStateEnum.canceled"
          :class="order.state == localStateEnum.served ? 'success darken-1': 'orange lighten-5'"
          :dark="order.state == localStateEnum.served"
        >
          <v-list-item-content>
            <v-list-item-title class="headline font-weight-medium">
              <v-row align="center" justify="end" no-gutters>
                <v-col>
                  <span>Table {{order.client.table}} | {{order.orderCode}}</span>
                  <!-- <v-chip
                    height="10px"
                    small
                    v-if="order.client.minor"
                    class="mx-3 mt-n1"
                    color="warning"
                    text-color="primary darken-4"
                  >
                    <v-icon left class="mt-n2">mdi-badge-account-alert</v-icon>-18 ANS
                  </v-chip>-->
                </v-col>
                <v-col align="end">
                  <v-btn
                    text
                    x-large
                    :color="(timeFromNow.includes('H') && order.state !== localStateEnum.served ? 'primary' : '' )"
                  >
                    Passée il y à {{timeFromNow}}
                    <v-icon medium right>mdi-timer-sand</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-row align="center" justify="end" no-gutters>
                <v-col>{{order.timestamp.toLocaleString()}}</v-col>
                <v-col align="end">
                  <v-chip
                    height="10px"
                    small
                    v-if="order.client.minor"
                    class="mr-3"
                    color="warning"
                    text-color="primary darken-4"
                  >
                    <v-icon left class="mt-n2">mdi-badge-account-alert</v-icon>-18 ANS
                  </v-chip>
                </v-col>
              </v-row>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item two-line v-if="order.state == localStateEnum.canceled" class="primary" dark>
          <v-list-item-content>
            <v-list-item-title class="headline font-weight-medium">
              <v-row align="center" justify="end" no-gutters>
                <v-col>
                  <span>Table {{order.client.table}} | {{order.orderCode}}</span>
                </v-col>
                <v-col align="end">
                  <v-btn
                    text
                    x-large
                    dark
                    :color="(timeFromNow.includes('H') && order.state !== localStateEnum.canceled ? 'primary' : '' )"
                  >
                    Passée il y à {{timeFromNow}}
                    <v-icon medium right>mdi-timer-sand</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item-title>
            <v-list-item-subtitle>{{order.timestamp.toLocaleString()}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list class="transparent">
          <ProductListItemClient
            v-for="(lineItem,i) of order.lineItems"
            :inOrder="true"
            :hideBtns="true"
            :inPreparation="order.state == localStateEnum.placed && detailed"
            :lineItem="lineItem"
            :key="i"
          />
          <v-divider
            class="mx-4"
            v-if="(order.state == localStateEnum.preparated && detailed) || client || quickFinishBtn"
          ></v-divider>
          <v-list-item
            v-if="(order.state == localStateEnum.preparated  && detailed) || client || quickFinishBtn"
          >
            <v-list-item-content>
              <h3 class="font-weight-light grey-darken2--text">Total</h3>
            </v-list-item-content>
            <v-list-item-content align="end">
              <v-list-item-title>
                <span class="font-weight-bold">{{totalPrice}} €</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-actions v-if="!client">
          <v-btn small v-if="quickFinishBtn" text v-bind="attrs" v-on="on">
            <v-icon right>mdi-pencil</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <span v-if="detailed">
            <v-btn
              text
              v-if="order.state == localStateEnum.placed"
              @click="updatedState(localStateEnum.preparated)"
            >
              Préparation terminée
              <v-icon right>mdi-check</v-icon>
            </v-btn>
            <v-btn
              text
              v-if="order.state == localStateEnum.preparated"
              @click="updatedState(localStateEnum.payed)"
            >
              Encaissement terminée
              <v-icon right>mdi-check</v-icon>
            </v-btn>
            <v-btn
              text
              v-if="order.state == localStateEnum.payed"
              @click="updatedState(localStateEnum.served)"
            >
              Dépot terminée
              <v-icon right>mdi-check</v-icon>
            </v-btn>
          </span>
          <v-btn
            v-if="quickFinishBtn"
            depressed
            class="success"
            v-bind="attrs"
            v-on="on"
            @click="updatedState(localStateEnum.served)"
          >
            J'ai dead ca
            <v-icon right>mdi-check</v-icon>
          </v-btn>
          <v-btn v-if="edit" text v-bind="attrs" v-on="on">
            éditer
            <v-icon right>mdi-pencil</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            align="center"
            :color="order.state == localStateEnum.served ? 'success': 'grey'"
          >
            <h3
              v-if="(order.state !== localStateEnum.served) && (order.state !== localStateEnum.canceled)"
            >Traitement en cours</h3>
            <h3 v-else>{{order.state == localStateEnum.served ? 'Traitée': 'Annulée'}}</h3>
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
    <v-card>
      <HeadLine
        class="my-2"
        :title="'Table ' + order.client.table +' | ' + order.orderCode"
        weight="bold"
      >
        <template v-slot:end>
          <v-btn
            outlined
            align="center"
            :color="order.state == localStateEnum.served ? 'success': 'warning'"
          >
            <h3>{{order.state}}</h3>
          </v-btn>
        </template>
      </HeadLine>
      <v-row align="center" justify="center" class="mx-1 my-2">
        <v-col cols="12" class="pb-0">
          <div class="overline font-weight-bold">Changer l'état de la commande :</div>
          <div
            class="underline font-weight-light"
          >Cela va déplacer la commande dans l'onglet de l'Icon : à servir, à déposer, à encaisser..</div>
        </v-col>
        <v-col cols="4">
          <v-btn
            block
            outlined
            align="center"
            color="success"
            height="3rem"
            @click="updatedState(localStateEnum.placed)"
          >
            <v-icon>mdi-beer</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn
            block
            outlined
            align="center"
            color="success"
            height="3rem"
            @click="updatedState(localStateEnum.preparated)"
          >
            <v-icon>mdi-cash</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn
            block
            outlined
            align="center"
            color="success"
            height="3rem"
            @click="updatedState(localStateEnum.served)"
          >
            <v-icon>mdi-table-chair</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row align="center" justify="center" class="mx-1">
        <v-col cols="6">
          <v-btn
            block
            outlined
            align="center"
            color="primary"
            height="3rem"
            @click="updatedState(localStateEnum.canceled)"
          >
            Annuler
            <v-icon right>mdi-cancel</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            block
            outlined
            align="center"
            black
            height="3rem"
            @click="updatedState(localStateEnum.preparated)"
          >
            Terminée
            <v-icon right>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import HeadLine from "../communs/HeadLine.vue";
import ProductListItemClient from "../products/ProductListItemClient.vue";
import { MOrder, OrderStates, MLineItem } from "../../models";
import OrderService from "../../services/order.service";

@Component({
  components: { HeadLine, ProductListItemClient },
})
export default class OrderTile extends Vue {
  @Prop() order!: MOrder;
  // @Prop() color!: string;
  @Prop({ default: false }) detailed!: boolean;
  @Prop({ default: false }) quickFinishBtn!: boolean;
  @Prop({ default: false }) client!: boolean;
  @Prop({ default: false }) edit!: boolean;

  private dialog = false;
  private localStateEnum = OrderStates;

  // Set an Interval to fetch the curent dif time.
  private interval = setInterval(() => {
    this.updatedDate();
  }, 1000);
  // Initialize the now value to now :)
  private now = new Date();

  updatedDate() {
    this.now = new Date();
  }

  get timeFromNow() {
    const diff = +this.now - +this.order.timestamp;
    const diffDays = diff / (1000 * 60 * 60 * 24);
    const difHours = diffDays * 24;
    const difMins = difHours * 60;

    const hours = difMins / 60;
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);

    return (rhours > 0 ? rhours + " H " : "") + rminutes + " min";
  }

  updatedState(newState: string) {
    OrderService.patchOrder(this.order.id, newState);
    this.dialog = false;
  }

  get totalPrice() {
    let totalPrice = 0;
    this.order.lineItems.forEach((lineItem: MLineItem) => {
      totalPrice += lineItem.quantity * lineItem.product.price;
    });
    return Math.round((totalPrice + Number.EPSILON) * 100) / 100;
  }
}
</script>


<style scoped>
</style>