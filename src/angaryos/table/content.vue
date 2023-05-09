<template>
  <div class="overflow-auto rounded min-height-300">
    <table class="table table-hover" v-if="Params">
      <table-header
        :table_data="table_data"
        :column_settings="column_settings"
        v-model="Params"
        @update:modelValue="updateParams($event)"
        :modules="modules"
        :table_settings="table_settings"
      >
      </table-header>
      <table-body
        v-if="table_data.all_records_count > 0"
        :table_data="table_data"
        :column_settings="column_settings"
        :button_settings="button_settings"
        :modules="modules"
        :table_settings="table_settings"
      ></table-body>
      <table-footer
        :table_data="table_data"
        :column_settings="column_settings"
        v-model="Params"
        @update:modelValue="updateParams($event)"
        :modules="modules"
        :table_settings="table_settings"
      ></table-footer>
    </table>
    <el-empty v-if="table_data.all_records_count <= 0" class="w-100" description="Veri bulunamadı">
      <el-button v-if="button_settings?.create?.visible != false" type="primary" @click="add()">Veri Ekle</el-button>
    </el-empty>
  </div>
</template>

<script>
/**
 * @description:tablo içerik
 * @props [table_name,button_settings,column_settings,data,params],
 * @emits: params
 * @methods ,
 * @components [create]
 */
import { components, props, watch, emits, computed } from "./datas/content.js";
export default {
  components: components,
  props: props,
  watch: watch,
  emits: emits,
  computed: computed,
  data() {
    return {
      Params: this.modelValue,
    };
  },
  methods: {
    updateParams(e) {
      this.Params = e;
      this.$emit("update:modelValue", this.Params);
    },
    add() {
      if (this.button_settings?.["create"]?.["url"] != undefined && this.button_settings?.["create"]?.["url"] != "") {
        this.$router.push(this.button_settings["create"]["url"]);
      } else {
        this.$store.commit("setRightModalData", {
          name: "dual",
          type: "create",
          title: "Ekle",
          state: true,
          display: "right",
          table_name: this.table_data.table_info.name,
          column_settings: this.column_settings,
        });
      }
    },
  },
};
</script>

<style>
.er-table .image {
  width: 50px !important;
  height: 50px !important;
  max-width: 50px !important;
  min-width: 80px !important;
}
</style>
