import { mapGetters } from "vuex";
import inputs from "@/angaryos/inputs.vue";

const props = {
  table_data: Object,
  column_settings: Object,
  modelValue: Object,
  modules: Array,
  table_settings: Object,
};
const methods = {
  setSorts(column) {
    if (this.Params.sorts[column.name] == true) {
      this.Params.sorts = {
        [column.name]: false,
      };
    } else if (this.Params.sorts[column.name] == false) {
      delete this.Params.sorts[column.name];
    } else {
      this.Params.sorts = {
        [column.name]: true,
      };
    }
    this.$emit("update:modelValue", this.Params);
  },
  setFilter(clm) {
    if (this.fastSearch[clm.name] != "" && this.fastSearch[clm.name] != null) {
      if (clm.gui_type_name == "select") {
        this.Params.filters[clm.name] = {
          type: 1,
          guiType: clm.gui_type_name,
          filter: [this.fastSearch[clm.name]],
        };
      } else {
        this.Params.filters[clm.name] = {
          type: 1,
          guiType: clm.gui_type_name,
          filter: this.fastSearch[clm.name],
        };
      }
    } else {
      delete this.Params.filters[clm.name];
    }

    this.$emit("update:modelValue", this.Params);
  },
  setFastFilter(clm) {
    if (this.fastSearch[clm.name] != "" && this.fastSearch[clm.name] != null) {
      if (clm.gui_type_name == "select") {
        this.Params.filters[clm.name] = {
          type: 1,
          guiType: clm.gui_type_name,
          filter: [this.fastSearch[clm.name]],
        };
        this.$emit("update:modelValue", this.Params);
      }
    } else {
      delete this.Params.filters[clm.name];
      this.$emit("update:modelValue", this.Params);
    }
  },
};
const data = () => {
  return {};
};
const computed = {
  ...mapGetters(["adminMode"]),
};
const emits = [""];
const components = {
  inputs,
};
export { data, props, methods, emits, computed, components };
