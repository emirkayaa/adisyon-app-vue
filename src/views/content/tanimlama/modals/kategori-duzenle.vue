<template>
  <el-dialog v-model="dialogVisible" title="Kategori Düzenle" draggable width="418px" id="kategori-ismi-input" align-center>
    <dual
      table_name="product_category"
      type="edit"
      :id="edit_data.id"
      :column_settings="column_settings"
      @new_params="params($event)"
    ></dual>
  </el-dialog>
</template>

<script>
import Dual from "../../../../angaryos/dual.vue";
export default {
  props: ["visible", "edit_data"],
  data() {
    return {
      dialogVisible: false,
      column_settings: {
        companies_id: { input_visible: false },
        menu_visible: { input_visible: false },
        product_ids: { input_visible: false },
        sort_no: { input_visible: false },
        state: { input_visible: false },
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
  methods: {
    params(e) {
      this.dialogVisible = false;
      this.$emit("update:visible", false);
      this.$emit("newData", e);
    },
  },
  components: { Dual },
};
</script>

<style></style>
