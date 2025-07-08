import Vue from 'vue'
import App from './App.vue'
import ByteWeektimePickerPro from './index.js'

Vue.config.productionTip = false

Vue.use(ByteWeektimePickerPro)

new Vue({
  render: h => h(App),
}).$mount('#app')