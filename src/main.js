import Vue from "vue"
import App from "./App.vue"
import store from './store'

import { initContract } from "./utils"

Vue.config.productionTip = false

window.nearInitPromise = initContract()
  .then(() => {
    new Vue({
      store,
      render: h => h(App),
    }).$mount("#app")

  })
  