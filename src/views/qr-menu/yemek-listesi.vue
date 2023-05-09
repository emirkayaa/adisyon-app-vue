<template>
  <div>
    <!--categories-->
    <div class="categories p-3">
      <div class="w-100 d-flex justify-content-between mb-2">
        <p class="fs-5 fw-bold">Kategoriler</p>
        <router-link
          class="categories-link"
          style="margin-right: 5px"
          :to="'/qr-menu/kategori?c=' + this.$route.query.c.split('#')[0]"
          >Tümünü Gör</router-link
        >
      </div>
      <div class="d-flex overflow-auto pb-2">
        <div v-for="o in category" :key="o">
          <div class="d-flex justify-content-center" @click="active_category = o.id">
            <div class="card me-3 text-center m-0 rounded">
              <div class="categories-card" :class="active_category == o.id ? 'bg-secondary text-light rounded ' : ''">
                <img
                  :src="
                    getproductimage(o.image) == null
                      ? 'https://cdn-icons-png.flaticon.com/512/1257/1257114.png'
                      : getproductimage(o.image)
                  "
                  class="categori-image"
                />
                <div class="text-nowrap p-1">
                  <span class="fw-bold">{{ o.product_category }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--product-->
    <div class="d-flex justify-content-between px-4" style="margin-top: 15px">
      <router-link class="categories-back" :to="'/qr-menu?c=' + this.$route.query.c.split('#')[0]"
        ><i class="bi bi-arrow-left-square fs-5"></i
      ></router-link>
      <h4 style="color: crimson" class="text-center categories-title fw-bold">Yemek Listesi</h4>
    </div>

    <div>
      <div class="d-flex justify-content-end me-3">
        <i @click="selectType(0)" :class="iconIndex == 0 ? 'activeIcon' : ''" class="bi bi-list me-2 fs-5"></i>
        <i @click="selectType(1)" :class="iconIndex == 1 ? 'activeIcon ' : ''" class="bi bi-grid fs-5"></i>
      </div>
    </div>

    <div v-if="iconIndex == 0">
      <template v-for="i in search_list" :key="i">
        <el-card class="mb-3 mx-3 p-2" v-if="active_category == i.product_category_id.split('é')[1]">
          <div class="d-flex justify-content-between food-list">
            <div class="d-flex">
              <div>
                <img
                  class="food-image rounded"
                  :src="
                    getproductimage(i.image) == null
                      ? 'https://cdn-icons-png.flaticon.com/512/1257/1257114.png'
                      : getproductimage(i.image)
                  "
                  alt="image"
                />
              </div>
              <div v-for="p in JSON.parse(i.portion_json)" :key="p" class="d-flex flex-column justify-content-between px-2">
                <template v-if="p.default">
                  <p class="fs-7 fw-bold">{{ i.product_name }}</p>
                  <span class="fs-7 fw-bold" style="color: #979796">{{ p.portion_name }}</span>
                  <span class="fs-6 fw-bold">{{ p.price }}₺</span>
                </template>
              </div>
            </div>
          </div>
        </el-card>
      </template>
    </div>

    <div class="row justify-content-center" style="--bs-gutter-x: 0" v-if="iconIndex == 1">
      <template v-for="i in search_list" :key="i">
        <el-card
          class="mb-4 col-5 mx-2"
          style="width: 150px !important; height: 250px"
          v-if="active_category == i.product_category_id.split('é')[1]"
        >
          <div>
            <div>
              <div>
                <img
                  style="object-fit: cover; height: 150px; width: 150px"
                  class="food-images"
                  :src="
                    getproductimage(i.image) == null
                      ? 'https://cdn-icons-png.flaticon.com/512/1257/1257114.png'
                      : getproductimage(i.image)
                  "
                  alt="yemek"
                />
              </div>
              <div class="text-center">
                <p class="fs-7 fw-bold py-2">{{ i.product_name }}</p>
              </div>
              <div
                v-for="p in JSON.parse(i.portion_json)"
                :key="p"
                class="d-flex justify-content-around align-items-center mt-2 px-1"
              >
                <template v-if="p.default">
                  <span class="fs-6 fw-bold">{{ p.price }}₺</span>
                  <span class="fs-7 fw-bold text-nowrap" style="color: #979796">{{ p.portion_name }}</span>
                </template>
              </div>
            </div>
          </div>
        </el-card>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      foodIndex: 0,
      index: 0,
      iconIndex: 0,
      miktar: {},
      products: [],
      search_list: [],
      search_category: [],
      category: [],
      imageurl: 'https://adisyon.masahesap.com/uploads/',
      active_category: 0
    };
  },
  methods: {
    getData() {
      console.log(this.$route.query.c.split("#")[0]);
      let params = {
        limit: 1000,
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
        column_array_id: 202,
        column_array_id_query: 203,
      };
      axios.post("/public/tables/product", { params: JSON.stringify(params) }).then((res) => {
        this.products = res.data.data.records;
        this.search_list = res.data.data.records;
        this.search(this.$route);
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
        this.active_category = this.$route.query.k;
        console.log(this.active_category);
      });
    },
    selectType(val) {
      console.log(val);
      this.iconIndex = val;
    },

    getproductimage(img) {
      if (img == "[]") return null;

      return this.imageurl + JSON.parse(img)?.[0].destination_path + "s_" + JSON.parse(img)?.[0].file_name;
    },

    search(val) {
      if (val.query.ara != undefined) {
        this.search_list = [];
        this.search_category = [];
        var ara = val.query.ara;
        for (const val of Object.values(this.products)) {
          if (val.product_name.toLowerCase().search(ara.toLowerCase()) > -1) this.search_list.push(val);
        }
        for (const urun of Object.values(this.search_list)) {
          for (const ctg of Object.values(this.category)) {
            if (urun.product_category_id.split("é")[1] == ctg.id) this.search_category.push(ctg);
          }
        }
        this.active_category = this.search_category[0]?.id;
      }
    },
  },
  mounted() {
    console.log(this.$route);
    this.getData();

    this.getCategory();
  },
  watch: {
    $route(val) {
      console.log("watch");
      this.search(val);
    },
  },
};
</script>

<style>
.activeIcon {
  color: wheat;
}

.categori-image {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px 5px 0 0;
}

.food-image {
  width: 70px;
  height: 70px;
}

.food-images {
  border-radius: 10px 10px 0 0;
}

.food-list-wrapper {
  border-radius: 5px;
}

.el-card__body {
  padding: 0;
}

.el-card.is-always-shadow {
  /* box-shadow: var(--el-box-shadow-light); */
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.categories-link {
  font-size: 16px;
  font-weight: bold;
  color: crimson;
  margin-bottom: 3px;
}

.categories-back {
  color: crimson;
}
</style>
