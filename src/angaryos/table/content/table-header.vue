<template>
  <!-- Baş: Tablo başlık -->
  <thead class="angaryos-table-thead">
    <tr>
      <!--- Baş: Başlık-> Kolonlar -->
      <template v-for="td in table_data?.columns" :key="td">
        <template v-if="column_settings[td.name]?.['visible'] == false"></template>
        <template v-else-if="td.name == 'para_birimi_id' || td.name == 'döviz_kuru'">
          <th
            v-if="td.name == 'para_birimi_id'"
            class="fs-8"
            style="min-width: 150px"
            :class="[td.name, column_settings?.[td.name]?.['format']]"
          >
            <i class="bi bi-arrow-down me-1 text-warning" v-if="Params.sorts[td.name] == true"></i>
            <i class="bi bi-arrow-up me-1 text-warning" v-else-if="Params.sorts[td.name] == false"></i>
            <i class="bi bi-arrow-down-up me-1" v-else></i>
            <span class="cursor-pointer" @click="setSorts(td)">
              {{
                td.display_name[td.display_name.length - 1] == "*"
                  ? td.display_name.substring(0, td.display_name.length - 1)
                  : td.display_name
              }}
            </span>
            <div v-if="adminMode" style="font-size:8px;font-weight:300">
              {{ td.name }}
            </div>
          </th>
        </template>
        <th v-else class="fs-8" style="min-width: 150px" :class="[td.name, column_settings?.[td.name]?.['format']]">
          <i class="bi bi-arrow-down me-1 text-warning" v-if="Params.sorts[td.name] == true"></i>
          <i class="bi bi-arrow-up me-1 text-warning" v-else-if="Params.sorts[td.name] == false"></i>
          <i class="bi bi-arrow-down-up me-1" v-else></i>
          <span class="cursor-pointer" @click="setSorts(td)">
            {{
              td.display_name[td.display_name.length - 1] == "*"
                ? td.display_name.substring(0, td.display_name.length - 1)
                : td.display_name
            }}
          </span>
          <div v-if="adminMode" style="font-size:8px;font-weight:300">
            {{ td.name }}
          </div>
        </th>
      </template>
      <!--- Son: Başlık-> Kolonlar -->
      <!--- Baş: Başlık-> Kalem -->
      <th
        v-if="table_settings?.right_button != false"
        style="width: 50px !important; cursor: pointer"
        class="angaryos-table-sticky-right text-primary p-1"
        @click="searchState = !searchState"
      >
        <el-button class="m-0 float-right"><i class="iconsminds-magnifi-glass me-1"></i> Ara</el-button>
      </th>
      <!--- Son: Başlık-> Kalem -->
      <!--- Baş: Başlık-> İşlemler -->

      <!--- Son: Başlık-> İşlemler -->
    </tr>
    <Transition>
      <tr v-if="searchState">
        <!--- Baş: Başlık-> Seçim -->
        <th v-if="satirSec" style="width: 50px !important">Seç</th>
        <!--- Son: Başlık-> Seçim -->
        <!--- Baş: Başlık-> Kolonlar -->
        <template v-for="td in table_data?.columns" :key="td">
          <template v-if="column_settings[td.name]?.['visible'] == false"></template>
          <th v-else class="cursor-pointer">
            <div v-if="td.gui_type_name == 'files'"></div>
            <inputs
              v-else
              :column="td"
              :label="false"
              v-model="fastSearch[td.name]"
              :table_name="table_data.table_info.name"
              @keypress.enter="setFilter(td)"
              @change="setFastFilter(td)"
            >
            </inputs>
          </th>
        </template>
        <!--- Son: Başlık-> Kolonlar -->
        <!--- Baş: Başlık-> Kalem -->
        <th class="angaryos-table-sticky-right" style="width: 50px !important">Hızlı arama</th>
        <!--- Son: Başlık-> Kalem -->
        <!--- Baş: Başlık-> İşlemler -->

        <!--- Son: Başlık-> İşlemler -->
      </tr>
    </Transition>
  </thead>
  <!-- Son: Tablo başlık -->
</template>

<script>
import { props, methods, emits, computed, components } from "../datas/table-header.js";
export default {
  data() {
    return {
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
.angaryos-table-thead {
  background: var(--theme-color-1-10) !important;
  white-space: nowrap;
  border: 1px solid var(--theme-color-1-10);
}

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
