import state from "./services/state.js";
import mutations from "./services/mutations.js";
import actions from "./services/actions.js";
import getters from "./services/getters.js";
/**
 * Tüm kullanıcı işlemlerinin yapıldığı yer
 */
const services = {
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
};

export default services;
