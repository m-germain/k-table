import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router';
import Client from '../views/Client.vue';
import Barman from '../views/Barman.vue';
import Products from '../views/Products.vue';
import Home from '../views/Home.vue';
import Tables from '../views/Tables.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: '',
    props: true,
    component: Home
  },
  {
    //Va Changer en Table ID genre CgkImrfu06656wI
    path: '/:number',
    name: 'Table',
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
