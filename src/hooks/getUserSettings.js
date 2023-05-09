import store from "@/store";
const getUserSettings = (key) => {
  let kullanici_ayarlari;
  if (store.getters.getUserData != null && store.getters.getUserData != "" && store.getters.getUserData != undefined) {
    if (store.getters.getUserData?.user?.kullanici_ayarlari?.replace(/&#34;/g, '"') == undefined) kullanici_ayarlari = {};
    else kullanici_ayarlari = JSON.parse(store.getters.getUserData?.user?.kullanici_ayarlari?.replace(/&#34;/g, '"'));
    if (kullanici_ayarlari[key] == undefined) kullanici_ayarlari[key] = "";
    if (store.getters.getUserData != "") {
      return kullanici_ayarlari[key];
    }
  }
};

export default getUserSettings;
