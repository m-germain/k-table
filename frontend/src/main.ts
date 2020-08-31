import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Toasted, { ToastOptions } from 'vue-toasted';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


//Notification managment
Vue.use(Toasted, {
  iconPack: 'material' // set your iconPack, defaults to material.
});

// options to the toast
const optionsError = {
  position: 'bottom-right',
  className: 'error',
  // icon: 'error-outline',
  // icon: {
  //   name: 'error-outline',
  //   after: true // this will append the icon to the end of content
  // }, 
  // action: [
  //   {
  //     text: 'OK',
  //     onClick: (e: any, toastObject: ToastObject) => {
  //       toastObject.goAway(0);
  //     }
  //   }
  // ],
  duration: 50000,
  keepOnHover: true,
};

const optionsSucess = {
  position: 'bottom-right',
  className: 'success',
  // icon: {
  //   name: 'check',
  //   after: true // this will append the icon to the end of content
  // },
  duration: 5000,
  keepOnHover: true,
};

// register the toast with the custom message
Vue.toasted.register('error',
  (payload) => {

    // if there is no message passed show default message
    if (!payload.message) {
      return "Oops.. Something Went Wrong.."
    }

    // if there is a message show it with the message
    return "Oops.. " + payload.message;
  },
  optionsError as ToastOptions
)

Vue.toasted.register('success',
  (payload) => {

    // if there is no message passed show default message
    if (!payload.message) {
      return "C'est tout bon ! "
    }

    // if there is a message show it with the message
    return payload.message;
  },
  optionsSucess as ToastOptions
)