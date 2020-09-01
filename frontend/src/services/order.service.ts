import { MLineItem, MUserData, OrderStates } from "../models";
import Vue from 'vue';
import db from "../plugins/firebase";

export const orders = db.collection("orders");

const OrderService = {

    createOrder: async function (userData: MUserData, lineItems: MLineItem[]) {
        if (userData.username && userData.table) {
            orders.add({
                orderCode: userData.username.charAt(0) + userData.table + "-" + Date.now()
                    .toString()
                    .substr(Date.now().toString().length - 3),
                client: userData,
                timestamp: new Date(),
                state: OrderStates.placed,
                lineItems: lineItems,
            }).then(docRef => {
                return docRef.id;
            }).catch(error => {
                throw new Error('Could not add this Order to the serveur.' + error)
            })
        } else throw new Error('Invalid User.')
    },

    patchOrder: async function (id: string, newState: string) {
        orders.doc(id).update({
            state: newState,
        }).then(() => {
            Vue.toasted.global.success({ message: "Commande passée à l'état : " + newState })
        }).catch(error => {
            throw new Error('Could not patch this Order to the serveur.' + error)
        })
    },
}

export default OrderService;