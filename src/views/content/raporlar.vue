<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex">
        <h2 class=""><i class="text-primary bi bi-file-earmark-spreadsheet"></i> Raporlar</h2>
      </div>
    </el-card>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="Gün Sonu" name="1"> <gun-sonu></gun-sonu> </el-tab-pane>
      <el-tab-pane label="Satışlar" name="2"> <satis-raporu></satis-raporu></el-tab-pane>

      <el-tab-pane label="Adisyonlar" name="4"><adisyonlar></adisyonlar></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import GunSonu from "./raporlama-components/gun-sonu.vue";
import SatisRaporu from "./raporlama-components/satis-raporu.vue";
import adisyonlar from "@/views/content/raporlama-components/adisyonlar";
export default {
  data() {
    return {
      activeName: "1",
    };
  },
  components: {
    GunSonu,
    SatisRaporu,
    adisyonlar,
  },
};
</script>

<style></style>
