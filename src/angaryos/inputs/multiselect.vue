<template>
  <div class="d-flex w-100">
    <el-select
      v-model="value"
      filterable
      multiple
      remote
      class="w-100 selectArea"
      reserve-keyword
      :disabled="disabled"
      placeholder="Seçiniz"
      :remote-method="remoteMethod"
      @focus="remoteMethod('')"
      :loading="loading"
      loading-text="Yükleniyor..."
      size="large"
      :style="error ? '--el-border-color:rgb(255,0,0)' : ''"
    >
      <el-option v-if="options.length <= 0" disabled value="Veri bulunamadı" />
      <el-option v-for="item in options" :key="item.id" :label="item.text" :value="item.id" />
    </el-select>
  </div>
</template>

<script>
import placeholder from "@/angaryos/inputs/placeholder";
export default {
  props: {
    modelValue: [String, Number, Array],
    options: Array,
    column: Object,
    error: Boolean,
    disabled: Boolean,
    selectSearch: String,
  },
  data() {
    return { placeholder, value: this.modelValue, loading: false };
  },
  methods: {
    remoteMethod(e) {
      this.loading = false;
      if (e.length > 0) {
        this.$emit("search", e);
      } else {
        this.$emit("search", "***");
      }
    },
  },
  watch: {
    value() {
      this.$emit("update:modelValue", this.value);
    },
    modelValue(v) {
      console.log(v);
      this.value = this.modelValue;
    },
    options() {
      this.option = this.options;

      this.loading = false;
      this.$emit("update:modelValue", this.value);
    },
  },
};
</script>

<style>
.el-scrollbar {
  max-width: 500px;
}
</style>
