<template>
  <div>
    <style-files></style-files>
    <HizliKurulum></HizliKurulum>

    <div class="d-flex">
      <Menu @menuCollapse="menu_collapse = $event" :menuState="menuOpen"></Menu>

      <div :class="menu_collapse ? 'menu-collapse' : 'menu-normal'" class="px-2">
        <div class="mx-3">
          <ust-menu @menuState="menuOpen = $event"></ust-menu>
          <div class="my-3">
            <div v-if="this.$route.name == '404'">
              <hata-sayfasi></hata-sayfasi>
            </div>
            <div v-else>
              <div id="offline"><offline></offline></div>

              <div id="online"><router-view></router-view></div>
            </div>
          </div>
          <div class="mt-5 pt-1">
            <footer-files></footer-files>
          </div>
        </div>
      </div>
    </div>

    <right-modal></right-modal>
    <centerModal></centerModal>
    <windows-modal></windows-modal>
    <script-files> </script-files>
    <page-to-top></page-to-top>
    <yardim></yardim>
  </div>
</template>
<script>
import ScriptFiles from "@/views/pages/Script.vue";
import StyleFiles from "@/views/pages/Style.vue";
import FooterFiles from "@/views/pages/Footer.vue";
import Menu from "@/views/pages/Menu";
import store from "@/store";
import hataSayfasi from "@/views/pages/404.vue";

import Offline from "@/views/pages/Offline.vue";

import HizliKurulum from "@/views/yeni-kullanici/hizli-kurulum.vue";
import UstMenu from "@/views/pages/UstMenu.vue";
import { mapGetters } from "vuex";

import rightModal from "@/angaryos/modal/right-modal.vue";
import centerModal from "@/angaryos/modal/center-modal.vue";

import WindowsModal from "@/angaryos/modal/windows-modal.vue";
import PageToTop from "@/views/modules/page-to-top.vue";
import yardim from "@/views/modules/yardim.vue";

export default {
  data() {
    return {
      token: "",
      menuOpen: null,
      menu_collapse: false,
    };
  },
  created() {
    this.token = store.getters.getToken;
    this.offlineControl();
  },
  methods: {
    offlineControl() {
      setInterval(() => {
        const divOff = document.getElementById("offline");
        const divOn = document.getElementById("online");
        window.addEventListener("online", () => {
          divOff.style.display = "none";
          divOn.style.display = "block";
        });
        window.addEventListener("offline", () => {
          divOff.style.display = "block";
          divOn.style.display = "none";
        });
      });
    },
  },
  watch: {
    userDataChange() {
      const interval_id = window.setInterval(function () {}, Number.MAX_SAFE_INTEGER);
      for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
      }
    },
  },
  computed: {
    ...mapGetters(["userDataChange", "getUserData"]),
  },
  components: {
    ScriptFiles,
    StyleFiles,
    FooterFiles,
    Menu,
    hataSayfasi,
    HizliKurulum,
    UstMenu,
    yardim,
    rightModal,
    centerModal,
    Offline,
    WindowsModal,
    PageToTop,
  },
};
</script>
<style>
.menu-normal {
  max-width: 100vw;
  width: 100%;
}
.menu-collapse {
  max-width: 100vw;
  width: 100%;
}
@media screen and (min-width: 769px) {
  .menu-normal {
    max-width: calc(100vw - 290px);
    width: 100%;
  }
  .menu-collapse {
    max-width: calc(100vw - 65px);
    width: 100%;
  }
}
</style>
