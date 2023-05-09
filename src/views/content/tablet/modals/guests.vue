<template>
  <el-dialog v-model="dialogVisible" title="Misafir Sayısı" width="20%" align-center>
    <div class="d-flex ekle-butons justify-content-center align-items-center mb-4">
      <el-button size="large" type="info" plain @click="buttonChange(2)" :icon="Minus"></el-button>
      <el-input v-model="adisyon.customer_count" />
      <el-button type="info " size="large" plain @click="buttonChange(1)" :icon="Plus"></el-button>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="dialogVisible = false">İptal</el-button>
        <el-button type="primary" @click="dialogVisible = false">Kaydet</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { Minus, Plus } from "@element-plus/icons-vue";
import { mapGetters } from "vuex";
export default {
  props: ["misafirlerVisible", "adisyonies"],
  data() {
    return {
      Minus,
      Plus,
      dialogVisible: false,
      adisyon: {},
    };
  },
  computed: {
    ...mapGetters(["getAdisyonData"]),
  },
  methods: {
    buttonChange(val) {
      if (val == 1) this.adisyon.customer_count++;
      else if (val == 2) this.adisyon.customer_count--;
      if (this.adisyon.customer_count < 0) this.adisyon.customer_count = 0;
      if (this.adisyon.customer_count > 100) this.adisyon.customer_count = 100;
    },
  },
  watch: {
    misafirlerVisible() {
      this.dialogVisible = this.misafirlerVisible;
      this.adisyon = this.adisyonies;
    },
    dialogVisible() {
      this.$emit("update:misafirlerVisible", this.dialogVisible);
      this.$emit("update:adisyonies", this.adisyon);
    },
  },
};
</script>

<style></style>
