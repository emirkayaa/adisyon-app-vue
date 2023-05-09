<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex">
        <h2 class=""><i class="text-primary bi bi-pc-display-horizontal"></i> Cihazlar</h2>
      </div>
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <label for="" class="h5 mb-0 me-2">Ara:</label>
          <el-input v-model="a" placeholder="" size="large"></el-input>
        </div>
        <div>
          <el-button type="primary" size="large" plain>Cihaz Ekle</el-button>
        </div>
      </div>
    </el-card>
    <div class="row" v-if="loading">
      <div class="col-12 col-sm-6 col-md-4 col-xxl-3 mb-5" v-for="i in 10" :key="i">
        <el-skeleton :rows="3" animated />
      </div>
    </div>
    <div class="row" v-else>
      <div class="mb-3 col-12 col-sm-6 col-md-4 col-xxl-3" v-for="i in datas.records" :key="i">
        <el-card>
          <div class="d-flex">
            <i class="bi bi-pc-display h1 me-2"></i>
            <div class="d-flex flex-column w-100">
              <div class="d-flex justify-content-between align-items-center w-100">
                <h4 class="text-color">{{ i.name_basic }}</h4>
                <i class="bi bi-pen fs-5"></i>
              </div>
              <span>Pin: {{ i.device_unique_info }}</span>
              <span>Bölge: Salon</span>
              <p>{{ i.description }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datas: {},
      loading: true,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      const params = {
        limit: 20,
        page: 1,
        filters: {},
        sorts: {},
      };
      this.$services.list("devices", params).then((res) => {
        this.datas = res.data.data;
        this.loading = false;
      });
    },
  },
};
</script>

<style></style>
