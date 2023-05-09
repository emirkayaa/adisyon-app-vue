<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex">
        <h2 class=""><i class="text-primary bi bi-cup"></i> Ürün/Sipariş Ayarları</h2>
      </div>
    </el-card>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="İndirimler" name="bir">
        <el-card>
          <Table table_name="discount"></Table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="Özellikler" name="iki">Role</el-tab-pane>
      <el-tab-pane label="Stoklar" name="uc">Config</el-tab-pane>
      <el-tab-pane label="Giderler" name="dort">Role</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Table from "../../../angaryos/table.vue";
export default {
  data() {
    return {
      activeName: "bir",
    };
  },
  components: {
    Table,
  },
};
</script>

<style></style>
