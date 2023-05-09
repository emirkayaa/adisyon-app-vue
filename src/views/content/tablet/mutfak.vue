<template>
  <div class="row h-100 w-100">
    <div class="col-12 col-md-6 p-4">
      <div class="h-100" style="min-height: 500px">
        <div class="d-flex align-items-center">
          <el-badge :value="Object.keys(this.bekliyor).length">
            <span class="fs-5"> Onaylanmamış Siparişler </span>
          </el-badge>
        </div>
        <el-divider class="my-2"></el-divider>
        <template v-for="a in this.bekliyor" :key="a.id">
          <template class="row px-3">
            <el-card class="mb-3">
              <div class="d-flex flex-column w-100">
                <div class="d-flex justify-content-between w-100">
                  <div>
                    <span class="fs-5 text-danger" v-if="a.adisyon.adisyon_type_id == 1">Masa Siparişi</span>
                    <span class="fs-5 text-danger" v-if="a.adisyon.adisyon_type_id == 2">Paket Siparişi</span>
                    <span class="fs-5 text-danger" v-if="a.adisyon.adisyon_type_id == 3">Self Servis</span>
                    <div class="fs-6">
                      Sipariş No: <span>{{ a.adisyon.id }}</span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center">
                    <el-tag type="warning" effect="plain">{{ a.adisyon.order_status_id }}</el-tag>
                    <el-button class="ms-2" size="large" plain circle><i class="bi fs-5 bi-printer"></i></el-button>
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <ul>
                  <li v-for="p in a.urun" :key="p" class="d-flex justify-content-between mb-2 pb-1"
                    style="border-bottom: 1px dotted #ddd">
                    <div class="d-flex flex-column">
                      <span>{{ p.product_count }} - {{ p.product_name }}</span>
                      <div class="d-flex flex-column ms-4">
                        <span> {{ p.portion_name }}</span>
                      </div>
                      <div class="d-flex ms-4">
                        <div class="mx-1" v-for="(pp, k) in p.selected_property_json" :key="pp">
                          {{
                            pp
                          }}<el-divider direction="vertical"
                            v-if="p.selected_property_json.length - 1 != k"></el-divider>
                        </div>
                      </div>
                      <label> {{ p.description }}</label>
                    </div>
                    <div class="d-flex justfiy-content-center align-items-center flex-column">
                      <el-tag size="medium" type="info" class="fs-7">
                        {{ toHoursAndMinutes((time_now - p.bekliyor) / 1000).h }}:
                        {{ toHoursAndMinutes((time_now - p.bekliyor) / 1000).m }}:
                        {{ toHoursAndMinutes((time_now - p.bekliyor) / 1000).s }}
                      </el-tag>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="d-flex justify-content-between">
                <p>{{ a.adisyon.description }}</p>
                <el-button @click="orderChange(a)">Başla</el-button>
              </div>
            </el-card>
          </template>
        </template>
        <el-empty v-if="Object.keys(this.bekliyor).length <= 0" description="Gösterilecek veri bulunamadı."></el-empty>
      </div>
    </div>
    <div class="col-12 col-md-6 p-4">
      <div class="h-100" style="min-height: 500px">
        <div class="d-flex align-items-center">
          <el-badge :value="Object.keys(this.hazirlaniyor).length">
            <span class="fs-5"> Başlanmamış Siparişler</span>
          </el-badge>
        </div>
        <el-divider class="my-2"></el-divider>
        <template v-for="a in this.hazirlaniyor" :key="a.id">
          <template class="row px-3">
            <el-card class="mb-3">
              <div class="d-flex flex-column w-100">
                <div class="d-flex justify-content-between w-100">
                  <div>
                    <span class="fs-5 text-danger" v-if="a.adisyon.adisyon_type_id == 1">Masa Siparişi</span>
                    <span class="fs-5 text-danger" v-if="a.adisyon.adisyon_type_id == 2">Paket Siparişi</span>
                    <span class="fs-5 text-danger" v-if="a.adisyon.adisyon_type_id == 3">Self Servis</span>
                    <div class="fs-6">
                      Sipariş No: <span>{{ a.adisyon.id }}</span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center">
                    <el-tag type="success" effect="plain">{{ a.adisyon.order_status_id }}</el-tag>
                    <el-button class="ms-2" size="large" plain circle><i class="bi fs-5 bi-printer"></i></el-button>
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <ul>
                  <li v-for="p in a.urun" :key="p" class="d-flex justify-content-between mb-2 pb-1"
                    style="border-bottom: 1px dotted #ddd">
                    <div class="d-flex flex-column">
                      <span>{{ p.product_count }} - {{ p.product_name }}</span>
                      <div class="d-flex flex-column ms-4">
                        <span> {{ p.portion_name }}</span>
                      </div>
                      <div class="d-flex ms-4">
                        <div class="mx-1" v-for="(pp, k) in p.selected_property_json" :key="pp">
                          {{ pp }}
                          <el-divider direction="vertical" v-if="p.selected_property_json.length - 1 != k"></el-divider>
                        </div>
                      </div>
                      <label> {{ p.description }}</label>
                    </div>
                    <div class="d-flex justfiy-content-center align-items-center flex-column">
                      <el-tag size="medium" type="info" class="fs-7">
                        {{ toHoursAndMinutes((time_now - p.hazirlaniyor) / 1000).h }}:
                        {{ toHoursAndMinutes((time_now - p.hazirlaniyor) / 1000).m }}:
                        {{ toHoursAndMinutes((time_now - p.hazirlaniyor) / 1000).s }}
                      </el-tag>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="d-flex justify-content-end">
                <el-button @click="orderChange2(a)">Tümü Hazır</el-button>
              </div>
            </el-card>
          </template>
        </template>
        <el-empty v-if="Object.keys(this.hazirlaniyor).length <= 0"
          description="Gösterilecek veri bulunamadı."></el-empty>
      </div>
    </div>
  </div>

  <route-buttons v-if="this.getUserData?.user?.user_task_id == 2"></route-buttons>
</template>

<script>
import moment from "moment";
import formatter from "@/angaryos/tools/numberFormatter";
import routeButtons from "./components/route-buttons.vue";
import { mapGetters } from "vuex";
export default {
  components: { routeButtons },
  data() {
    return {
      formatter,
      adisyonData: [],
      time_now: 0,
      product_info_json: [],
      bekliyor: {},
      hazirlaniyor: {},
      onaylanmamis: [],
      baslanmamis: [],
    };
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
  mounted() {
    setInterval(() => {
      this.time_now = new Date().getTime();
    }, 1000);
    this.getAdisyon();
  },
  methods: {
    moment,
    getAdisyon() {
      const params = {
        page: 1,
        limit: 10000,
        filters: {},
        sorts: {},
      };
      this.$services.list("adisyon", params).then((res) => {
        this.adisyonData = res.data.data.records;
        this.hazirlaniyor = {};
        this.bekliyor = {};
        for (const val of Object.values(res.data.data.records)) {
          for (const prod of Object.values(JSON.parse(val.product_info_json))) {
            if (prod.status == "1") {
              if (this.bekliyor[val.id] == undefined) this.bekliyor[val.id] = [];
              this.bekliyor[val.id]["adisyon"] = val;
              if (this.bekliyor[val.id]["urun"] == undefined) this.bekliyor[val.id]["urun"] = [];
              this.bekliyor[val.id]["urun"].push(prod);
            }
            if (prod.status == "2") {
              if (this.hazirlaniyor[val.id] == undefined) this.hazirlaniyor[val.id] = [];
              this.hazirlaniyor[val.id]["adisyon"] = val;
              if (this.hazirlaniyor[val.id]["urun"] == undefined) this.hazirlaniyor[val.id]["urun"] = [];
              this.hazirlaniyor[val.id]["urun"].push(prod);
            }
          }
        }
        console.log(this.bekliyor, this.hazirlaniyor);
      });
    },
    foodChange(a, p, k) {
      let val = a.adisyon;
      let products = JSON.parse(val.product_info_json);
      for (let [key, value] of Object.entries(products)) {
        if (key == k && value.id == p.id) {
          value.status = "3";
        }
      }
      console.log(products);
      const params = {
        product_info_json: JSON.stringify(products),
      };
      this.$services.update("adisyon", val.id, params).then((res) => {
        res;
        this.getAdisyon();
      });
    },

    orderChange(a) {
      let val = a.adisyon;
      let products = JSON.parse(val.product_info_json);
      for (let value of Object.values(products)) {
        if (a.urun.find((e) => e.id == value.id)) {
          value.status = "2";
          value.hazirlaniyor = new Date().getTime();
        }
      }
      console.log(products);
      const params = {
        order_status_id: 2,
        product_info_json: JSON.stringify(products),
      };

      this.$services.update("adisyon", val.id, params).then((res) => {
        res;
        this.getAdisyon();
      });
    },
    orderChange2(a) {
      let val = a.adisyon;
      let products = JSON.parse(val.product_info_json);
      for (let value of Object.values(products)) {
        if (a.urun.find((e) => e.id == value.id)) {
          value.status = "3";
        }
      }
      console.log(products);
      const params = {
        order_status_id: 4,
        product_info_json: JSON.stringify(products),
      };

      this.$services.update("adisyon", val.id, params).then((res) => {
        res;
        this.getAdisyon();
      });
    },
    toHoursAndMinutes(totalSeconds) {
      let totalMinutes = Math.floor(totalSeconds / 60);

      let seconds = totalSeconds % 60;
      let hours = Math.floor(totalMinutes / 60);
      let minutes = totalMinutes % 60;

      seconds = Math.floor(seconds) < 10 ? "0" + Math.floor(seconds) : Math.floor(seconds);
      minutes = Math.floor(minutes) < 10 ? "0" + Math.floor(minutes) : Math.floor(minutes);
      hours = Math.floor(hours) < 10 ? "0" + Math.floor(hours) : Math.floor(hours);
      return { h: hours, m: minutes, s: seconds };
    },
  },
  created() {
    this.getAdisyon();
  },
  watch: {
    orderChange() {
      this.getAdisyon();
    },
    orderChange2() {
      this.getAdisyon();
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap");

.el-card__body .el-divider--horizontal {
  border-top: 1px solid #e3e5eb !important;
}

.el-card {
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important;
}

.second-card {
  height: 350px;
  overflow: auto;
}

.first-card {
  max-height: 350px;
  overflow: auto;
}

.user-text {
  font-family: "Quicksand", sans-serif;
  font-weight: 500;
  color: #929292;
}

.user-title {
  font-family: "Quicksand", sans-serif;
  font-weight: 700;
}

.food-piece {
  background: var(--foreground--color);
}
</style>
