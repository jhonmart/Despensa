import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import control from "./modules/control";
import socket from "./modules/socket";

Vue.use(Vuex);

const dataState = createPersistedState({
  storage: window.localStorage,
  paths: ["control"]
});

export default new Vuex.Store({
  modules: {
    control,
    socket
  },
  plugins: [dataState]
});
