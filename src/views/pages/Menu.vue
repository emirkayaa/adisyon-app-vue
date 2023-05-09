<template>
  <mobilMenu v-model:menuOpen="menu_open" v-if="mobile"></mobilMenu>
  <div v-else :style="menu_collapse ? 'width:65px' : 'width:290px'" class="position-relative">
    <sidebar-menu :relative="false" @update:collapsed="onToggleCollapse" :menu="menu">
      <template v-slot:toggle-icon>
        <i v-if="!menu_collapse" class="bi h4 bi-arrow-bar-left m-0"></i>
        <i v-else class="bi bi-arrow-bar-right h4 m-0"></i>
      </template>
    </sidebar-menu>
  </div>
</template>

<script>
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import menu from "@/views/pages/menu/menu.json";
import mobilMenu from "./Mobile-Menu.vue";
export default {
  props: ["menuOpen"],
  data() {
    return {
      menu,
      mobile: false,
      menu_open: false,
      menu_collapse: false,
    };
  },
  watch: {
    menuOpen(val) {
      this.menu_open = val;
    },
    menu_open(val) {
      this.$emit("menuOpen", val);
    },
  },
  methods: {
    onToggleCollapse(e) {
      this.$emit("menuCollapse", e);
      this.menu_collapse = e;
      console.log(e);
    },
  },
  mounted() {
    this.mobile = window.innerWidth <= 768;
    window.addEventListener("resize", () => {
      this.mobile = window.innerWidth <= 768;
    });
  },
  components: {
    SidebarMenu,
    mobilMenu,
  },
};
</script>

<style>
.v-sidebar-menu {
  height: 100vh !important;
  z-index: 4 !important;
}
.vsm--child {
  background: var(--foreground-color) !important;
  border: 1px solid var(--el-card-border-color);
}
.vsm--link_active {
  color: var(--primary-color);
  background: rgb(212 108 0 / 10%);
}
.v-sidebar-menu .vsm--link_level-1.vsm--link_active {
  -webkit-box-shadow: inset 3px 0 0 0 #f44242;
  box-shadow: inset 3px 0 0 0 #f44242;
}
.v-sidebar-menu.vsm_expanded .vsm--link_level-1.vsm--link_open {
  background-color: rgb(212 108 0 / 10%);
  color: var(--primary-color);
}
.v-sidebar-menu.vsm_expanded .vsm--link_level-1.vsm--link_open .vsm--icon {
  background-color: rgb(212 108 0 / 10%);
}
.v-sidebar-menu .vsm--mobile-bg {
  background-color: #fdb0b0;
}
.v-sidebar-menu.vsm_collapsed .vsm--link_level-1.vsm--link_hover .vsm--icon {
  background-color: rgb(212 108 0 / 10%);
  color: var(--primary-color);
}
.v-sidebar-menu {
  border: 1px solid var(--el-card-border-color);
  background-color: var(--el-card-bg-color);
  box-shadow: var(--el-box-shadow-light);
  color: var(--primary-color) !important;
}
.v-sidebar-menu .vsm--link {
  color: var(--primary-color) !important;
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  border: 1px solid var(--el-card-border-color);
  background-color: var(--el-card-bg-color);
  box-shadow: var(--el-box-shadow-light);
}
.v-sidebar-menu .vsm--dropdown {
  border: 1px solid var(--el-card-border-color);
  background-color: var(--el-card-bg-color);
  box-shadow: var(--el-box-shadow-light);
}
.v-sidebar-menu .vsm--badge_default,
.v-sidebar-menu .vsm--toggle-btn {
  background-color: var(--foreground-color) !important;
  color: var(--primary-color) !important;
}
</style>
