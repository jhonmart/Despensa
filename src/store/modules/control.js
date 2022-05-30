import { SnackbarProgrammatic as Toast } from "buefy";

const getDefaultState = () => {
  return {
    listItens: []
  };
};

const state = getDefaultState();

const mutations = {
  setListItens: (state, data) => {
    state.listItens = data;
  },
  editItem: (state, data) => {
    state.listItens.forEach(item => item.id === data.id && (item = data));
  },
  removeItemById: (state, id) => {
    state.listItens = state.listItens.filter(item => item.id !== id);
  },
  insertNewItem: (state, data) => {
    state.listItens.unshift(data);
  }
};

const actions = {
  searchCodeInGoogle: async (_, query) => {
    return await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${process.env.VUE_APP_CX}&key=${process.env.VUE_APP_KEY}`
    )
      .then(el => el.json())
      .then(el => el.items);
  },
  addProduct: ({ commit, dispatch }, data) => {
    commit("insertNewItem", data);
    dispatch("addItensRequest", data);
    Toast.open({
      message: "Novo item adicionado com sucesso!",
      duration: 5e3,
      type: "is-success"
    });
  },
  editProduct: ({ commit, dispatch }, data) => {
    if (data.count === 0) {
      this.$buefy.toast.open({
        message: "A quantidade não pode ser menor que 1(um)!",
        type: "is-danger",
        duration: 5e3
      });
      return;
    }

    commit("editItem", data);
    dispatch("editItensRequest", data);
    Toast.open({
      message: "Item editado com sucesso!",
      duration: 5e3,
      type: "is-success"
    });
  },
  removeProduct: ({ commit, dispatch }, data_id) => {
    commit("removeItemById", data_id);
    dispatch("deleteItensRequest", data_id);
    Toast.open({
      message: "Item apagado com sucesso!",
      duration: 5e3,
      type: "is-success"
    });
  }
};

const getters = {
  getListItens: state => (filter = "") =>
    state.listItens.filter(item =>
      RegExp(filter, "i").test(`${item.name} ${item.code} ${item.size}`)
    ),
  getListBuys: state => state.listItens
};

export default {
  state,
  mutations,
  actions,
  getters
};
