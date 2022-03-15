const getDefaultState = () => {
  return {
    listItens: [],
  };
};

const state = getDefaultState();

const mutations = {
  setListItens: (state, data) => {
    state.listItens = data;
  },
};

const actions = {
  // listItensRequest: async ({ commit }) => {
  //   const results = await getListItens(data);
  //   if (results.kind === "ok") commit("setListItens", results.data);
  // },
};

const getters = {
  getListItens: (state) => state.listItens,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
