<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex">
        <h2 class=""><i class="text-primary bi bi-qr-code-scan"></i> QR Menü Ayarları</h2>
      </div>
    </el-card>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="Genel Ayarlar" name="1">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-9 col-md-8 col-lg-7">
            <div class="d-flex flex-column align-items-center justify-content-center">
              <a class="mb-2" :href="'https://adisyon.masahesap.com/qr-menu?c=' + getUserData.companies.id">
                {{ "https://adisyon.masahesap.com/qr-menu?c=" + getUserData.companies.id }}
              </a>
              <qrcode-vue
                :value="'https://adisyon.masahesap.com/qr-menu?c=' + getUserData.companies.id"
                size="200"
                level="H"
                :background="qr_back"
                :foreground="qr_fore"
              ></qrcode-vue>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!----------------------------------------------------->
      <el-tab-pane label="Ürün Ayarları" name="2">
        <div class="row">
          <div class="col-12 col-sm-6 col-md-12 col-lg-6 col-xl-5 col-xxl-3 mb-3">
            <el-card>
              <div class="d-flex align-items-center justify-content-between">
                <h3 class="mb-0">Kategoriler</h3>
              </div>
              <el-divider></el-divider>

              <template v-for="k in kategoriler" :key="k">
                <template v-if="k != null">
                  <div class="d-flex justify-content-between align-items-center">
                    <el-button
                      class="mb-2"
                      @click="active_kategori = k"
                      :class="active_kategori == k ? 'fs-6' : ''"
                      :type="active_kategori == k ? 'primary' : ''"
                      link
                    >
                      <i class="bi bi-palette-fill fs-5 me-2" :style="{ color: k?.color == null ? '' : k.color }"></i>
                      {{ k?.product_category }}
                    </el-button>
                    <el-switch v-model="k.qr_menu" @click="changeKtgVisible(k.id, k.qr_menu)"></el-switch>
                  </div>
                </template>
              </template>
            </el-card>
          </div>
          <div class="col-12 col-sm-6 col-md-12 col-lg-6 col-xl-7 col-xxl-9">
            <div class="row mb-3">
              <div class="col-12">
                <el-card>
                  <div class="d-flex justify-content-between">
                    <div class="d-flex">
                      <div class="me-3 rounded">
                        <img
                          v-if="getImage(active_kategori?.image) == null"
                          src="/_assets/no-image.png"
                          style="width: 60px"
                          class="rounded"
                        />
                        <img v-else :src="getImage(active_kategori?.image)" class="rounded" style="width: 60px" alt="" />
                      </div>

                      <span class="fs-4">
                        {{ active_kategori?.product_category }}
                      </span>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
            <div class="row">
              <template v-for="i in urunler" :key="i">
                <div
                  class="col-12 col-lg-12 col-xl-6 col-xxl-4 mb-4"
                  v-if="active_kategori.product_category + 'é' + active_kategori.id == i.product_category_id"
                >
                  <el-card class="cursor-pointer position-relative">
                    <div
                      class="position-absolute top-0 w-100 h-100 start-0"
                      :style="{ background: i.color }"
                      style="opacity: 0.2"
                    ></div>
                    <div class="position-relative" style="z-index: 1">
                      <div class="d-flex w-100">
                        <div class="p-1">
                          <img
                            v-if="getImage(i.image) == null"
                            src="/_assets/no-image.png"
                            class="rounded"
                            style="width: 60px"
                            alt=""
                          />
                          <img v-else :src="getImage(i.image)" style="width: 60px" class="rounded" alt="" />
                        </div>

                        <div class="d-flex flex-column ms-3 w-100">
                          <div class="w-100 d-flex justify-content-between">
                            <span class="fs-6">{{ i.product_name }} </span>
                          </div>
                          <div class="d-flex flex-wrap">
                            <el-tag v-for="p in JSON.parse(i.portion_ids)" :key="p" type="primary" size="small" class="m-1">
                              {{ p.display }}
                            </el-tag>
                          </div>
                          <el-divider class="my-2"></el-divider>
                          <div class="d-flex justify-content-between align-items-center">
                            <span>QR Menu'de göster:</span>
                            <el-switch v-model="i.qr_menu" @click="changeVisible(i.id, i.qr_menu)"></el-switch>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-card>
                </div>
              </template>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!----------------------------------------------------->

      <el-tab-pane label="Slider Ayarları" name="3">
        <el-card><Table table_name="qr_slider" :column_settings="columns_settings"></Table></el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import Table from "@/angaryos/table";
import { mapGetters } from "vuex";
import { ElNotification } from "element-plus";
export default {
  data() {
    return {
      activeName: "1",
      urunler: [],
      kategoriler: [],
      active_kategori: 0,
      qr_back: "",
      qr_fore: "",
      columns_settings: {
        content: { visible: false, input_visible: false },
        created_at: { visible: false, input_visible: false },
        id: { visible: false, input_visible: false },
        own_id: { visible: false, input_visible: false },
        state: { visible: false, input_visible: false },
        updated_at: { visible: false, input_visible: false },
        user_id: { visible: false, input_visible: false },
        image: { format: "image" },
      },
    };
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
  components: {
    Table,
    QrcodeVue,
  },
  mounted() {
    this.getDatas();
    this.qr_back = localStorage.getItem("theme") == "dark" ? "black" : "white";
    this.qr_fore = localStorage.getItem("theme") == "dark" ? "white" : "black";
  },
  methods: {
    getDatas() {
      this.getUrun();
      this.getKategori();
    },
    getKategori() {
      const params = {
        limit: 100,
        page: 1,
        filters: {},
        sorts: { sort_no: true },
      };
      this.$services.list("product_category", params).then((res) => {
        this.kategoriler = res.data.data.records;
        this.active_kategori = this.kategoriler[0];
        this.load_state += 1;
      });
    },
    getUrun() {
      const params = {
        limit: 1000,
        page: 1,
        filters: {},
        sorts: { sort_no: true },
      };
      this.$services.list("product", params).then((res) => {
        this.urunler = res.data.data.records;
        this.load_state += 1;
      });
    },
    getImage(img) {
      if (img == null || img == "[]") {
        return null;
      } else {
        return this.imgBaseUrl + JSON.parse(img)[0].destination_path + "s_" + JSON.parse(img)[0].file_name;
      }
    },
    changeVisible(id, data) {
      let params = {
        qr_menu: data,
        image_old: [],
      };
      this.$services.edit("product", id).then((res) => {
        params.image_old = res.data.data.record.image;
        this.$services.update("product", id, params).then(() => {
          ElNotification({
            title: "Başarılı",
            message: "QR menü durumu başarıyla değişti",
            type: "success",
          });
        });
      });
    },
    changeKtgVisible(id, data) {
      let params = {
        qr_menu: data,
        image_old: [],
      };
      this.$services.edit("product_category", id).then((res) => {
        params.image_old = res.data.data.record.image;
        this.$services.update("product_category", id, params).then(() => {
          ElNotification({
            title: "Başarılı",
            message: "QR menü durumu başarıyla değişti",
            type: "success",
          });
        });
      });
    },
  },
};
</script>

<style></style>
