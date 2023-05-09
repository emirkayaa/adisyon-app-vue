<template>
  <div>
    <div class="d-flex justify-content-between mx-3" style="margin-top: 15px">
      <router-link style="font-weight: bold" class="categories-back" :to="'/qr-menu?c=' + this.$route.query.c.split('#')[0]"
        ><i class="bi bi-arrow-left-square"></i
      ></router-link>
      <h4 class="text-center categories-title">Kategoriler</h4>
    </div>

    <div class="row justify-content-center px-4">
      <div class="col-6 px-1" v-for="o in search_category" :key="o">
        <div class="d-flex justify-content-center card-wrapper">
          <div class="card mt-2">
            <div class="categories-card" @click="active_category = o.id">
              <router-link :to="'/qr-menu/yemek-listesi?c=' + this.$route.query.c.split('#')[0] + '&k=' + o.id">
                <img
                  :src="
                    getproductimage(o.image) == null
                      ? 'https://cdn-icons-png.flaticon.com/512/1257/1257114.png'
                      : getproductimage(o.image)
                  "
                  class="categories-image"
                />
              </router-link>
              <div class="p-1">
                <span style="font-size: 17px; font-weight: bold; color: coral">{{ o.product_category }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      search_category: [],
      category: [],
      active_category: 0,
      imageurl: 'https://adisyon.masahesap.com/uploads/',
    }
  },
  mounted() {
    this.getCategory();
    console.log("bura home");
  },
  methods: {
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
      });
    },
    getproductimage(img) {
      if (img == null) return;
      if (img == "[]") return null;

      return this.imageurl + JSON.parse(img)?.[0].destination_path + "s_" + JSON.parse(img)?.[0].file_name;
    },
  },
};
</script>

<style>
.categories-card {
  text-align: center;
  margin: 0;
}

.categories-image {
  width: 160px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
}

.categories-back {
  margin-left: 12px;
  font-size: 24px;
  color: crimson;
}

.categories-title {
  margin-right: 10px;
  font-weight: bold;
  color: crimson;
  font-family: Arial, Helvetica, sans-serif;
}

.card {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}
</style>
