<template>
  <el-dialog v-model="dialogVisible" id="musteri-ismi-input" title="Müşteri Düzenle" width="418px">
    <dual
      table_name="customer"
      :column_settings="column_settings"
      type="edit"
      :id="edit_data.id"
      @message="dialogVisible = $event == 'success' ? false : true"
    ></dual>
  </el-dialog>
</template>

<script>
import dual from "../../../../angaryos/dual.vue";
export default {
  components: { dual },
  props: ["visible", "edit_data"],
  data() {
    return {
      dialogVisible: false,
      column_settings: {
        opening_price: { input_visible: false },
        companies_id: { input_visible: false },
        state: { input_visible: false },
      },
    };
  },
  methods: {},
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
  },
};
</script>

<style></style>
