<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex flex-column align-items-center align-items-sm-start w-100">
        <span class="h4"><i class="text-primary bi bi-cup-hot"></i> Menu / Kategoriler</span>
        <div class="d-flex align-items-center mb-3">
          <label for="" class="h5 mb-0 me-2">Ara:</label>
          <el-input v-model="search" @keyup="Ara()" placeholder="" size="large"></el-input>
        </div>
        <div class="d-none d-md-block">
          <el-button-group>
            <el-button type="primary" id="kategori-ekle-dialog-button" size="large" plain @click="kategoriEkleVisible = true"
              >Kategori Ekle</el-button
            >
            <el-button type="primary" size="large" plain @click="urun_sirala_visible = true">Ürün Sırala</el-button>
            <el-button type="primary" id="urun-ekle-dialog-button" size="large" plain @click="urunEkleVisible = true"
              >Ürün Ekle</el-button
            >
          </el-button-group>
        </div>
        <div class="d-flex d-md-none flex-wrap justify-content-center">
          <el-button type="primary" class="mb-1" size="large" plain @click="kategoriEkleVisible = true"
            >Kategori Ekle</el-button
          >
          <el-button type="primary" class="mb-1" size="large" plain @click="urun_sirala_visible = true"
            >Ürün Sırala</el-button
          >
          <el-button type="primary" class="mb-1" size="large" plain @click="urunEkleVisible = true">Ürün Ekle</el-button>
        </div>
      </div>
    </el-card>

    <div class="row">
      <div class="col-12 col-sm-6 col-md-12 col-lg-6 col-xl-5 col-xxl-3 mb-3">
        <el-card>
          <div class="d-flex align-items-center justify-content-between">
            <h3 class="mb-0">Kategoriler</h3>
            <i class="bi bi-pen fs-5 cursor-pointer" @click="kategoriSiralaVisible = true"></i>
          </div>
          <el-divider></el-divider>

          <template v-for="k in search_kategoriler" :key="k">
            <template v-if="k != null">
              <el-button
                class="mb-2"
                @click="active_kategori = k"
                :class="active_kategori == k ? 'fs-6' : ''"
                :type="active_kategori == k ? 'primary' : ''"
                link
              >
                <i class="bi bi-palette-fill fs-5 me-2" :style="{ color: k?.color == null ? '' : k.color }"></i>
                {{ k?.product_category }} </el-button
              ><br
            /></template>
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
                <i
                  class="bi bi-pen fs-5 cursor-pointer"
                  @click="(kategori_duzenle_visible = true), (edit_ktg_data = active_kategori)"
                ></i>
              </div>
            </el-card>
          </div>
        </div>
        <div class="row">
          <template v-for="i in search_urunler" :key="i">
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
                        class="rounded"
                        src="/_assets/no-image.png"
                        style="width: 100px"
                        alt=""
                      />
                      <img v-else :src="getImage(i.image)" class="rounded" style="width: 100px" alt="" />
                    </div>

                    <div class="d-flex flex-column w-100 ms-3">
                      <div class="w-100 d-flex justify-content-between mb-1">
                        <span class="fs-6">{{ i.product_name }} </span>
                      </div>
                      <div class="d-flex flex-wrap">
                        <el-tag v-for="p in JSON.parse(i.portion_json)" :key="p" type="primary" size="small" class="m-1">
                          {{ p.portion_name }}
                        </el-tag>
                      </div>
                      <el-divider class="my-2"></el-divider>
                      <div class="d-flex">
                        <el-button
                          circle
                          size="large"
                          @click="urunFavori(i, i.favorite != true)"
                          :type="i.favorite == true ? 'primary' : ''"
                          class=""
                        >
                          <i class="bi bi-bookmark fs-5 mb-0" id="urun-favori-button" v-tooltip="'Favori'"></i>
                        </el-button>
                        <el-button circle size="large" id="urun-color-button" class="urun-renk">
                          <el-color-picker v-model="i.color" @change="urunRenk(i)" />
                        </el-button>
                        <el-button circle size="large" class="" @click="(urun_duzenle_visible = true), (edit_data = i)">
                          <i class="bi bi-pen h5 mb-0" v-tooltip="'Düzenle'"></i>
                        </el-button>
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
  </div>
  <kategori-ekle v-model:visible="kategoriEkleVisible" @update:visible="$event == false ? getDatas() : ''"></kategori-ekle>
  <kategori-duzenle
    v-model:visible="kategori_duzenle_visible"
    :edit_data="edit_ktg_data"
    @update:visible="$event == false ? getDatas() : ''"
  ></kategori-duzenle>
  <urun-ekle v-model:visible="urunEkleVisible" @update:visible="$event == false ? getDatas() : ''"></urun-ekle>

  <kategori-sirala
    v-model:visible="kategoriSiralaVisible"
    @update:visible="$event == false ? getDatas() : ''"
  ></kategori-sirala>
  <urun-duzenle
    v-model:visible="urun_duzenle_visible"
    :edit_data="edit_data"
    @update:visible="$event == false ? getDatas() : ''"
  ></urun-duzenle>
  <urun-sirala
    v-model:visible="urun_sirala_visible"
    :ktg_id="active_kategori?.id"
    @update:visible="$event == false ? getDatas() : ''"
  ></urun-sirala>
</template>

<script>
import KategoriDuzenle from "./modals/kategori-duzenle.vue";
import kategoriEkle from "./modals/kategori-ekle.vue";
import KategoriSirala from "./modals/kategori-sirala.vue";
import UrunDuzenle from "./modals/urun-duzenle.vue";
import UrunEkle from "./modals/urun-ekle.vue";
import UrunSirala from "./modals/urun-sirala.vue";

import { ElNotification } from "element-plus";
export default {
  components: { kategoriEkle, UrunEkle, KategoriSirala, UrunDuzenle, UrunSirala, KategoriDuzenle },
  data() {
    return {
      kategoriEkleVisible: false,
      urunEkleVisible: false,
      kategoriSiralaVisible: false,
      urun_duzenle_visible: false,
      urun_sirala_visible: false,
      kategori_duzenle_visible: false,
      edit_data: {},
      edit_ktg_data: {},
      urunler: [],
      kategoriler: [],
      search_urunler: [],
      search_kategoriler: [],
      active_kategori: {},
      load_state: 0,
      loading: true,
      search: "",
      search_list: [],
    };
  },
  watch: {
    load_state(v) {
      if (v == 2) {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.getDatas();
  },
  methods: {
    Ara() {
      this.search_kategoriler = [];
      this.search_urunler = [];
      if (this.search.length > 0) {
        for (const val of Object.values(this.urunler)) {
          if (val.product_name.toLowerCase().search(this.search.toLowerCase()) > -1) this.search_urunler.push(val);
        }
        this.search_kategoriler = [];
        for (const val of Object.values(this.search_urunler)) {
          for (const val2 of Object.values(this.kategoriler)) {
            if (val2.id == val.product_category_id.split("é")[1]) {
              this.search_kategoriler[val2.id] = val2;
              this.active_kategori = val2;
            }
          }
        }
      } else {
        console.log("burdayız");
        this.search_kategoriler = this.kategoriler;
        for (const val of Object.values(this.urunler)) {
          this.search_urunler.push(val);
        }
        this.active_kategori = this.search_kategoriler[0];
      }
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
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
        this.search_kategoriler = res.data.data.records;
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
        this.search_urunler = res.data.data.records;
        this.load_state += 1;
      });
    },
    getImage(img) {
      if (img == null || img == "[]") {
        return null;
      } else {
        return this.imgBaseUrl + JSON.parse(img)[0].destination_path + "s_" + JSON.parse(img)[0].file_name;
        //[{"disk": "ftpServer", "file_name": "Tea-PNG-HD.png", "destination_path": "2022/12/30/"}]
      }
    },
    async urunFavori(data, favori) {
      let params = {
        favorite: favori,
        image_old: [],
      };
      await this.$services.edit("product", data.id).then((res) => {
        params.image_old = res.data.data.record.image;
        this.$services.update("product", data.id, params).then(() => {
          ElNotification({
            title: "Başarılı",
            message: "Favori durumu başarıyla değişti",
            type: "success",
          });
        });
      });

      data.favorite = favori;
    },
    async urunRenk(data) {
      let params = {
        color: data.color,
        image_old: [],
      };
      await this.$services.edit("product", data.id).then((res) => {
        params.image_old = res.data.data.record.image;
        this.$services.update("product", data.id, params).then(() => {
          ElNotification({
            title: "Başarılı",
            message: "Renk başarıyla değişti",
            type: "success",
          });
        });
      });
    },
  },
};
</script>

<style>
.urun-renk .el-color-picker__trigger {
  border: none !important;
}
</style>
