import Vue from 'vue'
import Component from 'vue-class-component'
import { MProduct } from '@/models';
import { products } from '@/services/product.service';

@Component
export default class ProductHelper extends Vue {
  private products: MProduct[] = [];

  async getProducts() {
    this.realTimeListenner();
  }

  //Listen to the db and fetch the changes on all devices.
  realTimeListenner() {
    //Ref to the collection in table service.
    //Local tables array. Bcs I Can't acces to this.tables mdr
    const localProducts: MProduct[] = [];
    products.orderBy("name").onSnapshot(function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        const product: MProduct = {
          id: change.doc.id,
          name: change.doc.data().name,
          price: change.doc.data().price,
          alcohol: change.doc.data().alcohol,
          description: change.doc.data().description,
          pictureUrl: change.doc.data().pictureUrl,
          available: change.doc.data().available,
          categorie: change.doc.data().categorie,
        }
        if (change.type === "added") {
          localProducts.push(product);
        }
        if (change.type === "modified") {
          const index = localProducts.findIndex(item => item.id == product.id)
          localProducts.splice(index, 1, product)
        }
        if (change.type === "removed") {
          const index = localProducts.findIndex(item => item.id == product.id)
          if (index >= 0) {
            localProducts.splice(index, 1)
          }
        }
      });
    });
    this.products = localProducts;
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