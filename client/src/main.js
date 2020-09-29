import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Meta from 'vue-meta'

import './registerServiceWorker'
import Axios from 'axios'
import './assets/css/style.scss'

Vue.config.productionTip = false
Vue.prototype.$http = Axios

Vue.use(Meta)
Vue.use({
	install(Vue) {
		Vue.prototype.$api = Axios.create({
			baseURL: 'http://localhost:3000/',
		})
	},
})

new Vue({
	router,
	render: h => h(App),
}).$mount('#app')
