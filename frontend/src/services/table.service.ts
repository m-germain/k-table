import { MTable } from "../models";
import db from "../plugins/firebase";

export const tables = db.collection("tables");

const ProductService = {


    // Kind of useless.
    getTables: async function (): Promise<MTable[]> {
        const productsArray: MTable[] = [];
        tables.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const table: MTable = {
                    id: doc.id,
                    name: doc.data().name,
                    available: doc.data().available,
                    help: doc.data().help,
                    token: doc.data().token,
                }
                productsArray.push(table);
            })
        }).catch(error => {
            throw new Error('Could not get any Tables from the serveur.' + error)
        })
        return productsArray;
    },

    addTable: async function (tableList: MTable[]) {
        tables.add({
            name: (tableList.length + 1),
            available: true,
            help: false,
            token: "",
        }).then(docRef => {
            console.log("Success Add new Table Id :" + docRef.id);
        }).catch(error => {
            throw new Error('Could not add this Table to the serveur.' + error)
        })
    },

    removeTable: async function (tableList: MTable[]) {
        const lastTable = tableList.find(table => {
            return table.name === tableList.length
        })

        if (lastTable)
            tables.doc(lastTable.id).delete()
                .then(() => {
                    console.log("Table Deleted" + lastTable.id);
                })
                .catch(error => {
                    throw new Error('Could not delete this Product to the serveur.' + error)
                })
    },

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

export default ProductService;