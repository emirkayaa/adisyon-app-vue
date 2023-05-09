<template>
  <!-- Baş: Tablo başlık -->
  <tfoot class="">
    <tr>
      <!--- Baş: Başlık-> Kolonlar -->
      <template v-for="td in table_data?.columns" :key="td">
        <template v-if="column_settings[td.name]?.['visible'] == false"></template>
        <th v-else class="fs-8 text-end" :class="[td.name, column_settings?.[td.name]?.['format']]">
          <el-tooltip :show-after="500" :content="'Tabloda kayıtlı tüm verilerin toplamı: ' + format.format(table_data?.collectiveInfos?.[td.name]?.data)" effect="tooltip-theme">
            <span style="color: var(--theme-color-4)" v-if="table_data?.collectiveInfos?.[td.name]?.data">
              Toplam:
              {{ format.format(table_data?.collectiveInfos?.[td.name]?.data) }}
            </span>
          </el-tooltip>
        </th>
      </template>
      <!--- Son: Başlık-> Kolonlar -->
      <!--- Baş: Başlık-> Kalem -->
      <th
        style="width: 50px !important; cursor: pointer"
        class="angaryos-table-sticky-right text-primary p-1"
        @click="searchState = !searchState"
      ></th>
      <!--- Son: Başlık-> Kalem -->
      <!--- Baş: Başlık-> İşlemler -->

      <!--- Son: Başlık-> İşlemler -->
    </tr>
  </tfoot>
  <!-- Son: Tablo başlık -->
</template>

<script>
import { props, methods, emits, computed, components } from "../datas/table-header.js";
import format from "@/angaryos/tools/numberFormatter.js";
export default {
  data() {
    return {
      format,
      searchState: false,
      fastSearch: {},
      Params: this.modelValue,
    };
  },
  props: props,
  emits: emits,
  methods: methods,
  computed: computed,
  components: components,
};
</script>

<style>
.angaryos-table-sticky-right {
  position: sticky;
  right: 0;
  border: 1px solid var(--theme-color-1-10);
  background: var(--foreground-color) !important;
  z-index: 1;
}

.angaryos-table-sticky-left {
  position: sticky;
  left: 0;
  background: var(--theme-color-1-1);
  border: 1px solid var(--theme-color-1);
  z-index: 1;
}

@media screen and (max-width: 768px) {
  .angaryos-table-sticky-right {
    position: relative;
    background: transparent;
  }

  .angaryos-table-sticky-left {
    position: relative;
    background: transparent;
  }
}
</style>
