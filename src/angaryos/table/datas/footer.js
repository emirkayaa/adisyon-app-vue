const props = {
  table_name: {
    type: String,
    required: true,
  },
  button_settings: {
    type: Object,
  },
  params: {
    type: Object,
  },
  column_settings: {
    type: Object,
  },
  table_data: {
    type: Object,
  },
};
const components = {};
const emits = ["params", "refresh"];
const methods = {
  change(e) {
    this.params.page = e;
    this.$emit("update:params", this.params);
    this.$store.commit("setTableRefresh");
  },
};
export { props, components, emits, methods };
