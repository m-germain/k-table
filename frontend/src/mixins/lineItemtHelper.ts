import Vue from 'vue'
import Component from 'vue-class-component'
import { MProduct, MLineItem } from '@/models';
import ProductService from '@/services/product.service';

@Component
export default class LineItemHelper extends Vue {
  private lineItemList: MLineItem[] = [];

  async getProducts() {
    this.clear();
    ProductService.getProductsAvailable().then((products: MProduct[]) => {
      for (const product of products) {
        const lineItem: MLineItem = {
          product: product,
          quantity: 0
        }
        this.lineItemList.push(lineItem);
      }
    });
  }

  clear() {
    this.lineItemList = [];
  }

  get tapBeers() {
    const beers: MLineItem[] = [];
    for (const lineItem of this.lineItemList) {
      if (lineItem.product.categorie.name === "Tap Beers") beers.push(lineItem);
    }
    return beers;
  }

  get bottledBeers() {
    const bottledBeers: MLineItem[] = [];
    for (const lineItem of this.lineItemList) {
      if (lineItem.product.categorie.name === "Bottled Beers") bottledBeers.push(lineItem);
    }
    return bottledBeers;
  }

  get wines() {
    const wines: MLineItem[] = [];
    for (const lineItem of this.lineItemList) {
      if (lineItem.product.categorie.name === "Wines") wines.push(lineItem);
    }
    return wines;
  }

  get softs() {
    const softs: MLineItem[] = [];
    for (const lineItem of this.lineItemList) {
      if (lineItem.product.categorie.name === "Softs") softs.push(lineItem);
    }
    return softs;
  }

  get foods() {
    const foods: MLineItem[] = [];
    for (const lineItem of this.lineItemList) {
      if (lineItem.product.categorie.name === "Foods") foods.push(lineItem);
    }
    return foods;
  }

  get recomendations() {
    const recomendations: MLineItem[] = [];
    for (const lineItem of this.lineItemList) {
      if (lineItem.product.categorie.name === "Recommended")
        recomendations.push(lineItem);
    }
    return recomendations;
  }

  get lineItems() {
    const lineItems: MLineItem[] = [];
    for (const lineItem of this.lineItemList) {
      if (lineItem.quantity > 0)
        lineItems.push(lineItem);
    }
    return lineItems;
  }

  get numberItems() {
    let numberItems = 0;
    this.lineItems.forEach((lineItem: MLineItem) => {
      numberItems += lineItem.quantity;
    })
    return numberItems;
  }


  get totalPrice() {
    let totalPrice = 0;
    this.lineItems.forEach((lineItem: MLineItem) => {
      totalPrice += (lineItem.quantity) * (lineItem.product.price);
    })
    return totalPrice;
  }
}