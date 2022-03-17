import Vue from "vue";
import VueNativeSock from "vue-native-websocket";

import { SocketHandlerEvents } from ".";

export const configSocket = store => {
  const socketOpts = {
    store,
    passToStoreHandler: SocketHandlerEvents,
    connectManually: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    format: "json"
  };
  Vue.use(VueNativeSock, process.env.VUE_APP_SOCKET_URL, socketOpts);
};
