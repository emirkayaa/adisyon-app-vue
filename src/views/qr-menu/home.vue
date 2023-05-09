<template>
  <div v-if="true">
    <!--categories-->
    <div class="categories p-3">
      <div class="w-100 d-flex justify-content-between mb-2">
        <span class="fs-5 fw-bold">Kategoriler</span>
        <router-link
          class="categories-link"
          style="margin-right: 5px"
          :to="'/qr-menu/kategori?c=' + this.$route.query.c.split('#')[0]"
          >Tümünü Gör</router-link
        >
      </div>
      <div class="d-flex overflow-auto pb-2">
        <div v-for="o in search_category" :key="o">
          <router-link
            @click="active_category = o.id"
            :to="'/qr-menu/yemek-listesi?c=' + this.$route.query.c.split('#')[0] + '&k=' + o.id"
          >
            <div class="d-flex justify-content-center">
              <div class="card me-3 text-center m-0 rounded">
                <div class="categories-card">
                  <img
                    class="categori-image"
                    :src="
                      getproductimage(o.image) == null
                        ? 'https://cdn-icons-png.flaticon.com/512/1257/1257114.png'
                        : getproductimage(o.image)
                    "
                    alt="image"
                  />
                  <div class="text-nowrap p-1">
                    <span class="fs-7 fw-bold">{{ o.product_category }}</span>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!--carousel-->
    <div class="px-1 py-2 my-3">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="item in slider" :key="item">
          <img
            :src="
              getproductimage(item.image) == null
                ? 'https://cdn-icons-png.flaticon.com/512/1257/1257114.png'
                : getproductimage(item.image)
            "
            alt=""
          />
        </el-carousel-item>
      </el-carousel>
    </div>

    <!--favoriFood-->

    <div class="favori-food">
      <div class="w-100 d-flex justify-content-between mb-3">
        <span class="fs-5 fw-bold ms-3">Favoriler</span>
        <router-link
          class="categories-link"
          style="margin-right: 20px"
          :to="'/qr-menu/yemek-listesi?c=' + this.$route.query.c.split('#')[0]"
          >Tümünü Gör</router-link
        >
      </div>
      <div class="w-100 overflow-auto">
        <div class="d-flex" style="width: min-content">
          <el-card
            v-for="i in products"
            :key="i"
            class="favori-card mx-1"
            style="width: 150px"
            :body-style="{ padding: '0px' }"
          >
            <img
              :src="
                getproductimage(i.image) == null
                  ? 'https://cdn-icons-png.flaticon.com/512/1257/1257114.png'
                  : getproductimage(i.image)
              "
              style="object-fit: cover; height: 150px; width: 150px"
              class="image"
            />
            <div class="d-flex flex-column justify-content-around" style="padding: 14px">
              <span class="fs-6 fw-bold text-center text-nowrap">{{ i.product_name }}</span>
              <div
                v-for="p in JSON.parse(i.portion_json)"
                :key="p"
                class="d-flex justify-content-between align-items-center mt-2 px-2"
              >
                <template v-if="p.default">
                  <span class="fs-6 fw-bold">{{ p.price }}₺</span>
                  <span class="fs-7 fw-bold" style="color: #979796">{{ p.portion_name }}</span>
                </template>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
  <div v-if="false">
    <div class="w-100 p-2 my-2">
      <el-card>
        <Carousel :settings="settings" :breakpoints="breakpoints">
          <Slide v-for="o in search_category" :key="o">
            <div class="d-flex flex-column m-2 p-4">
              <img
                style="height: 120px; object-fit: cover"
                :src="
                  getproductimage(o.image) == null
                    ? 'https://cdn-icons-png.flaticon.com/512/1257/1257114.png'
                    : getproductimage(o.image)
                "
                alt="image"
              />
              <div class="text-nowrap p-1">
                <span class="fs-7 fw-bold mx-2">{{ o.product_category }}</span>
              </div>
            </div>
          </Slide>

          <template #addons>
            <Navigation />
          </template>
        </Carousel>
      </el-card>
    </div>
    <div class="w-100 p-2 my-2">
      <div class="row">
        <div class="col-6 position-relative p-2" style="height: 150px" v-for="i in products" :key="i">
          <div class="position-absolute" style="width: calc(100% - 20px); z-index: -1">
            <div
              class="position-absolute rounded"
              style="background: rgba(0, 0, 0, 0.3); width: calc(100% - 0px); height: 130px"
            ></div>
            <img
              :src="getproductimage(i.image)"
              style="height: 130px; width: 100%; object-fit: cover"
              alt=""
              class="rounded"
            />
          </div>
          <div class="d-flex justify-content-center text-white align-items-center fs-5 h-100">
            {{ i.product_name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";

export default {
  components: {
    Carousel,
    Slide,

    Navigation,
  },
  data() {
    return {
      settings: {
        itemsToShow: 1,
        snapAlign: "center",
      },
      // breakpoints are mobile first
      // any settings not specified will fallback to the carousel settings
      breakpoints: {
        // 700px and up
        300: {
          itemsToShow: 4,
          snapAlign: "center",
        },
        // 1024 and up
        1024: {
          itemsToShow: 5,
          snapAlign: "start",
        },
      },
      products: {},
      search: "",
      index: 0,
      active_category: 0,
      search_category: [],
      imageurl: "https://adisyon.masahesap.com/uploads/",
      category: {},
      slider: {},
    };
  },
  mounted() {
    this.getData();
    this.getCategory();
    this.getSlider();
    console.log("bura home");
  },
  methods: {
    getproductimage(img) {
      if (img == "[]") return null;
      return this.imageurl + JSON.parse(img)?.[0].destination_path + "s_" + JSON.parse(img)?.[0].file_name;
    },
    getData() {
      const params = {
        limit: 10,
        page: 1,
        sorts: { sort_no: true },
        filters: {
          companies_id: {
            type: 1,
            guiType: "multiselect",
            filter: [this.$route.query.c.split("#")[0]],
          },
          qr_menu: { type: 1, guiType: "boolean", filter: "true" },
          favorite: { type: 1, guiType: "boolean", filter: "true" },
        },
        column_array_id: 202,
        column_array_id_query: 203,
      };

      axios.post("/public/tables/product", { params: JSON.stringify(params) }).then((res) => {
        this.products = res.data.data.records;
      });
    },

    getCategory() {
      const params = {
        limit: 10,
        page: 1,
        sorts: { sort_no: true },
        filters: {
          companies_id: {
            type: 1,
            guiType: "multiselect",
            filter: [this.$route.query.c.split("#")[0]],
          },
          qr_menu: { type: 1, guiType: "boolean", filter: "true" },
        },
        column_array_id: 204,
        column_array_id_query: 205,
      };

      axios.post("/public/tables/product_category", { params: JSON.stringify(params) }).then((res) => {
        this.category = res.data.data.records;
        this.search_category = res.data.data.records;
        this.active_category = this.search_category[0].id;
      });
    },

    getSlider() {
      const params = {
        limit: 10,
        page: 1,
        sorts: {},
        filters: {},
        column_array_id: 206,
        column_array_id_query: 207,
      };

      axios.post("/public/tables/qr_slider", { params: JSON.stringify(params) }).then((res) => {
        this.slider = res.data.data.records;
      });
    },
  },
};
</script>

<style>
.favori-card {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px !important;
}

p {
  margin-top: 0;
  margin-bottom: 0 !important;
}

.categories .card {
  --bs-card-border-radius: 10px 10px 10px 10px;
}

.categori-image {
  width: 150px;
  height: 100px;
  border-radius: 10px 10px 0 0 !important;
}

.categories-link {
  font-size: 16px;
  font-weight: bold;
  color: crimson;
  margin-bottom: 3px;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.favori-name {
  margin-left: 5px;
  font-size: 18px;
  font-weight: bold;
}

.categories .card {
  --bs-card-border-radius: 10px 10px 0 0;
}
</style>
