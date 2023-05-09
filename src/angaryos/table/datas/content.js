import tableHeader from "../content/table-header.vue";
import tableBody from "../content/table-body.vue";
import tableFooter from "../content/table-footer.vue";
const props = {
  table_data: Object,
  column_settings: Object,
  button_settings: Object,
  modelValue: Object,
  modules: Array,
  table_settings: Object,
};
const components = {
  tableHeader,
  tableBody,
  tableFooter,
};
const computed = {};
const data = () => {};
const watch = {
  Params() {},
};
const emits = [""];
export { components, props, watch, emits, computed, data };
