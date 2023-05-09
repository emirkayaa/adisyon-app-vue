<template>
  <el-select
    v-model="value"
    filterable
    remote
    class="w-100 selectArea"
    reserve-keyword
    :disabled="disabled"
    placeholder="Seçiniz"
    :loading="loading"
    clearable
    size="large"
    :style="error ? '--el-border-color:rgb(255,0,0)' : ''"
  >
    <el-option v-if="options.length <= 0" disabled value="Veri bulunamadı" />
    <el-option v-for="item in options" :key="item.id" :label="item.text" :value="item.id" />
  </el-select>
</template>

<script>
import placeholder from "@/angaryos/inputs/placeholder";
export default {
  props: {
    modelValue: [String, Number, Array],
    column: Object,
    error: Boolean,
    disabled: Boolean,
    selectSearch: String,
  },
  data() {
    return { placeholder, value: this.modelValue, loading: false, options: {} };
  },
  mounted() {
    this.setOption();
  },
  methods: {
    setOption() {
      if (this.column.name == "aylik_mizan_front") {
        this.options = [
          {
            id: 1,
            text: "Ocak",
          },
          {
            id: 2,
            text: "Şubat",
          },
          {
            id: 3,
            text: "Mart",
          },
          {
            id: 4,
            text: "Nisan",
          },
          {
            id: 5,
            text: "Mayıs",
          },
          {
            id: 6,
            text: "Haziran",
          },
          {
            id: 7,
            text: "Temmuz",
          },
          {
            id: 8,
            text: "Ağustos",
          },
          {
            id: 9,
            text: "Eylül",
          },
          {
            id: 10,
            text: "Ekim",
          },
          {
            id: 11,
            text: "Kasım",
          },
          {
            id: 12,
            text: "Aralık",
          },
          {
            id: 2,
            text: "Şubat",
          },
        ];
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
  },
};
</script>

<style>
.el-scrollbar {
  max-width: 500px;
}
</style>
