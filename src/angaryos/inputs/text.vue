<template>
  <el-input
    v-if="maskeleme[column.name]"
    v-model="value"
    v-mask="maskeleme[column.name]"
    :placeholder="
      placeholder[column.name] != undefined
        ? placeholder[column.name]
        : column.display_name[column.display_name.length - 1] == '*'
        ? column.display_name.substring(0, column.display_name.length - 1)
        : column.display_name + ' giriniz.'
    "
    :input-style="error ? '--el-input-border-color:red' : ''"
    clearable
    :disabled="disabled"
    size="large"
  ></el-input>
  <el-input
    v-else
    maxlength="100"
    v-model="value"
    :placeholder="
      placeholder[column?.name] != undefined
        ? placeholder[column?.name]
        : column.display_name[column?.display_name?.length - 1] == '*'
        ? column.display_name.substring(0, column?.display_name?.length - 1)
        : column.display_name + ' giriniz.'
    "
    :input-style="error ? '--el-input-border-color:red' : ''"
    clearable
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
      maskeleme: {
        tc: "###########",
        tc_no: "###########",
        firma_vkn: "##########",
        tasiyici_vkn: "###########",
        ticaret_sicil_no: "#####XXXXXXXXXXX",
        personel_sicil_numarasi: "#############",
        iban_no: "AA## #### #### #### #### #### ##", //"AA## XXXX XXXX XXXX XXXX XXXX XX",
        hesap_numarasi: "#### #### #### #### #### ####",
        musteri_numarasi: "#### #### #### ####",
        kobi_taksit_sayisi: "###",
        vade: "####",
        bina_no: "####",
        kdv_rate: "###",
      },
    };
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
.el-input__count-inner {
  font-weight: 200;
  font-size: 11px;
}
</style>
