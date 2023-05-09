<template>
  <div v-if="this.$route.name != 'siparisEkrani'">
    <div class="d-none d-lg-flex container-fluid order-container">
      <el-button @click="$router.push('/')" class="px-3" v-if="this.getUserData?.user?.user_task_id != 3">
        <div class="d-flex flex-column">
          <i class="bi bi-arrow-left fs-3"></i>
          Geri Dön
        </div>
      </el-button>
      <div
        v-tooltip="
          !Object.values(JSON.parse(getUserData.companies.work_type_ids))?.some((x) => x == 1)
            ? 'Firma Ayarlarından açabilirsiniz'
            : ''
        "
      >
        <el-button
          class="px-3"
          @click="$router.push('/panel/garson')"
          :type="$route.fullPath == '/panel/garson' ? 'danger' : ''"
          plain
          :disabled="!Object.values(JSON.parse(getUserData.companies.work_type_ids))?.some((x) => x == 1)"
        >
          <div class="d-flex flex-column">
            <i class="mdi mdi-table-chair fs-3"></i>
            Masa Siparişi
          </div>
        </el-button>
      </div>
      <div
        v-tooltip="
          !Object.values(JSON.parse(getUserData.companies.work_type_ids)).some((x) => x == 3)
            ? 'Firma ayarlarından açabilirsiniz'
            : ''
        "
      >
        <el-button
          class="px-3"
          @click="$router.push('/panel/paket')"
          :type="$route.fullPath == '/panel/paket' ? 'danger' : ''"
          plain
          :disabled="!Object.values(JSON.parse(getUserData.companies.work_type_ids)).some((x) => x == 3)"
        >
          <div class="d-flex flex-column">
            <i class="mdi mdi-motorbike fs-3"></i>
            Paket Siparişi
          </div>
        </el-button>
      </div>
      <div
        v-tooltip="
          !Object.values(JSON.parse(getUserData.companies.work_type_ids)).some((x) => x == 4)
            ? 'Firma ayarlarından açabilirsiniz'
            : ''
        "
      >
        <el-button
          class="px-3"
          @click="$router.push('/panel/self-servis')"
          plain
          :type="$route.fullPath == '/panel/self-servis' ? 'danger' : ''"
          :disabled="!Object.values(JSON.parse(getUserData.companies.work_type_ids)).some((x) => x == 4)"
        >
          <div class="d-flex flex-column">
            <i class="mdi mdi-basket-outline fs-3"></i>
            Self Servis Sipariş
          </div>
        </el-button>
      </div>

      <div v-tooltip="this.getUserData.companies?.is_kitchen != true ? 'Mutfağınız aktif değil' : 'Mutfak'">
        <el-button
          class="px-3"
          @click="$router.push('/panel/mutfak')"
          :type="$route.fullPath == '/panel/mutfak' ? 'danger' : ''"
          plain
          :disabled="this.getUserData.companies?.is_kitchen != true"
        >
          <div class="d-flex flex-column">
            <i class="mdi mdi-faucet-variant fs-3"></i>
            Mutfak
          </div>
        </el-button>
      </div>
      <div class="w-100"></div>
      <div>
        <el-input-number
          class="h-100 zoom-button"
          v-model="zoom"
          :precision="2"
          :step="0.1"
          size="large"
          :min="0.5"
          :max="1.7"
          placeholder=""
        ></el-input-number>
      </div>
      <el-button
        class="px-3"
        @click="$router.push('/panel/ozet')"
        :type="$route.fullPath == '/panel/ozet' ? 'danger' : ''"
        plain
      >
        <div class="d-flex flex-column">
          <i class="bi bi-card-text fs-4"></i>
          Sipariş Özeti
        </div>
      </el-button>
    </div>
    <div class="d-flex d-lg-none mobil-header justify-content-center flex-wrap">
      <el-button @click="$router.push('/')" class="px-3" v-disabled="this.getUserData?.user?.user_task_id">
        <div class="d-flex flex-column">
          <i class="bi bi-arrow-left fs-3"></i>
          Geri Dön
        </div>
      </el-button>
      <el-button
        class="px-3"
        @click="$router.push('/panel/garson')"
        :type="$route.fullPath == '/panel/garson' ? 'danger' : ''"
        plain
      >
        <div class="d-flex flex-column">
          <i class="mdi mdi-table-chair fs-3"></i>
          Masa Siparişi
        </div>
      </el-button>
      <el-button
        class="px-3"
        @click="$router.push('/panel/paket')"
        :type="$route.fullPath == '/panel/paket' ? 'danger' : ''"
        plain
      >
        <div class="d-flex flex-column">
          <i class="mdi mdi-motorbike fs-3"></i>
          Paket Siparişi
        </div>
      </el-button>
      <el-button
        class="px-3"
        @click="$router.push('/panel/self-servis')"
        plain
        :type="$route.fullPath == '/panel/self-servis' ? 'danger' : ''"
      >
        <div class="d-flex flex-column">
          <i class="mdi mdi-basket-outline fs-3"></i>
          Self Servis
        </div>
      </el-button>

      <el-button
        class="px-3"
        @click="$router.push('/panel/mutfak')"
        :type="$route.fullPath == '/panel/mutfak' ? 'danger' : ''"
        plain
        :disabled="this.getUserData.companies?.is_kitchen != true"
        v-tooltip="this.getUserData.companies?.is_kitchen != true ? 'Mutfağınız aktif değil' : ''"
      >
        <div class="d-flex flex-column">
          <i class="mdi mdi-faucet-variant fs-3"></i>
          Mutfak
        </div>
      </el-button>
      <el-button
        class="px-3"
        @click="$router.push('/panel/ozet')"
        :type="$route.fullPath == '/panel/ozet' ? 'danger' : ''"
        plain
      >
        <div class="d-flex flex-column">
          <i class="bi bi-card-text fs-4"></i>
          Sipariş Özeti
        </div>
      </el-button>
    </div>
  </div>
  <route-buttons v-if="this.getUserData?.user?.user_task_id == 3"></route-buttons>
</template>

<script>
import { mapGetters } from "vuex";
import routeButtons from "./components/route-buttons.vue";
export default {
  components: { routeButtons },
  data() {
    return {
      zoom: "",
    };
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
  mounted() {
    this.zoom = document.body.style.zoom == "" ? 1 : document.body.style.zoom;
  },
  watch: {
    zoom() {
      document.body.style.zoom = this.zoom;
    },
  },
};
</script>

<style>
.zoom-button span {
  width: 60px !important;
}
.zoom-button .el-input-number__decrease {
  cursor: zoom-out;
}
.zoom-button .el-input-number__increase {
  cursor: zoom-in;
}
.order-container {
  margin: 0;
  padding: 0;
}
.mobil-header .el-button {
  padding: 25px 15px;
  width: 110px;
  margin-left: 5px !important;
  margin: 5px;
}
.order-container .el-button {
  margin: 0;
  padding: 30px;
  border-radius: 0;
  margin-left: 0 !important;
}

.order-container .el-button i {
  font-size: 24px;
}

.order-container .el-input__wrapper {
  margin: 0;
  border-radius: 0;
  /* background-color: #909399; */
  background-color: var(--el-bg-color-overlay);
}

.icecek-wrapper .icecek-card .el-card__body {
  padding: 0px 0px 0px 10px !important;
}

.order-container .desk-input .el-input__wrapper {
  background-color: #909399;
  color: #fff;
}

.order-container .desk-input .el-input__wrapper .el-input__inner {
  color: #fff;
}
</style>
