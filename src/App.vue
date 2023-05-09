<template>
  <div>
    <div v-if="!getToken && $route.meta.parent == 'qr-menu'">
      <qr-menu-header></qr-menu-header>
      <div id="offline"><offline></offline></div>
      <div id="online"><router-view></router-view></div>
    </div>
    <div v-else-if="$route.meta.parent == 'paketler'">
      <div id="offline"><offline></offline></div>
      <div id="online"><router-view></router-view></div>
    </div>
    <div v-else-if="$route.meta.parent == 'panel'">
      <template v-if="this.getUserData?.user?.user_task_id == 1 || this.getUserData?.user?.user_task_id == 2"></template>
      <tabletHeader v-else></tabletHeader>
      <div id="offline"><offline></offline></div>
      <div id="online"><router-view></router-view></div>
      <rightModal></rightModal>
      <centerModal></centerModal>
    </div>
    <div v-else-if="$route.name == 'siparis'">
      <div id="offline"><offline></offline></div>
      <div id="online"><router-view></router-view></div>
      <rightModal></rightModal>
      <centerModal></centerModal>
    </div>
    <div
      v-else-if="
        this.$route.path != '/login' &&
        this.$route.path != '/register' &&
        this.$route.path != '/verification' &&
        getScreenLock == 'true'
      "
    >
      <style-files></style-files>
      <LockScreenVue></LockScreenVue>
      <script-files> </script-files>
    </div>
    <div
      v-else-if="
        $route.meta.parent == 'kurye' && getToken && this.$route.fullPath != '/login' && this.$route.fullPath != '/register'
      "
    >
      <div id="offline"><offline></offline></div>
      <div id="online"><router-view></router-view></div>
    </div>
    <div v-else-if="getToken && this.$route.fullPath != '/login' && this.$route.fullPath != '/register'">
      <Content />
    </div>
    <div v-else>
      <Login></Login>
    </div>
  </div>
</template>
<script>
import Content from "./views/app/content.vue";
import Login from "./views/app/login.vue";
import { mapGetters } from "vuex";

import ScriptFiles from "@/views/pages/Script.vue";
import StyleFiles from "@/views/pages/Style.vue";
import LockScreenVue from "@/views/pages/LockScreen.vue";

import { ElMessageBox, ElNotification } from "element-plus";
import setUserSettings from "@/hooks/setUserSettings";
import getUserSettings from "@/hooks/getUserSettings";

import tabletHeader from "@/views/content/tablet/header.vue";
import qrMenuHeader from "@/views/qr-menu/header.vue";

import rightModal from "@/angaryos/modal/right-modal";
import centerModal from "@/angaryos/modal/center-modal";

import Offline from "@/views/pages/Offline.vue";

export default {
  components: {
    Content,
    Login,
    ScriptFiles,
    StyleFiles,
    LockScreenVue,
    tabletHeader,
    qrMenuHeader,
    rightModal,
    centerModal,
    Offline,
  },
  computed: {
    ...mapGetters(["getToken", "getScreenLock", "userDataChange", "getUserData"]),
  },
  mounted() {
    this.sayacInterval();
    this.loginTakip();

    this.yetkiKontrol();
  },
  created() {
    this.offlineControl();
  },
  methods: {
    sayacInterval() {
      if (
        getUserSettings("pinTime") == null ||
        getUserSettings("pinTime") == undefined ||
        getUserSettings("pinTime") == 0 ||
        getUserSettings("pinTime") == ""
      ) {
        localStorage.setItem("lock", new Date().getTime());
        return;
      }
      localStorage.setItem("lock", new Date().getTime());
      this.sayacSay = this.sayacSay++;
      var pinModalState = 0;
      const pinSure = getUserSettings("pinTime") * 1000;
      clearInterval(inter);
      var inter = setInterval(() => {
        let sayac = new Date().getTime() - localStorage.getItem("lock");

        if (this.getScreenLock == "true") {
          sayac = 0;
          localStorage.setItem("lock", new Date().getTime());
        }
        if (sayac > (pinSure == "" ? 100000 : pinSure)) {
          var pin = getUserSettings("pin");
          if (pin != null && pin != "" && pin != undefined) {
            this.$store.commit("setScreenLock", "true");
            this.sayac = 0;
            localStorage.setItem("lock", new Date().getTime());
          } else if (pinModalState == 0) {
            pinModalState++;
            ElMessageBox.prompt("4 rakamdan oluşmalıdır.", "Pin kodu belirleyiniz", {
              confirmButtonText: "Tamam",
              cancelButtonText: "Vazgeç",
              inputPattern: /^[1-9][0-9]{3}$/,
              inputErrorMessage: "Uyumsuz pin",
            })
              .then((value) => {
                setUserSettings("pin", value.value);
                ElNotification({
                  title: "Başarılı",
                  message: "Pin kodunuz başarıyla kaydedildi.",
                  type: "success",
                  position: "top-left",
                });
              })
              .catch(() => {
                ElNotification({
                  title: "Vazgeçildi",
                  message: "Pin kodunuz kaydedilemedi.",
                  type: "info",
                  position: "top-left",
                });
              });

            this.$store.commit("setScreenLock", "true");
            this.sayac = 0;
            localStorage.setItem("lock", new Date().getTime());
          }
        }
      }, 1000);
    },
    loginTakip() {
      if (this.$route.fullPath == "/login" && this.getToken) {
        this.$router.push("/");
      }
    },
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
    yetkiKontrol() {
      console.log("userDataChange", this.getUserData, this.$route.meta.parent);
      const yetki = this.getUserData?.user?.user_task_id;
      if (yetki == 1) {
        //GARSON
        if (this.$route.path == "/panel/garson" || this.$route.name == "siparisEkrani") {
          yetki;
        } else {
          this.$router.push("/panel/garson");
        }
      }
      if (yetki == 2) {
        //MUTFAK
        if (this.$route.path == "/panel/mutfak" || this.$route.name == "siparisEkrani") {
          yetki;
        } else {
          this.$router.push("/panel/mutfak");
        }
      }
      if (yetki == 3) {
        //Kasa
        console.log("KASA");
        console.log(this.$route);
        if (this.$route.meta.parent != "panel") {
          this.$router.push("/panel/ozet");
        }
      }
      if (yetki == 6) {
        //Kurye
        if (this.$route.path != "/kurye") {
          this.$router.push("/kurye");
        }
      }
    },
  },
  watch: {
    userDataChange() {
      const interval_id = window.setInterval(function () {}, Number.MAX_SAFE_INTEGER);
      for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
      }
      this.sayacInterval();
      this.yetkiKontrol();
    },
    $route() {
      this.loginTakip();
      this.yetkiKontrol();
    },
  },
};

document.addEventListener("click", () => {
  localStorage.setItem("lock", new Date().getTime());
});
document.addEventListener("keyup", () => {
  localStorage.setItem("lock", new Date().getTime());
});
document.addEventListener("mousemove", () => {
  localStorage.setItem("lock", new Date().getTime());
});
</script>
