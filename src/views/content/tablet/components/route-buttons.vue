<template>
  <div class="position-fixed bottom-0 end-0 p-3 d-flex">
    <!-- Tema değiştirici -->
    <el-button size="large" class="mb-2" style="margin-left: 12px" @click="themeChange()">
      <i v-if="this.themeColor != 'dark'" class="bi bi-brightness-high text-warning fs-4 m-0 bolder"></i>
      <i v-else class="bi bi-moon text-info m-0 fs-4 m-0"></i>
    </el-button>
    <!-- Tema değiştirici -->
    <!-- Tam ekran -->
    <el-button class="d-none d-sm-flex align-items-center mb-2" @click="openFullScreen()" size="large">
      <i v-if="fullScreen == false" class="bi bi-fullscreen-exit text-color fs-4 m-0"></i>
      <i v-else class="bi bi-fullscreen m-0 fs-4 m-0"></i>
    </el-button>
    <!-- Tam ekran -->
    <!-- Ekran Kilidi -->
    <el-button class="mb-2 d-none d-sm-flex" size="large" @click="lockScreen()">
      <i class="bi bi-lock m-0 fs-4"></i>
    </el-button>
    <el-button size="large" class="cikis-buton mb-2" @click="logOut()">
      <i class="bi bi-door-closed m-0 fs-4"></i>
    </el-button>
    <!-- Ekran Kilidi -->
  </div>
</template>

<script>
import $ from "jquery";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getUserData"]),
  },
  methods: {
    loadTheme() {
      this.themeColor = localStorage.getItem("theme");
      if (this.themeColor == "dark") {
        $("html").removeClass("light");
        $("html").addClass("dark");
      } else {
        $("html").removeClass("dark");
        $("html").addClass("light");
      }
      this.$emit("themeChange", this.themeColor);
    },
    lockScreen() {
      var pin = this.getCompData.pin_code;
      document.getElementsByTagName("body")[0].classList.remove("collapse-lock");
      if (pin != null && pin != "" && pin != undefined) {
        this.$store.commit("setScreenLock", "true");
      } else {
        this.lockPinDialog = true;
      }
    },
    themeChange() {
      this.themeColor = localStorage.getItem("theme");

      if (this.themeColor == "light") {
        localStorage.setItem("theme", "dark");
        $("html").removeClass("light");
        $("html").addClass("dark");
        $("#theme-c").attr("content", "rgb(30,32,34)");
        this.themeColor = "dark";
      } else {
        localStorage.setItem("theme", "light");
        $("html").removeClass("dark");
        $("html").addClass("light");
        $("#theme-c").attr("content", "rgb(250,250,250)");
        this.themeColor = "light";
      }
    },
    openFullScreen() {
      var elem = document.documentElement;
      if (window.innerHeight < screen.height) {
        this.fullScreen = false;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
      } else {
        this.fullScreen = true;
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },
    logOut() {
      localStorage.setItem("cikis", "true");
      this.$store.dispatch("logOut");
    },
  },
};
</script>

<style></style>
