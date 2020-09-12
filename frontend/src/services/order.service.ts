import { MLineItem, MUserData, OrderStates, MOrder } from "../models";
import Vue from 'vue';
import db from "../plugins/firebase";

export const orders = db.collection("orders");

const OrderService = {

    getOrdersOfClient: async function (userData: MUserData): Promise<MOrder[]> {
        const clientOrders: MOrder[] = [];

        await orders.where('client', "==", userData).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const orderDate: Date = new Date(doc.data().timestamp.seconds * 1000);
                const order: MOrder = {
                    id: doc.id,
                    orderCode: doc.data().orderCode,
                    client: doc.data().client,
                    timestamp: orderDate,
                    state: doc.data().state,
                    lineItems: doc.data().lineItems,
                };
                clientOrders.push(order);
            })
        }).catch(error => console.log(error));
        // We sort it by Desc timestamp. to diplay the latest order on the top.
        clientOrders.sort((a: MOrder, b: MOrder) => {
            return (b.timestamp.getTime() - a.timestamp.getTime())
        }
        )
        return clientOrders;
    },

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