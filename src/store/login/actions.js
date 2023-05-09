import router from "@/router";
import axios from "axios";
import { ElNotification } from "element-plus";
import store from "../index.js";
import services from "@/services";

const actions = {
  verification(store, data) {
    axios.post("https://ipapi.co/json/").then((res) => {
      console.log("verif ip", res);
      data["clientInfo"] = {
        browser: res.data,
        device: navigator.platform,
        type: "web",
        name: "",
        dateTime: new Date().toISOString(),
      };

      store.commit("setLoginData", data);
      axios
        .post("login", data)
        .then((res) => {
          if (typeof res.data.data.token == "object") {
            router.push("/verification");
            data["token"] = res.data.data.token;
            store.commit("setLoginData", data);
          } else {
            document.getElementById("page-loader").style.display = "block";
            document.getElementById("app").style.display = "none";
            store.commit("setToken", res.data.data.token);
          }
        })
        .catch(() => {
          ElNotification({
            title: "Hata",
            message: "Eksik veya hatalı giriş yaptınız.",
            type: "warning",
            position: "top-right",
          });
        });
    });
  },

  login(store, authData) {
    axios.post("https://ipapi.co/json/").then((res) => {
      console.log("login ip", res);
      authData["clientInfo"] = {
        browser: res.data,
        device: navigator,
        type: "web",
        dateTime: new Date().toISOString(),
      };
      axios
        .post("otp", authData)
        .then((response) => {
          if (response.data.status) {
            document.getElementById("page-loader").style.display = "block";
            document.getElementById("app").style.display = "none";
            store.commit("setToken", response.data.data.token);
            ElNotification({
              title: "Başarılı",
              message: "Doğrulandı. Yönlendiriliyorsunuz...",
              type: "success",
              position: "top-left",
            });
            localStorage.removeItem("loginData");
            localStorage.removeItem("kalanSure");
          }
        })
        .catch(() => {
          ElNotification({
            title: "Hata",
            message: "Eksik veya hatalı giriş yaptınız.",
            type: "warning",
            position: "top-right",
          });
        });
    });
  },
  logOut() {
    services.edit("users", store.getters.getUserData.user?.id).then((res) => {
      var tokens = JSON.parse(res.data.data.record.tokens);
      tokens.splice(tokens.indexOf(this.getToken), 1);
      services
        .update("users", store.getters.getUserData.user.id, {
          column_set_id: store.getters.getUserData.auths.tables["users"].edits[0],
          email: store.getters.getUserData.user.email,
          tc: store.getters.getUserData.user.tc,
          tokens: JSON.stringify(tokens),
        })
        .then(() => {
          //this.$router.push("/login");
        });
    });
    localStorage.clear();
    window.location.href = "/login";
  },
  async userDataApi(store) {
    await axios
      .post(store.getters.getToken + "/getLoggedInUserInfo")
      .then((res) => {
        if (res.data.code == "400") {
          this.$router.push("/login");
        } else {
          store.commit("setUserData", res.data.data);
          // store.dispatch("blogLogin");
          localStorage.removeItem("loginData");
          localStorage.removeItem("kalanSure");
        }
      })
      .catch((err) => {
        ElNotification({
          title: "Error",
          message: err.response.data.data.message,
          type: "error",
          position: "top-left",
        });
        localStorage.removeItem("frontToken");
        window.location.href = "/login";
      });
  },
};
export default actions;
