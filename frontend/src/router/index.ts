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
import Orders from "../views/Orders.vue";
import TokenService from '@/services/token.service';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: '',
    props: true,
    component: Home,
    meta: {
      public: true,  // Allow access to even if not logged in
    }
  },
  {
    //Ici c'est bien le table number 
    path: '/table/:tableNumber',
    name: 'Welcome', // Nom en haut de l'ecran
    props: true,
    component: LandingPageTable,
    meta: {
      public: true,  // Allow access to even if not logged in
    }
  },
  {
    //Page pour imprimer un QR code.
    path: '/qrcode/:tableNumber',
    name: 'QRCode', // Nom en haut de l'ecran
    props: true,
    component: PrintQRCode,
    meta: {
      public: true,  // Allow access to even if not logged in
    }
  },
  {
    // Activate a token => Store it on the user phone and redirect him to the 
    // Addapted page for him.
    path: '/activate/:token',
    name: '', // Nom en haut de l'ecran
    props: true,
    component: ActivatePhone,
    meta: {
      public: true,  // Allow access to even if not logged in
    }
  },
  {
    // La route order va récupérer le client dans le local Storage.
    // Il trouvera seul la bonne table et data du client.
    path: '/order',
    name: '', // Nom en haut de l'ecran
    props: true,
    component: Client,
    meta: {
      public: true,  // Allow access to even if not logged in
    }
  },
  {
    path: '/admin',
    name: 'Barman Dashboard',
    component: Barman,
    meta: {
      public: false,  // Only for admins
    }
  },
  {
    path: '/admin/products',
    name: 'Products',
    component: Products,
    meta: {
      public: false,  // Only for admins
    }
  },
  {
    path: '/admin/tables',
    name: 'Tables',
    component: Tables,
    meta: {
      public: false,  // Only for admins
    }
  },
  {
    path: '/admin/orders',
    name: 'Tables',
    component: Orders,
    meta: {
      public: false,  // Only for admins
    }
  },
  {
    path: '/admin/activate/:tableId/:tableNumber',
    name: 'Table Activation',
    component: ActivateTable,
    meta: {
      public: false,  // Only for admins
    }
  },
  { path: '*', redirect: '/' } // auto redirect when bad route

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public)
  const adminToken = TokenService.getAdminToken();

  if (!isPublic && !adminToken) {
    // We cannot show any message notifications here bcs the vue toasted isn't defined...
    return next({
      path: '',
    });
    // With no token on a private route the user is redirected to the home.
  }

  next();
})


export default router
