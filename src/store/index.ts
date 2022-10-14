import { createStore } from "vuex";

export default createStore({
  state: {
    rows: [],
  },
  mutations: {
    Loaded(state) {
      // state的isLoading true/false 互轉
      console.log("asd");
      state.rows = [];
    },
  },
  actions: {},
  modules: {},
});
