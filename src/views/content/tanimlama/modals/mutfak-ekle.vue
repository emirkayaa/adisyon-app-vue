<template>
  <el-dialog v-model="dialogVisible" id="mutfak-ismi-input" title="Mutfak Ekle" width="400px" draggable>
    <dual
      table_name="kitchen_group"
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
        companies_id: { input_visible: false },
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
  methods: {},
  components: { Dual },
};
</script>

<style></style>
