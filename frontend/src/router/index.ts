import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router';
import Client from '../views/Client.vue';
import Barman from '../views/Barman.vue';
import Products from '../views/Products.vue';
import Home from '../views/Home.vue';
import Tables from '../views/Tables.vue';
import LandingPageTable from "../views/LandingPageTable.vue";
import ActivateTable from "../views/ActivateTable.vue";
import ActivatePhone from "../views/ActivatePhone.vue";
import PrintQRCode from "../views/PrintQRCode.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: '',
    props: true,
    component: Home
  },
  {
    //Ici c'est bien le table number 
    path: '/table/:tableNumber',
    name: 'Welcome', // Nom en haut de l'ecran
    props: true,
    component: LandingPageTable
  },
  {
    //Page pour imprimer un QR code.
    path: '/qrcode/:tableNumber',
    name: 'QRCode', // Nom en haut de l'ecran
    props: true,
    component: PrintQRCode
  },
  {
    // Activate a token => Store it on the user phone and redirect him to the 
    // Addapted page for him.
    path: '/activate/:token',
    name: '', // Nom en haut de l'ecran
    props: true,
    component: ActivatePhone
  },
  {
    // La route order va récupérer le client dans le local Storage.
    // Il trouvera seul la bonne table et data du client.
    path: '/order',
    name: '', // Nom en haut de l'ecran
    props: true,
    component: Client
  },
  {
    path: '/manager/admin',
    name: 'Barman Dashboard',
    component: Barman
  },
  {
    path: '/manager/admin/products',
    name: 'Products',
    component: Products,
  },
  {
    path: '/manager/admin/tables',
    name: 'Tables',
    component: Tables,
  },
  {
    path: '/manager/admin/activate/:tableId/:tableNumber',
    name: 'Table Activation',
    component: ActivateTable,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
