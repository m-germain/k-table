import Vue from 'vue'
import Component from 'vue-class-component'
import { MProduct } from '@/models';
import ProductService from '@/services/product.service';

@Component
export default class ProductHelper extends Vue {
  private products: MProduct[] = [];

  async getProducts() {
    this.products = await ProductService.getProducts();
  }

  get beers() {
    const beers: MProduct[] = [];
    for (const product of this.products) {
      if (product.categorie.name === "Beers") beers.push(product);
    }
    return beers;
  }

  get softs() {
    const softs: MProduct[] = [];
    for (const product of this.products) {
      if (product.categorie.name === "Softs") softs.push(product);
    }
    return softs;
  }

  get foods() {
    const foods: MProduct[] = [];
    for (const product of this.products) {
      if (product.categorie.name === "Foods") foods.push(product);
    }
    return foods;
  }

  get recomendations() {
    const recomendations: MProduct[] = [];
    for (const product of this.products) {
      if (product.categorie.name === "Recommended")
        recomendations.push(product);
    }
    return recomendations;
  }
}