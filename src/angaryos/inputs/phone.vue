<template>
  <div class="d-flex">
    <div style="width: 40%">
      <el-select filterable remote clearable v-model="selectedCountry" placeholder="Ülke" size="large">
        <el-option v-for="c in country" :key="c.code" :label="c.name" :value="c.code" />
      </el-select>
    </div>
    <div style="width: 60%">
      <el-input
        v-model="value"
        :placeholder="
          placeholder[column.name] != undefined
            ? placeholder[column.name]
            : column.display_name[column.display_name.length - 1] == '*'
            ? column.display_name.substring(0, column.display_name.length - 1)
            : column.display_name + ' giriniz.'
        "
        class="w-100"
        v-mask="maske"
        clearable
        size="large"
      />
    </div>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import country from "./country.json";
import phoneMask from "./phone-mask.json";
import placeholder from "@/angaryos/inputs/placeholder";
export default {
  directives: { mask },
  props: {
    modelValue: String,
    column: Object,
    error: Boolean,
  },
  data() {
    return { placeholder, value: this.modelValue, country, phoneMask, maske: "+90 (###) ### ## ##", selectedCountry: "TR" };
  },
  watch: {
    value() {
      this.$emit("update:modelValue", this.value);
    },
    selectedCountry() {
      this.maske = phoneMask[this.selectedCountry];
    },
  },
};
</script>

<style></style>
