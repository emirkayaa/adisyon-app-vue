<template>
  <el-dialog v-model="dialogVisible" title="Masa Ekle" width="400px" draggable>
    <dual
      table_name="masa"
      type="create"
      :column_settings="column_settings"
      @message="dialogVisible = $event == 'success' ? false : true"
    ></dual>
  </el-dialog>
</template>

<script>
import Dual from "../../../../angaryos/dual.vue";
export default {
  props: ["visible"],
  data() {
    return {
      dialogVisible: false,
      column_settings: {
        sort_no: { input_visible: false },
        zone_id: { select: ["create", "edit"] },
        color: { input_visible: false },
        customer_id: { input_visible: false },
        res_time: { input_visible: false },
        res_status: { input_visible: false },
        x_axis: { input_visible: false },
        y_axis: { input_visible: false },
        companies_id: { input_visible: false },
        state: { input_visible: false },
        adisyon_id: { input_visible: false },
        qr_menu: { input_visible: false },
        table_type_id: { input_visible: false },
        status: { input_visible: false },
        total: { input_visible: false },
      },
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
  },
  methods: {},
  components: { Dual },
};
</script>

<style></style>
