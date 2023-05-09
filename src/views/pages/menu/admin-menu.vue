<template>
  <el-dialog v-if="isAdmin || admin_token" v-model="adminMenu" title="Admin menu" width="400px" :before-close="handleClose">
    <div class="d-flex">
      <el-input v-model="token" placeholder="Kullanıcı Takliti"></el-input>
      <el-button @click="taklitEt()">Taklit</el-button>
      <el-button v-if="admin_token" @click="taklitKapat()">Kapat</el-button>
      <div>6 aralık 12:47</div>
    </div>
    <div class="d-flex justify-content-between my-3">
      <el-button type="warning" @click="cacheClear()">Cache Temizle</el-button>
      <div>
        <label for="">Admin Mod:</label>
        <el-switch v-model="adminMode" @change="this.$store.commit('setAdminMode')"> </el-switch>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["visible"],
  data() {
    return {
      adminMenu: false,
      token: "",
      admin_token: "",
    };
  },
  computed: {
    ...mapGetters(["isAdmin"]),
  },
  mounted() {
    this.admin_token = localStorage.getItem("adminToken");
  },
  methods: {
    taklitEt() {
      const my_token = localStorage.getItem("frontToken");
      localStorage.clear();
      localStorage.setItem("frontToken", this.token);
      localStorage.setItem("adminToken", my_token);
      window.location.reload();
    },
    taklitKapat() {
      const my_token = localStorage.getItem("adminToken");
      localStorage.clear();
      localStorage.setItem("frontToken", my_token);
      window.location.reload();
    },
    cacheClear() {
      localStorage.removeItem("userData");
      localStorage.removeItem("tabloData");
      window.location.reload();
    },
  },
  watch: {
    visible(val) {
      this.adminMenu = val;
    },
    adminMenu(val) {
      this.$emit("update:visible", val);
    },
  },
};
</script>

<style></style>
