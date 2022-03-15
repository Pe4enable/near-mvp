import Vue from "vue"
import App from "./App.vue"
import store from './store'
import router from './router'
import Notifications from 'vue-notification'
import IconComponent from './components/Icon'

import { initContract } from "./nearConfig"

Vue.config.productionTip = false
Vue.use(Notifications)
Vue.component('Icon', IconComponent)

initContract(store)
  .then(() => {
    store.dispatch('setContractLoading', false)
  })
  
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount("#app")