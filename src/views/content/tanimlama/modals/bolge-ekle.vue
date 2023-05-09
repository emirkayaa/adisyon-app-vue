<template>
  <el-dialog v-model="dialogVisible" title="Bölge Ekle" width="400px">
    <dual
      table_name="zone"
      type="create"
      :column_settings="{
        companies_id: { input_visible: false },
        state: { input_visible: false },
        sort_no: { input_visible: false },
      }"
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
