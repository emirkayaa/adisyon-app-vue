<template>
  <div class="h-100 w-100">
    <div class="d-flex align-items-center justify-content-between p-2">
      <div class="d-flex align-items-center">
        <span class="fs-5 m-0">Teslimatlarınız</span>
      </div>
      <!-- Sağ menü tuşları-->
      <div class="d-flex justify-content-end align-items-center pe-2">
        <!-- Tema değiştirici -->
        <el-button size="large" class="ms-2 p-4" circle plain @click="themeChange()" v-tooltip="'Tema Ayarı'">
          <i v-if="this.themeColor != 'dark'" class="bi bi-brightness-high text-warning fs-4 m-0 bolder"></i>
          <i v-else class="bi bi-moon text-info m-0 fs-4 m-0"></i>
        </el-button>
        <!-- Tema değiştirici -->

        <el-button size="large" class="cikis-buton ms-2 p-4" circle @click="logOut()" v-tooltip="'Çıkış Yap'">
          <i class="bi bi-door-closed m-0 fs-4"></i>
        </el-button>
        <!-- Ekran Kilidi -->
      </div>
    </div>
    <el-divider class="my-2"></el-divider>

    <template v-for="a in adisyonData" :key="a.id">
      <div class="px-3 w-100">
        <el-card class="mb-3">
          <div class="d-flex flex-column w-100">
            <div class="d-flex justify-content-between w-100">
              <div>
                <div class="fs-6">
                  Sipariş No: <span>{{ a.id }}</span>
                </div>
              </div>
              <div class="d-flex align-items-center">
                <el-button class="ms-2" size="large" plain circle><i class="bi fs-5 bi-printer"></i></el-button>
              </div>
            </div>
          </div>

          <div class="d-flex flex-column mb-1" v-if="musteri[a.id]">
            <span class="fs-5">Müşteri bilgileri</span>
            <div>
              <span>{{ musteri[a.id].customer_name }} {{ musteri[a.id].customer_surname }}</span>
            </div>
            <a :href="'tel:' + musteri[a.id].phone">Ara: {{ musteri[a.id].phone }}</a>
            <p>{{ musteri[a.id].address_detail }}</p>
          </div>

          <div class="mt-2">
            <el-collapse>
              <el-collapse-item title="Harita" v-if="musteri[a.id]?.address_detail">
                <iframe
                  style="width: 100%; border: 0"
                  height="450"
                  loading="lazy"
                  allowfullscreen
                  referrerpolicy="no-referrer-when-downgrade"
                  :src="
                    'https://www.google.com/maps/embed/v1/place?key=AIzaSyDzwhF836Nxj1QUf_0wFNhA4NCrIwxCAyE&q=' +
                    musteri[a.id].address_detail.replace(' ', '%20')
                  "
                >
                </iframe>
              </el-collapse-item>
              <el-collapse-item title="Sipariş Bilgileri">
                <ul>
                  <li
                    v-for="p in JSON.parse(a.product_info_json)"
                    :key="p"
                    class="d-flex justify-content-between mb-2 pb-1"
                    style="border-bottom: 1px dotted #ddd"
                  >
                    <div class="d-flex flex-column">
                      <span>{{ p.product_count }} - {{ p.product_name }}</span>
                      <div class="d-flex flex-column ms-4">
                        <span> {{ p.portion_name }}</span>
                      </div>
                      <div class="d-flex ms-4">
                        <div class="mx-1" v-for="(pp, k) in p.selected_property_json" :key="pp">
                          {{ pp
                          }}<el-divider direction="vertical" v-if="p.selected_property_json.length - 1 != k"></el-divider>
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
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="d-flex justify-content-between mt-2">
            <p>{{ a.description }}</p>
            <div>
              <el-button @click="(odeme_visible = true), (odenecek_id = a.id)">Ödeme</el-button>
              <el-button @click="quickOdeme(a)">Hızlı Ödeme</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </template>

    <el-empty v-if="Object.keys(adisyonData).length <= 0" description="Gösterilecek veri bulunamadı."></el-empty>

    <pay v-model:visible="odeme_visible" :adisyon_id="odenecek_id"></pay>
    <quick-pay :hizliOdemeVisible="quick_odeme_visible" :masaData="masa_data"></quick-pay>
  </div>
</template>

<script>
import moment from "moment";
import formatter from "@/angaryos/tools/numberFormatter";
import quickPay from "../content/tablet/modals/quickPay.vue";
import pay from "@/views/content/tablet/modals/pay";
import $ from "jquery";
export default {
  components: { quickPay, pay },
  data() {
    return {
      formatter,
      adisyonData: [],
      time_now: 0,
      product_info_json: [],
      musteri: {},
      masa_data: {},
      odeme_visible: false,
      quick_odeme_visible: false,
      odenecek_id: 0,
      themeColor: null,
    };
  },
  mounted() {
    setInterval(() => {
      this.time_now = new Date().getTime();
    }, 1000);
    this.getAdisyon();
    this.loadTheme();
  },
  methods: {
    moment,
    quickOdeme(a) {
      this.masa_data = { adisyon_id: a.id, table_name: "Paket", total: a.total };
      this.quick_odeme_visible = true;
    },
    getAdisyon() {
      const params = {
        page: 1,
        limit: 10000,
        filters: { order_status_id: { type: 1, guiType: "multiselect", filter: ["3"] } },
        sorts: {},
      };
      this.$services.list("adisyon", params).then((res) => {
        this.adisyonData = res.data.data.records;
        for (const val of Object.values(this.adisyonData)) {
          this.$services.show("customer", val.customer_id.split("é")[1]).then((res) => {
            this.musteri[val.id] = res.data.data.record;
          });
        }
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
    themeChange() {
      this.themeColor = localStorage.getItem("theme");

      if (this.themeColor == "light") {
        localStorage.setItem("theme", "dark");
        $("html").removeClass("light");
        $("html").addClass("dark");
        $("#theme-c").attr("content", "rgb(30,32,34)");
        this.themeColor = "dark";
      } else {
        localStorage.setItem("theme", "light");
        $("html").removeClass("dark");
        $("html").addClass("light");
        $("#theme-c").attr("content", "rgb(250,250,250)");
        this.themeColor = "light";
      }
    },
    loadTheme() {
      this.themeColor = localStorage.getItem("theme");
      if (this.themeColor == "dark") {
        $("html").removeClass("light");
        $("html").addClass("dark");
      } else {
        $("html").removeClass("dark");
        $("html").addClass("light");
      }
      this.$emit("themeChange", this.themeColor);
    },
    logOut() {
      localStorage.setItem("cikis", "true");
      this.$store.dispatch("logOut");
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
