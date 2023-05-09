import store from "../store";
import axios from "axios";
import services from "@/services";
import { ElNotification } from "element-plus";
import crypt from "./crypt.js";
const userSetting = async (key, value) => {
  let kullanici_ayarlari;

  if (localStorage.getItem("user-data") != null) {
    if (store.getters.getUserData?.user?.kullanici_ayarlari?.replace(/&#34;/g, '"') == undefined) kullanici_ayarlari = {};
    else kullanici_ayarlari = JSON.parse(store.getters.getUserData?.user?.kullanici_ayarlari?.replace(/&#34;/g, '"'));
    localStorage.setItem("user-settings", crypt(true, kullanici_ayarlari));

    if (kullanici_ayarlari[key] == undefined) kullanici_ayarlari[key] = "";
    kullanici_ayarlari[key] = value;
    await services
      .update("users", store.getters.getUserData?.user?.id, {
        column_set_id: store.getters.getUserData?.auths.tables.users.edits[0],
        kullanici_ayarlari: JSON.stringify(kullanici_ayarlari),
        tc: store.getters.getUserData.user.tc,
        email: store.getters.getUserData.user.email,
      })
      .then(async (res) => {
        if (res.data.data.message == "success") {
          store.commit("setUserData", {});

          await axios
            .post(store.getters.getToken + "/getLoggedInUserInfo")
            .then((res) => {
              if (res.data.code == "400") {
                this.$router.push("/login");
              } else {
                store.commit("setUserData", res.data.data);
                return true;
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
        }
      });
  }
};

export default userSetting;

/**
 * Kullanılan ayarlar:
 *
 * 'firstSettings' => 'Kullanıcı ilk girdiğinde karşısına çıkan hızlı kurulum ekranı',
 * 'moneyVisible' => 'Para gösterim modu (Dashboardlardaki parayı gizler)(false:goster,true:gizle)',
 *
 */
