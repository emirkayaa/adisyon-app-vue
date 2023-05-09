<template>
  <div class="row w-100 mt-3">
    <div class="col-12 col-md-6 col-xl-7 col-xxl-8 px-4 py-2" v-if="this.getUserData.companies?.is_kitchen == true">
      <div class="d-flex justify-content-between">
        <el-badge :value="this.counts.bekliyor">
          <span class="fs-5">Bekliyor / Hazırlanıyor</span>
        </el-badge>
        <el-button type="danger" size="large" plain @click="$router.push('/panel/siparis/0?selfservis=1')">Sipariş
          Oluştur</el-button>
      </div>
      <el-divider class="mt-1"></el-divider>
      <div class="row">
        <template v-for="t in adisyonlar" :key="t">
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6"
            v-if="t.order_status_id == 'Bekliyor' || t.order_status_id == 'Hazırlanıyor'">
            <el-card class="mb-3">
              <div class="d-flex flex-column w-100">
                <div class="d-flex justify-content-between w-100">
                  <div class="fs-6" for="">
                    Sipariş No: <span>{{ t.id }}</span>
                  </div>
                  <el-tag type="warning" effect="plain">{{ t.order_status_id }}</el-tag>
                </div>
              </div>
              <div class="mt-3">
                <div v-for="p in JSON.parse(t.product_info_json)" :key="p"
                  class="d-flex justify-content-between ms-2 mb-2 pb-1" style="border-bottom: 1px dotted #ddd">
                  <div class="d-flex flex-column">
                    <span>{{ p.product_count }} - {{ p.portion_name }} {{ p.product_name }}</span>
                    <div class="d-flex ms-4">
                      <div class="mx-1" v-for="(pp, k) in p.selected_property_json" :key="pp">
                        {{ pp
                        }}<el-divider direction="vertical" v-if="p.selected_property_json.length - 1 != k"></el-divider>
                      </div>
                    </div>
                  </div>
                  <span class="fs-6">₺{{ formatter.format(p.product_total) }}</span>
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <el-button @click="$router.push('/panel/siparis/' + t.id + '?selfservis=1')">Siparişe Git</el-button>
                <div class="fs-5">
                  Toplam: <span>₺{{ this.formatter.format(t.total) }}</span>
                </div>
              </div>
            </el-card>
          </div>
        </template>
      </div>
    </div>
    <div :class="this.getUserData.companies?.is_kitchen == true ? 'col-xl-5 col-xxl-4' : 'col-xl-12'"
      class="col-12 col-md-6 px-4 py-2">
      <div class="d-flex justify-content-between align-items-center">
        <el-badge :value="this.counts.tamamlananlar">
          <span class="fs-5">Tamamlananlar</span>
        </el-badge>
        <el-button v-if="this.getUserData.companies?.is_kitchen != true" type="danger" size="large" plain
          @click="$router.push('/panel/siparis/0?selfservis=1')">Sipariş Oluştur</el-button>
      </div>
      <el-divider class="mt-1"></el-divider>
      <div class="row w-100">
        <template v-for="t in adisyonlar" :key="t">
          <div class="col-12" v-if="t.order_status_id == 'Sipariş Hazırlandı'">
            <el-card class="mb-3">
              <div class="d-flex flex-column w-100">
                <div class="d-flex justify-content-between w-100">
                  <div class="fs-6" for="">
                    Sipariş No: <span>{{ t.id }}</span>
                  </div>
                  <el-tag type="success" effect="plain">{{ t.order_status_id }}</el-tag>
                </div>
              </div>
              <div class="mt-3">
                <div v-for="p in JSON.parse(t.product_info_json)" :key="p"
                  class="d-flex justify-content-between ms-2 mb-2 pb-1" style="border-bottom: 1px dotted #ddd">
                  <div class="d-flex flex-column">
                    <span>{{ p.product_count }} - {{ p.portion_name }} {{ p.product_name }}</span>
                    <div class="d-flex ms-4">
                      <div class="mx-1" v-for="(pp, k) in p.selected_property_json" :key="pp">
                        {{ pp
                        }}<el-divider direction="vertical" v-if="p.selected_property_json.length - 1 != k"></el-divider>
                      </div>
                    </div>
                  </div>
                  <span class="fs-6">₺{{ formatter.format(p.product_total) }}</span>
                </div>
              </div>
              <div class="d-flex flex-column">
                <div class="fs-5 d-flex justify-content-between">
                  <el-button @click="$router.push('/panel/siparis/' + t.id + '?selfservis=1')">Siparişe Git</el-button>
                  <div>
                    <label for="">Toplam:</label> <span>₺{{ this.formatter.format(t.total) }}</span>
                  </div>
                </div>
                <el-divider class="my-2"></el-divider>
                <div class="d-flex justify-content-end">
                  <el-button @click="orderFastPay(t)">Hızlı Öde</el-button>
                  <el-button @click="orderPaying(t)">Öde</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </template>
      </div>
    </div>
    <pay v-model:visible="pay_visible" :adisyon_id="masa_data.adisyon_id" :masaData="masa_data" @pay_it="getAdisyon()">
    </pay>
    <quickPay v-model:hizliOdemeVisible="fast_pay_visible" :masaData="masa_data" @pay_it="getAdisyon()"></quickPay>
  </div>
</template>

<script>
import formatter from "@/angaryos/tools/numberFormatter";
import pay from "@/views/content/tablet/modals/pay";
import quickPay from "@/views/content/tablet/modals/quickPay";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      durum: "1",
      adisyonlar: [],
      columns: [],
      formatter,
      masa_data: {},
      pay_visible: false,
      fast_pay_visible: false,
      counts: {
        bekliyor: 0,
        tamamlananlar: 0,
      },
    };
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
  mounted() {
    this.getAdisyon();
  },
  methods: {
    getAdisyon() {
      const params = {
        page: 1,
        limit: "10",
        column_array_id: "0",
        column_array_id_query: "0",
        sorts: {},
        filters: {
          adisyon_type_id: { type: 1, guiType: "multiselect", filter: ["3"] },
        },
      };
      this.$services.list("adisyon", params).then((res) => {
        this.adisyonlar = res.data.data.records;
        this.columns = res.data.data.columns;
        this.counts = {
          bekliyor: 0,
          tamamlananlar: 0,
        };
        for (const val of Object.values(res.data.data.records)) {
          if (val.order_status_id == "Bekliyor" || val.order_status_id == "Hazırlanıyor") {
            this.counts.bekliyor++;
          }
          if (val.order_status_id == "Tamamlandı") {
            this.counts.tamamlananlar++;
          }
        }
      });
    },
    orderPaying(data) {
      console.log(data);
      this.masa_data = { adisyon_id: data.id, table_name: "Self Servis" };
      this.pay_visible = true;
    },
    orderFastPay(data) {
      this.masa_data = { adisyon_id: data.id, table_name: "Self Servis", total: data.total };
      this.fast_pay_visible = true;
    },
  },
  components: {
    pay,
    quickPay,
  },
};
</script>

<style></style>
