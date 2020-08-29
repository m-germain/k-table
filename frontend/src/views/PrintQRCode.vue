<template>
  <v-container>
    <v-row align="center" justify="center" class="mx-2">
      <v-col cols="12" align="center" justify="center">
        <qrcode-vue :value="link" :size="size" level="L"></qrcode-vue>
      </v-col>
      <v-col cols="12" align="center" justify="center">
        <h1 style="font-size: 7rem">Table {{tableNumber}}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import QrcodeVue from "qrcode.vue";

@Component({
  components: { QrcodeVue },
})
export default class PrintQrCode extends Vue {
  private tableNumber = "";
  private size = 400;
  private link = "k-table.firebaseapp.com/table/";

  mounted() {
    this.tableNumber = this.$route.params.tableNumber;
    this.link += this.tableNumber;
  }
}
</script>


<style scoped>
</style>