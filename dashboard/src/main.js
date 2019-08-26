import Vue from 'vue'
import { store } from './store/store'
import App from './App.vue'

Vue.config.productionTip = false

import moment from 'moment'

Vue.filter('formatTimestampToTime', function (timestamp) {
  if (timestamp) {
    return moment(timestamp).format('HH:mm:ss')
  }
})

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
