<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="font-weight-medium">Hello Barman,</h2>
        <h2>
          peux-tu dead ca
          <span class="font-weight-medium">stp ?</span>
        </h2>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" xl="4" lg="4" md="4">
            <v-card class="mx-auto" to="/admin/orders">
              <v-img
                class="white--text align-end"
                height="150px"
                gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.6)"
                src="https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F1203497834%2F0x0.jpg"
              >
                <v-card-title>
                  <h2>Commandes</h2>
                </v-card-title>
              </v-img>
              <!-- 
              <v-card-subtitle class="pb-0">Nombre de commandes : {{numberOfOrdersToday}}</v-card-subtitle>

              <v-card-text class="text--primary">
                <div>Reste à traiter :</div>
              </v-card-text>-->

              <!-- <v-card-actions>
                <v-btn color="orange" text>Share</v-btn>

                <v-btn color="orange" text>Explore</v-btn>
              </v-card-actions>-->
            </v-card>
          </v-col>
          <v-col cols="6" xl="4" lg="4" md="4">
            <v-card class="mx-auto" to="/admin/products">
              <v-img
                class="white--text align-end"
                height="150px"
                gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.6)"
                src="https://api.time.com/wp-content/uploads/2018/04/national-beer-day-ipa.jpg?quality=85&w=1024&h=512&crop=1"
              >
                <v-card-title>
                  <h2>Produits</h2>
                </v-card-title>
              </v-img>

              <!-- <v-card-subtitle class="pb-0">Nombre de produits : 10</v-card-subtitle>

              <v-card-text class="text--primary">
                <div>Indisponibles :</div>
              </v-card-text>-->
            </v-card>
          </v-col>
          <v-col cols="6" xl="4" lg="4" md="4">
            <v-card class="mx-auto" to="/admin/tables">
              <v-img
                class="white--text align-end"
                height="150px"
                gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.6)"
                src="https://media-cdn.tripadvisor.com/media/photo-s/0a/67/68/26/terrasse-restaurant.jpg"
              >
                <v-card-title>
                  <h2>Tables</h2>
                </v-card-title>
              </v-img>

              <!-- <v-card-subtitle class="pb-0">Nombre de tables : {{numberOfTables}}</v-card-subtitle>

              <v-card-text class="text--primary">
                <div>Tables Libres : {{numberOfTablesAvailable}}</div>
              </v-card-text>-->
            </v-card>
          </v-col>
          <v-col cols="6" xl="4" lg="4" md="4">
            <v-card class="mx-auto" to="/admin/association">
              <v-img
                class="white--text align-end"
                height="150px"
                gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.6)"
                src="https://content.thriveglobal.com/wp-content/uploads/2018/08/iStock-585522428.jpg"
              >
                <v-card-title>
                  <h2>Associations</h2>
                </v-card-title>
              </v-img>

              <!-- <v-card-subtitle class="pb-0">Nombre de tables : {{numberOfTables}}</v-card-subtitle>

              <v-card-text class="text--primary">
                <div>Tables Libres : {{numberOfTablesAvailable}}</div>
              </v-card-text>-->
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-footer
      padless
      absolute
      class="font-weight-thin"
      style="background-color: transparent; transparent; opacity:0.3"
    >
      <v-col class="text-center" cols="12">
        Made with
        <v-icon small color="primary">mdi-heart</v-icon>by La Pedale
      </v-col>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Barman extends Vue {}
</script>

<style scoped></style>
