<template>
  <el-tag v-if="column.name == 'iskonto_orani'" type="info" style="width: 40px; height: 40px; font-size: 16px">%</el-tag>

  <!--- INPUT ÖNCESİ -->
  <el-input
    v-if="maskeleme[column.name] || maskeleme[column.mask]"
    v-model="value"
    v-mask="maskeleme[column.name] || maskeleme[column.mask]"
    :placeholder="
      placeholder[column.name] != undefined
        ? placeholder[column.name]
        : column.display_name[column.display_name.length - 1] == '*'
        ? column.display_name.substring(0, column.display_name.length - 1)
        : column.display_name + ' giriniz.'
    "
    clearable
    :input-style="error ? '--el-input-border-color:red' : ''"
    :disabled="disabled"
    size="large"
  >
  </el-input>
  <div
    v-else
    class="el-input el-input--large el-input--suffix"
    :style="error ? 'border: 1px solid red !important;border-radius:4px' : ''"
  >
    <div class="el-input__wrapper" :class="disabled ? 'bg-disabled' : ''">
      <currency-input
        :options="opt1"
        :placeholder="
          column.display_name[column.display_name.length - 1] == '*'
            ? column.display_name.substring(0, column.display_name.length - 1)
            : column.display_name + ' giriniz.'
        "
        v-model="value"
        class="el-input__inner text-end"
        :disabled="disabled"
      />
    </div>
    <!--- INPUT SONRASI -->
    <el-tag
      v-if="column.name == 'dovizli_tutar'"
      size="large"
      type="info"
      style="width: 40px; height: 40px; font-size: 16px"
    >
      ₺
    </el-tag>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import CurrencyInput from "../../tools/CurrencyInput.vue";
import opt1 from "../tools/currencyOptions";
import placeholder from "@/angaryos/inputs/placeholder";
export default {
  components: { CurrencyInput },
  directives: { mask },
  props: {
    modelValue: String,
    column: Object,
    error: Boolean,
    disabled: Boolean,
  },
  data() {
    return {
      placeholder,
      value: this.modelValue,
      opt1,
      maskeleme: {
        posta_kodu: "#####",
        faydali_omur: "####",
        iskonto_orani: "###",
        kapi_no: "####",
        personel_sicil_numarasi: "XXXXXXXXXXXXXXXXXXXXXXXXXX",
        miktar: "#########",
        gonderilen_miktar: "#########",
        digerVergi: "######",
        askeri_stok: "############",
        azemi_stok: "############",
        fire_orani: "#####",
        temin_suresi: "#####",
        mersis_no: "##########################",
      },
    };
  },
  methods: {
    onKeyUp() {
      if (this.value.search(/^(0|[1-9][0-9]{0,10})(,\d{2})*(,\d{1,2})?$/gm) < 0) {
        this.value = this.value[this.value.length - 1] === "," ? this.value : this.value.slice(0, -1);
      }
    },
    onChange() {
      if (this.value[this.value.length - 1] === ",") {
        this.value = this.value.slice(0, -1);
      }
    },
  },
  watch: {
    value() {
      this.$emit("update:modelValue", this.value);
    },
    modelValue(val) {
      this.value = val;
    },
  },
};
</script>
<style>
.borderLeft {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  /* font-size: 14px !important; */
}
.borderRight {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.bg-disabled {
  background-color: var(--el-fill-color) !important;
}
</style>
