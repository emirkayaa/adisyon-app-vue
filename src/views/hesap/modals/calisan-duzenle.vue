<template>
  <el-dialog v-model="dialogVisible" title="Çalışan Düzenle" width="400px">
    <dual
      table_name="users"
      type="edit"
      :id="edit_data.id"
      :column_settings="column_settings"
      @message="$event == 'success' ? (dialogVisible = false) : ''"
    ></dual>
  </el-dialog>
</template>

<script>
import Dual from "../../../angaryos/dual.vue";
export default {
  props: ["visible", "edit_data"],
  data() {
    return {
      dialogVisible: false,
      column_settings: {
        auths: { input_visible: false },
        companies_id: { input_visible: false },
        department_id: { input_visible: false },
        email_verified_at: { input_visible: false },
        google_detail: { input_visible: false },
        google_id: { input_visible: false },
        language_id: { input_visible: false, filters: { filter: ["1"] } },
        location: { input_visible: false },
        profile_picture: { input_visible: false },
        remember_token: { input_visible: false },
        state: { input_visible: false },
        srid: { input_visible: false },
        tc: { input_visible: false, filters: { filter: [new Date().getTime()] } },
        tokens: { input_visible: false },
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
