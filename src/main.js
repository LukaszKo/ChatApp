import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import './registerServiceWorker'
import Vuetify from 'vuetify'
import VueSocketio from 'vue-socket.io'
import VeeValidate from 'vee-validate'
import { sync } from 'vuex-router-sync'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import '../node_modules/vuetify/dist/vuetify.min.css'
import '../node_modules/vue-multiselect/dist/vue-multiselect.min.css'

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(Vuetify)
Vue.use(VeeValidate)
sync(store, router)

Vue.use(VueSocketio, 'http://localhost:9100')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created () {
    store.dispatch('core/checkLogin')
    if (this.$store.getters['core/getUser']) {
      this.$router.push({ name: 'home' })
    } else {
      this.$router.push('/signin')
    }
  },
  render: h => h(App)
}).$mount('#app')
