import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import state from "./state";

import CTCloudbase from "./function/c_tcloudbase";

Vue.prototype.$tcb = CTCloudbase;
Vue.prototype.$state=Vue.observable(state); //小型状态存储 非vuex

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
