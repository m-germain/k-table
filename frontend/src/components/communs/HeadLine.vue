<template>
  <div :class="`header ${classCustom}`">
    <v-toolbar flat class="transparent">
      <v-toolbar-title  v-if="!noTitle" :class="`font-weight-${weight} mr-3`">{{title}} :</v-toolbar-title>
      <slot name="start"></slot>
      <v-spacer></v-spacer>
      <slot name="end"></slot>
    </v-toolbar>
    <v-divider class="mx-4"></v-divider>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class HeadLine extends Vue {
  @Prop({ default: "" }) readonly classCustom!: string;

  @Prop({ default: "Super Header" }) readonly title!: string;

  @Prop({ default: "medium" }) readonly weight!: string;
  @Prop({ default: false }) readonly noTitle!: boolean;
}
</script>


<style scoped>
</style>