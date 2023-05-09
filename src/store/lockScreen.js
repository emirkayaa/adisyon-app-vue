const lockScreen = {
  state: {
    screenLock: false,
  },
  mutations: {
    setScreenLock(state, data) {
      state.screenLock = data;
      document.cookie = "screenLock=" + data;
    },
  },
  getters: {
    getScreenLock(state) {
      var nameEQ = "screenLock=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) state.screenLock = c.substring(nameEQ.length, c.length);
      }
      return state.screenLock;
    },
  },
};
export default lockScreen;
