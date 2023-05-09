<template>
  <div class="row text-center align-items-center my-2">
    <div class="col-12 col-md-4 my-1 my-md-0">
      <!-- Baş: Toplam veri miktarı -->
      {{ tr("toplam-veri", table_data?.all_records_count) }}
      <!-- Son: Toplam veri miktarı -->
    </div>
    <div class="col-12 col-md-4 my-1 my-md-0">
      <!-- Baş: Sayfalama -->
      <div class="d-flex justify-content-center">
        <el-pagination
          v-if="true"
          background
          :page-size="this.params.limit"
          @current-change="change"
          :pager-count="5"
          layout="prev, pager, next"
          :total="table_data?.all_records_count"
        />
      </div>
    </div>
    <div class="col-12 col-md-4 my-1 my-md-0">
      <!-- Baş: Gösterilen veriler miktarı -->
      {{ this.params.limit * (this.params.page - 1) }} - {{ this.params.limit * this.params.page }} arasındaki veriler
      gösteriliyor

      <!-- Son: Gösterilen veriler miktarı -->
    </div>
  </div>
</template>

<script>
import { props, components, emits, methods } from "./datas/footer.js";
export default {
  props: props,
  emits: emits,
  components: components,
  methods: methods,
};
</script>
<style>
.page-item {
  cursor: pointer;
}
</style>
