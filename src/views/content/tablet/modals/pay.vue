<template>
  <div>
    <el-dialog class="kurye-dialog" v-model="dialogVisible" width="98%" align-center :show-close="false">
      <template #title>
        <div class="d-flex justify-content-between flex-wrap flex-sm-nowrap">
          <div>
            <span class="fs-4 text-nowrap">{{ title }}</span>
          </div>

          <div class="w-100 d-flex justify-content-end">
            <el-button size="large" plain type="info" v-yakinda class="px-5">Yazdır</el-button>
            <el-button size="large" plain type="success" class="px-5" @click="kaydet()">Kaydet</el-button>
            <el-button size="large" type="danger" @click="closeDialog()">X</el-button>
          </div>
        </div>
      </template>
      <div class="row pay-dialog">
        <div class="col-12 col-md-6 mb-2">
          <el-card>
            <el-tabs v-model="active_adisyon_state" class="h-100">
              <el-tab-pane name="1">
                <template #label>
                  <div class="d-flex justify-content-between align-items-center me-4 w-100">
                    <h5 class="text-danger">Adisyon</h5>
                    <span class="fs-6"> ₺{{ format(toplamlar.odenmemis) }} </span>
                  </div>
                </template>

                <div class="overflow-auto" v-if="odenmemis.length > 0">
                  <div v-for="(odeme, key) in odenmemis" :key="key" class="d-flex flex-column">
                    <div class="d-flex align-items-center justify-content-between my-1" @click="odemeClick(odeme, key)">
                      <span class="">
                        {{ odeme?.product_name }}
                      </span>

                      <div class="d-flex align-items-center">
                        <label class="me-2">
                          {{ odeme?.product_count }} Adet
                          <el-divider direction="vertical"></el-divider>
                          <span class="fs-5">₺{{ format(odeme?.portion_price * odeme?.product_count) }}</span>
                        </label>
                        <el-button size="large"><i class="bi bi-wallet2 fs-5"></i></el-button>
                      </div>
                    </div>
                    <el-divider class="my-1" border-style="dashed"></el-divider>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane name="2">
                <template #label>
                  <div class="d-flex justify-content-between align-items-center me-4 w-100">
                    <h5 class="text-success">Ödeme Listesi</h5>
                    <span class="fs-6"> ₺{{ format(toplamlar.odenmis) }} </span>
                  </div>
                </template>

                <div v-for="(odeme, key) in odenmis" :key="key" class="d-flex flex-column">
                  <div class="d-flex align-items-center justify-content-between my-1">
                    <span v-if="odeme.id > 0" class="">
                      {{ odeme.product_name }}
                    </span>
                    <el-tag v-else size="large" class="fs-5" type="success">{{ odeme.product_name }} </el-tag>

                    <div class="d-flex align-items-center">
                      <label class="me-2" v-if="odeme.id > 0"> {{ odeme.remainder_total }} Adet </label>
                      <el-divider direction="vertical"></el-divider>
                      <div class="d-flex me-2 align-items-center" v-html="getHesaplanmisFiyat(odeme)"></div>
                    </div>
                  </div>
                  <el-divider class="my-1" border-style="dashed"></el-divider>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </div>
        <div class="col-12 col-md-6 mb-2">
          <el-card body-style="height:calc(100vh - 148px)">
            <div style="height: calc(100% - 320px)">
              <div class="d-flex justify-content-between align-items-center me-4 w-100">
                <h4 class="text-warning"></h4>
                <span class="fs-4">
                  Kalan:₺{{ format(toplamlar.adisyon_toplam - toplamlar.odenmis - toplamlar.odeniyor - toplamlar.indirim) }}
                </span>
              </div>
              <div class="overflow-auto" style="height: calc(100% - 40px)">
                <div v-for="(odeme, key) in odeniyor.concat(nakit_list)" :key="key" class="d-flex flex-column">
                  <div class="d-flex align-items-center justify-content-between my-1">
                    <span v-if="odeme.id > 0" class="">
                      {{ odeme.product_name }}
                    </span>
                    <el-tag v-else size="large" class="fs-5" type="success">{{ odeme.product_name }} </el-tag>

                    <div class="d-flex align-items-center">
                      <label class="me-2" v-if="odeme.id > 0"> {{ odeme.remainder_total }} Adet </label>
                      <el-divider direction="vertical"></el-divider>
                      <label
                        for=""
                        class="text-danger me-2"
                        v-if="odeme.indirim?.discount_total"
                        @click="iptalIndirim(odeme)"
                        >İptal</label
                      >
                      <div class="d-flex me-2 align-items-center" v-html="getHesaplanmisFiyat(odeme)"></div>
                      <el-button size="large" v-if="odeme.id > 0" @click="odemeIptalClick(odeme, key)">
                        <i class="bi bi-backspace fs-5"></i>
                      </el-button>
                    </div>
                  </div>

                  <el-divider class="my-1" border-style="dashed"></el-divider>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between fs-5">
              <span>₺{{ format(this.toplamlar.numpad) }}</span>
              <span v-if="this.toplamlar.para_ustu < 0" class="text-danger"
                >Alacak ₺{{ format(this.toplamlar.para_ustu) }}</span
              >
              <span v-else class="text-success">Para üstü ₺{{ format(Math.abs(this.toplamlar.para_ustu)) }}</span>
            </div>
            <div class="d-flex justify-content-center">
              <div
                class="d-flex flex-wrap px-3 pt-1 justify-content-center numpad"
                style="width: 381px; min-width: 383px; height: 290px"
              >
                <template v-for="n in numpad_list" :key="n">
                  <el-button
                    :class="n == 'Öde' || n == 'Tümü' || n == 'İndirim' || n == 'Sil' ? 'uzat-buton' : ''"
                    :type="n == 'Öde' ? 'primary' : ''"
                    @click="numpadClick(n)"
                    >{{ n }}</el-button
                  >
                </template>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </el-dialog>
    <pay_list v-model:visible="pay_list_visible" @type="odemeIslemi($event)"></pay_list>
    <pay_indirim v-model:visible="pay_indirim_visible" @indirim="indirimIslemi($event)"></pay_indirim>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import formatter from "@/angaryos/tools/numberFormatter";
import { ElNotification } from "element-plus";

import pay_list from "@/views/content/tablet/modals/pay_list";
import pay_indirim from "@/views/content/tablet/modals/pay_indirim";
export default {
  props: ["visible", "adisyon_id"],
  components: { pay_list, pay_indirim },
  data() {
    return {
      dialogVisible: false,
      active_adisyon_state: "1",
      width: "",
      title: "",

      adisyon: [],
      odenmemis: [],
      odeniyor: [],
      odenmis: [],

      nakit_list: [],

      odeme_tipleri: [],
      toplamlar: {
        adisyon_toplam: 0,
        odenmemis: 0,
        odeniyor: 0,
        odenmis: 0,
        para_ustu: 0,
        numpad: 0,
        indirim: 0,
      },

      numpad_list: ["7", "8", "9", "Sil", "4", "5", "6", "Tümü", "1", "2", "3", "İndirim", "0", ".", "", "Öde"],

      format: formatter.format,

      pay_list_visible: false,
      pay_indirim_visible: false,
    };
  },
  computed: {
    ...mapGetters(["getCompData"]),
  },
  watch: {
    visible(v) {
      this.dialogVisible = v;
      if (v == true) {
        this.getAdisyon();
        this.getTypes();
      }
    },
    dialogVisible(v) {
      this.$emit("update:visible", v);
    },
  },
  mounted() {},
  methods: {
    getAdisyon() {
      this.$services.edit("adisyon", this.adisyon_id).then((res) => {
        this.adisyon = res.data.data.record;

        this.odenmis = [];
        this.odenmemis = [];
        this.odeniyor = [];

        let odenmis = res.data.data.record.pay_list == null ? "[]" : res.data.data.record.pay_list;
        this.odenmis = Object.values(JSON.parse(odenmis));

        for (const val of Object.values(JSON.parse(this.adisyon.product_info_json))) {
          this.toplamlar.adisyon_toplam += val.product_total;
          this.odenmemis.push(val);
        }
        for (const val of Object.values(this.odenmis)) {
          this.odenmemis.find((e, k) => {
            if (e?.id == val?.id) {
              e.product_count -= 1;
              if (e.product_count == 0) {
                this.odenmemis.splice(k, 1);
              }
            }
          });
        }

        this.toplamHesapla();

        if (this.adisyon.masa_ids.length > 0)
          for (const [k, val] of Object.entries(this.adisyon.masa_ids)) {
            this.title += val.display.split("é")[0];
            if (k < this.adisyon.masa_ids.length - 1) this.title += " - ";
          }
        if (this.adisyon.adisyon_type_id?.[0]?.source == "2") {
          this.title = "Paket Servisi";
        }
        if (this.adisyon.adisyon_type_id?.[0]?.source == "3") {
          this.title = "Self-Servis";
        }
      });
    },
    getTypes() {
      const params = {
        limit: 100,
        page: 1,
        filters: {},
        sorts: { id: true },
      };
      this.$services.list("pay_type", params).then((res) => {
        this.odeme_tipleri = res.data.data.records;
        this.$emit("odeme_tipleri", this.odeme_tipleri);
      });
    },
    odemeClick(odeme, key) {
      if (
        this.toplamlar.adisyon_toplam - this.toplamlar.odenmis - this.toplamlar.odeniyor - this.toplamlar.indirim <
        odeme.portion_price
      ) {
        ElNotification({
          title: "Dikkat",
          message: "Ödeme sınırını aşıyor!",
          type: "warning",
        });
      } else {
        odeme.remainder_total = 1;
        if (odeme.product_count > 1) {
          this.odeniyor.push(odeme);
          this.odenmemis[key].product_count--;
        } else {
          this.odeniyor.push(odeme);
          this.odenmemis.splice(key, 1);
        }
        this.toplamHesapla();
      }
    },
    odemeIptalClick(odeme, key) {
      this.odenmemis.push(odeme);
      this.odeniyor.splice(key, 1);
      this.toplamHesapla();
    },
    toplamHesapla() {
      console.log("ödeniyor", this.odeniyor);
      this.toplamlar = {
        adisyon_toplam: this.toplamlar.adisyon_toplam,
        odenmemis: 0,
        odeniyor: 0,
        odenmis: 0,
        para_ustu: 0,
        numpad: this.toplamlar.numpad,
        indirim: this.toplamlar.indirim,
      };
      for (const val of Object.values(this.odenmemis)) {
        this.toplamlar.odenmemis += val.product_count * val.portion_price;
      }
      for (const val of Object.values(this.odeniyor)) {
        this.toplamlar.odeniyor += val.remainder_total * val.portion_price;
      }
      for (const val of Object.values(this.odenmis)) {
        console.log("odenmis", val);
        this.toplamlar.odenmis += val.remainder_total * val.portion_price;
      }
      this.toplamlar.para_ustu = parseFloat(this.toplamlar.numpad) - this.toplamlar.odeniyor;
      console.log("toplamlar", this.toplamlar);
    },
    odemeIslemi(odeme_id) {
      if (this.odeniyor.length <= 0 && this.toplamlar.para_ustu > 0) {
        if (
          this.toplamlar.adisyon_toplam - this.toplamlar.odenmis - this.toplamlar.odeniyor - this.toplamlar.indirim <
          this.toplamlar.para_ustu
        ) {
          ElNotification({
            title: "Dikkat",
            message: "Ödeme sınırını aşıyor!",
            type: "warning",
          });
        } else {
          this.nakit_list.push({
            product_name: this.odeme_tipleri.find((e) => e.id == odeme_id).pay_type,
            portion_price: this.toplamlar.para_ustu,
            product_count: 1,
            remainder_total: 1,
          });
          this.odenmis.push({
            product_name: this.odeme_tipleri.find((e) => e.id == odeme_id).pay_type,
            portion_price: this.toplamlar.para_ustu,
            product_count: 1,
            remainder_total: 1,
          });
        }
      }
      this.odenmis = this.odenmis.concat(this.odeniyor);
      this.odeniyor = [];

      this.toplamlar.para_ustu = 0;
      this.toplamlar.numpad = 0;
      this.toplamHesapla();
      odeme_id;
    },
    numpadClick(n) {
      if (n == "Sil") {
        if (this.toplamlar.numpad != 0) this.toplamlar.numpad = this.toplamlar.numpad.slice(0, -1);
        if(this.toplamlar.para_ustu == 'NaN') this.toplamlar.para_ustu = 0
        if(this.toplamlar.numpad == '') this.toplamlar.numpad = 0
      } else if (n == "Tümü") {
        for (const [k, v] of Object.entries(this.odenmemis)) {
          k;
          v.remainder_total = v.product_count;
        }
        this.odeniyor = this.odeniyor.concat(this.odenmemis);
        this.odenmemis = [];
      } else if (n == "Öde") {
        this.pay_list_visible = true;
        //this.odemeIslemi(1);
      } else if (n == "İndirim") {
        this.pay_indirim_visible = true;
      } else {
        if (this.toplamlar.numpad == 0) this.toplamlar.numpad = n;
        else this.toplamlar.numpad += n;
      }

      this.toplamHesapla();
    },
    indirimIslemi(indir) {
      for (const val of Object.values(this.odeniyor)) {
        if (val.indirim?.discount_total != undefined) {
          val.indirim = {};
          this.toplamlar.indirim -= val.indirimsiz - val.portion_price;
          val.portion_price = val.indirimsiz;
        }
        val.indirim = indir;
        val.indirimsiz = val.portion_price;
        if (indir?.discount_type_id == "Yüzde (%)") {
          val.portion_price = val.portion_price - val.portion_price / val.indirim?.discount_total;
          this.toplamlar.indirim += val.indirimsiz - val.portion_price;
        } else if (indir?.discount_type_id == "Tutar (₺)") {
          if (val.portion_price - val.indirim?.discount_total < 0) {
            ElNotification({
              title: "Dikkat",
              message: "İndirim ürün fiyatından daha yüksek.",
              type: "warning",
            });
            val.indirim = {};
            val.indirimsiz = val.portion_price;
          } else {
            val.portion_price = val.portion_price - val.indirim?.discount_total;
            this.toplamlar.indirim += val.indirimsiz - val.portion_price;
          }
        }
      }
      console.log("odeniyor", this.odeniyor);

      this.toplamHesapla();
    },
    iptalIndirim(odeme) {
      this.toplamlar.indirim -= odeme.indirimsiz - odeme.portion_price;

      odeme.indirim = {};
      odeme.portion_price = odeme.indirimsiz;
      this.toplamHesapla();
    },
    getHesaplanmisFiyat(odeme) {
      if (odeme.indirim?.discount_type_id == "Yüzde (%)") {
        return (
          "<div class='d-flex flex-column me-1'></strike> <strike>₺" +
          this.format(odeme.indirimsiz) +
          "</strike> " +
          "<span>%" +
          odeme.indirim?.discount_total +
          "</span>" +
          "</div>" +
          "<span class='fs-5'>₺" +
          this.format(odeme.portion_price) +
          "</span>"
        );
      } else if (odeme.indirim?.discount_type_id == "Tutar (₺)") {
        return (
          "<div class='d-flex flex-column me-1'></strike> <strike>₺" +
          this.format(odeme.indirimsiz) +
          "</strike> " +
          "<span>-₺" +
          odeme.indirim?.discount_total +
          "</span>" +
          "</div>" +
          "<span class='fs-5'>₺" +
          this.format(odeme.portion_price) +
          "</span>"
        );
      } else return "<span class='fs-5'>₺" + this.format(odeme.portion_price * odeme.remainder_total) + "</span>";
    },
    kaydet() {
      const toplamlar = this.toplamlar;
      let params = {
        total: toplamlar.adisyon_toplam - toplamlar.odenmis - toplamlar.odeniyor - toplamlar.indirim,
        pay_list: JSON.stringify(this.odenmis),
      };
      toplamlar.adisyon_toplam - toplamlar.odenmis - toplamlar.odeniyor - toplamlar.indirim == 0
        ? (params.order_status_id = 5)
        : "";
      this.$services
        .update("adisyon", this.adisyon?.id, params)
        .then((res) => {
          if (res.data.data.message == "success") {
            ElNotification({
              title: "Başarılı",
              message: "Başarıyla kaydedildi.",
              type: "success",
            });
            if (this.$route.name == "siparisEkrani") this.$router.go(-1);
            this.$emit('pay_it',true)
          } else {
            ElNotification({
              title: "Hata",
              message: "Kaydedilirken bir hata ile karşılaşıldı.",
              type: "error",
            });
          }
        })
        .catch(() => {
          ElNotification({
            title: "Hata",
            message: "Kaydedilirken bir hata ile karşılaşıldı.",
            type: "error",
          });
        });
      this.dialogVisible = false;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style>
@media screen and (max-width: 700px) {
  .numpad .el-button {
    --numpad-button-size: 50px !important;
  }
}
.numpad .el-button {
  --numpad-button-size: 65px;
  margin-left: 0 !important;
  margin: 5px !important;
  width: var(--numpad-button-size) !important;
  height: var(--numpad-button-size) !important;
  font-size: 18px;
}

.numpad .uzat-buton {
  width: 110px !important;
}

.pay-dialog .el-button {
  --pay-dialog-button-size: 50px;
  margin-left: 0 !important;
  margin: 5px !important;
  width: var(--pay-dialog-button-size);
  height: var(--pay-dialog-button-size);
}

.pay-dialog .el-tabs__content {
  height: calc(100vh - 254px);
  overflow-y: auto;
  padding-right: 10px;
}

.kurye-dialog .el-dialog__header {
  margin-right: 0 !important;
}
</style>
