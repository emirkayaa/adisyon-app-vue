<template>
  <div>
    <el-card class="mt-3">
      <Table table_name="end_day" :column_settings="column_setting" :button_settings="button_settings"></Table>
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
      },
      button_settings: {
        create: { visible: false },
        shows: { visible: false },
      },
    };
  },
};
</script>

<style></style>
