import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
let coverIndex = 0;
const COVER_URL = [
  require(`../assets/cover1.jpg`),
  require(`../assets/cover2.jpg`),
  require(`../assets/cover3.jpg`),
];

const store = new Vuex.Store({
  state: {
    isPlaying: false,
    coverUrl: "", //require("../assets/cover1.jpg")
  },
  mutations: {
    togglePlay(state, payload) {
      state.isPlaying = payload;
      // console.log(payload);
    },
    changeCover(state) {
      // 切换图片用
      state.coverUrl = COVER_URL[coverIndex++];
      if (coverIndex >= 3) {
        coverIndex = 0;
      }
    },
  },
  actions: {},
  getters: {},
});

export default store;
