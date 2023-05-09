import axios from "axios";
import store from "@/store";
import router from "@/router";
import { ElNotification } from "element-plus";
/**
 * Verileri listelemek için kullanılan method
 * @params {string}: table_name
 * @params {object}: params
 */
const list = async (table_name, params) => {
  if (store.getters.getUserData == undefined) return;
  params["column_array_id"] = store.getters.getUserData.auths.tables[table_name]?.lists?.[0];
  params["column_array_id_query"] = store.getters.getUserData.auths.tables[table_name]?.queries?.[0];
  return await axios
    .post(store.getters.getToken + "/tables/" + table_name, {
      params: JSON.stringify(params),
    })
    .catch((err) => {
      setError({
        istek_link: store.getters.getToken + "/tables/" + table_name + "/store",
        kullanici_bilgileri: JSON.stringify(store.getters.getUserData.user),
        payloads: JSON.stringify(params),
        preview: JSON.stringify(err.response),
        tablo_ismi: table_name,
        token_bilgisi: store.getters.getToken,
      });
      ElNotification({
        title: "Hata",
        message: err.response.data.data.message,
        type: "error",
        position: "top-left",
      });
      if (err.response.data.data.message == "fail.token") {
        store.dispatch("logOut");
      }
    });
};
const edit = async (table_name, id) => {
  const params = {
    column_set_id: store.getters.getUserData.auths.tables[table_name]?.edits[0],
  };
  return await axios
    .post(store.getters.getToken + "/tables/" + table_name + "/" + id + "/edit", {
      params: JSON.stringify(params),
    })
    .catch((err) => {
      setError({
        istek_link: store.getters.getToken + "/tables/" + table_name + "/store",
        kullanici_bilgileri: JSON.stringify(store.getters.getUserData.user),
        payloads: JSON.stringify(params),
        preview: JSON.stringify(err.response),
        tablo_ismi: table_name,
        token_bilgisi: store.getters.getToken,
      });
      ElNotification({
        title: "Hata",
        message: err.response.data.data.message,
        type: "error",
        position: "top-left",
      });
      if (err.response.data.data.message == "fail.token") store.dispatch("logOut");
      if (err.response.data.data.message == "no.auth") {
        router.go(-1);
        routerDelete(window.location.pathname);
      }
      if (err.response.data.data.message == "fail.id") {
        router.go(-1);
        routerDelete(window.location.pathname);
      }
    });
};
const update = async (table_name, id, params) => {
  params["column_set_id"] = store.getters.getUserData.auths.tables[table_name].edits[0];
  return await axios.post(store.getters.getToken + "/tables/" + table_name + "/" + id + "/update", params).catch((err) => {
    setError({
      istek_link: store.getters.getToken + "/tables/" + table_name + "/store",
      kullanici_bilgileri: JSON.stringify(store.getters.getUserData.user),
      payloads: JSON.stringify(params),
      preview: JSON.stringify(err.response),
      tablo_ismi: table_name,
      token_bilgisi: store.getters.getToken,
    });
    ElNotification({
      title: "Hata",
      message: err.response.data.data.message,
      type: "error",
    });
    if (err.response.data.data.message == "fail.token") store.dispatch("logOut");
  });
};
const create = async (table_name) => {
  console.log(store.getters.getUserData);
  const params = {
    column_set_id: store.getters.getUserData.auths.tables[table_name].creates[0],
  };
  return await axios
    .post(store.getters.getToken + "/tables/" + table_name + "/create", {
      params: JSON.stringify(params),
    })
    .catch((err) => {
      setError({
        istek_link: store.getters.getToken + "/tables/" + table_name + "/store",
        kullanici_bilgileri: JSON.stringify(store.getters.getUserData.user),
        payloads: JSON.stringify(params),
        preview: JSON.stringify(err.response),
        tablo_ismi: table_name,
        token_bilgisi: store.getters.getToken,
      });
      ElNotification({
        title: "Hata",
        message: err.response.data.data.message,
        type: "error",
        position: "top-left",
      });
      if (err.response.data.data.message == "fail.token") store.dispatch("logOut");
    });
};
const add = async (table_name, params) => {
  params["column_set_id"] = store.getters.getUserData.auths.tables[table_name]?.creates[0];
  return await axios.post(store.getters.getToken + "/tables/" + table_name + "/store", params).catch((err) => {
    setError({
      istek_link: store.getters.getToken + "/tables/" + table_name + "/store",
      kullanici_bilgileri: JSON.stringify(store.getters.getUserData.user),
      payloads: JSON.stringify(params),
      preview: JSON.stringify(err.response),
      tablo_ismi: table_name,
      token_bilgisi: store.getters.getToken,
    });
    let offsets = 0;
    for (let [key, val] of Object.entries(err.response.data.data.errors)) {
        key;
        ElNotification({
            type: "error",
            title: "Hata",
            message: val[0],
            position: "top-left",
            offset: 90 * offsets + 40,
        });
        offsets++;
    }
    // ElNotification({
    //   title: "Hata",
    //   message: err.response.data.data.message,
    //   type: "error",
    //   position: "top-left",
    // });
    if (err.response.data.data.message == "fail.token") store.dispatch("logOut");
  });
};
const show = async (table_name, id) => {
  if (store.getters.getUserData == undefined) return;
  const params = {
    column_set_id: store.getters.getUserData.auths.tables[table_name].shows?.[0],
  };
  return await axios
    .post(store.getters.getToken + "/tables/" + table_name + "/" + id, {
      params: JSON.stringify(params),
    })
    .catch((err) => {
      setError({
        istek_link: store.getters.getToken + "/tables/" + table_name + "/store",
        kullanici_bilgileri: JSON.stringify(store.getters.getUserData.user),
        payloads: JSON.stringify(params),
        preview: JSON.stringify(err.response),
        tablo_ismi: table_name,
        token_bilgisi: store.getters.getToken,
      });
      ElNotification({
        title: "Hata",
        message: err.response.data.data.message,
        type: "error",
      });
      if (err.response.data.data.message == "fail.token") store.dispatch("logOut");
    });
};

const routerDelete = (link) => {
  router;
  let historyLinks = JSON.parse(localStorage.getItem("history"));
  historyLinks.splice(historyLinks.indexOf(historyLinks.find((e) => e.fullPath == link)), 1);
  localStorage.setItem("history", JSON.stringify(historyLinks));
};

/**
 * Veri silmek için kullanılan servis.
 * @param {*} table_name
 * @param {*} id
 * @returns axios
 */
const deleted = async (table_name, id) => {
  return await axios.post(store.getters.getToken + "/tables/" + table_name + "/" + id + "/delete").catch((err) => {
    setError({
      istek_link: store.getters.getToken + "/tables/" + table_name + "/store",
      kullanici_bilgileri: JSON.stringify(store.getters.getUserData.user),
      payloads: "Silme işlemi",
      preview: JSON.stringify(err.response),
      tablo_ismi: table_name,
      token_bilgisi: store.getters.getToken,
    });
    ElNotification({
      title: "Hata",
      message: err.response.data.data.message,
      type: "error",
      position: "top-left",
    });
    if (err.response.data.data.message == "fail.token") store.dispatch("logOut");
  });
};

const setError = async (params) => {
  params;
  /*const form_data = new FormData();
  form_data.append("column_set_id", "0");
  for (const [key, val] of Object.entries(params)) {
    form_data.append(key, val);
  }
  return await axios({
    method: "post",
    url: "https://blog.siberhesap.com/api/v1/public/tables/hatalar/store",
    data: form_data,
  }).catch((res) => {
    if (res.response.status == 401) {
      ElNotification({
        title: "Error",
        message: "Unauthorized",
        type: "error",
      });
    }
  });*/
};

export default { list, show, edit, update, create, add, deleted, setError };
