<template>
  <div>
    <div class="p-4 mx-3 mt-3 d-grid align-items-center rounded basket-ground">
      <div class="d-flex justify-content-between">
        <span class="fs-5">Sepetiniz ({{ toplam }})</span>

        <a><i class="bi bi-trash3 fs-5"></i></a>
      </div>
    </div>

    <!--basket content-->
    <div style="margin-top: 5%; height: 300px; overflow: auto">
      <div
        :class="this.miktar[i] == 0 ? 'd-none ' : ''"
        class="d-flex flex-column justify-content-between food-list my-2 mx-2"
        v-for="i in Object.keys(miktar)"
        :key="i"
      >
        <el-card class="mb-1 mx-2">
          <div class="d-flex justify-content-between align-items-center p-2">
            <div class="d-flex">
              <div>
                <img
                  class="food-image rounded"
                  src="@/views/qr-menu/image/hamburger.jpg"
                  style="width: 48px; height: 48px"
                  alt=""
                />
              </div>
              <div class="mx-2">
                <span class="fs-6">Hamburger</span>
                <p class="text-justify">Yemek Özellikleri</p>
              </div>
            </div>
            <el-input-number v-model="miktar[i]" style="max-width: 99px" :min="0" :max="100" @change="handleChange" />
          </div>
        </el-card>
      </div>
    </div>

    <div class="d-flex justify-content-center mt-3">
      <el-button @click="open1()" plain type="primary">Sipariş Ver</el-button>
    </div>

    <!--önerilenler-->
    <div class="favori-food mt-4">
      <div class="w-100 d-flex justify-content-between">
        <p class="fs-6 fw-bold ms-3">Ekstra Lezzetler</p>
        <a class="fs-7 fw-bold" style="margin-right: 20px; color: crimson" href="qr-menu/yemek-listesi">Tümünü Gör</a>
      </div>
      <div class="w-100 overflow-auto">
        <div class="d-flex" style="width: min-content">
          <el-card v-for="i in 10" :key="i" class="mx-1" :body-style="{ padding: '0px' }">
            <img src="@/views/qr-menu/image/kesek.jpg" style="height: 200px; width: 200px" class="image" />
            <div class="d-flex justify-content-between align-items-center" style="padding: 14px">
              <span>Keşkek</span>
              <el-input-number style="width: 97px" :min="0" :max="10" @change="handleChange" />
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ElMessage } from "element-plus";
export default {
  data() {
    return {
      miktar: {},
      toplam: 0,
    };
  },
  computed: {
    ...mapGetters(["getSepet"]),
  },
  mounted() {
    this.handleChange();
  },
  watch: {
    getSepet() {
      this.handleChange();
    },
  },
  methods: {
    open1() {
      ElMessage({
        message: "Siparişiniz Alındı.",
        type: "success",
      });
    },
    handleChange() {
      this.miktar = this.getSepet;
      this.toplam = 0;
      for (const val of Object.values(this.miktar)) {
        this.toplam += val;
      }
      this.$store.commit("setSepet", this.miktar);
    },
  },
};
</script>

<style>
.favori-name {
  margin-left: 5px;
  font-size: 18px;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
}
.food-image {
  width: 70px;
  height: 70px;
}

.food-list-wrapper {
  border-radius: 5px;
}
.basket-ground {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
.el-card.is-always-shadow {
  /* box-shadow: var(--el-box-shadow-light); */
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
.el-button > span {
  font-size: 19px;
}
</style>
