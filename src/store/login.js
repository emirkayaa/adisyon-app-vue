import state from "./login/state.js";
import mutations from "./login/mutations.js";
import actions from "./login/actions.js";
import getters from "./login/getters.js";
/**
 * Tüm kullanıcı işlemlerinin yapıldığı yer
 */
const login = {
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
};

export default login;
