
import { Component, Vue, Watch } from "vue-property-decorator";
import { MOrder, OrderStates } from '@/models';
import { orders } from "../services/order.service";

@Component
export default class OrderHelper extends Vue {
  private orders: MOrder[] = [];
  private ordersPlaced: MOrder[] = [];
  private ordersPreparated: MOrder[] = [];
  private ordersServed: MOrder[] = [];
  private ordersUncompleted: MOrder[] = [];


  @Watch("orders")
  filterOrderByTypes() {
    this.ordersPlaced = this.filterOrder(OrderStates.placed);
    this.ordersPreparated = this.filterOrder(OrderStates.preparated);
    this.ordersServed = this.filterOrder(OrderStates.served);
    this.ordersUncompleted = [... this.ordersPlaced, ... this.ordersPreparated, ...this.ordersServed];
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

  get numberOfOrdersServed() {
    return this.ordersServed.length;
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