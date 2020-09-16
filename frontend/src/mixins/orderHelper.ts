
import { Component, Vue, Watch } from "vue-property-decorator";
import { MOrder, MUserData, OrderStates } from '@/models';
import { orders } from "../services/order.service";

@Component
export default class OrderHelper extends Vue {
  private orders: MOrder[] = [];
  private clientOrders: MOrder[] = [];

  private ordersPlaced: MOrder[] = [];
  private ordersPreparated: MOrder[] = [];
  private ordersPayed: MOrder[] = [];
  private ordersUncompleted: MOrder[] = [];


  @Watch("orders")
  filterOrderByTypes() {
    this.ordersPlaced = this.filterOrder(OrderStates.placed); // Orders à servir
    this.ordersPreparated = this.filterOrder(OrderStates.preparated); // Orders à encaisser 
    this.ordersPayed = this.filterOrder(OrderStates.payed); // Orders à déposer
    this.ordersUncompleted = [... this.ordersPlaced, ... this.ordersPreparated, ...this.ordersPayed];
  }

  async getOrders() {
    this.realTimeListenner();
  }

  //Listen to the db and fetch the changes on all devices.
  realTimeListenner() {
    //Ref to the collection in table service.
    //Local Order array. Bcs I Can't acces to this.orders mdr
    const localOrders: MOrder[] = [];
    // We check only the dates 
    const today = new Date();
    // Convert it to today 00h30
    today.setHours(0);
    today.setMinutes(30);
    today.setSeconds(0);

    // We get only the orders of today day.
    orders.where("timestamp", ">", today).orderBy("timestamp").onSnapshot(function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        const orderDate: Date = new Date(change.doc.data().timestamp.seconds * 1000);
        const order: MOrder = {
          id: change.doc.id,
          orderCode: change.doc.data().orderCode,
          client: change.doc.data().client,
          timestamp: orderDate,
          message: change.doc.data().message,
          state: change.doc.data().state,
          lineItems: change.doc.data().lineItems,
        }
        if (change.type === "added") {
          localOrders.push(order);
        }
        if (change.type === "modified") {
          const index = localOrders.findIndex(item => item.id == order.id)
          localOrders.splice(index, 1, order)
        }
        if (change.type === "removed") {
          const index = localOrders.findIndex(item => item.id == order.id)
          if (index >= 0) {
            localOrders.splice(index, 1)
          }
        }
      });
    });
    this.orders = localOrders;
  }

  //Listen to the db and fetch the changes on all devices.
  clientRealTimeListenner(userData: MUserData) {
    //Ref to the collection in table service.
    //Local Order array. Bcs I Can't acces to this.orders mdr
    const localOrders: MOrder[] = [];

    // We get only the orders of today day.
    orders.where('client', "==", userData).onSnapshot(function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        const orderDate: Date = new Date(change.doc.data().timestamp.seconds * 1000);
        const order: MOrder = {
          id: change.doc.id,
          orderCode: change.doc.data().orderCode,
          client: change.doc.data().client,
          timestamp: orderDate,
          message: change.doc.data().message,
          state: change.doc.data().state,
          lineItems: change.doc.data().lineItems,
        }
        if (change.type === "added") {
          localOrders.push(order);
        }
        if (change.type === "modified") {
          const index = localOrders.findIndex(item => item.id == order.id)
          localOrders.splice(index, 1, order)
        }
        if (change.type === "removed") {
          const index = localOrders.findIndex(item => item.id == order.id)
          if (index >= 0) {
            localOrders.splice(index, 1)
          }
        }
      });
    });
    // We sort it by Desc timestamp. to diplay the latest order on the top.
    localOrders.sort((a: MOrder, b: MOrder) => {
      return (b.timestamp.getTime() - a.timestamp.getTime())
    });
    
    this.clientOrders = localOrders;
  }

  get numberOfOrdersToday() {
    return this.orders.length;
  }

  get numberOfOrdersUncompleted() {
    return this.ordersUncompleted.length;
  }

  get numberOfOrdersPlaced() {
    return this.ordersPlaced.length;
  }

  get numberOfOrdersPreparated() {
    return this.ordersPreparated.length;
  }

  get numberOfOrdersPayed() {
    return this.ordersPayed.length;
  }

  filterOrder(state: string) {
    const filtredOrder: MOrder[] = []
    for (const order of this.orders) {
      if (order.state == state) {
        filtredOrder.push(order);
      }
    }
    // Orders are sorted desc and for the waitings one we want the oposit.
    filtredOrder.slice().reverse();
    return filtredOrder;
  }

}