<template>
  <transition name="el-zoom-in-left">
    <sidebar-menu v-show="mobile" class="mobile-menu" :relative="false" :menu="menu" />
  </transition>
</template>

<script>
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import menu from "@/views/pages/menu/menu.json";
export default {
  props: ["menuOpen"],
  data() {
    return {
      menu,
      mobile: false,
    };
  },
  mounted() {
    document.addEventListener("click", (e) => {
      if (e.target.className != undefined) {
        let is_menu = false;
        if (e.target?.className?.search("menu-open-button") > 0) {
          this.mobile = true;
          is_menu = true;
        }
        //vsm--toggle-btn
        for (const val of Object.values(e.path)) {
          if (val.className?.search("v-sidebar-menu") > -1) {
            is_menu = true;
            break;
          }
        }
        console.log("is menu", is_menu);
        if (is_menu == false) {
          this.mobile = false;
        }
      }
    });
  },
  components: {
    SidebarMenu,
  },
};
</script>

<style>
.mobile-menu {
  border: 1px solid var(--el-card-border-color);
  background-color: var(--foreground-color) !important;
  box-shadow: var(--el-box-shadow-light);
  color: var(--primary-color) !important;
}
</style>
