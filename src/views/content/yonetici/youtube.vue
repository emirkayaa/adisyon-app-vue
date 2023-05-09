<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex">
        <h2 class=""><i class="text-primary bi bi-youtube"></i> Youtube Ayarları</h2>
      </div>
    </el-card>
    <el-card>
      <Table table_name="youtube"></Table>
    </el-card>
  </div>
</template>

<script>
import Table from "@/angaryos/table";
export default {
  components: {
    Table,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style></style>
