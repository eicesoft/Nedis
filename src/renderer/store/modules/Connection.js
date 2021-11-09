const state = {
  connections: []
};

const mutations = {
  ADD_CONNECTION(state, connection) {
    state.connections.push(connection);
  }
};

const actions = {
  addConnection({ commit }) {
    commit("ADD_CONNECTION");
  }
};

export default {
  state,
  mutations,
  actions
};
