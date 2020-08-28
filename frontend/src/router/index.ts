import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router';
import Client from '../views/Client.vue';
import Barman from '../views/Barman.vue';
import Products from '../views/Products.vue';
import Home from '../views/Home.vue';
import Tables from '../views/Tables.vue';
import LandingPageTable from "../views/LandingPageTable.vue";
import ActivateTable from "../views/ActivateTable.vue";

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
    path: '/:tableNumber',
    name: 'Welcome', // Nom en haut de l'ecran
    props: true,
    component: LandingPageTable
  },
  {
    //Va Changer en Table ID genre CgkImrfu06656wI
    path: '/order/:number',
    name: 'Table', // Nom en haut de l'ecran
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
