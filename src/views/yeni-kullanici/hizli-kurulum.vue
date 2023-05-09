<template>
  <div v-show="show" class="hizli-kurulum">
    <div class="d-flex w-100 justify-content-end pe-5 pt-3">
      <el-button size="large" class="cikis-buton ms-2" @click="logOut()" v-tooltip="'Çıkış Yap'">
        <i class="bi bi-door-closed m-0 fs-4"></i>
      </el-button>
    </div>
    {{ active_tab }}
    <div class="container py-5">
      <el-steps :active="active_tab" align-center>
        <el-step @click="pageChange(1)" class="cursor-pointer" title="İşletme Detayları" description="" />
        <el-step @click="pageChange(2)" class="cursor-pointer" title="Çalışma Tipi" description="" />
        <el-step @click="pageChange(3)" class="cursor-pointer" title="Tamamlandı" description="" />
      </el-steps>
      <div class="d-flex flex-column h-100 align-items-center justify-content-center">
        <div v-if="active_tab == 1" class="row py-5">
          <div class="col-12">
            <div class="d-flex flex-column text-center">
              <h1>İşletme Detayları</h1>
              <p>Size özel ayarlar için aşağıdaki bilgilere ihtiyacımız var</p>
            </div>
          </div>
          <div class="col-md-5 d-none d-md-block">
            <img class="w-100" src="/_assets/Coffeeshop.gif" alt="" />
          </div>
          <div class="col-12 col-md-7">
            <div class="d-flex flex-column h-100 justify-content-center">
              <div class="d-flex flex-column position-relative">
                <label for="">İşletme Adı</label>
                <el-input v-model="company.company_name" placeholder="İşletme Adı" size="large"></el-input>
                <label class="mt-2" for="">Sektör</label>
                <inputs :column="create_data?.['sektor_id']" table_name="companies" v-model="company.sektor_id"></inputs>
                <label class="mt-2" for="">Ülkeniz</label>
                <el-input v-model="company.country" placeholder="Ülkeniz" size="large"></el-input>
                <label class="mt-2" for="">Şehriniz</label>
                <el-input v-model="company.city" placeholder="Şehirler" size="large"></el-input>
                <label class="mt-2" for="">Mesai saatleriniz</label>
                <el-time-picker
                  @change="selectedTime()"
                  v-model="time"
                  is-range
                  size="large"
                  class="w-100"
                  range-separator="-"
                  start-placeholder="Gün  Başı"
                  end-placeholder="Gün Sonu"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-if="active_tab == 2" class="row py-5">
          <div class="col-12">
            <div class="d-flex flex-column text-center">
              <h1>Çalışma Tipi</h1>
              <p>Size özel ayarlar için aşağıdaki bilgilere ihtiyacımız var</p>
            </div>
          </div>
          <div class="col-md-5 d-none d-md-block">
            <img class="w-100" src="/_assets/Kitchen.gif" alt="" />
          </div>
          <div class="col-12 col-md-7">
            <div class="d-flex flex-column h-100 justify-content-center">
              <div class="d-flex flex-column position-relative">
                <label for="">Çalışma Tipleri</label>
                <div class="mb-3 d-flex align-items-center justify-content-center w-100 flex-wrap">
                  <el-checkbox v-model="checked[1]" class="calisma-tipi-check" label="Masa siparişi" size="large" border />
                  <el-checkbox v-model="checked[2]" class="calisma-tipi-check" label="QR Menü" size="large" border />
                  <el-checkbox v-model="checked[3]" class="calisma-tipi-check" label="Paket siparişi" size="large" border />
                  <el-checkbox v-model="checked[4]" class="calisma-tipi-check" label="Gel-al siparişi" size="large" border />
                </div>
              </div>
              <div class="d-flex flex-column position-relative">
                <label for="">Ödeme Tipi</label>
                <div class="mb-3 d-flex align-items-center justify-content-center w-100 flex-wrap">
                  <el-checkbox
                    v-for="pt in show_pay_types"
                    :key="pt"
                    v-model="paytp[pt.id]"
                    class="odeme-tipi-check"
                    :label="pt.pay_type"
                    size="large"
                    border
                  />
                </div>
                <el-button @click="showAllPayType()" type="primary" link>Daha fazla...</el-button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="active_tab == 3" class="row py-5">
          <div class="col-12">
            <div class="d-flex flex-column text-center">
              <h1>Tamamlandı</h1>
              <p>Hızlı bir başlangıç için size birkaç veri kaydı yaptık .</p>
            </div>
          </div>
          <div class="col-md-5 d-none d-md-block">
            <img class="w-100" src="/_assets/Cateringservice.gif" alt="" />
          </div>
          <div class="col-12 col-md-7">
            <div class="d-flex flex-column h-100 justify-content-center">
              <ul class="fs-6">
                <li>
                  <label for=""
                    ><span>{{ company.company_name }}</span> tanımlandı.</label
                  >
                </li>
                <li>
                  <label for=""><span>Salon</span> ve <span>Bahçe</span> adında 2 bölge tanımlandı.</label>
                </li>
                <li>
                  <label for="">Bölgelerinize özel 10 adet <span>Masa</span> tanımlandı.</label>
                </li>
                <li>
                  <label for=""
                    ><span>{{ company.sector_id }} </span> sektörüne ait <span>Kategoriler</span> ve
                    <span>Ürünler</span> tanımlandı.
                  </label>
                </li>
                <li>
                  <label for="">(eğer mutfak seçildiyse) Bir adet <span>Mutfak</span> tanımlandı. </label>
                </li>
                <li>
                  <label for=""> Bir adet <span>Cihaz</span> tanımlandı. </label>
                </li>
                <li>
                  <label for=""><span>30 Gün </span> ücretsiz kullanım hakkı tanımlandı. </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="d-flex justify-content-between w-100">
          <div>
            <el-button v-if="active_tab == 2" @click="pageChange(active_tab - 1)" type="primary" plain size="large">
              Önceki</el-button
            >
          </div>

          <div>
            <el-button
              v-if="active_tab == 2 || active_tab == 1"
              @click="pageChange(active_tab + 1)"
              type="primary"
              size="large"
              >Sonraki</el-button
            >
            <el-button v-if="active_tab == 3" @click="add()" type="primary" size="large"> Tamamlandı </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import inputs from "../../angaryos/inputs.vue";
import moment from "moment";
import { ElNotification } from "element-plus";
export default {
  components: { inputs },
  data() {
    return {
      show: false,
      active_tab: 1,
      time: null,
      company: {
        company_name: "",
        sektor_id: null,
        day_start_time: null,
        day_end_time: null,
        work_type_ids: [],
        pay_type_ids: [],
      },
      pay_types: {},
      paytp: {},
      show_pay_types: [],
      checked: {},
      create_data: {},
      percentage: 0,
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
      status: {
        kuver: false,
        garsoniye: false,
        company: false,
        user: false,
        bolge: false,
        masa: false,
        kategori: false,
        urun: false,
        mutfak: false,
        cihaz: false,
      },
      masa_state: 0,
      urun_state: 0,
      yenile: 0,
    };
  },
  computed: {
    ...mapGetters(["userDataChange", "getUserData"]),
  },
  watch: {
    userDataChange() {
      this.companyControl();
    },
    getUserData() {
      this.companyControl();
    },
    masa_state(v) {
      if (v == 20) {
        this.status.masa = true;
        this.percentage += 10;
      }
    },
    urun_state(v) {
      if (v == 9) {
        this.status.urun = true;
        this.percentage += 10;
      }
    },
    percentage(v) {
      if (v == 100) {
        this.$store.dispatch("userDataApi");
        this.show = false;
      }
    },
    yenile(v) {
      if (v == 2) {
        this.$store.dispatch("userDataApi");
      }
    },
    active_tab(v) {
      console.log(v);
      if (v == 3) {
        let paytype = [];
        for (const [key, val] of Object.entries(this.paytp)) {
          if (val) {
            paytype.push(key);
          }
        }
        if (paytype.length <= 0) {
          ElNotification({
            title: "Hata",
            message: "Ödeme türü seçmelisiniz.",
            type: "error",
          });
          setTimeout(() => {
            this.active_tab = 2;
          }, 100);
        }
        let worktype = [];
        for (const [key, val] of Object.entries(this.checked)) {
          if (val) {
            worktype.push(key);
          }
        }
        if (worktype.length <= 0) {
          ElNotification({
            title: "Hata",
            message: "Çalışma tipleri seçmelisiniz.",
            type: "error",
          });
          setTimeout(() => {
            this.active_tab = 2;
          }, 100);
        }
      }
    },
  },
  mounted() {
    if (this.getUserData != undefined) {
      this.companyControl();
    }
  },
  methods: {
    logOut() {
      localStorage.clear();
      window.location.href = "/login";
    },
    companyControl() {
      const comp_id = this.getUserData?.user?.companies_id;
      console.log(this.getUserData);
      if (comp_id == null || comp_id == undefined) {
        this.show = true;
        this.$services.create("companies").then((res) => {
          this.create_data = res.data.data.column_set.column_arrays[0].columns;
        });
        const params = {
          limit: 100,
          page: 1,
          sorts: { id: true },
          filters: {},
        };
        this.$services.list("pay_type", params).then((res) => {
          this.pay_types = res.data.data.records;
          this.show_pay_types = this.pay_types.filter((e) => e.id < 7);
        });
      } else {
        this.show = false;
      }
    },
    pageChange(page) {
      if (page == 2) {
        if (this.company.company_name?.length < 2) {
          ElNotification({
            title: "Dikkat",
            message: "Lütfen işletme adı'nı doldurunuz!",
            type: "warning",
          });
          return;
        }
        if (this.company.sektor_id > 0) {
          this.company;
        } else {
          ElNotification({
            title: "Dikkat",
            message: "Lütfen sektör'ünüzü doldurunuz!",
            type: "warning",
          });
          return;
        }
        if (this.time == null) {
          ElNotification({
            title: "Dikkat",
            message: "Lütfen mesai saatlerinizi doldurunuz!",
            type: "warning",
          });
          return;
        }
      }
      this.company.work_type_ids = [];
      this.company.pay_type_ids = [];
      for (const [key, val] of Object.entries(this.checked)) {
        if (val) this.company.work_type_ids.push(key);
      }
      for (const [key, val] of Object.entries(this.paytp)) {
        if (val) this.company.pay_type_ids.push(key);
      }
      if (page > 0 && page < 4) {
        this.active_tab = page;
      }
    },
    add() {
      this.addCompany();
      //this.addZone();
      //this.addCategories();
      //this.addKitchen();
      //this.addCihaz();
    },

    async addCompany() {
      let params = this.company;
      params.work_type_ids = JSON.stringify(this.company.work_type_ids);
      params.pay_type_ids = JSON.stringify(this.company.pay_type_ids);
      await this.$services.add("companies", params).then((res) => {
        if (res.data.data.message == "success") {
          this.status.company = true;
          this.percentage += 10;
          this.updateUser(res.data.data.id);
          this.addKuverGarsoniye(res.data.data.id);
          this.show = false;
        }
      });
    },
    updateUser(id) {
      const params = {
        companies_id: id,
        email: this.getUserData.user.email,
        name_basic: this.getUserData.user.name_basic,
        surname: this.getUserData.user.surname,
      };
      this.$services.update("users", this.getUserData.user.id, params).then((res) => {
        if (res.data.data.message == "success") {
          this.status.user = true;
          this.percentage += 10;
          this.yenile++;
        }
      });
    },
    addKuverGarsoniye(comp_id) {
      this.$services.add("kuver_settings", {}).then((kuver_res) => {
        if (kuver_res.data.data.message == "success") {
          this.status.kuver = true;
          this.percentage += 10;
          this.$services.add("waiter_settings", {}).then((garsoniye_res) => {
            if (garsoniye_res.data.data.message == "success") {
              this.status.garsoniye = true;
              this.percentage += 10;
              this.$services
                .update("companies", comp_id, {
                  kuver_settings_id: kuver_res.data.data.id,
                  waiter_settings_id: garsoniye_res.data.data.id,
                })
                .then(() => {
                  this.yenile++;
                });
            }
          });
        }
      });
    },
    addZone() {
      this.$services.add("zone", { zone: "Salon" }).then((salon_res) => {
        if (salon_res.data.data.message == "success") {
          this.$services.add("zone", { zone: "Balkon" }).then((balkon_res) => {
            if (balkon_res.data.data.message == "success") {
              this.status.bolge = true;
              this.percentage += 10;
              this.addMasa(salon_res.data.data.id, balkon_res.data.data.id);
            }
          });
        }
      });
    },
    addMasa(id1, id2) {
      for (let i = 1; i <= 10; i++) {
        this.$services.add("masa", { zone_id: id1, table_name: "Masa " + i }).then((masa_res) => {
          if (masa_res.data.data.message == "success") {
            this.masa_state++;
          }
        });
      }
      for (let i = 1; i <= 10; i++) {
        this.$services.add("masa", { zone_id: id2, table_name: "Masa " + i }).then((masa_res) => {
          if (masa_res.data.data.message == "success") {
            this.masa_state++;
          }
        });
      }
    },
    addCategories() {
      this.$services.add("product_category", { product_category: "Sıcak İçecekler" }).then((res) => {
        if (res.data.data.message == "success") {
          this.status.kategori = true;
          this.percentage += 10;
          this.addUrun(res.data.data.id);
        }
      });
    },
    addUrun(ctg_id) {
      this.$services.add("product", { product_category_id: ctg_id, product_name: "Çay" }).then((res) => {
        if (res.data.data.message == "success") {
          this.urun_state++;
        }
      });
      this.$services.add("product", { product_category_id: ctg_id, product_name: "Kuşburnu" }).then((res) => {
        if (res.data.data.message == "success") {
          this.urun_state++;
        }
      });
      this.$services.add("product", { product_category_id: ctg_id, product_name: "Yeşil Çay" }).then((res) => {
        if (res.data.data.message == "success") {
          this.urun_state++;
        }
      });
      this.$services.add("product", { product_category_id: ctg_id, product_name: "Kış Çayı" }).then((res) => {
        if (res.data.data.message == "success") {
          this.urun_state++;
        }
      });
      this.$services.add("product", { product_category_id: ctg_id, product_name: "Türk Kahvesi" }).then((res) => {
        if (res.data.data.message == "success") {
          this.urun_state++;
        }
      });
      this.$services.add("product", { product_category_id: ctg_id, product_name: "Latte" }).then((res) => {
        if (res.data.data.message == "success") {
          this.urun_state++;
        }
      });
      this.$services.add("product", { product_category_id: ctg_id, product_name: "Caffè mocha" }).then((res) => {
        if (res.data.data.message == "success") {
          this.urun_state++;
        }
      });
      this.$services.add("product", { product_category_id: ctg_id, product_name: "Espresso" }).then((res) => {
        if (res.data.data.message == "success") {
          this.urun_state++;
        }
      });
      this.$services.add("product", { product_category_id: ctg_id, product_name: "Caffè Americano" }).then((res) => {
        if (res.data.data.message == "success") {
          this.urun_state++;
        }
      });
    },
    addKitchen() {
      this.$services.add("kitchen_group", { kitchen_group: "Ana Mutfak" }).then((res) => {
        if (res.data.data.message == "success") {
          this.status.mutfak = true;
          this.percentage += 10;
        }
      });
    },
    addCihaz() {
      this.status.cihaz = true;
      this.percentage += 10;
    },
    selectedTime() {
      this.company.day_start_time = moment(this.time[0]).format("hh:mm:ss");
      this.company.day_end_time = moment(this.time[1]).format("hh:mm:ss");
    },
    showAllPayType() {
      this.show_pay_types = this.pay_types;
    },
  },
};
</script>

<style>
.hizli-kurulum {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  z-index: 30;
  overflow: auto;
}
.el-step__title {
  line-height: 20px !important;
}
.calisma-tipi-check {
  margin: 4px !important;
  width: 160px;
}
.odeme-tipi-check {
  margin: 4px !important;
  width: 200px;
}
</style>
