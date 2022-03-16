import { ToastProgrammatic as Toast } from 'buefy'

const getDefaultState = () => {
  return {
    listItens: [{
      id: Math.random().toString(16).slice(2),
      code: '',
      count: 0,
      name: '',
      size: '',
      codeReading: false,
      date: (new Date).toISOString().split('T')[0],
    }],
  };
};

const state = getDefaultState();

const mutations = {
  setListItens: (state, data) => {
    state.listItens = data;
  },
  editItem: (state, data) => {
    state.listItens.forEach(item => (item.id === data.id) && (item = data));
    Toast.open({
      message: "Item editado com sucesso!",
      duration: 5e3,
      type: "is-success"
    });
  },
  removeItemById: (state, id) => {
    state.listItens = state.listItens.filter(item => item.id !== id);
    Toast.open({
      message: "Item apagado com sucesso!",
      duration: 5e3,
      type: "is-success"
    });
  },
  insertNewItem: (state, data) => {
    state.listItens.unshift(data);
    Toast.open({
      message: "Novo item adicionado com sucesso!",
      duration: 5e3,
      type: "is-success"
    });
  },
};

const actions = {
  // listItensRequest: async ({ commit }) => {
  //   const results = await getListItens(data);
  //   if (results.kind === "ok") commit("setListItens", results.data);
  // },
  searchCodeInGoogle: async (_, query) => {
    return await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${process.env.VUE_APP_CX}&key=${process.env.VUE_APP_KEY}`
    )
    .then(el=>el.json())
    .then(el=>el.items);
  }
};

const getters = {
  getListItens: (state) => (filter = "") => state.listItens.filter(item => RegExp(filter, "i").test(`${item.name} ${item.code}`)),
};

export default {
  state,
  mutations,
  actions,
  getters,
};
