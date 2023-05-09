<template>
  <div class="dropdown-menu mt-3 sayfa-dropdown rounded">
    <a class="dropdown-item cursor-pointer" @click="this.$store.commit('refreshPage')">
      <i class="simple-icon-refresh"></i>
      Sayfa Yenile
    </a>
    <a class="dropdown-item cursor-pointer" @click="this.$store.commit('refreshTable')">
      <i class="simple-icon-refresh"></i>
      Tablo Yenile
    </a>
    <a
      v-if="button_settings?.create?.visible != false"
      class="dropdown-item cursor-pointer"
      @click="this.$store.commit('dataCreate', { table_name: this.table_name, column_settings: this.column_settings })"
    >
      <i class="simple-icon-refresh"></i>
      Ekle
    </a>
    <a class="dropdown-item cursor-pointer" @click="this.$store.commit('help')">
      <i class="simple-icon-refresh"></i>
      Yardım
    </a>
  </div>
</template>

<script>
export default {
  props: ["table_name", "column_settings", "button_settings"],
};
</script>

<style></style>
