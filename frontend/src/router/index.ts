import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router';
import Client from '../views/Client.vue';
import Barman from '../views/Barman.vue';
import Products from '../views/Products.vue';


Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
