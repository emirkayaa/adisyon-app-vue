<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex">
        <h2 class=""><i class="text-primary bi bi-diagram-3"></i> Entegrator Ayarları</h2>
      </div>
    </el-card>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="Ayarlar" name="first"> *Yakında sizlerle </el-tab-pane>
      <!----------------------------------------------------->
      <el-tab-pane label="Yemek Sepeti" name="second"> *Yakında sizlerle</el-tab-pane>
      <!----------------------------------------------------->
      <el-tab-pane label="Getir" name="third"> *Yakında sizlerle</el-tab-pane>
      <el-tab-pane label="Trendyol Yemek" name="dorduncu">
        <Dual table_name="trendyol_yemek_api" type="edit" id="1" :column_settings="{}"></Dual>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Dual from "@/angaryos/dual.vue";
export default {
  components: {
    Dual,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style></style>
