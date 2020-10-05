import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Client from "../views/Public/Client.vue";
import Barman from "../views/Barman/Barman.vue";
import Products from "../views/Barman/Products.vue";
import Home from "../views/Public/Home.vue";
import Tables from "../views/Barman/Tables.vue";
import LandingPageTable from "../views/Public/LandingPageTable.vue";
import ActivateTable from "../views/Barman/ActivateTable.vue";
import ActivatePhone from "../views/Public/ActivatePhone.vue";
import PrintQRCode from "../views/Barman/PrintQRCode.vue";
import Orders from "../views/Barman/Orders.vue";
import MyOrders from "../views/Public/MyOrders.vue";
import TokenService from "@/services/token.service";
import ActivateAssociation from "../views/Barman/ActivateAssociation.vue";
import OrdersAssociation from "../views/Association/OrdersAssociation.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "",
    props: true,
    component: Home,
    meta: {
      public: true, // Allow access to even if not logged in
    },
  },
  {
    //Ici c'est bien le table number
    path: "/table/:tableNumber",
    name: "Welcome", // Nom en haut de l'ecran
    props: true,
    component: LandingPageTable,
    meta: {
      public: true, // Allow access to even if not logged in
    },
  },
  {
    //Page pour imprimer un QR code.
    path: "/qrcode/:tableNumber",
    name: "QRCode", // Nom en haut de l'ecran
    props: true,
    component: PrintQRCode,
    meta: {
      public: true, // Allow access to even if not logged in
    },
  },
  {
    // Activate a token => Store it on the user phone and redirect him to the
    // Addapted page for him.
    path: "/activate/:token",
    name: "", // Nom en haut de l'ecran
    props: true,
    component: ActivatePhone,
    meta: {
      public: true, // Allow access to even if not logged in
    },
  },
  {
    // La route order va récupérer le client dans le local Storage.
    // Il trouvera seul la bonne table et data du client.
    path: "/order",
    name: "", // Nom en haut de l'ecran
    props: true,
    component: Client,
    meta: {
      public: true, // Allow access to even if not logged in
    },
  },
  {
    // La route order va récupérer le client dans le local Storage.
    // Il trouvera seul la bonne table et data du client.
    path: "/myorders",
    name: "", // Nom en haut de l'ecran
    props: true,
    component: MyOrders,
    meta: {
      public: true, // Allow access to even if not logged in
    },
  },
  {
    path: "/admin",
    name: "Barman Dashboard",
    component: Barman,
    meta: {
      public: false, // Only for admins
    },
  },
  {
    path: "/admin/products",
    name: "Products",
    component: Products,
    meta: {
      public: false, // Only for admins
    },
  },
  {
    path: "/admin/tables",
    name: "Tables",
    component: Tables,
    meta: {
      public: false, // Only for admins
    },
  },
  {
    path: "/admin/orders",
    name: "Commandes",
    component: Orders,
    meta: {
      public: false, // Only for admins
    },
  },
  {
    path: "/admin/activate/:tableId/:tableNumber",
    name: "Table Activation",
    component: ActivateTable,
    meta: {
      public: false, // Only for admins
    },
  },
  {
    path: "/admin/association",
    name: "Association Activation",
    component: ActivateAssociation,
    meta: {
      public: false, // Only for admins
    },
  },
  {
    path: "/association",
    name: "Commandes Association",
    component: OrdersAssociation,
    meta: {
      public: true, // Only for admins
    },
  },
  { path: "*", redirect: "/" }, // auto redirect when bad route
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isPublic = to.matched.some((record) => record.meta.public);

  if (!isPublic) {
    // We get the token from the storage.
    await TokenService.getAdminToken()
      .then(() => {
        // If the token is valid the user can continue.
        next();
      })
      .catch(() => {
        // If there is an error this mean the token is invalid or we cannot find it on the user device.
        // we send the user back home.
        router.push("/");
        return next({
          path: "",
        });
      });
  } else next();
});

export default router;
