<template>
  <el-date-picker
    v-if="column.name == 'gecerlilik_tarihi'"
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
    :style="error ? '--el-border-color:rgb(255,0,0)' : ''"
    format="DD.MM.YYYY"
    value-format="YYYY-MM-DD"
    clearable
    :disabled="disabled"
    :disabled-date="disabledDate"
    size="large"
    :picker-options="{ disabledDate: (time) => disabledEndDate(time, departureDate) }"
  />
  <el-date-picker
    v-else
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
    :style="error ? '--el-border-color:rgb(255,0,0)' : ''"
    format="DD.MM.YYYY"
    value-format="YYYY-MM-DD"
    clearable
    :disabled="disabled"
    size="large"
    :shortcuts="shortcuts"
    :picker-options="{ disabledDate: (time) => disabledEndDate(time, departureDate) }"
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
      shortcuts: [
        {
          text: "Bugün",
          value: new Date(),
        },
        {
          text: "Dün",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            return date;
          },
        },
        {
          text: "Yarın",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            return date;
          },
        },
        {
          text: "Bir Hafta Önce",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            return date;
          },
        },
        {
          text: "Bir Hafta Sonra",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            return date;
          },
        },
      ],
    };
  },
  mounted() {
    /*const yil = new Date().getFullYear();
    const ay = new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
    const gun = new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate();
    this.value = yil + "/" + ay + "/" + gun;*/
  },
  methods: {
    disabledDate(time) {
      return time.getTime() < Date.now();
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
