import { MOrder, MLineItem, MUserData } from "../models";
import db from "../plugins/firebase";

export const orders = db.collection("orders");

const OrderService = {

    // getProductsAvailable: async function (): Promise<MProduct[]> {
    //     const productsArray: MProduct[] = [];
    //     await products.where("available", "==", true).get().then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //             const product: MProduct = {
    //                 id: doc.id,
    //                 name: doc.data().name,
    //                 price: doc.data().price,
    //                 alcohol: doc.data().alcohol,
    //                 description: doc.data().description,
    //                 pictureUrl: doc.data().pictureUrl,
    //                 available: doc.data().available,
    //                 categorie: doc.data().categorie,
    //             }
    //             productsArray.push(product);
    //         })
    //     }).catch(error => {
    //         throw new Error('Could not get any Products from the serveur.' + error)
    //     })
    //     console.log(productsArray);

    //     return productsArray;
    // },

    // updateProduct: async function (product: MProduct) {
    //     products.doc(product.id).set({
    //         id: product.id,
    //         name: product.name,
    //         price: parseFloat(product.price.toString()),
    //         alcohol: parseFloat(product.alcohol.toString()),
    //         pictureUrl: product.pictureUrl,
    //         description: product.description,
    //         available: product.available,
    //         categorie: product.categorie,
    //     }).then(() => {
    //         console.log("ProductUpdated" + product.id);
    //     }).catch(error => {
    //         throw new Error('Could not patch this Product to the serveur.' + error)
    //     })

    // },

    // getByFieldProducts: async function (field: string): Promise<MProduct[]> {
    //     const productsArray: MProduct[] = [];
    //     products.where(field, "==", true).get().then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //             const product: MProduct = {
    //                 id: doc.id,
    //                 name: doc.data().name,
    //                 price: doc.data().price,
    //                 alcohol: doc.data().alcohol,
    //                 description: doc.data().description,
    //                 pictureUrl: doc.data().pictureUrl,
    //                 available: doc.data().available,
    //                 categorie: doc.data().categorie,
    //             }
    //             productsArray.push(product);
    //         })
    //     }).catch(error => {
    //         throw new Error('Could not get any Products from the serveur.' + error)
    //     })
    //     return productsArray;
    // },

    createOrder: async function (userData: MUserData, lineItems: MLineItem[]) {
        orders.add({
            client: userData,
            timestamp: new Date(),
            completed: false,
            lineItems: lineItems,
        }).then(docRef => {
            console.log("Sucess new Order Placed Id :" + docRef.id);
        }).catch(error => {
            throw new Error('Could not add this Order to the serveur.' + error)
        })
    },

    // deleteProduct: async function (product: MProduct) {
    //     products.doc(products.id).delete()
    //         .then(() => {
    //             console.log("ProductDeleted" + product.id);
    //         })
    //         .catch(error => {
    //             throw new Error('Could not delete this Product to the serveur.' + error)
    //         })

    // },

}

export default OrderService;