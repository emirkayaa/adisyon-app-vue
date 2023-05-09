import Vuex from "vuex";

import login from "./login.js";
import services from "./services.js";
import lockScreen from "./lockScreen.js";
import angaryos from "./angaryos.js";
import rightClickMenu from "./rightClickMenu.js";

const store = new Vuex.Store({
  state: {
    historyState: 0,
    menuState: false,
    testMode: false,
    sepet:{}
  },
  mutations: {
    //cari değiştikçe sayfa başlığı değişsin methodu
    historyChange(state) {
      state.historyState++;
    },
    setMenuState(state, data) {
      state.menuState = data;
    },
    setTestMode(state, data) {
      state.testMode = data;
    },
    setSepet(state, data) {
      state.sepet = data
      localStorage.setItem('sepet',JSON.stringify(data))
    }
  },
  actions: {},
  getters: {
    // cari hesap adını sayfa başlığına yazdığımız yer
    getHistoryState(state) {
      return state.historyState;
    },
    getMenuState(state) {
      return state.menuState;
    },
    getTestMode(state) {
      return state.testMode;
    },
    getSepet(state) {
      state.sepet=JSON.parse(localStorage.getItem('sepet'))
      return state.sepet
    }
  },

  modules: { login, services, lockScreen, angaryos, rightClickMenu },
});
export default store;
