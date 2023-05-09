<template>
  <div class="dropdown-menu mt-3 sag-menu rounded" :id="'k' + menuId">
    <a
      v-if="button_settings?.edit?.visible != false"
      class="dropdown-item cursor-pointer"
      @click="
        this.$store.commit('dataEdit', {
          table_name: this.table_name,
          column_settings: this.column_settings,
          id: this.menuId,
        })
      "
    >
      <i class="simple-icon-refresh"></i>
      Düzenle
    </a>
    <a
      v-if="button_settings?.delete?.visible != false"
      class="dropdown-item cursor-pointer text-danger"
      @click="
        this.$store.commit('dataDelete', {
          table_name: this.table_name,
          id: this.menuId,
        })
      "
    >
      <i class="simple-icon-refresh"></i>
      Sil
    </a>
    <el-divider />
    <a
      class="dropdown-item cursor-pointer"
      @click="this.$store.commit('refreshPage')"
    >
      <i class="simple-icon-refresh"></i>
      Sayfa Yenile
    </a>
    <a
      class="dropdown-item cursor-pointer"
      @click="this.$store.commit('refreshTable')"
    >
      <i class="simple-icon-refresh"></i>
      Tablo Yenile
    </a>
    <a
      v-if="button_settings?.create?.visible != false"
      class="dropdown-item cursor-pointer"
      @click="
        this.$store.commit('dataCreate', {
          table_name: this.table_name,
          column_settings: this.column_settings,
        })
      "
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
  props: ["table_name", "column_settings", "menuId", "button_settings"],
};
</script>

<style></style>
