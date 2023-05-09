<template>
  <!-- header -->
  <div class="menu-navbar p-3">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <!--   <router-link v-if="false" style="margin-bottom: 3px; width: 44.72px; text-align: start" to="qr-menu/siparisler">
        <el-badge :value="0" class="item">
          <i class="bi bi-hourglass-split menu-icon"></i>
        </el-badge>
      </router-link> -->
      <div style="width:43.53px"></div>
      <router-link :to="'/qr-menu?c=' + this.$route.query.c.split('#')[0]">
        <p class="menu-writing">Adisyon</p>
      </router-link>

      <el-button size="small" class="ms-2 border-0 p-1" @click="themeChange()" v-tooltip="themeColor == dark ? 'Açık Mod' : 'Koyu Mod'">
        <i v-if="this.themeColor != 'dark'" class="bi bi-brightness-high text-color fs-4 m-0 bolder"></i>
        <i v-else class="bi bi-moon text-info m-0 fs-4 m-0"></i>
      </el-button>

      <!--  <router-link v-if="false" style="margin-bottom: 3px; width: 44.72px; text-align: end" to="/qr-menu/sepet">
        <el-badge :value="this.toplam" class="item"> <i class="bi bi-basket menu-icon"></i> </el-badge
      ></router-link> -->
    </div>
    <!--search-->
    <div class="search-wrapper">
      <el-input v-model="search" @keyup.enter="Ara" placeholder="Ara" />
    </div>
  </div>
</template>

<script>
//import { mapGetters } from "vuex";
import $ from "jquery";
import crypt from "@/hooks/crypt";
export default {
  data() {
    return {
      toplam: 0,
      miktar: {},
      search: ''
    };
  },

  computed: {
    //...mapGetters(["getSepet"]),

  },
  mounted() {
    //this.handleChange();
    document.getElementById("page-loader").style.display = "none";
    document.getElementById("app").style.display = "block";
    crypt;
    console.log(crypt(true, 6));
    console.log();
    this.loadTheme();

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      const newColorScheme = event.matches ? "dark" : "light";
      if (newColorScheme != localStorage.getItem("theme")) this.themeChange();
    });
  },
  watch: {
    getSepet() {
      this.handleChange();
    },
  },
  methods: {
    Ara() {
      this.$router.push('/qr-menu/yemek-listesi?c=' + this.$route.query.c.split('#')[0] + "&ara=" + this.search)
    },
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
    /*  handleChange() {
       this.miktar = this.getSepet;
       this.toplam = 0;
       for (const val of Object.values(this.miktar)) {
         this.toplam += val;
       }
       this.$store.commit("setSepet", this.miktar);
     }, */

  },
};
</script>

<style>
.menu-navbar {
  background-color: var(--foreground--color);
  align-items: center !important;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 3px 0px;
}

.menu-icon {
  font-size: 22px;
  color: crimson;
  margin-bottom: 3px;
}

.menu-writing {
  font-size: 17px;
  font-weight: bold;
  color: crimson;
}

p {
  margin-top: 0;
  margin-bottom: 0 !important;
}

.mobile-input {
  width: 100%;
  border-radius: 5px;
  border: 0px;
  margin-right: 2px;
}

.item .el-badge__content.is-fixed {
  right: calc(25px + var(--el-badge-size) / 2);
}

.mobile-input {
  width: 100%;
  border-radius: 5px;
  border: 0px;
  margin-right: 2px;
}
</style>
