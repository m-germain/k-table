<template>
  <v-row align="center" justify="center">
    <v-col :cols="cols">
      <v-text-field
        block
        outlined
        prepend-inner-icon="mdi-account-edit"
        v-model="client.username"
        align="center"
        color="success"
        class="py-0"
        black
        label="Table est au prénom de :"
        persistent-hint
        hint="Pour garder le ptit nom de la personne"
      ></v-text-field>
    </v-col>
    <v-col :cols="cols" class>
      <v-text-field
        block
        outlined
        class="py-0"
        prepend-inner-icon="mdi-account-group-outline"
        v-model="client.clientsAtTable"
        align="center"
        color="success"
        type="number"
        pattern="\d*"
        black
        label="Nombres de personnes à la table."
        persistent-hint
        hint="Pour savoir combiens ils sont ;)"
      ></v-text-field>
    </v-col>
    <v-col :cols="cols">
      <v-text-field
        block
        outlined
        class="py-0"
        prepend-inner-icon="mdi-badge-account-alert-outline"
        v-model="client.minor"
        align="center"
        color="success"
        type="number"
        pattern="\d*"
        black
        label="Nombres de MINEURS à la table."
        persistent-hint
        hint="Pour savoir combiens sont -18ans ;)"
      ></v-text-field>
    </v-col>
    <v-col :cols="cols" align="end">
      <slot name="btn"></slot>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { MUserData } from "../../models";

@Component({
  components: {},
})
export default class Orders extends Vue {
  @Prop({
    default: {
      username: "",
      clientsAtTable: 0,
      minor: 0,
    } as MUserData,
  })
  client!: MUserData;

  @Prop({ default: 8 }) cols!: number;
}
</script>

<style>
</style>