<template>
  <el-date-picker
    v-model="value"
    class="w-100"
    type="datetime"
    :placeholder="
      placeholder[column.name] != undefined
        ? placeholder[column.name]
        : column.display_name[column.display_name.length - 1] == '*'
        ? column.display_name.substring(0, column.display_name.length - 1)
        : column.display_name + ' giriniz.'
    "
    :style="error ? '--el-border-color:rgb(255,0,0)' : ''"
    size="large"
    format="DD/MM/YYYY hh:mm:ss"
    value-format="YYYY-MM-DD h:m:s"
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
    error: Boolean,
  },
  data() {
    return { placeholder, value: this.modelValue };
  },
  watch: {
    value() {
      this.$emit("update:modelValue", this.value);
    },
  },
};
</script>
