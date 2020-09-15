<template>
  <v-container>
    <HeadLine title="Commandes">
      <template v-slot:end>
        <!-- <v-text-field
          v-model="search"
          dense
          solo
          :clearable="search.length > 2"
          filled
          flat
          disabled
          style="max-width: 9rem"
          hide-details
          prepend-inner-icon="mdi-database-search"
          label="Search"
        ></v-text-field>-->
        <v-switch inset v-model="tracking" color="success" class="mt-7 v-input--reverse">
          <template #label>Suivi commandes</template>
        </v-switch>
      </template>
    </HeadLine>
    <v-row class="mx-1" align="center" justify="space-between">
      <v-col>
        <v-card>
          <v-list-item two-line>
            <v-list-item-content>
              <div class="overline font-weight-bold mb-4">Commandes à Traiter</div>
              <v-list-item-title class="headline mb-1">
                <v-btn x-large block text color="warning">
                  <h1>{{numberOfOrdersUncompleted}}</h1>
                  <v-icon class="ml-4 mt-n3" large right>mdi-table-chair</v-icon>
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
              <div class="overline font-weight-bold mb-4">Commandes Aujourd'hui</div>
              <v-list-item-title class="headline mb-1">
                <v-btn x-large block text color="success">
                  <h1>{{numberOfOrdersToday}}</h1>
                  <v-icon class="ml-3" large right>mdi-checkbox-marked-circle-outline</v-icon>
                </v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <span v-if="!tracking">
      <v-row class="mx-1" align="center" justify="center">
        <v-col block align="center" v-if="numberOfOrdersToday < 1">
          <v-progress-circular :size="70" :width="7" color="secondary" indeterminate class="mb-6"></v-progress-circular>
          <br />
          <h3>En attente de commandes...</h3>
        </v-col>
        <v-col cols="12">
          <div
            class="overline font-weight-bold"
            style="font-size: 20px !important"
            v-if="numberOfOrdersUncompleted > 0"
          >Commandes à traiter !</div>

          <v-row v-if="numberOfOrdersUncompleted > 0">
            <v-col cols="12" lg="6" xl="6" v-for="order in ordersUncompleted" :key="order.id">
              <OrderTile :quickFinishBtn="true" :order="order" />
            </v-col>
          </v-row>
          <v-divider
            v-if="numberOfOrdersUncompleted > 0"
            class="mt-5 primary"
            style="    min-height: 5px;"
          ></v-divider>
          <span
            v-if="numberOfOrdersUncompleted > 0"
            style="opacity: 9%;"
          >pour lele pour lele pour lele</span>
          <v-divider
            v-if="numberOfOrdersUncompleted > 0"
            class="mb-5 primary"
            style="    min-height: 5px;"
          ></v-divider>

          <div
            v-if="numberOfOrdersToday > 0"
            style="font-size: 17px !important"
            class="overline font-weight-bold"
          >Toutes les Commandes</div>
          <v-row v-if="numberOfOrdersToday > 0">
            <v-col
              cols="12"
              lg="6"
              xl="6"
              v-for="order in orders.slice().reverse()"
              :key="order.id"
            >
              <OrderTile :edit="true" :order="order" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </span>
    <v-card v-else class="mx-4">
      <v-tabs v-model="tab" fixed-tabs center-active icons-and-text color="primary">
        <v-tab href="#tab-1">
          <v-chip outlined class="mt-2" style="margin-top: 3px important!" color="primary">
            <v-avatar left>
              <v-icon class="mt-n1">mdi-text-box-check</v-icon>
            </v-avatar>
            {{numberOfOrdersToday}}
          </v-chip>Commandes
        </v-tab>
        <v-tab href="#tab-2">
          <v-chip outlined class="mt-2" style="margin-top: 3px important!" color="primary">
            <v-avatar left>
              <v-icon>mdi-beer</v-icon>
            </v-avatar>
            {{numberOfOrdersPlaced}}
          </v-chip>à préparer
        </v-tab>
        <v-tab href="#tab-3">
          <v-chip outlined class="mt-2" style="margin-top: 3px important!" color="primary">
            <v-avatar left>
              <v-icon>mdi-cash</v-icon>
            </v-avatar>
            {{numberOfOrdersPreparated}}
          </v-chip>à encaisser
        </v-tab>
        <v-tab href="#tab-4">
          <v-chip outlined class="mt-2" style="margin-top: 3px important!" color="primary">
            <v-avatar left>
              <v-icon>mdi-table-chair</v-icon>
            </v-avatar>
            {{numberOfOrdersPayed}}
          </v-chip>à déposer
        </v-tab>

        <v-tabs-items v-model="tab">
          <OrderTabItem
            :orders="orders.slice().reverse()"
            :edit="true"
            title="Toutes les commandes"
            :number="1"
          />
          <OrderTabItem :orders="ordersPlaced" title="Commandes à préparer" :number="2" />
          <OrderTabItem :orders="ordersPreparated" title="Commandes à encaisser" :number="3" />
          <OrderTabItem :orders="ordersPayed" title="Commandes à déposer à une table" :number="4" />
        </v-tabs-items>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import HeadLine from "../components/communs/HeadLine.vue";
import OrderTabItem from "../components/orders/OrderTabItem.vue";
import OrderTile from "../components/orders/OrderTile.vue";
import OrderHelper from "../mixins/orderHelper";

@Component({
  components: { HeadLine, OrderTile, OrderTabItem },
})
export default class Orders extends Mixins(OrderHelper) {
  // private search = "";
  private tracking = false;
  private tab = null;

  mounted() {
    this.getOrders();
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