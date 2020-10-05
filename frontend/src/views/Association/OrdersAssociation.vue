<template>
  <v-container>
    <HeadLine :title="'Commandes Association ' + clientData.username" />
    <v-row class="mx-1" align="center" justify="space-between">
      <v-col>
        <v-card>
          <v-list-item two-line>
            <v-list-item-content>
              <div class="overline font-weight-bold mb-4">
                Commandes à Traiter
              </div>
              <v-list-item-title class="headline mb-1">
                <v-btn x-large block text color="warning">
                  <h1>{{ numberOfOrdersUncompleted }}</h1>
                  <v-icon class="ml-4 mt-n3" large right
                    >mdi-table-chair</v-icon
                  >
                </v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-list-item two-line>
            <v-list-item-content>
              <div class="overline font-weight-bold mb-4">
                Commandes Aujourd'hui
              </div>
              <v-list-item-title class="headline mb-1">
                <v-btn x-large block text color="success">
                  <h1>{{ numberOfOrdersToday }}</h1>
                  <v-icon class="ml-3" large right
                    >mdi-checkbox-marked-circle-outline</v-icon
                  >
                </v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="mx-4">
      <v-tabs
        v-model="tab"
        fixed-tabs
        center-active
        icons-and-text
        color="primary"
      >
        <v-tab href="#tab-1">
          <v-chip
            outlined
            class="mt-2"
            style="margin-top: 3px important!"
            color="primary"
          >
            <v-avatar left>
              <v-icon class="mt-n1">mdi-text-box-check</v-icon>
            </v-avatar>
            {{ numberOfOrdersToday }} </v-chip
          >Commandes
        </v-tab>
        <v-tab href="#tab-2">
          <v-chip
            outlined
            class="mt-2"
            style="margin-top: 3px important!"
            color="primary"
          >
            <v-avatar left>
              <v-icon>mdi-beer</v-icon>
            </v-avatar>
            {{ numberOfOrdersPlaced }} </v-chip
          >à préparer
        </v-tab>
        <v-tab href="#tab-3">
          <v-chip
            outlined
            class="mt-2"
            style="margin-top: 3px important!"
            color="primary"
          >
            <v-avatar left>
              <v-icon>mdi-cash</v-icon>
            </v-avatar>
            {{ numberOfOrdersPreparated }} </v-chip
          >à faire payer
        </v-tab>
        <v-tab href="#tab-4">
          <v-chip
            outlined
            class="mt-2"
            style="margin-top: 3px important!"
            color="primary"
          >
            <v-avatar left>
              <v-icon>mdi-table-chair</v-icon>
            </v-avatar>
            {{ numberOfOrdersPayed }} </v-chip
          >à déposer
        </v-tab>

        <v-tabs-items v-model="tab">
          <OrderTabItem
            :orders="orders.slice().reverse()"
            :edit="true"
            title="Toutes les commandes"
            :number="1"
          />
          <OrderTabItem
            :orders="ordersPlaced"
            title="Commandes à préparer"
            :number="2"
          />
          <OrderTabItem
            :orders="ordersPreparated"
            title="Commandes à faire payer"
            :number="3"
          />
          <OrderTabItem
            :orders="ordersPayed"
            title="Commandes à déposer à une table"
            :number="4"
          />
        </v-tabs-items>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import HeadLine from "../../components/communs/HeadLine.vue";
import OrderTabItem from "../../components/orders/OrderTabItem.vue";
import OrderTile from "../../components/orders/OrderTile.vue";
import OrderHelper from "../../mixins/orderHelper";
import { MUserData } from "../../models";
import TokenService from "../../services/token.service";

@Component({
  components: { HeadLine, OrderTile, OrderTabItem },
})
export default class OrdersAssociation extends Mixins(OrderHelper) {
  private tab = null;
  private loadingUser = true;

  // Client Data
  private clientData: MUserData = {
    username: "",
    tableId: "",
    table: "",
    clientsAtTable: 0,
    minor: 0,
  };

  mounted() {
    this.checkUser();
    this.getOrders(true);
  }

  async checkUser() {
    await TokenService.getAndDecodeToken()
      .then((userData: MUserData) => {
        this.clientData = userData as MUserData;
        this.loadingUser = false;
      })
      .catch((err) => {
        // If there is no token or it is expiered or invalid for this table.
        this.$toasted.global.error({
          message:
            "Télephone n'est plus activé. Si besoin demandez de l'aide dans Page asso." +
            err,
        });
        this.$router.push("/");
      });
  }
}
</script>

<style lang="scss">
.v-input--reverse .v-input__slot {
  flex-direction: row-reverse;
  justify-content: flex-end;
  .v-application--is-ltr & {
    .v-input--selection-controls__input {
      margin-right: 0;
      margin-left: 8px;
    }
  }
  .v-application--is-rtl & {
    .v-input--selection-controls__input {
      margin-left: 0;
      margin-right: 8px;
    }
  }
}

.v-input--expand .v-input__slot {
  // justify-content: space-between;
  .v-label {
    display: block;
    flex: 1;
  }
}
</style>
