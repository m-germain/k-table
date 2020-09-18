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
          :class="
            order.state == localStateEnum.served
              ? 'success darken-1'
              : 'orange lighten-5'
          "
          :dark="order.state == localStateEnum.served"
        >
          <v-list-item-content>
            <v-list-item-title class="headline font-weight-medium">
              <v-row align="center" justify="end" no-gutters>
                <v-col>
                  <span
                    >Table {{ order.client.table }} |
                    {{ order.orderCode }} |</span
                  >
                  <v-chip small class="mx-2 mt-n1" color="success" pill>
                    <h2>{{ order.client.clientsAtTable }}</h2>
                    <v-icon right>mdi-account-outline</v-icon>
                  </v-chip>
                </v-col>
                <v-col align="end">
                  <v-btn
                    text
                    x-large
                    :color="
                      timeFromNow.includes('H') &&
                      order.state !== localStateEnum.served
                        ? 'primary'
                        : ''
                    "
                  >
                    Passée il y à {{ timeFromNow }}
                    <v-icon medium right>mdi-timer-sand</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-row align="center" justify="end" no-gutters>
                <v-col>{{ order.timestamp.toLocaleString() }}</v-col>
                <v-col align="end">
                  <v-chip
                    height="10px"
                    small
                    v-if="order.client.minor > 0"
                    class="mr-3"
                    color="warning"
                    text-color="primary darken-4"
                  >
                    <v-icon left class="mt-n2">mdi-badge-account-alert</v-icon>
                    <h2 class="mr-1">
                      {{ order.client.minor }}/{{ order.client.clientsAtTable }}
                      -18 ANS
                    </h2>
                  </v-chip>
                </v-col>
              </v-row>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          two-line
          v-if="order.state == localStateEnum.canceled"
          class="primary"
          dark
        >
          <v-list-item-content>
            <v-list-item-title class="headline font-weight-medium">
              <v-row align="center" justify="end" no-gutters>
                <v-col>
                  <span
                    >Table {{ order.client.table }} |
                    {{ order.orderCode }} |</span
                  >
                  <v-chip
                    small
                    class="mx-2 mt-n1"
                    color="primary lighten-2"
                    pill
                  >
                    <h2>{{ order.client.clientsAtTable }}</h2>
                    <v-icon right>mdi-account-outline</v-icon>
                  </v-chip>
                </v-col>
                <v-col align="end">
                  <v-btn
                    text
                    x-large
                    dark
                    :color="
                      timeFromNow.includes('H') &&
                      order.state !== localStateEnum.canceled
                        ? 'primary'
                        : ''
                    "
                  >
                    Passée il y à {{ timeFromNow }}
                    <v-icon medium right>mdi-timer-sand</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-row align="center" justify="end" no-gutters>
                <v-col>{{ order.timestamp.toLocaleString() }}</v-col>
                <v-col align="end">
                  <v-chip
                    height="10px"
                    small
                    v-if="order.client.minor > 0"
                    class="mr-3"
                    color="warning"
                    text-color="primary darken-4"
                  >
                    <v-icon left class="mt-n2">mdi-badge-account-alert</v-icon>
                    <h2 class="mr-1">
                      {{ order.client.minor }}/{{ order.client.clientsAtTable }}
                      -18 ANS
                    </h2>
                  </v-chip>
                </v-col>
              </v-row>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list class="transparent">
          <ProductListItemClient
            v-for="(lineItem, i) of order.lineItems"
            :inOrder="true"
            :hideBtns="true"
            :showIcon="true"
            :inPreparation="order.state == localStateEnum.placed && detailed"
            :lineItem="lineItem"
            :key="i"
          />
          <v-divider
            class="mx-4"
            v-if="
              (order.state == localStateEnum.preparated && detailed) ||
                (order.state == localStateEnum.placed && detailed) ||
                client ||
                quickFinishBtn
            "
          ></v-divider>
          <v-list-item
            v-if="
              (order.state == localStateEnum.preparated && detailed) ||
                (order.state == localStateEnum.placed && detailed) ||
                client ||
                quickFinishBtn
            "
          >
            <v-list-item-content>
              <h3 class="font-weight-light grey-darken2--text">Total</h3>
            </v-list-item-content>
            <v-list-item-content align="end">
              <v-list-item-title>
                <span class="font-weight-bold">{{ totalPrice }} €</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="client && msgBanner">
            <v-list-item-content>
              <v-banner
                rounded
                v-model="msgBanner"
                two-line
                class="primary white--text"
                transition="slide-y-transition"
              >
                <v-avatar slot="icon" color="white accent-4" size="40">
                  <v-icon icon="mdi-lock" color="primary">mdi-alert</v-icon>
                </v-avatar>
                {{ order.message }}
                <template v-slot:actions="{ dismiss }">
                  <v-btn text color="white" @click="dismiss">OK</v-btn>
                </template>
              </v-banner>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-actions v-if="!client">
          <v-btn
            small
            v-if="
              quickFinishBtn ||
                (order.state == localStateEnum.placed && detailed) ||
                (order.state == localStateEnum.preparated && detailed) ||
                (order.state == localStateEnum.payed && detailed)
            "
            text
            v-bind="attrs"
            v-on="on"
          >
            <v-icon right>{{
              (order.state == localStateEnum.preparated ||
                order.state == localStateEnum.payed) &&
              detailed &&
              !openInNew
                ? "mdi-open-in-new"
                : "mdi-pencil"
            }}</v-icon>
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
              Payé
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
          <v-btn
            outlined
            align="center"
            v-if="order.state == localStateEnum.placed"
            @click="updatedState(localStateEnum.canceled)"
          >
            <h4>Annuler</h4>
            <v-icon right small>mdi-alert</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            align="center"
            flex
            :color="
              order.state == localStateEnum.served ? 'success' : 'primary'
            "
          >
            <span
              v-if="
                order.state !== localStateEnum.served &&
                  order.state !== localStateEnum.canceled
              "
              class="warning--text"
            >
              <h3>en préparation</h3>
            </span>
            <h3 v-else>
              {{ order.state == localStateEnum.served ? "Traitée" : "Annulée" }}
            </h3>
          </v-btn>
          <v-progress-circular
            v-if="
              order.state !== localStateEnum.served &&
                order.state !== localStateEnum.canceled
            "
            indeterminate
            size="15"
            color="warning"
          ></v-progress-circular>
        </v-card-actions>
      </v-card>
    </template>
    <OrderTile
      v-if="
        (order.state == localStateEnum.preparated ||
          order.state == localStateEnum.payed) &&
          detailed &&
          !openInNew
      "
      :detailed="true"
      :edit="false"
      :openInNew="true"
      :order="order"
    />
    <v-card
      v-if="
        !(
          (order.state == localStateEnum.preparated ||
            order.state == localStateEnum.payed) &&
          detailed &&
          !openInNew
        )
      "
    >
      <HeadLine
        class="my-2"
        :title="'Table ' + order.client.table + ' | ' + order.orderCode"
        weight="bold"
      >
        <template v-slot:end>
          <v-btn
            outlined
            align="center"
            :color="
              order.state == localStateEnum.served ? 'success' : 'warning'
            "
          >
            <h3>{{ order.state }}</h3>
          </v-btn>
        </template>
      </HeadLine>
      <v-row align="center" justify="center" class="mx-1 my-2">
        <v-col cols="12">
          <v-tabs background-color="white" color="primary" right>
            <v-tab>MANAGE STATES</v-tab>
            <v-spacer></v-spacer>
            <v-tab>
              <v-icon>mdi-pencil</v-icon>
            </v-tab>

            <v-tab-item :key="1">
              <v-container fluid>
                <v-row align="center" justify="space-between">
                  <v-col cols="12" class="pb-0">
                    <div class="overline font-weight-bold">
                      Changer l'état de la commande :
                    </div>
                    <div class="underline font-weight-light">
                      Cela va déplacer la commande dans l'onglet de l'Icon : à
                      servir, à déposer, à faire payer..
                    </div>
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
                      @click="updatedState(localStateEnum.payed)"
                    >
                      <v-icon>mdi-table-chair</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row align="center" justify="center">
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
                      @click="updatedState(localStateEnum.served)"
                    >
                      Terminée
                      <v-icon right>mdi-check</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
            <v-tab-item :key="2">
              <v-list>
                <ProductListItemClient
                  v-for="lineItem of order.lineItems"
                  :inOrder="true"
                  :showIcon="true"
                  :lineItem="lineItem"
                  :key="lineItem.product.id"
                />
                <v-divider class="ml-3 mr-16"></v-divider>
                <v-list-item class="mb-12">
                  <v-list-item-content>
                    <h3 class="font-weight-light grey-darken2--text">Total</h3>
                  </v-list-item-content>
                  <v-list-item-content align="end">
                    <v-list-item-title>
                      <span class="font-weight-bold">{{ totalPrice }} €</span>
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <!-- Here to center it proprerly -->
                    <v-btn small text disabled color="sucess"></v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-spacer></v-spacer>
                  <v-btn
                    depressed
                    align="center"
                    color="success"
                    @click="saveChangesOrder"
                  >
                    Enregistrer
                    <v-icon right>mdi-pencil</v-icon>
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-tab-item>
          </v-tabs>
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
  @Prop({ default: false }) openInNew!: boolean;

  private dialog = false;
  private msgBanner = this.order.message.length > 1;
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
    OrderService.patchStateOrder(this.order.id, newState);
    this.dialog = false;
  }

  get totalPrice() {
    let totalPrice = 0;
    this.order.lineItems.forEach((lineItem: MLineItem) => {
      totalPrice += lineItem.quantity * lineItem.product.price;
    });
    return Math.round((totalPrice + Number.EPSILON) * 100) / 100;
  }

  saveChangesOrder() {
    OrderService.patchLineItemsOrder(this.order.id, this.order.lineItems);
    this.dialog = false;
  }
}
</script>

<style scoped></style>
