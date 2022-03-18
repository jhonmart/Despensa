import Vue from "vue";
import App from "./App.vue";

import Buefy from "buefy";

import "@mdi/font/css/materialdesignicons.css";

import router from "./routes";
import store from "./store";

import { configSocket } from "./services/Socket";

Vue.config.productionTip = false;

Vue.use(Buefy);

Object.defineProperty(String.prototype, "padronize", {
  value: function(...args_) {
    args_;
    const articles = (this.match(/ [^\d\s]{1,3} /g) || []).map(article =>
      article.trim()
    );
    return this.split(" ")
      .map(word =>
        articles.includes(word)
          ? word.toLowerCase()
          : `${word.charAt(0).toUpperCase()}${word.toLowerCase().slice(1)}`
      )
      .join(" ");
  }
});

configSocket(store);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
