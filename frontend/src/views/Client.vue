<template>
  <span>
    <v-container>
      <v-btn @click="appendItem">add</v-btn>
      <v-btn @click="clear">acleardd</v-btn>
      <v-row>
        <v-col cols="12">
          <h2 class="font-weight-medium">Que souhaitez vous</h2>
          <h2>
            déguster
            <span class="font-weight-medium">ce soir ?</span>
          </h2>
        </v-col>
        <v-col cols="12">
          <h3 class="font-weight-medium">Nos Suggestions</h3>
          <v-row>
            <v-col cols="6">
              <v-card shaped dark>
                <v-img
                  src="https://www.castoretpollux.com/uploads/newcoverststefanus.png"
                  height="194"
                  @click="recommended1Check = !recommended1Check"
                  gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.6)"
                >
                  <v-row align="end" class="white--text pl-3">
                    <v-col>
                      <h2>Stefanus Blonde</h2>
                    </v-col>
                  </v-row>
                </v-img>

                <v-card-actions class="pa-0 pl-2">
                  <v-row no-gutters>
                    <v-col>
                      <v-checkbox
                        v-model="recommended1Check"
                        class="pa-0"
                        style="max-height: 35px"
                        :label="!recommended1Check ? wantOne : added "
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card dark shaped>
                <v-img
                  @click="recommended2Check = !recommended2Check"
                  rounded
                  src="https://www.bierista.nl/biernieuws/wp-content/uploads/2017/12/Grolsch-Weizen-Japan.001.jpeg"
                  height="194"
                  gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.6)"
                >
                  <v-row align="end" class="white--text pl-3">
                    <v-col>
                      <h2>Grolsch Weizen</h2>
                    </v-col>
                  </v-row>
                </v-img>

                <v-card-actions class="pa-0 pl-2">
                  <v-row no-gutters>
                    <v-col>
                      <v-checkbox
                        v-model="recommended2Check"
                        class="pa-0"
                        style="max-height: 35px"
                        :label="!recommended2Check ? wantOne : added "
                      ></v-checkbox>
                      <!-- <v-text-field
                          solo
                          flat
                          style="max-height: 50px"
                          v-model="number"
                          append-icon="mdi-plus-circle"
                          prepend-icon="mdi-minus-circle"
                          type="number"
                          @click:append="number = number + 1"
                          @click:prepend="number = number - 1"
                      ></v-text-field>-->
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <h3 class="font-weight-medium">Nos Bièrres</h3>
          <v-list>
            <v-list-item-group
              v-model="selected"
              multiple
              active-class="secondary--text"
            >
              <template v-for="(item, index) in items">
                <ProductCard :key="item.id" :product="item"/>
                <!-- <v-list-item :key="item.name" v-if="item.alcohol > 1">
                  <template v-slot:default="{ active }">
                    <v-list-item-icon class="ma-0 mr-4">
                      <h1>{{item.alcohol}}</h1>
                      <h4>%</h4>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        <span class="font-weight-medium">{{item.name}}</span>
                        <span class="ml-3 font-weight-ligth">{{item.description}}</span>
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-list-item-action-text v-text="item.action"></v-list-item-action-text>
                      <v-icon
                        v-if="!active"
                        color="grey lighten-1"
                      >mdi-checkbox-blank-circle-outline</v-icon>

                      <v-icon v-else color="success">mdi-checkbox-marked-circle-outline</v-icon>
                    </v-list-item-action>
                  </template>
                </v-list-item> -->

                <v-divider v-if="index + 1 < items.length && item.alcohol > 1" :key="index"></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col cols="12">
          <h3 class="font-weight-medium">Nos Softs</h3>
          <v-list>
            <v-list-item-group v-model="selected" multiple active-class="secondary--text">
              <template v-for="(item, index) in items">
                <v-list-item :key="item.name" v-if="item.alcohol < 1">
                  <template v-slot:default="{ active }">
                    <v-list-item-icon class="ma-0 mr-4">
                      <h1>{{item.alcohol}}</h1>
                      <h4>%</h4>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        <span class="font-weight-medium">{{item.name}}</span>
                        <span class="ml-3 font-weight-ligth">{{item.description}}</span>
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-list-item-action-text v-text="item.action"></v-list-item-action-text>
                      <v-icon
                        v-if="!active"
                        color="grey lighten-1"
                      >mdi-checkbox-blank-circle-outline</v-icon>

                      <v-icon v-else color="success">mdi-checkbox-marked-circle-outline</v-icon>
                    </v-list-item-action>
                  </template>
                </v-list-item>

                <v-divider
                  v-if="index + 1 < items.length && item.alcohol < 1"
                  :key="item.id + index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </v-container>

    <v-navigation-drawer app v-model="drawer" absolute bottom temporary>
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <!-- <v-list-item-title> -->
            <h2 class="font-weight-bold grey-darken2--text">Votre commande</h2>
            <!-- </v-list-item-title> -->
          </v-list-item-content>
          <v-list-item-action>
            <v-btn text class @click="drawer = !drawer">
              <v-icon class="primary--text">mdi-arrow-down</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <span class="font-weight-bold">
              <v-icon left>mdi-beer</v-icon>HG Demi
            </span>
          </v-list-item-content>
          <v-list-item-action>
            <span>
              3.50
              <v-icon rigth class="primary--text">mdi-currency-eur</v-icon>
            </span>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-spacer></v-spacer>
          <v-list-item-action>
            <v-btn outlined text color="sucess">
              Commander
              <v-icon right>mdi-store</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <transition name="slide-fade">
      <v-btn
        v-if="selected.length > 0"
        outlined
        class="absolute-btn ma-5"
        fab
        color="primary"
        @click="drawer = !drawer"
      >
        <v-badge :content="selected.length" :value="selected.length" color="primary">
          <v-icon>mdi-basket</v-icon>
        </v-badge>
      </v-btn>
    </transition>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { MProduct } from "../models";

@Component({
  components: {},
})
export default class Barman extends Vue {
  collapseOnScroll = true;
  drawer = false;
  fab = false;
  wantOne = "J'en veux une stp !";
  added = "C'est noté chef !";
  order = [];
  selected = [];
  recommended1Check = false;
  recommended2Check = false;

  items: MProduct[] = [];

  number = 0;

  created() {
    // db.collection("items")
    //   .get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       const newItem = doc.data() as Mitem;
    //       console.log(newItem);
    //       this.items.push(newItem);
    //     });
    //   });
  }

  clear() {
    this.selected = [];
  }
}
</script>


<style scoped>
.absolute-btn {
  position: absolute;
  bottom: 10vh;
  right: 0;
}

.fit-screen {
  max-height: 100vh;
  overflow: scroll;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>