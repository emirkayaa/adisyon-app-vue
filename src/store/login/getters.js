import crypt from "@/hooks/crypt";
const getters = {
  getToken(state) {
    if (state.token) {
      return state.token;
    } else {
      if (localStorage.getItem("frontToken")) {
        state.token = localStorage.getItem("frontToken");
        return state.token;
      } else {
        return null;
      }
    }
  },
  getUserData(state) {
    if (state.userData.user == undefined) {
      if (localStorage.getItem("user-data") != undefined) {
        return crypt(false, localStorage.getItem("user-data"));
      } else {
        return undefined;
      }
    } else {
      return state.userData;
    }
  },
  getUserSettings() {
    if (localStorage.getItem("user-settings") != undefined) {
      return crypt(false, localStorage.getItem("user-settings"));
    } else {
      return undefined;
    }
  },
  getLoginData(state) {
    return state.loginData;
  },
  adminMode(state) {
    return state.adminMode;
  },
  isAdmin(state) {
    return state.isAdmin;
  },
  getCompData(state) {
    if (state.compData.id == undefined) {
      if (localStorage.getItem("comp-data") != undefined) {
        return crypt(false, localStorage.getItem("comp-data"));
      } else {
        return undefined;
      }
    } else {
      return state.compData;
    }
  },
  userDataChange(state) {
    return state.userDataChange;
  },
};
export default getters;
