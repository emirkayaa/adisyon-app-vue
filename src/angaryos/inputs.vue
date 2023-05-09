<template>
  <div class="w-100 mt-2 d-flex flex-column" v-if="column" :className="className">
    <div v-if="label" class="mb-0 mt-2 d-flex justify-content-between align-items-center">
      <div>
        <label class="mb-0 fs-7" v-if="column?.display_name[column?.display_name.length - 1] == '*'"
          >{{ column?.display_name.slice(0, -1) }}:&nbsp;<span class="text-danger">*</span></label
        >
        <label class="mb-0 fs-7" v-else-if="column_settings?.['required'] == true">
          {{ column?.display_name }}:&nbsp;<span class="text-danger">*</span>
        </label>
        <label class="mb-0 fs-7" v-else-if="column.name == 'ticaret_sicil_no' && this.table_name == 'departments'"
          >Ticaret Sicil No.:</label
        >
        <label class="mb-0 fs-7" v-else> {{ column?.display_name }}: </label>
        <span v-if="adminMode" style="font-weight: 100; font-size: 12px"> {{ " " + column.name }}</span>
      </div>
      <div v-if="info[column?.name]">
        <el-popover placement="left" :width="250" trigger="hover">
          <template #default>
            <div style="word-break: normal">
              {{ info[column?.name] }}
            </div>
          </template>
          <template #reference>
            <div class="info-icon text-info fs-5" style="line-height: 0">
              <i class="bi bi-info info-icon-1"></i>
              <i class="bi bi-info-circle-fill info-icon-2"></i>
            </div>
          </template>
        </el-popover>
      </div>
    </div>

    <div class="d-flex" v-if="column.gui_type_name == 'numeric'">
      <numberVue class="w-100" v-model="Data" :column="column" :disabled="disabled" :error="errors" size="large"></numberVue>
      <el-button
        size="large"
        class="ml-0"
        v-if="column_settings?.select?.find((e) => e == 'pay')"
        :icon="Money"
        v-tooltip="'Tamamını Öde'"
        @click="payInFull()"
      />

      <el-dropdown
        class="h-100"
        size="large"
        v-if="column_settings?.select?.find((e) => e == 'exchange') && !disabled"
        v-tooltip="'Güncel Kur Bilgisi'"
      >
        <el-button type="info" plain style="height: 40px !important" :icon="Switch"> </el-button>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="getExchange(6)">Dolar</el-dropdown-item>
            <el-dropdown-item @click="getExchange(3)">Euro</el-dropdown-item>
            <el-dropdown-item @click="getExchange(7)">Sterlin</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div v-else-if="column.name == 'color'">
      <el-color-picker v-model="Data" />
    </div>
    <div v-else-if="false" class="d-flex position-relative">
      {{ Data }}
      <dropdown-multi
        style="min-width: 150px"
        v-model="Data"
        :disabled="disabled"
        :column="column"
        :options="options"
        :error="errors"
        :column_settings="column_settings"
        @search="getColumnData($event)"
        size="large"
        :search="selectSearch"
        class="dropdown-select"
      >
      </dropdown-multi>
      <el-button
        class="position-absolute mx-1 dropdown-button-1"
        style="z-index: 1"
        v-if="column_settings?.select?.find((e) => e == 'edit')"
        :icon="Edit"
        v-tooltip="'Düzenle'"
        @click="editSelect()"
        circle
      />
      <el-button
        style="z-index: 1"
        class="position-absolute mx-1"
        :class="column_settings?.select?.find((e) => e == 'edit') ? 'dropdown-button-2' : 'dropdown-button-1'"
        v-if="column_settings?.select?.find((e) => e == 'create')"
        :icon="Plus"
        v-tooltip="'Ekle'"
        @click="addSelect()"
        circle
      />
    </div>
    <div
      class="d-flex position-relative"
      v-else-if="column.gui_type_name == 'select' || column.gui_type_name == 'select:static'"
    >
      <dropdown
        style="min-width: 150px"
        v-model="Data"
        :disabled="disabled"
        :column="column"
        :options="options"
        :error="errors"
        :column_settings="column_settings"
        @search="getColumnData($event)"
        size="large"
        :search="selectSearch"
        class="dropdown-select"
      ></dropdown>

      <el-button
        size=""
        class="position-absolute mx-1 dropdown-button-1"
        v-if="column_settings?.select?.find((e) => e == 'edit')"
        :icon="Edit"
        v-tooltip="'Düzenle'"
        @click="editSelect()"
        circle
      />
      <el-button
        size=""
        class="position-absolute mx-1"
        :class="column_settings?.select?.find((e) => e == 'edit') ? 'dropdown-button-2' : 'dropdown-button-1'"
        v-if="column_settings?.select?.find((e) => e == 'create')"
        :icon="Plus"
        v-tooltip="'Ekle'"
        @click="addSelect()"
        circle
      />
    </div>
    <div class="d-flex position-relative" v-else-if="column.gui_type_name == 'multiselect'">
      <multiSelect
        style="min-width: 150px"
        v-model="Data"
        :disabled="disabled"
        :column="column"
        :options="options"
        :error="errors"
        :column_settings="column_settings"
        @search="getColumnData($event)"
        size="large"
        :search="selectSearch"
        class="dropdown-select"
      ></multiSelect>
    </div>
    <dropdown-static
      v-else-if="column.gui_type_name == 'select_static'"
      v-model="Data"
      :column="column"
      :disabled="disabled"
      :error="errors"
    ></dropdown-static>
    <phone
      v-else-if="column.gui_type_name == 'phone' || column.name == 'phone' || column.name == 'personel_telefon'"
      v-model="Data"
      :column="column"
      :disabled="disabled"
      :error="errors"
      size="large"
    ></phone>

    <datetime
      v-else-if="column.gui_type_name == 'datetime'"
      v-model="Data"
      :column="column"
      :disabled="disabled"
      :error="errors"
      size="large"
    >
    </datetime>

    <date
      v-else-if="column.gui_type_name == 'date'"
      v-model="Data"
      :column="column"
      :disabled="disabled"
      :error="errors"
      size="large"
    >
    </date>

    <timeVue
      v-else-if="column.gui_type_name == 'time'"
      v-model="Data"
      :column="column"
      :disabled="disabled"
      :error="errors"
      size="large"
    >
    </timeVue>

    <Switchs
      v-else-if="column.gui_type_name == 'boolean' || column.gui_type_name == 'boolean:fastchange'"
      v-model="Data"
      :column="column"
      :disabled="disabled"
      size="large"
    />
    <text-area
      v-else-if="column.gui_type_name == 'text'"
      v-model="Data"
      :column="column"
      :disabled="disabled"
      :error="errors"
    />
    <files
      v-else-if="column.gui_type_name == 'files'"
      v-model="Data"
      :column="column"
      :disabled="disabled"
      :error="errors"
      size="large"
    />
    <!--- v-if="column.gui_type_name == 'string'" -->
    <textVue v-else v-model="Data" :column="column" :disabled="disabled" :error="errors" size="large"></textVue>

    <label v-if="errors" class="mb-0 text-danger">{{ errors }} </label>
  </div>
</template>

<script>
import textVue from "@/angaryos/inputs/text";
import numberVue from "@/angaryos/inputs/number";
import dropdown from "@/angaryos/inputs/dropdown";
import phone from "@/angaryos/inputs/phone";
import datetime from "@/angaryos/inputs/datetime";
import Switchs from "@/angaryos/inputs/switch.vue";
import textArea from "@/angaryos/inputs/text-area";
import date from "@/angaryos/inputs/date";
import timeVue from "@/angaryos/inputs/time";
import dropdownStatic from "@/angaryos/inputs/dropdown_static";
import files from "@/angaryos/inputs/files";
import dropdownMulti from "./inputs/dropdown-multi";
import multiSelect from "@/angaryos/inputs/multiselect";

import axios from "axios";
import { mapGetters } from "vuex";

import { Edit, Plus, Money, Coin, Switch } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";

import column_settings_modal from "@/angaryos/modal/column_settings.js";
import infoColumns from "@/info";

export default {
  props: {
    column: Object,
    modelValue: [String, Number, Array, Object],
    label: Boolean,
    table_name: String,
    disabled: Boolean,
    errors: String,
    column_settings: Object,
    className: String,
    params: Object,
  },
  data() {
    return {
      Data: this.modelValue,
      options: [],
      Edit,
      Plus,
      Money,
      Coin,
      Switch,
      selectSearch: "",
      info: infoColumns,
    };
  },
  watch: {
    modelValue(val) {
      this.Data = val;
    },
    Data() {
      this.$emit("update:modelValue", this.Data);
      this.$emit("change", this.Data);
    },
    column() {
      if (this.column.gui_type_name == "select" || this.column.gui_type_name == "select:static") {
        this.getColumnData();
      }
    },
    getDualRefresh() {
      if (this.column?.gui_type_name == "select" || this.column?.gui_type_name == "select:static") {
        this.getColumnData();
      }
    },
  },
  mounted() {
    if (
      this.column?.gui_type_name == "select" ||
      this.column?.gui_type_name == "select:static" ||
      this.column?.gui_type_name == "multiselect"
    ) {
      this.getColumnData();
    }
  },
  computed: {
    ...mapGetters(["getToken", "getUserData", "adminMode", "getDualRefresh", "getBorsaData"]),
  },
  methods: {
    getColumnData(e) {
      axios
        .post(this.getToken + "/tables/" + this.table_name + "/getSelectColumnData/" + this.column.name, {
          search: e?.length > 0 ? e : "***",
          limit: 1000,
          upColumnName: this.column.up_column_name,
          upColumnData: this.params?.[this.column.up_column_name],
        })
        .then((res) => {
          this.options = res.data.results;
          if (
            this.table_name == "kobi_siparis" &&
            (this.column.name == "kasa_karti_id" || this.column.name == "banka_karti_id")
          ) {
            this.Data = this.options[0].id;
          }
          this.$emit("selectResult", this.options);
        })
        .catch((e) => {
          this.$services.setError({
            istek_link: this.getToken + "/tables/" + this.table_name + "/getSelectColumnData/" + this.column.name,
            kullanici_bilgileri: JSON.stringify(this.$store.getters.getUserData.user),
            payloads: JSON.stringify({
              search: e?.length > 0 ? e : "***",
              limit: 1000,
              upColumnName: this.column.up_column_name,
              upColumnData: this.params?.[this.column.up_column_name],
            }),
            preview: JSON.stringify(e.response),
            tablo_ismi: this.table_name,
            token_bilgisi: this.$store.getters.getToken,
          });

          this.options = [];
          ElNotification({
            title: "Hata",
            message: e.response.data.data.message,
            type: "error",
            position: "top-left",
          });
        });
    },
    addSelect() {
      this.$store.commit("setCenterModalData", {
        name: "dual",
        type: "create",
        title: "Hızlı ekleme",
        state: true,
        table_name: this.column.relation?.table_name,
        column_settings:
          column_settings_modal[this.column.relation?.table_name] === undefined
            ? {}
            : column_settings_modal[this.column.relation?.table_name],
      });
    },
    editSelect() {
      if (this.Data == undefined || this.Data == null || this.Data == "") {
        ElNotification({
          title: "Hata!",
          message: "Lütfen öncelikle bir değer seçiniz.",
          type: "error",
          position: "top-left",
        });
        return;
      } else {
        this.$store.commit("setCenterModalData", {
          name: "dual",
          type: "edit",
          title: "Hızlı düzenleme",
          state: true,
          id: this.Data,
          table_name: this.column.relation?.table_name,
          column_settings:
            column_settings_modal[this.column.relation?.table_name] === undefined
              ? {}
              : column_settings_modal[this.column.relation?.table_name],
        });
        this.Data = null;
      }
    },
    payInFull() {
      this.Data = this.params.vergi_tutar;
    },
    getExchange(e) {
      this.Data = this.getBorsaData[e].SATIS;
    },
  },
  components: {
    textVue,
    numberVue,
    dropdown,
    phone,
    datetime,
    Switchs,
    textArea,
    date,
    timeVue,
    dropdownStatic,
    files,
    dropdownMulti,
    multiSelect,
  },
};
</script>

<style>
.info-icon-2 {
  display: none;
}
.info-icon:hover .info-icon-2 {
  display: block !important;
}
.info-icon:hover .info-icon-1 {
  display: none !important;
}
.select-trigger .el-input--suffix .el-input__suffix {
  position: absolute;
  left: 0;
}
.select-trigger .el-input--suffix .el-input__inner {
  padding-left: 10px;
}
.dropdown-button-1 {
  top: 4px;
  right: 4px;
}
.dropdown-button-2 {
  top: 4px;
  right: 41px;
}
</style>
