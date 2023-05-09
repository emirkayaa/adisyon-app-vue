<template>
  <el-select
    v-if="column.name == 'status'"
    :disabled="disabled"
    class="w-100"
    placeholder="Seçiniz"
    v-model="value"
    size="large"
  >
    <el-option label="Dolu" value="1" />
    <el-option label="Boş" value="0" />
  </el-select>

  <el-select
    v-else-if="column.name == 'res_status'"
    :disabled="disabled"
    class="w-100"
    placeholder="Seçiniz"
    v-model="value"
    size="large"
  >
    <el-option label="Rezerve edildi" :value="true" />
    <el-option label="Rezerve edilmedi" :value="false" />
  </el-select>

  <el-switch
    v-else
    v-model="value"
    :input-style="errors ? '--el-input-border-color:red' : ''"
    inline-prompt
    :active-icon="Check"
    :inactive-icon="Close"
    :disabled="disabled"
    size="large"
  />
</template>

<script>
import { mask } from "vue-the-mask";
import { Check, Close } from "@element-plus/icons-vue";
export default {
  directives: { mask },
  props: {
    modelValue: String,
    column: Object,
    disabled: Boolean,
    errors: Boolean,
  },
  data() {
    return {
      Check,
      Close,
      value: "",
    };
  },
  mounted() {
    this.value = this.modelValue == 1 ? true : false;
  },
  watch: {
    value() {
      if (this.value == true || this.value == "1") this.$emit("update:modelValue", "1");
      else if (this.value == false || this.value == "0") this.$emit("update:modelValue", "0");
      // this.$emit("update:modelValue", this.value ? "1" : "0");
    },
    modelValue(val) {
      this.value = val == 1 ? true : false;
    },
  },
};
</script>
