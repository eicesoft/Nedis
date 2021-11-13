const state = {
  connections: [] //数据连接
};

const mutations = {
  ADD_CONNECTION(state, connection) {
    // console.log("add connection", connection);

    if (connection.name === "") {
      connection.name = connection.host;
    }
    state.connections.push(connection);
  },
  EDIT_CONNECTION(state, connection, index) {
    // console.log("edit connection", index, connection);

    if (index !== null && index !== undefined) {
      state.connections[index] = connection;
    }
  },

  DELETE_CONNECTION(state, index) {
    if (index !== null && index !== undefined) {
      // delete state.connections[index];
      state.connections.splice(index, 1);
    }
  }
};

const getters = {
  connections: state => {
    return state.connections;
  }
};

const actions = {
  addConnection({ commit }, connection) {
    console.log("add connnect action", connection);
    commit("ADD_CONNECTION", connection);
  },
  editConnection({ commit }, connection, index) {
    console.log("edit connection action", index, connection);
    commit("EDIT_CONNECTION", connection, index);
  },
  deleteConnection({ commit }, index) {
    console.log("delete connection action", index);
    commit("DELETE_CONNECTION", index);
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
