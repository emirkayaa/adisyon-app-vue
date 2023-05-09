<template>
  <div>
    <el-card class="mt-3">
      <Table table_name="paid" :column_settings="column_setting" :button_settings="button_settings"></Table>
    </el-card>
  </div>
</template>

<script>
import Table from "../../../angaryos/table.vue";
export default {
  components: { Table },
  data() {
    return {
      column_setting: {
        id: { visible: false },
        pay_list: { visible: false, banned: true },
        adisyon_detay: { visible: false, banned: true },
        product_ids: { visible: false, banned: true },
      },
      button_settings: {
        create: { visible: false },
        edit: { visible: false },
        delete: { visible: false },
        shows: { visible: false, module: "odemeDetay" },
      },
    };
  },
};
</script>

<style></style>
