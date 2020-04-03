import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isPlaying: false,
    coverUrl: ""
  },
  mutations: {
    togglePlay(state, payload) {
      state.isPlaying = payload;
    },
    changeCover(state) {}
  },
  actions: {},
  getters: {}
});

export default store;
