import Vue from "vue";
import App from "./App.vue";
import store from "./store/index";

Vue.config.productionTip = false;

new Vue({
  render: function(h) {
    return h(App);
  },
  store
}).$mount("#app");
