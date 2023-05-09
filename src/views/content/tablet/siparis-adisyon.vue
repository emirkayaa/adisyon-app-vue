<template>
  <div class="adisyon-wrapper" :class="mobile ? 'mobile-adisyon' : ''" :style="mobile ? '' : 'width: 450px'">
    <el-card
      :style="mobile ? '' : 'max-height: 92vh'"
      style=""
      class="p-0 rounded-0"
      :body-style="mobile ? 'padding:5px;' : ''"
    >
      <div>
        <div class="d-flex justify-content-center align-items-center">
          <template v-if="adisyonies.masa_ids?.[0]?.display != undefined">
            <span v-for="(m, k) in adisyonies.masa_ids" :key="m">
              {{ m.display.split("é")[0] }}
              <span v-if="adisyonies.masa_ids.length - 2 == k" class="mx-1">-</span>
            </span>
          </template>
          <span v-else>{{ desk.table_name }}</span>
        </div>

        <div class="d-flex justify-content-center w-100">
          <el-tabs v-model="activeName" class="w-100 adisyon">
            <el-tab-pane v-for="s in states" :key="s.id" :label="s.name" :name="s.id" class="w-100">
              <div class="d-flex flex-column" v-for="(a, k) in adisyonies.product_info_json" :key="k">
                <template v-if="a.status == s.id">
                  <div class="d-flex justify-content-between my-1">
                    <div class="d-flex w-100">
                      <div
                        class="d-flex flex-column justify-content-center align-items-center me-2"
                        v-if="a.id != 'garsoniye'"
                      >
                        <el-button size="large" @click="buttonChange(1, a, k)" :icon="Plus" circle></el-button>

                        <span class="fs-5 mx-2 product-counter">{{ a?.product_count }}</span>
                        <el-button
                          circle
                          size="large"
                          @click="a?.product_count < 2 ? buttonChange(3, a, k) : buttonChange(2, a, k)"
                          :icon="a?.product_count > 1 ? Minus : Delete"
                        ></el-button>
                      </div>
                      <div class="d-flex align-items-center justify-content-between px-3 w-100">
                        <div class="d-flex flex-column px-1">
                          <span class="fs-6">{{ a?.product_name }}</span>
                          <div class="fs-8">{{ a?.portion_name }} - ₺{{ formatter.format(a?.portion_price) }}</div>
                        </div>
                        <span class="me-1 fs-4">₺{{ formatter.format(a?.product_total) }}</span>
                      </div>
                    </div>

                    <div class="d-flex flex-column justify-content-between">
                      <el-button size="large" class="px-3 ms-0" @click="(ozelliklerVisible = true), (production_key = k)">
                        <i class="bi bi-three-dots-vertical"></i>
                      </el-button>
                      <el-button size="large" class="px-3 ms-0" plain @click="buttonChange(3, a, k)">
                        <i class="bi bi-trash"></i>
                      </el-button>
                    </div>
                  </div>
                  <el-divider class="my-2"></el-divider>
                </template>
              </div>
              <div class="overflow-auto">
                <div v-if="this.kuverJSONies.kuverToplam > 0" class="d-flex justify-content-between my-4">
                  <div class="d-flex">
                    <div class="kuver-sayisi me-2 d-flex justify-content-center align-items-center">
                      {{ this.kuverJSONies.kuverSayisi }}
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <span>Kuver Hizmet</span>
                      <el-tag type="info">₺{{ formatter.format(this.kuverJSONies.kuverTotal) }}</el-tag>
                    </div>
                  </div>
                  <div class="d-flex justify-content-center align-items-center adisyon-buttons">
                    <div class="me-2">₺{{ formatter.format(this.kuverJSONies.kuverToplam) }}</div>
                    <el-button class="me-2" v-tooltip="'Sil'" @click="kuverDelete()"><i class="bi bi-trash"></i></el-button>
                  </div>
                </div>
              </div>
              <div class="overflow-auto">
                <div v-if="this.garsonies.garsoniyeTotal > 0" class="d-flex justify-content-between my-4">
                  <div class="d-flex">
                    <div class="d-flex flex-column justify-content-center">
                      <span>Garsoniye Ücreti</span>
                    </div>
                  </div>
                  <div class="d-flex justify-content-center align-items-center adisyon-buttons">
                    <div v-if="this.garsonies.garsoniyeTipi == 'Yüzde'" class="me-2">
                      %{{ this.garsonies.garsoniyeTotal }}
                    </div>
                    <div v-else class="me-2">₺{{ formatter.format(this.garsonies.garsoniyeTotal) }}</div>
                    <el-button class="me-2" v-tooltip="'Sil'" @click="garsoniyeDelete()"
                      ><i class="bi bi-trash"></i
                    ></el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <el-divider class="my-2"></el-divider>
        <div class="kaydet-btn w-100" style="background: var(--foreground--color)">
          <div class="d-flex justify-content-between pt-3">
            <div>Toplam Tutar</div>
            <div>₺{{ formatter.format(adisyonies.total) }}</div>
          </div>
          <div class="d-flex flex-column" v-loading="button_loading">
            <el-button
              v-show="!mobile"
              class="mx-2 mb-2 py-4"
              size="large"
              type="danger"
              @click="this.$route.params.id > 0 ? adisyonEdit() : adisyonSave()"
              >Kaydet</el-button
            >
            <div class="d-flex justify-content-between">
              <el-button
                v-if="this.$route.params.id != 0"
                class="mx-2 mb-2"
                size="large"
                type="success"
                plain
                @click="odemeVisible = true"
                :disabled="yetki == 1 || yetki == 2"
                >Öde</el-button
              >
              <el-button
                v-if="this.$route.params.id != 0"
                class="mx-2"
                size="large"
                type="warning"
                plain
                @click="hizliOdemeVisible = true"
                :disabled="yetki == 1 || yetki == 2"
                >Hızlı Öde</el-button
              >
              <el-button
                v-if="this.$route.params.id != 0"
                @click="iptalEt(adisyonies)"
                class="mx-2 mb-2"
                size="large"
                plain
                type="info"
              >
                Sipariş İptal
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>

  <order-props
    v-model:ozelliklerVisible="ozelliklerVisible"
    @update:adisyonies="getOzelliklikAdisyon($event)"
    v-model:adisyonies="adisyonies"
    :production_key="production_key"
  ></order-props>

  <pay v-model:visible="odemeVisible" :adisyon_id="adisyon.id"></pay>
  <quick-pay v-model:hizliOdemeVisible="hizliOdemeVisible" :masaData="{ adisyon_id: adisyon.id }"></quick-pay>
</template>

<script>
import orderProps from "./modals/orderProps.vue";
import formatter from "@/angaryos/tools/numberFormatter";
import { Plus, Minus, Delete, ArrowUp, ArrowDown } from "@element-plus/icons-vue";
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import pay from "@/views/content/tablet/modals/pay";
import quickPay from "@/views/content/tablet/modals/quickPay";
import { mapGetters } from "vuex";
export default {
  components: {
    orderProps,
    pay,
    quickPay,
  },
  props: ["adisyon", "desk", "sync", "kuverJSON", "garsoniyeToplam", "mobile"],
  data() {
    return {
      production_key: 0,
      ozelliklerVisible: false,
      odemeVisible: false,
      hizliOdemeVisible: false,
      activeName: 1,
      Minus,
      Plus,
      Delete,
      ArrowUp,
      ArrowDown,
      formatter,
      adisyonies: {},
      masaData: [],
      tutarGoster: false,
      kuverJSONies: {
        kuverToplam: 0,
        kuverSayisi: 0,
        kuverTotal: 0,
      },
      garsonies: 0,
      states: [
        {
          id: 1,
          name: "Beklemede",
        },
        {
          id: 2,
          name: "Hazırlanıyor",
        },
        {
          id: 3,
          name: "Tamamlandı",
        },
      ],
      changeTrack: 0,
      button_loading: false,
      yetki: 0,
    };
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },

  mounted() {
    this.adisyonies = this.adisyon;
    this.yetki = this.getUserData?.user?.user_task_id;
  },
  watch: {
    adisyon(v) {
      this.adisyonies = v;
    },
    adisyonies(v) {
      this.$emit("update:adisyon", v);
    },
    kuverJSON() {
      this.kuverJSONies = this.kuverJSON;
    },
    kuverJSONies() {
      this.$emit("update:kuverJSON", this.kuverJSONies);
    },
    garsoniyeToplam() {
      this.garsonies = this.garsoniyeToplam;
    },
    garsonies() {
      this.$emit("update:garsoniyeToplam", this.garsonies);
    },
    changeTrack() {
      this.toplamGuncelle();
      this.$emit("update:adisyon", this.adisyonies);
    },
    sync() {
      this.toplamGuncelle();
      for (const val of Object.values(this.adisyonies.product_info_json)) {
        console.log(val.status);
        if (val.status == "0") {
          console.log(val);
        }
      }
    },
  },
  methods: {
    iptalEt(data) {
      this.button_loading = true;
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
            .update("adisyon", data?.id, params)
            .then((res) => {
              if (res.data.data.message == "success") {
                ElMessage({
                  type: "success",
                  message: "Sipariş iptal edildi.",
                });
                setTimeout(() => {
                  this.button_loading = false;
                  this.$router.go(-1);
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
          this.button_loading = false;
          ElMessage({
            type: "info",
            message: "Kapatıldı.",
          });
        });
    },
    buttonChange(key, val, k) {
      const prodPortion = JSON.parse(val.prods.portion_json);
      let portion_price =
        this.adisyonies.product_info_json[k].selected_portion_json.price != undefined
          ? this.adisyonies.product_info_json[k].selected_portion_json.price
          : prodPortion.find((e) => e.default == true).price;
      if (key == 1) {
        this.adisyonies.product_info_json[k].remainder_total = 0;
        this.adisyonies.product_info_json[k].product_count += 1;
        this.adisyonies.product_info_json[k].product_total =
          this.adisyonies.product_info_json[k].product_count * portion_price;
        this.adisyonies.product_info_json[k].product_kdv =
          this.adisyonies.product_info_json[k].product_count * (portion_price * ((1 + parseFloat(val.kdv_rate)) / 100));
      } else if (key == 2) {
        this.adisyonies.product_info_json[k].remainder_total = 0;
        this.adisyonies.product_info_json[k].product_count -= 1;
        this.adisyonies.product_info_json[k].product_total =
          this.adisyonies.product_info_json[k].product_count * portion_price;
        this.adisyonies.product_info_json[k].product_kdv =
          this.adisyonies.product_info_json[k].product_count * (portion_price * ((1 + parseFloat(val.kdv_rate)) / 100));
        if (this.adisyonies.product_info_json[k].product_count <= 0) {
          delete this.adisyonies.product_info_json[k];
        }
      } else if (key == 3) {
        this.adisyonies.product_info_json.splice(k, 1);
      }
      this.adisyonies.total = 0;
      this.adisyonies.kdv_total = 0;
      for (let vals of Object.values(this.adisyonies.product_info_json)) {
        this.adisyonies.total = parseFloat(this.adisyonies.total) + parseFloat(vals.product_total);
        this.adisyonies.kdv_total = parseFloat(this.adisyonies.kdv_total) + parseFloat(vals.product_kdv);
      }

      this.changeTrack++;
    },
    adisyonSave() {
      this.button_loading = true;
      for (let val of Object.values(this.adisyonies.product_info_json)) {
        if (!this.adisyonies.product_ids.includes(val.id)) this.adisyonies.product_ids.push(val.id);
        val.bekliyor = new Date().getTime();
        val.kuryede = 0;
        val.hazirlaniyor = 0;
      }
      let masa_ids = this.adisyonies.masa_ids;
      let send_masa = [];
      if (masa_ids?.[0]?.display != undefined) {
        for (const val of Object.values(masa_ids)) {
          send_masa.push(val.source);
        }
      } else {
        send_masa = masa_ids;
      }

      //send_masa == null ? (send_masa = [""]) : (send_masa = JSON.stringify(send_masa));
      console.log("sipariş eklendi", this.adisyonies.order_status_id, this.getUserData.companies?.is_kitchen);
      if (this.adisyonies.order_status_id == 1 && this.getUserData.companies?.is_kitchen != true) {
        //Mutfak yoksa direkt hazırlandı yap
        this.adisyonies.order_status_id = 4;
      }
      let params = {
        adisyon_type_id: this.adisyonies.adisyon_type_id,
        cost_total: this.adisyonies.cost_total, //Maliyet Tutarı
        customer_count: this.adisyonies.customer_count, //müşteri sayısı
        customer_id: this.adisyonies.customer_id, //müşteri
        description: this.adisyonies.description, //sipariş açıklaması
        kdv_total: this.adisyonies.kdv_total, //KDV Tutar
        kuver_settings_id: this.adisyonies.kuver_settings_id, //Kuver Ayarları
        net_total: this.adisyonies.net_total, //Brüt Tutar
        order_status_id: this.adisyonies.order_status_id, //Sipariş Durumu
        product_ids: JSON.stringify(this.adisyonies.product_ids), //Ürünler
        product_info_json: JSON.stringify(this.adisyonies.product_info_json), //Ürün Bilgileri
        received_total: this.adisyonies.received_total, //Tahsil Edilen Tutar
        total: this.adisyonies.total, //Toplam Tutar
        waiter_settings_id: this.adisyonies.waiter_settings_id, //Garsoniye Ayarları
        waiter_total: this.adisyonies.waiter_total, //Garsoniye Ayarları
      };
      if (send_masa != null) params["masa_ids"] = JSON.stringify(send_masa);
      if (params[this.errors] == 1) {
        ElNotification({
          title: "Hata",
          message: "Sipariş Açıklaması yazınız.",
          type: "warning",
        });
      } else {
        this.$services.add("adisyon", params).then((res) => {
          if (res.data.data.message == "success") {
            ElNotification({
              title: "Başarılı",
              message: "Adisyon oluşturuldu.",
              type: "success",
            });
            setTimeout(() => {
              this.button_loading = false;
              this.$router.go(-1);
            }, 800);
          } else if (res.data.data.message == "error") {
            let offsets = 0;
            for (let [key, val] of Object.entries(res.data.data.errors)) {
              this.errors[key] = val[0];
              ElNotification({
                type: "error",
                title: "Hata",
                message: val[0],
                position: "top-left",
                offset: 90 * offsets + 40,
              });
              offsets++;
            }
          } else {
            ElNotification({
              title: "Hata",
              message: "Beklenmedik bir hata oluştu. Daha sonra tekrar deneyiniz.",
              type: "error",
            });
          }
        });
      }
    },
    adisyonEdit() {
      this.button_loading = true;
      for (let val of Object.values(this.adisyonies.product_info_json)) {
        if (val.kuryede == undefined) val.bekliyor = new Date().getTime();
        if (val.bekliyor == undefined) val.kuryede = 0;
        if (val.hazirlaniyor == undefined) val.hazirlaniyor = 0;
      }
      let masa_ids = this.adisyonies.masa_ids;
      let send_masa = [];
      if (masa_ids?.[0]?.display != undefined) {
        for (const val of Object.values(masa_ids)) {
          send_masa.push(val.source);
        }
      } else {
        send_masa = masa_ids;
      }

      send_masa == null ? (send_masa = JSON.stringify([""])) : (send_masa = JSON.stringify(send_masa));
      if (this.adisyonies.order_status_id == 1 && this.getUserData.companies?.is_kitchen != true) {
        //Mutfak yoksa direkt hazırlandı yap
        this.adisyonies.order_status_id = 4;
      }
      let params = {
        cost_total: this.adisyonies.cost_total, //Maliyet Tutarı
        customer_count: this.adisyonies.customer_count, //müşteri sayısı
        customer_id: this.adisyonies.customer_id, //müşteri
        description: this.adisyonies.description, //sipariş açıklaması
        kdv_total: this.adisyonies.kdv_total, //KDV Tutar
        kuver_settings_id: this.adisyonies.kuver_settings_id, //Kuver Ayarları
        net_total: this.adisyonies.net_total, //Brüt Tutar
        order_status_id: this.adisyonies.order_status_id, //Sipariş Durumu
        product_ids: JSON.stringify(this.adisyonies.product_ids), //Ürünler
        product_info_json: JSON.stringify(this.adisyonies.product_info_json), //Ürün Bilgileri
        received_total: this.adisyonies.received_total, //Tahsil Edilen Tutar
        total: this.adisyonies.total, //Toplam Tutar
        waiter_settings_id: this.adisyonies.waiter_settings_id, //Garsoniye Ayarları
        waiter_total: this.adisyonies.waiter_total, //Garsoniye Ayarları
      };
      this.$services.update("adisyon", this.adisyonies.id, params).then((res) => {
        if (res.data.data.message == "success") {
          ElNotification({
            title: "Başarılı",
            message: "Adisyon güncellendi.",
            type: "success",
          });
          setTimeout(() => {
            this.button_loading = false;
            //this.$router.push("/panel/garson");
            this.$router.go(-1);
          }, 800);
        } else if (res.data.data.message == "error") {
          let offsets = 0;
          for (let [key, val] of Object.entries(res.data.data.errors)) {
            this.errors[key] = val[0];
            ElNotification({
              type: "error",
              title: "Hata",
              message: val[0],
              position: "top-left",
              offset: 90 * offsets + 40,
            });
            offsets++;
          }
        } else {
          ElNotification({
            title: "Hata",
            message: "Beklenmedik bir hata oluştu. Daha sonra tekrar deneyiniz.",
            type: "error",
          });
        }
      });
    },
    getOzelliklikAdisyon(e) {
      this.adisyonies = e;
      this.changeTrack++;
    },
    toplamGuncelle() {
      //Adisyon sipariş componentinde değişiklik olduğunda burası tetiklenir
      this.counter = [];
      this.adisyonies.total = 0;
      this.adisyonies.kdv_total = 0;
      for (let vals of Object.values(this.adisyonies.product_info_json)) {
        //toplam ve kdv toplam hesabı
        if (this.counter[vals.id] == undefined) this.counter[vals.id] = 0; //her ürünün sayacını arttırma
        this.counter[vals.id] = this.counter[vals.id] + vals.product_count;
        this.adisyonies.total = parseFloat(this.adisyonies.total) + parseFloat(vals.product_total);
        this.adisyonies.kdv_total = parseFloat(this.adisyonies.kdv_total) + parseFloat(vals.product_kdv);
      }
    },
    kuverDelete() {
      this.kuverJSONies.kuverSayisi = this.kuverJSONies.kuverSayisi - 1;
      this.kuverJSONies.kuverToplam = this.kuverJSONies.kuverTotal * this.kuverJSONies.kuverSayisi;
      this.$emit("update:kuverJSON", this.kuverJSONies);
    },
    garsoniyeDelete() {
      this.garsonies.garsoniyeTotal = 0;
    },
  },
};
</script>

<style>
.adisyon-wrapper .el-tabs__nav-scroll {
  display: flex;
  justify-content: center;
  overflow: hidden;
}

@media only screen and (max-width: 950px) {
  .adisyon-wrapper {
    width: 100% !important;
  }
}

.mobile-adisyon .el-tabs__content {
  height: 100% !important;
}

.adisyon .el-tabs__content {
  height: calc(100vh - 348px);
  overflow-y: auto;
  padding-right: 10px;
}

.product-counter {
  background: var(--foreground--color);
}

.adisyon-buttons .el-button + .el-button {
  margin-left: 0 !important;
}
</style>
