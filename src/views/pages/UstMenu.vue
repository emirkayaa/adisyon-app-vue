<template>
  <el-card :body-style="{ padding: '3px 10px' }" style="border-radius: 0 0 10px 10px">
    <div class="d-flex justify-content-between align-items-center nav-bar px-0 py-2 px-md-1">
      <!-- Mobil ekranlar için menu açma tuşu-->

      <div class="d-flex">
        <el-button size="large" class="d-flex d-md-none menu-open-button menu-open-button">
          <i class="bi bi-list fs-4 menu-open-button"></i>
        </el-button>
        <el-button type="" size="large" class="ms-2" plain @click="$router.push('/panel/garson')">
          <div class="m-0 fs-4 d-flex">
            <i class="bi bi-display m-0"></i> <label class="d-none d-sm-block h5 ms-1 mb-0">Panel</label>
          </div>
        </el-button>
      </div>
      <!-- Sağ menü tuşları-->
      <div class="d-flex justify-content-end align-items-center p-0 pr-2">
        <!-- Tema değiştirici -->
        <el-button size="large" class="ms-2" plain @click="themeChange()" v-tooltip="'Tema Ayarı'">
          <i v-if="this.themeColor != 'dark'" class="bi bi-brightness-high text-warning fs-4 m-0 bolder"></i>
          <i v-else class="bi bi-moon text-info m-0 fs-4 m-0"></i>
        </el-button>
        <!-- Tema değiştirici -->
        <!-- Tam ekran -->
        <el-button
          class="d-none d-sm-flex align-items-center ms-2"
          @click="openFullScreen()"
          v-tooltip="'Tam Ekran'"
          size="large"
        >
          <i v-if="fullScreen == false" class="bi bi-fullscreen-exit text-color fs-4 m-0"></i>
          <i v-else class="bi bi-fullscreen m-0 fs-4 m-0"></i>
        </el-button>
        <!-- Tam ekran -->
        <!-- Ekran Kilidi -->
        <el-button class="ms-2 d-none d-sm-flex" size="large" @click="lockScreen()" v-tooltip="'Kilitle'">
          <i class="bi bi-lock m-0 fs-4"></i>
        </el-button>
        <el-button size="large" class="cikis-buton ms-2" @click="logOut()" v-tooltip="'Çıkış Yap'">
          <i class="bi bi-door-closed m-0 fs-4"></i>
        </el-button>
        <!-- Ekran Kilidi -->
      </div>
    </div>
  </el-card>
  <LockScreenPinDialog :visible="lockPinDialog" @visible="lockPinDialog = $event"></LockScreenPinDialog>
  <youtube v-model:visible="youtube_visible"></youtube>
  <admin-menu v-model:visible="admin_visible"></admin-menu>
</template>

<script>
import $ from "jquery";
import axios from "axios";
import { mapGetters } from "vuex";

import { Search } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";

import LockScreenPinDialog from "@/views/modules/lock-screen-pin-dialog.vue";
import youtube from "@/views/modules/youtube";
import AdminMenu from "./menu/admin-menu.vue";
export default {
  data() {
    return {
      Search,
      themeColor: "",
      fullScreen: true,
      webHistory: [],
      historyLinks: [],
      activeTab: this.$route.fullPath,
      cariHesapList: [],
      takvimState: false,
      calcState: false,
      cariState: true,
      quickMenuList: [],
      localTheme: localStorage.getItem("dore-theme-color"),
      lockPinDialog: false,
      counters: 0,
      youtube_visible: false,
      admin_visible: false,
    };
  },
  computed: {
    ...mapGetters([
      "getToken",
      "getUserData",
      "adminMode",
      "getCompData",
      "getHistoryState",
      "getDuyuru",
      "getUserSettings",
      "isAdmin",
    ]),
  },
  created() {},
  mounted() {
    this.setHistory();
    this.loadTheme();
    if (localStorage.getItem("user-data") != null) {
      if (this.getUserData?.user?.kullanici_ayarlari != null) {
        if (JSON.parse(this.getUserData?.user?.kullanici_ayarlari.replace(/&#34;/g, '"'))["kisayol"] != undefined) {
          this.quickMenuList = JSON.parse(this.getUserData?.user?.kullanici_ayarlari.replace(/&#34;/g, '"')).kisayol;
        }
      }
    }
    // tablar arası geçiş
    // document.addEventListener("keydown", (e) => {
    //   if (e.keyCode == 49 && e.shiftKey) {
    //     this.$router.push(this.historyLinks[0].fullPath);
    //   }
    //   if (e.keyCode == 50 && e.shiftKey) {
    //     this.$router.push(this.historyLinks[1].fullPath);
    //   }
    //   if (e.keyCode == 51 && e.shiftKey) {
    //     this.$router.push(this.historyLinks[2].fullPath);
    //   }
    //   if (e.keyCode == 52 && e.shiftKey) {
    //     this.$router.push(this.historyLinks[3].fullPath);
    //   }
    //   if (e.keyCode == 53 && e.shiftKey) {
    //     this.$router.push(this.historyLinks[4].fullPath);
    //   }
    // });
    document.addEventListener("auxclick", (e) => {
      if (e.button == 1) {
        e.preventDefault();
        this.routerSil(e.target.getAttribute("id").replace("tab-", ""));
      }
    });

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      const newColorScheme = event.matches ? "dark" : "light";
      if (newColorScheme != localStorage.getItem("theme")) this.themeChange();
    });
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
    routerPush(link) {
      this.$router.push(link);
    },
    lockScreen() {
      var pin = this.getUserData.companies.pin_code;
      document.getElementsByTagName("body")[0].classList.remove("collapse-lock");
      if (pin != null && pin != "" && pin != undefined) {
        this.$store.commit("setScreenLock", "true");
      } else {
        this.lockPinDialog = true;
      }
    },
    routerSil(link) {
      if (link == this.$route.fullPath) {
        if (this.historyLinks.length == 1) {
          this.$router.push("/");
        } else {
          if (
            this.historyLinks[this.historyLinks.indexOf(this.historyLinks.find((e) => e.fullPath == link)) - 1] ==
              undefined &&
            this.historyLinks[this.historyLinks.indexOf(this.historyLinks.find((e) => e.fullPath == link)) + 1] == undefined
          ) {
            this.$router.push("/");
          } else if (
            this.historyLinks[this.historyLinks.indexOf(this.historyLinks.find((e) => e.fullPath == link)) - 1] == undefined
          ) {
            this.$router.push(
              this.historyLinks[this.historyLinks.indexOf(this.historyLinks.find((e) => e.fullPath == link)) + 1]
            );
          } else if (
            this.historyLinks[this.historyLinks.indexOf(this.historyLinks.find((e) => e.fullPath == link)) + 1] == undefined
          ) {
            this.$router.push(
              this.historyLinks[this.historyLinks.indexOf(this.historyLinks.find((e) => e.fullPath == link)) - 1]
            );
          } else {
            this.$router.push("/");
          }
        }
        this.historyLinks.splice(this.historyLinks.indexOf(this.historyLinks.find((e) => e.fullPath == link)), 1);
      } else {
        this.historyLinks.splice(this.historyLinks.indexOf(this.historyLinks.find((e) => e.fullPath == link)), 1);
      }

      localStorage.setItem("history", JSON.stringify(this.historyLinks));
    },
    routeTabClick(route) {
      this.$router.push(route.props.name);
    },
    logOut() {
      localStorage.setItem("cikis", "true");
      this.$store.dispatch("logOut");
    },
    cariSearch(e) {
      if (e != "") {
        this.cariState = false;
        axios
          .post(this.getToken + "/tables/cari_hesap", {
            params: JSON.stringify({
              page: 1,
              limit: 100,
              column_array_id: this.getUserData.auths.tables.cari_hesap.lists[0],
              column_array_id_query: this.getUserData.auths.tables.cari_hesap.queries[0],
              sorts: {},
              filters: {
                cari_hesap_adi: {
                  type: 1,
                  guiType: "string",
                  filter: e.toString(),
                },
              },
            }),
          })
          .then((res) => {
            this.cariHesapList = res.data.data.records;
            setTimeout(() => {
              this.cariState = true;
            }, 10);
          })
          .catch((err) => {
            ElNotification({
              title: "Error",
              message: err.response.data.data.message,
              type: "error",
              position: "top-left",
            });
          });
      }

      /**/
    },
    getQuickMenuList() {
      if (localStorage.getItem("user-data") != null) {
        if (this.getUserData.user.kullanici_ayarlari != null) {
          if (JSON.parse(this.getUserData.user.kullanici_ayarlari.replace(/&#34;/g, '"'))["kisayol"] != undefined) {
            this.quickMenuList = JSON.parse(this.getUserData.user.kullanici_ayarlari.replace(/&#34;/g, '"')).kisayol;
          }
        }
      }
    },
    setHistory() {
      this.historyLinks = [];
      if (localStorage.getItem("history") == null) return;
      this.webHistory = JSON.parse(localStorage.getItem("history"));
      for (const val of Object.values(this.webHistory)) {
        if (this.historyLinks.length >= 10) break;
        if (this.historyLinks.find((x) => x.href == val.href)) {
          continue;
        } else {
          this.historyLinks.push(val);
        }
      }
      if (this.historyLinks.find((x) => x.href == this.$route.href)) {
        return;
      } else {
        if (this.historyLinks.length >= 10) this.historyLinks.splice(0, 1);

        this.historyLinks.push(this.$route);
      }
      this.historyLinks.find((e) => {
        if (e?.name == "404" || e?.name == "Login" || e?.name == "Register" || e?.name == undefined) {
          this.historyLinks.splice(this.historyLinks.indexOf(e), 1);
        }
      });
      if (typeof this.historyLinks != typeof {}) {
        this.historyLinks = JSON.parse(this.historyLinks);
      }
      localStorage.setItem("history", JSON.stringify(this.historyLinks));
    },
    countValue() {
      this.counters = this.getDuyuru.length;
    },
  },
  watch: {
    localTheme() {},
    $route() {
      this.setHistory();
      this.activeTab = this.$route.fullPath;
    },
    getHistoryState() {
      this.setHistory();
    },
    getDuyuru() {
      this.countValue();
    },
  },
  components: {
    LockScreenPinDialog,
    youtube,
    AdminMenu,
  },
};
</script>

<style>
.linkHover:hover {
  background: rgba(255, 0, 0, 0.1);
  border-radius: 5px;
}
.history-links .el-tabs__header {
  height: min-content !important;
  margin: 0 !important;
}
.history-links .el-tabs__content {
  display: none;
}
.history-links .el-tabs__item {
  --el-tabs-header-height: 35px !important;
}
.history-links .is-active {
  background: var(--theme-color-1-10);
}
.cikis-buton:hover > .bi-door-closed {
  display: none;
}
.cikis-buton:hover > .bi-door-open {
  display: block !important;
}
.badgeBil {
  display: block !important;
}
.badgeBil sup {
  margin-right: 8px !important;
}
.badgeBil .el-badge__content {
  background-color: var(--theme-color-4);
}
</style>
