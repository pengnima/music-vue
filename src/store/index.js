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
      console.log(payload);
    },
    changeCover(state) {
      console.log("切换图片");
    }
  },
  actions: {},
  getters: {}
});

export default store;
