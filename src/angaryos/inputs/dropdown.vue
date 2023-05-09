<template>
  <div class="d-flex w-100">
    <el-tag v-if="column.name == 'kdv_id'" type="info" style="width: 40px; height: 40px; font-size: 16px">%</el-tag>
    <!-- <el-button bg plain v-if="column.name == 'kdv_id'" class="px-2"></el-button> -->
    <el-select
      v-model="value"
      filterable
      remote
      class="w-100 selectArea"
      reserve-keyword
      :disabled="disabled"
      placeholder="Seçiniz"
      :remote-method="remoteMethod"
      @focus="remoteMethod('')"
      :loading="loading"
      loading-text="Yükleniyor..."
      clearable
      size="large"
      :style="error ? '--el-border-color:rgb(255,0,0)' : ''"
    >
      <el-option v-if="options.length <= 0" disabled value="Veri bulunamadı" />
      <el-option v-for="item in option" :key="item.id" :label="item.text" :value="item.id" />
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
    return { placeholder, value: this.modelValue, loading: false, option: [] };
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
    modelValue() {
      this.value = this.modelValue;
    },
    options() {
      this.option = [];
      for (const val of Object.values(this.options)) {
        val.text = typeof val.text == typeof "" ? val.text.split("é")[0] : val.text;
        this.option.push(val);
      }

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
