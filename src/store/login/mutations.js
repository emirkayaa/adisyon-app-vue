import crypt from "@/hooks/crypt";
const mutations = {
  setToken(state, token) {
    state.token = token;
    state.isLoggedIn = true;
    localStorage.setItem("frontToken", token);
    var control = setTimeout(() => {
      if (localStorage.getItem("frontToken") != null) {
        window.location.href = "/";
        clearInterval(control);
      }
    }, 100);
  },
  setUserData(state, userData) {
    state.userData = userData;

    let kullanici_ayarlari;
    if (userData?.user?.kullanici_ayarlari?.replace(/&#34;/g, '"') == undefined) kullanici_ayarlari = {};
    else kullanici_ayarlari = JSON.parse(userData?.user?.kullanici_ayarlari?.replace(/&#34;/g, '"'));
    localStorage.setItem("user-settings", crypt(true, kullanici_ayarlari));
    localStorage.setItem("user-setting", JSON.stringify(kullanici_ayarlari));

    state.user_settings = kullanici_ayarlari;

    if (userData.auths?.admin?.authWizard[0] == 0) {
      state.isAdmin = true;
      state.adminMode = false;
    } else {
      state.isAdmin = false;
      state.adminMode = false;
    }
    console.log(userData);
    localStorage.setItem("user-data", crypt(true, userData));

    if (localStorage.getItem("dashData") == null) {
      localStorage.setItem("dashData", JSON.stringify({}));
    }
    if (
      localStorage.getItem("history") == null ||
      localStorage.getItem("history") == "" ||
      localStorage.getItem("history") == undefined
    ) {
      localStorage.setItem("history", JSON.stringify([]));
    }
    if (
      localStorage.getItem("create") == null ||
      localStorage.getItem("create") == "" ||
      localStorage.getItem("create") == undefined
    ) {
      localStorage.setItem("create", "");
    }
    if (
      localStorage.getItem("visibleColumn") == null ||
      localStorage.getItem("visibleColumn") == "" ||
      localStorage.getItem("visibleColumn") == undefined
    ) {
      localStorage.setItem("visibleColumn", JSON.stringify({}));
    }
    localStorage.setItem("theme", "light");
    setTimeout(() => {
      state.userDataChange++;
    }, 100);
  },
  setIsAdmin(state) {
    let userData;
    if (state.userData.user == undefined) {
      if (localStorage.getItem("user-data") != undefined) {
        userData = crypt(false, localStorage.getItem("user-data"));
      } else {
        userData = undefined;
      }
    } else {
      userData = state.userData;
    }

    if (userData?.auths?.admin?.authWizard[0] == 0) {
      state.isAdmin = true;
      state.adminMode = false;
    } else {
      state.isAdmin = false;
      state.adminMode = false;
    }
  },
  setCompData(state, data) {
    state.compData = data;
    localStorage.setItem("comp-data", crypt(true, data));
  },
  setAdminMode(state) {
    state.adminMode = !state.adminMode;
  },
  setLoginData(state, data) {
    state.loginData = data;
  },
};
export default mutations;
