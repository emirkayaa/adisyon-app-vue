<template>
  <div v-loading="false" class="er-table">
    <headerVue
      v-if="table_settings?.header != false"
      :table_name="table_name"
      :button_settings="button_settings"
      :table_data="table_data"
      v-model="params"
      @update:modelValue="updateParams($event)"
      :column_settings="column_settings"
    ></headerVue>
    <contentVue
      :table_name="table_name"
      :button_settings="button_settings"
      v-model="params"
      @update:modelValue="updateParams($event)"
      :table_data="table_data"
      :column_settings="column_settings"
      :modules="modules"
      :table_settings="table_settings"
    >
    </contentVue>
    <footerVue
      v-if="table_settings?.footer != false"
      :table_name="table_name"
      :params="params"
      :table_data="table_data"
    ></footerVue>
  </div>

  <!-- Baş: Sağ tık menü -->
  <right-click-table
    :column_settings="this.column_settings"
    :table_name="this.table_name"
    :button_settings="this.button_settings"
  ></right-click-table>
  <!-- Son: Sağ tık menü -->
</template>

<script>
/**
 * @description:tablo isteği bu konumda atılır ve alt komponentlerine gönderilir.
 * @props [table_name,button_settings,column_settings,modules,table_settings],
 * @emits: data,params
 * @methods [getData,]
 */
import { props, components, emits, data, methods, computed, watch } from "./table/table.js";
export default {
  name: "table-vue",
  data: data,
  props: props,
  components: components,
  emits: emits,
  methods: methods,
  computed: computed,
  mounted() {
    this.getDefaultParams();
  },
  watch: watch,
};
</script>

<style></style>
