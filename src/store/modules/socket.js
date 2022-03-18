import Vue from "vue";

const vue = new Vue();

const getDefaultState = () => {
  return {
    isConnected: false,
    message: "",
    reconnectError: false,
    uuid: false
  };
};

const state = getDefaultState();

const mutations = {
  SOCKET_ONOPEN(state) {
    state.isConnected = true;
  },
  SOCKET_ONCLOSE(state) {
    state.isConnected = false;
  },
  SOCKET_ONERROR(state, event) {
    console.error(state, event);
  },
  // default handler called for all methods
  SOCKET_ONMESSAGE(state, message) {
    state.message = message;
  },
  // mutations for reconnect methods
  SOCKET_RECONNECT(state, count) {
    console.info(state, count);
  },
  SOCKET_RECONNECT_ERROR(state) {
    state.reconnectError = true;
  }
};

const actions = {
  sendSocketMessage: (_, message) => {
    vue.$socket.sendObj(message);
  },

  listItensRequest: ({ state }, uuid) => {
    state.uuid = uuid;
    vue.$socket.sendObj({ method: "GET", uuid });
  },

  addItensRequest: ({ state }, item) => {
    vue.$socket.sendObj({ method: "POST", uuid: state.uuid, item });
  },

  editItensRequest: ({ state }, item) => {
    vue.$socket.sendObj({ method: "PUT", uuid: state.uuid, item });
  },

  deleteItensRequest: ({ state }, item) => {
    vue.$socket.sendObj({
      method: "DELETE",
      uuid: state.uuid,
      item_id: item.id
    });
  }
};

const getters = {
  socketConnectionState: state => state.isConnected,
  getMessage: state => state.message
};

export default {
  state,
  mutations,
  actions,
  getters
};
