<template>
  <div class="mains">
    <div class="pulse"></div>
    <el-tabs type="border-card">
      <el-tab-pane v-for="b in bolgeler" :key="b">
        <template #label>
          <span class="h5 custom-tabs-label">
            {{ b.zone }}
          </span>
        </template>
        <div class="p-2 d-flex flex-wrap">
          <template v-for="m in masalar" :key="m">
            <el-card
              v-if="b.zone + 'é' + b.id == m.zone_id"
              :style="{ background: m.color }"
              style="width: 250px; border: 0; height: 140px"
              class="text-center mx-2 my-2 table-cards d-flex justify-content-center position-relative"
              :body-style="{ padding: '0px' }"
              @click="deskClick(m)"
              :class="m.status ? 'bg-danger text-white' : ''"
            >
              <div
                class="position-absolute bottom-0 end-0 m-1"
                :class="masa_adisyon_ids[getadisyonaa(m.id)]?.length > 1 ? 'me-1' : ' me-3'"
                v-if="m.adisyon_id > 0"
              >
                Sipariş No: <span>{{ m.adisyon_id }}</span>
                <i class="bi bi-paperclip fs-3" v-if="masa_adisyon_ids[getadisyonaa(m.id)]?.length > 1"></i>
              </div>
              <div class="position-absolute end-0 m-1 me-3" v-if="masa_adisyon_ids[getadisyonaa(m.id)]?.length > 1">
                <span v-for="bm in masa_adisyon_ids[getadisyonaa(m.id)]" :key="bm">
                  <template v-if="m.id == bm"></template>
                  <template v-else>
                    {{ masalar.find((e) => e.id == bm).table_name }}
                    <el-divider class="mx-1" direction="vertical"></el-divider>
                  </template>
                </span>
              </div>
              <div v-if="masaDegistirVisible && m.status != true" class="change-desk-icons">
                <i v-if="radioValue == m.id" class="bi bi-check2-circle"></i>
                <i v-else class="bi bi-circle"></i>
              </div>
              <div v-if="masaBirlestirVisible && m.status != true" class="change-desk-icons">
                <i v-if="checkedValue.find((e) => e == m.id)" class="bi bi-check2-square"></i>
                <i v-else class="bi bi-square"></i>
              </div>
              <div v-if="adisyon_birlestir_visible && m.status == true" class="change-desk-icons">
                <i v-if="birlestir_value.find((e) => e == m.id)" class="bi bi-check2-square"></i>
                <i v-else class="bi bi-square"></i>
              </div>
              <div class="d-flex flex-column justify-content-center h-100 p-3">
                <div class="h4">{{ m.table_name }}</div>
                <div v-if="m.status" class="my-2 h5">
                  <b>₺{{ m.total ? formatter.format(m.total) : formatter.format(0) }}</b>
                </div>
              </div>
            </el-card>
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div
    v-if="masaDegistirVisible || masaBirlestirVisible || adisyon_birlestir_visible"
    class="position-fixed bottom-0 end-0 m-5"
  >
    <el-button type="warning" size="large" @click="masaAyarlari('iptal')">İptal</el-button>
    <el-button type="primary" size="large" @click="masaAyarlari()">Kaydet</el-button>
  </div>
  <routeButtons v-if="this.getUserData?.user?.user_task_id == 1"></routeButtons>
  <!-- Card'ların -sağ üst- ayarlar dialogu -->
  <el-dialog v-model="menuVisible" :title="masaData.table_name + ' - Hızlı İşlemler'" :width="width" align-center>
    <div class="row justify-content-center" style="user-select: none">
      <el-card class="col-xl-4 col-lg-4 col-md-6 col-sm-12 m-2 modal-card" @click="sipariseGit(masaData)">
        <div class="d-flex flex-column p-4 align-items-center justify-content-center">
          <i class="bi bi-cart3 h2"></i>
          <div class="h6">Sipariş</div>
        </div>
      </el-card>
      <el-card
        class="col-xl-4 col-lg-4 col-md-5 col-sm-12 m-2 modal-card"
        @click="odemeEkrani()"
        :style="yetki == 1 || yetki == 2 || yetki == 6 ? 'cursor:no-drop' : ''"
      >
        <div class="d-flex flex-column p-4 align-items-center justify-content-center">
          <i class="bi bi-wallet h2"></i>
          <div class="h6">Öde</div>
        </div>
      </el-card>
      <el-card
        class="col-xl-4 col-lg-4 col-md-5 col-sm-12 m-2 modal-card"
        @click="hizliOdemeEkrani()"
        :style="yetki == 1 || yetki == 2 || yetki == 6 ? 'cursor:no-drop' : ''"
      >
        <div class="d-flex flex-column p-4 align-items-center justify-content-center">
          <i class="bi bi-credit-card h2"></i>
          <div class="h6">Hızlı Öde</div>
        </div>
      </el-card>
      <el-card class="col-xl-4 col-lg-4 col-md-5 col-sm-12 m-2 modal-card" @click="iptalEt(masaData)">
        <div class="d-flex flex-column p-4 align-items-center justify-content-center">
          <i class="bi bi-escape h2"></i>
          <div class="h6">İptal</div>
        </div>
      </el-card>
      <el-card class="col-xl-4 col-lg-4 col-md-5 col-sm-12 m-2 modal-card" v-yakinda>
        <!-- modal-card class'ı eklenecek -->
        <div class="d-flex flex-column p-4 align-items-center justify-content-center">
          <i class="bi bi-printer h2"></i>
          <div class="h6">Yazdır</div>
        </div>
      </el-card>
      <el-card
        v-if="masa_adisyon_ids[getadisyonaa(masaData.id)]?.length <= 1"
        class="col-xl-4 col-lg-4 col-md-5 col-sm-12 m-2 modal-card"
        @click="
          [
            (masaDegistirVisible = true),
            (menuVisible = false),
            (masaBirlestirVisible = false),
            (checkedValue = []),
            (oncekiMasa = masaData),
          ]
        "
      >
        <div class="d-flex flex-column p-4 align-items-center justify-content-center">
          <i class="bi bi-arrow-return-right h2"></i>
          <div class="h6">Masayı Değiştir</div>
        </div>
      </el-card>
      <el-card
        v-if="masa_adisyon_ids[getadisyonaa(masaData.id)]?.length > 1"
        class="col-xl-4 col-lg-4 col-md-5 col-sm-12 m-2 modal-card"
        @click="masaAyir(masaData)"
      >
        <div class="d-flex flex-column p-4 align-items-center justify-content-center">
          <i class="bi bi-arrows-expand h2"></i>
          <div class="h6">Masayı Ayır</div>
        </div>
      </el-card>
      <el-card
        class="col-xl-4 col-lg-4 col-md-5 col-sm-12 m-2 modal-card"
        @click="
          [
            (masaBirlestirVisible = true),
            (menuVisible = false),
            (masaDegistirVisible = false),
            (radioValue = {}),
            (oncekiMasa = masaData),
          ]
        "
      >
        <div class="d-flex flex-column p-4 align-items-center justify-content-center">
          <i class="bi bi-arrows-collapse h2"></i>
          <div class="h6">Masaları Birleştir</div>
        </div>
      </el-card>
      <el-card class="col-xl-4 col-lg-4 col-md-5 col-sm-12 m-2 modal-card" @click="adisyonBirlestir(masaData)" v-yakinda>
        <div class="d-flex flex-column p-4 align-items-center justify-content-center">
          <i class="bi bi-files h2"></i>
          <div class="h6">Adisyon Birleştir</div>
        </div>
      </el-card>
      <!-- <el-card class="col-xl-3 col-lg-3 col-md-5 col-sm-12 m-2 modal-card" @click="adisyonAktarVisible = true">
        <div class="d-flex flex-column p-4 align-items-center justify-content-center">
          <i class="bi bi-arrow-down-up h2"></i>
          <div class="h6">Adisyon Aktar</div>
        </div>
      </el-card> -->
    </div>
  </el-dialog>

  <pay v-model:visible="odemeVisible" :adisyon_id="masaData.adisyon_id" @pay_it="getMasa(), getBolgeler()"></pay>
  <quick-pay
    v-model:hizliOdemeVisible="hizliOdemeVisible"
    :masaData="masaData"
    @pay_it="getMasa(), getBolgeler()"
  ></quick-pay>
</template>

<script>
import pay from "./modals/pay.vue";
import quickPay from "../tablet/modals/quickPay.vue";
import { Menu } from "@element-plus/icons-vue";
import { mapGetters } from "vuex";
import formatter from "@/angaryos/tools/numberFormatter";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import routeButtons from "@/views/content/tablet/components/route-buttons";
export default {
  components: { pay, quickPay, routeButtons },
  data() {
    return {
      activeTab: "first",
      Menu,
      formatter,
      menuVisible: false,
      odemeVisible: false,
      hizliOdemeVisible: false,
      masaDegistirVisible: false,
      masaBirlestirVisible: false,
      adisyonAktarVisible: false,
      masaAyirVisible: false,
      adisyon_birlestir_visible: false,

      masalar: [],
      bolgeler: [],
      width: 0,
      height: 0,
      masaData: [],
      masaDatas: [],
      adisyonD: [],

      radioValue: {},
      checkedValue: [],
      ayrilacak_masalar: [],
      birlestir_value: [],
      oncekiMasa: {},
      masa_adisyon_ids: {},
      yetki: 0,
    };
  },
  computed: {
    ...mapGetters(["getAdisyonData", "getUserData"]),
  },
  methods: {
    odemeEkrani() {
      let yetki = this.getUserData?.user?.user_task_id;
      if (yetki != 1 && yetki != 2 && yetki != 6) {
        this.odemeVisible = true;
      }
    },
    hizliOdemeEkrani() {
      let yetki = this.getUserData?.user?.user_task_id;
      if (yetki != 1 && yetki != 2 && yetki != 6) {
        this.hizliOdemeVisible = true;
      }
    },
    deskClick(m) {
      if (this.masaDegistirVisible) {
        this.radioValue = m.id;
      } else if (this.masaBirlestirVisible) {
        if (this.checkedValue.find((e) => e == m.id)) {
          this.checkedValue.find((e, k) => {
            if (e == m.id) {
              delete this.checkedValue[k];
            }
          });
          //
        } else {
          this.checkedValue.push(m.id);
        }
      } else if (this.adisyon_birlestir_visible) {
        if (this.birlestir_value.find((e) => e == m.id)) {
          this.birlestir_value.find((e, k) => {
            if (e == m.id) {
              delete this.birlestir_value[k];
            }
          });
        } else {
          this.birlestir_value.push(m.id);
        }
      } else if (this.masaAyirVisible) {
        console.log(m);
      } else if (m.status) {
        this.menuVisible = true;
        this.masaData = m;
      } else {
        this.sipariseGit(m);
      }
    },
    adisyonBirlestir(masaData) {
      masaData;
      /* this.adisyon_birlestir_visible = true;
      this.menuVisible = false;
      this.birlestir_value = [];
      this.birlestir_value.push(masaData.id);
      this.oncekiMasa = masaData; */
    },
    masaAyarlari(i) {
      if (i == "iptal") {
        this.radioValue = null;
        this.checkedValue = [];
        this.masaDegistirVisible = false;
        this.masaBirlestirVisible = false;
      }
      if (this.masaDegistirVisible == true) {
        console.log('asdasdasdasd' + this.oncekiMasa, this.radioValue, this.checkedValue);
        const params = {
          adisyon_id: this.oncekiMasa.adisyon_id,
          status: 1,
          total: this.oncekiMasa.total,
          customer_id: this.oncekiMasa.customer_id,
        };
        this.$services.update("masa", this.radioValue, params).then(() => {
          const params2 = {
            adisyon_id: null,
            status: 0,
            total: 0,
            customer_id: null,
          };
          this.$services.update("masa", this.oncekiMasa.id, params2).then(() => {
            const params3 = { masa_ids: [] };
            params3.masa_ids.push(this.radioValue);
            params3.masa_ids = JSON.stringify(params3.masa_ids);
            this.$services.update("adisyon", this.oncekiMasa.adisyon_id, params3).then(() => {
              this.getMasa();
              this.masaAyarlari("iptal");
            });
          });
        });
      }
      if (this.masaBirlestirVisible == true) {
        this.$services.show("adisyon", this.oncekiMasa.adisyon_id).then((res) => {
          let adisyon = res.data.data.record;
          for (const masa_id of Object.values(this.checkedValue)) {
            const params2 = {
              adisyon_id: this.oncekiMasa.adisyon_id,
              status: 1,
              total: this.oncekiMasa.total,
              customer_id: this.oncekiMasa.customer_id,
            };
            this.$services.update("masa", masa_id, params2);
          }
          for (const masa_id of Object.values(JSON.parse(adisyon.masa_ids))) {
            this.checkedValue.push(masa_id.source);
          }
          let uniqueChars = this.checkedValue.filter((element, index) => {
            return this.checkedValue.indexOf(element) === index;
          });

          const params3 = {
            masa_ids: JSON.stringify(uniqueChars),
          };
          this.$services.update("adisyon", adisyon.id, params3).then(() => {
            this.getMasa();
            this.masaAyarlari("iptal");
          });
        });
      }
      if (this.adisyon_birlestir_visible == true) {
        console.log(this.oncekiMasa);
        console.log(this.birlestir_value);
      }
    },
    sipariseGit(data) {
      if (data.adisyon_id == undefined || data.adisyon_id == null || data.adisyon_id == "")
        this.$router.push("/panel/siparis/0?masa=" + data.id);
      else this.$router.push("/panel/siparis/" + data.adisyon_id + "?masa=" + data.id);
    },
    getBolgeler() {
      const params = {
        limit: 10000,
        page: 1,
        filters: {},
        sorts: { sort_no: true },
      };
      this.$services.list("zone", params).then((res) => {
        this.bolgeler = res.data.data.records;
      });
    },
    getadisyonaa(id) {
      for (const [k, v] of Object.entries(this.masa_adisyon_ids)) {
        if (v.find((e) => e == id)) {
          return k;
        }
      }
    },
    masaAyir(masa) {
      for (const val of Object.values(this.masa_adisyon_ids[masa.adisyon_id])) {
        if (val == masa.id) continue;
        const params2 = {
          adisyon_id: null,
          status: 0,
          total: 0,
          customer_id: null,
        };
        this.$services.update("masa", val, params2);
      }
      const params3 = {
        masa_ids: JSON.stringify([masa.id]),
      };
      this.$services.update("adisyon", masa.adisyon_id, params3).then(() => {
        this.masa_adisyon_ids[masa.adisyon_id] = [masa.id];
        this.menuVisible = false;
        this.getMasa();
        this.masaAyarlari("iptal");
      });
    },
    getMasa() {
      const params = {
        limit: 10000,
        page: 1,
        filters: {},
        sorts: { sort_no: true },
      };
      this.$services.list("masa", params).then((res) => {
        this.masalar = res.data.data.records;
        let adis_id = {};
        for (const val of Object.values(this.masalar)) {
          /*if (val.x_axis > this.width) this.width = val.x_axis;
          if (val.y_axis > this.height) this.height = val.y_axis;*/

          if (val.adisyon_id == null) continue;
          if (adis_id[val.adisyon_id] == undefined) adis_id[val.adisyon_id] = [];
          adis_id[val.adisyon_id].push(val.id);
        }
        this.masa_adisyon_ids = adis_id;
      });
    },
    iptalEt(data) {
      ElMessageBox.confirm("Sipariş iptal edilecektir. Onaylıyor musunuz?", {
        confirmButtonText: "Evet",
        cancelButtonText: "Hayır",
        type: "warning",
      })
        .then(() => {
          let params = {
            order_status_id: 6,
            total: 0,
          };
          this.$services
            .update("adisyon", data?.adisyon_id, params)
            .then((res) => {
              if (res.data.data.message == "success") {
                ElMessage({
                  type: "success",
                  message: "Sipariş iptal edildi.",
                });
                setTimeout(() => {
                  this.$router.go();
                }, 800);
              } else {
                ElNotification({
                  title: "Hata",
                  message: "Sipariş iptal edilirken bir hata oluştu.",
                  type: "error",
                });
              }
            })
            .catch(() => {
              ElNotification({
                title: "Hata",
                message: "Sipariş iptal edilirken bir hata oluştu.",
                type: "error",
              });
            });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "Kapatıldı.",
          });
        });
    },
  },
  watch: {
    radioValue(v) {
      console.log(v);
    },
    menuVisible() {
      this.yetki = this.getUserData?.user?.user_task_id;
    },
  },
  created() {
    this.getMasa();
    this.getBolgeler();
    if (window.innerWidth < 368) {
      this.width = "90%";
    } else if (window.innerWidth < 768) {
      this.width = "80%";
    } else if (window.innerWidth < 992) {
      this.width = "65%";
    } else if (window.innerWidth < 1200) {
      this.width = "55%";
    } else if (window.innerWidth < 1400) {
      this.width = "40%";
    } else {
      this.width = "30%";
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth < 368) {
        this.width = "90%";
      } else if (window.innerWidth < 768) {
        this.width = "80%";
      } else if (window.innerWidth < 992) {
        this.width = "65%";
      } else if (window.innerWidth < 1200) {
        this.width = "55%";
      } else if (window.innerWidth < 1400) {
        this.width = "40%";
      } else {
        this.width = "30%";
      }
    });
  },
};
</script>

<style>
.change-desk-icons {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  font-size: 30px;
}

.modal-card:hover {
  border: 1px solid var(--el-color-primary);
  cursor: pointer;
}

.modal-card div div {
  white-space: nowrap;
}

.modal-card div i {
  color: var(--el-color-primary);
}

.table-cards:hover {
  cursor: pointer;
}

.table-cards {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px !important;
}

.mains .el-tabs__item,
.el-tabs,
.el-tabs__header {
  border-radius: 0 !important;
}

input[type="radio"] {
  border: 0px;
  width: 100%;
  height: 2.4em;
  margin-left: 3rem;
  accent-color: red;
}

input[type="checkbox"] {
  border: 0px;
  width: 100%;
  height: 2.4em;
  margin-left: 3rem;
  accent-color: red;
}

.blobs-container {
  display: flex;
  position: absolute;
  left: 0;
}

.blob {
  border-radius: 50%;
  margin: 10px;
  height: 20px;
  width: 20px;
  transform: scale(1);
  background: white;
  box-shadow: 0 0 0 0 rgba(255, 255, 255, 1);
  animation: pulse-white 2s infinite;
}

@keyframes pulse-white {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}
body > textarea {
  display: none;
}
</style>
