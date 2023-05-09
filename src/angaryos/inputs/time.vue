<template>
  <el-time-picker
    v-model="value"
    type="date"
    class="w-100"
    :placeholder="
      placeholder[column.name] != undefined
        ? placeholder[column.name]
        : column.display_name[column.display_name.length - 1] == '*'
        ? column.display_name.substring(0, column.display_name.length - 1)
        : column.display_name + ' giriniz.'
    "
    :input-style="error ? '--el-input-border-color:red' : ''"
    format="HH:mm:ss"
    value-format="HH:mm:ss"
    clearable
    arrow-control
    :disabled="disabled"
    size="large"
  />
</template>

<script>
import { mask } from "vue-the-mask";
import placeholder from "@/angaryos/inputs/placeholder";
export default {
  directives: { mask },
  props: {
    modelValue: String,
    column: Object,
    disabled: Boolean,
    error: Boolean,
  },
  data() {
    return {
      placeholder,
      value: this.modelValue,
    };
  },
  watch: {
    value() {
      this.$emit("update:modelValue", this.value);
    },
  },
};
</script>
