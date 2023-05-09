import axios from "axios";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import lang from "./lang";
import services from "@/services";

import FloatingVue from "floating-vue";
import ElementPlus from "element-plus";
import elTR from "./lang/element_tr.ts";
import { DraggablePlugin, Draggable } from "@braks/revue-draggable";

import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";

import crypt from "@/hooks/crypt";

axios.defaults.baseURL = "https://adisyon.masahesap.com/api/v1/";

import "element-plus/theme-chalk/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";

import "bootstrap-icons/font/bootstrap-icons.css";
import "floating-vue/dist/style.css";

import "@mdi/font/css/materialdesignicons.min.css";

let app = createApp(App);

app.config.globalProperties.$services = services;
app.config.globalProperties.tr = lang;
app.config.globalProperties.imgBaseUrl = "https://adisyon.masahesap.com/uploads/";
app.config.globalProperties.loadingGif = "/gif/ishesap-loading.gif";
app.config.globalProperties.loadingGifText = "/gif/ishesap-loading-2.gif";

app.directive("yakinda", {
  mounted(el, dt) {
    dt.value != false ? el.classList.add("yakinda") : "";
    el.addEventListener("mouseover", () => {
      dt.value != false ? el.classList.remove("yakinda") : "";
    });
    el.addEventListener("mouseout", () => {
      dt.value != false ? el.classList.add("yakinda") : "";
    });
  },
});

app.directive("yakinda", {
  mounted(el, dt) {
    dt.value != false ? el.classList.add("yakinda") : "";
  },
});
app.directive("yakinda", {
  mounted(el, dt) {
    dt.value != false ? el.classList.add("yakinda") : "";
  },
});

app.use(DraggablePlugin);

app.use(router);
app.use(VueSidebarMenu);
app.use(store);

app.component(Draggable);
app.use(ElementPlus, {
  locale: elTR,
});
app.config.globalProperties.isEmpty = (e) => {
  if (e == "" || e == null || e == undefined) return true;
  else return false;
};
app.config.globalProperties.getImages = (image) => {
  if (image == undefined || image == "[]") {
    return [];
  } else {
    const img = JSON.parse(image)[0];

    return app.config.globalProperties.imgBaseUrl + img.destination_path + "m_" + img.file_name;
  }
};
app.config.globalProperties.crypt = crypt;
app.use(FloatingVue, {
  themes: {
    tooltip: {
      triggers: ["hover", "focus", "touch", "click"],
    },
  },
});
app.mount("#app");
