import { MProduct } from "../models";
import db from "../plugins/firebase";
import Vue from "vue";

export const products = db.collection("products");

const ProductService = {
  getProductsAvailable: async function(): Promise<MProduct[]> {
    const productsArray: MProduct[] = [];
    await products
      .where("available", "==", true)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const product: MProduct = {
            id: doc.id,
            name: doc.data().name,
            price: doc.data().price,
            alcohol: doc.data().alcohol,
            description: doc.data().description,
            pictureUrl: doc.data().pictureUrl,
            available: doc.data().available,
            categorie: doc.data().categorie,
            association: doc.data().association,
          };
          productsArray.push(product);
        });
      })
      .catch((error) => {
        throw new Error("Could not get any Products from the serveur." + error);
      });
    return productsArray;
  },

  updateProduct: async function(product: MProduct) {
    products
      .doc(product.id)
      .set({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price.toString()),
        alcohol: parseFloat(product.alcohol.toString()),
        pictureUrl: product.pictureUrl,
        description: product.description,
        available: product.available,
        categorie: product.categorie,
        association: product.association,
      })
      .then(() => {
        Vue.toasted.global.success({
          message: "Product " + product.name + " Updated",
        });
      })
      .catch((error) => {
        Vue.toasted.global.error({
          message: "Could not updated" + product.name,
        });
        throw new Error("Could not patch this Product to the serveur." + error);
      });
  },

  getByFieldProducts: async function(field: string): Promise<MProduct[]> {
    const productsArray: MProduct[] = [];
    products
      .where(field, "==", true)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const product: MProduct = {
            id: doc.id,
            name: doc.data().name,
            price: doc.data().price,
            alcohol: doc.data().alcohol,
            description: doc.data().description,
            pictureUrl: doc.data().pictureUrl,
            available: doc.data().available,
            categorie: doc.data().categorie,
            association: doc.data().association,
          };
          productsArray.push(product);
        });
      })
      .catch((error) => {
        throw new Error("Could not get any Products from the serveur." + error);
      });
    return productsArray;
  },

  addProduct: async function(product: MProduct) {
    products
      .add({
        name: product.name,
        price: parseFloat(product.price.toString()),
        alcohol: parseFloat(product.alcohol.toString()),
        pictureUrl: product.pictureUrl,
        description: product.description,
        available: product.available,
        categorie: product.categorie,
        association: product.association,
      })
      .then((docRef) => {
        Vue.toasted.global.success({
          message: "New Product " + product.name + " Created",
        });
        return docRef.id;
      })
      .catch((error) => {
        Vue.toasted.global.error({
          message: "Could not Create" + product.name,
        });
        throw new Error("Could not add this Product to the serveur." + error);
      });
  },

  deleteProduct: async function(product: MProduct) {
    console.log(product);
    products
      .doc(product.id.toString())
      .delete()
      .then(() => {
        Vue.toasted.global.success({
          message: "Product " + product.name + " Deleted",
        });
      })
      .catch((error) => {
        Vue.toasted.global.error({
          message: "Could not Deleted" + product.name + error,
        });
        throw new Error(
          "Could not delete this Product to the serveur." + error
        );
      });
  },
};

export default ProductService;
