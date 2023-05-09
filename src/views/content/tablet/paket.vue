<template>
  <div class="row w-100 mt-3">
    <div class="col-12 col-md-6 col-xl-5 col-xxl-4 px-4 py-2">
      <div class="d-flex justify-content-between">
        <span class="fs-5"> Kuryeler </span>
        <el-button type="primary" size="large" @click="$router.push('/panel/siparis/0?paket=1')">Sipariş
          Oluştur</el-button>
      </div>
      <el-divider class="mt-1"></el-divider>
      <div class="row w-100">
        <div class="col-12 col-sm-6 col-md-12 col-lg-6 col-xl-6 col-xxl-6 mb-3" v-for="k in kuryeler" :key="k">
          <el-card>
            <div class="d-flex flex-column">
              <span class="fs-5"> {{ k.name_basic }} {{ k.surname }} </span>
              <div class="fs-7">
                Telefon No: <span>{{ k.phone }}</span>
              </div>
              <template v-for="a in adisyonlar" :key="a">
                <template v-if="a.user_ids != null">
                  <template v-if="Object.values(JSON.parse(a.user_ids)).find((e) => e.source == k.id)">
                    <div class="fs-7">
                      Sipariş No: <span>{{ a.id }}</span>
                    </div>
                  </template>
                </template>
              </template>
              <el-tag v-if="Object.values(kurye).find((e) => e == k.id)" type="danger"> Teslimatta</el-tag>
              <el-tag v-else type="success"> Boşta</el-tag>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-6 col-xl-7 col-xxl-8 px-4 py-2">
      <el-tabs v-model="durum">
        <el-tab-pane name="1" :disabled="this.getUserData.companies?.is_kitchen != true">
          <template #label>
            <el-badge :value="this.counts.bekliyorlar">
              <span class="custom-tabs-label"
                v-tooltip="this.getUserData.companies?.is_kitchen != true ? 'Mutfağınız aktif değil' : ''">
                <span>Bekliyor / Hazırlanıyor</span>
              </span>
            </el-badge>
          </template>
          <div class="row">
            <template v-for="t in adisyonlar" :key="t">
              <div class="mb-3 p-1 col-12 col-sm-12 col-md-12 col-xl-6">
                <el-card v-if="t.order_status_id == 'Bekliyor' || t.order_status_id == 'Hazırlanıyor'" class="mb-1">
                  <div class="d-flex flex-column w-100">
                    <div class="d-flex justify-content-between w-100">
                      <div class="fs-6" for="">
                        Sipariş No: <span>{{ t.id }}</span>
                      </div>
                      <div>
                        <el-tag type="warning" effect="plain" class="me-3">{{ t.order_status_id }}</el-tag>
                        <el-button type="" plain circle size="large"><i class="bi bi-printer"></i></el-button>
                      </div>
                    </div>
                  </div>
                  <div class="my-2">
                    <div class="demo-collapse">
                      <el-collapse accordion>
                        <el-collapse-item name="1">
                          <template #title> Adisyon </template>
                          <div>
                            <ul>
                              <li v-for="p in JSON.parse(t.product_info_json)" :key="p"
                                class="d-flex justify-content-between mb-2 pb-1" style="border-bottom: 1px dotted #ddd">
                                <div class="d-flex flex-column">
                                  <span>{{ p.product_count }} - {{ p.portion_name }} {{ p.product_name }}</span>
                                  <div class="d-flex ms-4">
                                    <div class="mx-1" v-for="(pp, k) in p.selected_property_json" :key="pp">
                                      {{ pp
                                      }}<el-divider direction="vertical"
                                        v-if="p.selected_property_json.length - 1 != k"></el-divider>
                                    </div>
                                  </div>
                                </div>
                                <span class="fs-6">₺{{ formatter.format(p.product_total) }}</span>
                              </li>
                            </ul>
                          </div>
                        </el-collapse-item>
                      </el-collapse>
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
        </el-tab-pane>
        <el-tab-pane name="2" class="hazirlandi">
          <template #label>
            <el-badge :value="this.counts.hazirlandi">
              <span class="custom-tabs-label">
                <span>Hazırlandı</span>
              </span>
            </el-badge>
          </template>
          <div class="row">
            <template v-for="t in adisyonlar" :key="t">
              <div class="mb-3 p-1 col-12 col-sm-12 col-md-12 col-xl-6"
                v-if="t.order_status_id.toLowerCase() == 'sipariş hazırlandı'">
                <el-card>
                  <div class="d-flex flex-column w-100">
                    <div class="d-flex justify-content-between w-100">
                      <div class="fs-6" for="">
                        Sipariş No: <span>{{ t.id }}</span>
                      </div>
                      <el-tag type="warning" effect="plain">{{ t.order_status_id }}</el-tag>
                    </div>
                  </div>
                  <div class="my-2">
                    <div class="demo-collapse">
                      <el-collapse accordion>
                        <el-collapse-item name="1">
                          <template #title> Adisyon </template>
                          <div>
                            <ul>
                              <li v-for="p in JSON.parse(t.product_info_json)" :key="p"
                                class="d-flex justify-content-between mb-2 pb-1" style="border-bottom: 1px dotted #ddd">
                                <div class="d-flex flex-column">
                                  <span>{{ p.product_count }} - {{ p.portion_name }} {{ p.product_name }}</span>
                                  <div class="d-flex ms-4">
                                    <div class="mx-1" v-for="(pp, k) in p.selected_property_json" :key="pp">
                                      {{ pp
                                      }}<el-divider direction="vertical"
                                        v-if="p.selected_property_json.length - 1 != k"></el-divider>
                                    </div>
                                  </div>
                                </div>
                                <span class="fs-6">₺{{ formatter.format(p.product_total) }}</span>
                              </li>
                            </ul>
                          </div>
                        </el-collapse-item>
                      </el-collapse>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <el-button @click="$router.push('/panel/siparis/' + t.id + '?selfservis=1')">Siparişe Git</el-button>

                    <div class="fs-5">
                      Toplam: <span>₺{{ this.formatter.format(t.total) }}</span>
                    </div>
                  </div>
                  <div class="d-flex mt-2 justify-content-between align-items-center">
                    <div class="d-flex justify-content-between align-items-center" v-if="!t.customer_id">
                      <span class="fs-5 me-3">Müşteri:</span>
                      <el-select v-model="this.customer_id[t.id]" @change="changeMusteri(t.id)" size="large" clearable>
                        <el-option v-for="item in musteriler" :key="item.id"
                          :label="item.customer_name + ' ' + item.customer_surname" :value="item.id" />
                      </el-select>
                    </div>

                    <div class="d-flex justify-content-center align-items-center" v-if="t.customer_id && !t.user_ids">
                      <span class="fs-5 me-3">Kurye:</span>
                      <el-select v-model="this.kurye[t.id]" @change="changeKurye(t.id)" size="large" clearable>
                        <el-option v-for="item in kuryeler" :key="item.id" :label="item.name_basic + ' ' + item.surname"
                          :value="item.id" />
                      </el-select>
                    </div>
                    <el-button type="primary" v-if="t.user_ids" @click="teslimatacikar(t.id)">Teslimata Çıkar</el-button>
                  </div>
                </el-card>
              </div>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane name="3">
          <template #label>
            <el-badge :value="this.counts.kuryede">
              <span class="custom-tabs-label">
                <span>Teslimatta</span>
              </span>
            </el-badge>
          </template>
          <div class="row">
            <template v-for="t in adisyonlar" :key="t">
              <div class="mb-3 p-1 col-12 col-sm-12 col-md-12 col-xl-6" v-if="t.order_status_id == 'Kuryede'">
                <el-card class="mb-1">
                  <div class="d-flex flex-column w-100">
                    <div class="d-flex justify-content-between w-100">
                      <div class="fs-6" for="">
                        Sipariş No: <span>{{ t.id }}</span>
                      </div>
                      <el-tag type="warning" effect="plain">{{ t.order_status_id }}</el-tag>
                    </div>
                  </div>
                  <div class="my-2">
                    <div class="demo-collapse">
                      <el-collapse accordion>
                        <el-collapse-item name="1">
                          <template #title> Adisyon </template>
                          <div>
                            <ul>
                              <li v-for="p in JSON.parse(t.product_info_json)" :key="p"
                                class="d-flex justify-content-between mb-2 pb-1" style="border-bottom: 1px dotted #ddd">
                                <div class="d-flex flex-column">
                                  <span>{{ p.product_count }} - {{ p.portion_name }} {{ p.product_name }}</span>
                                  <div class="d-flex ms-4">
                                    <div class="mx-1" v-for="(pp, k) in p.selected_property_json" :key="pp">
                                      {{ pp
                                      }}<el-divider direction="vertical"
                                        v-if="p.selected_property_json.length - 1 != k"></el-divider>
                                    </div>
                                  </div>
                                </div>
                                <span class="fs-6">₺{{ formatter.format(p.product_total) }}</span>
                              </li>
                            </ul>
                          </div>
                        </el-collapse-item>
                      </el-collapse>
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
        </el-tab-pane>

        <el-tab-pane name="4">
          <template #label>
            <el-badge :value="this.counts.tamamlandi">
              <span class="custom-tabs-label">
                <span>Tamamlananlar</span>
              </span>
            </el-badge>
          </template>
          <div class="row">
            <template v-for="t in adisyonlar" :key="t">
              <div class="mb-3 p-1 col-12 col-sm-12 col-md-12 col-xl-6">
                <el-card v-if="t.order_status_id == 'Ödendi'" class="mb-1">
                  <div class="d-flex flex-column w-100">
                    <div class="d-flex justify-content-between w-100">
                      <div class="fs-6" for="">
                        Sipariş No: <span>{{ t.id }}</span>
                      </div>
                      <el-tag type="warning" effect="plain">{{ t.order_status_id }}</el-tag>
                    </div>
                  </div>
                  <div class="my-2">
                    <div class="demo-collapse">
                      <el-collapse accordion>
                        <el-collapse-item name="1">
                          <template #title> Adisyon </template>
                          <div>
                            <ul>
                              <li v-for="p in JSON.parse(t.product_info_json)" :key="p"
                                class="d-flex justify-content-between mb-2 pb-1" style="border-bottom: 1px dotted #ddd">
                                <div class="d-flex flex-column">
                                  <span>{{ p.product_count }} - {{ p.portion_name }} {{ p.product_name }}</span>
                                  <div class="d-flex ms-4">
                                    <div class="mx-1" v-for="(pp, k) in p.selected_property_json" :key="pp">
                                      {{ pp
                                      }}<el-divider direction="vertical"
                                        v-if="p.selected_property_json.length - 1 != k"></el-divider>
                                    </div>
                                  </div>
                                </div>
                                <span class="fs-6">₺{{ formatter.format(p.product_total) }}</span>
                              </li>
                            </ul>
                          </div>
                        </el-collapse-item>
                      </el-collapse>
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { ElNotification } from "element-plus";
import formatter from "@/angaryos/tools/numberFormatter";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      durum: "2",
      kuryeler: [],
      adisyonlar: [],
      columns: [],
      musteriler: [],
      kurye: {},
      formatter,
      customer_id: {},
      counts: {
        hazirlandi: 0,
        bekliyorlar: 0,
        kuryede: 0,
        tamamlandi: 0,
      },
    };
  },
  mounted() {
    this.getAdisyon();
    this.getKurye();
    this.getMusteri();
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
  methods: {
    getKurye() {
      const params = {
        page: 1,
        limit: "10",
        sorts: {},
        filters: {
          user_task_id: { type: 1, guiType: "multiselect", filter: ["6"] },
        },
      };
      this.$services.list("users", params).then((res) => {
        this.kuryeler = res.data.data.records;
        console.log(this.kuryeler);
      });
    },
    getMusteri() {
      const params = {
        page: 1,
        limit: "10",
        sorts: {},
        filters: {},
      };
      this.$services.list("customer", params).then((res) => {
        this.musteriler = res.data.data.records;
      });
    },
    getAdisyon() {
      const params = {
        page: 1,
        limit: "10",
        column_array_id: "0",
        column_array_id_query: "0",
        sorts: {},
        filters: {
          adisyon_type_id: { type: 1, guiType: "multiselect", filter: ["2"] },
        },
      };
      this.$services.list("adisyon", params).then((res) => {
        this.adisyonlar = res.data.data.records;
        this.columns = res.data.data.columns;
        this.counts = {
          hazirlandi: 0,
          bekliyorlar: 0,
          kuryede: 0,
          tamamlandi: 0,
        };
        for (const val of Object.values(res.data.data.records)) {
          if (val.order_status_id == "Bekliyor" || val.order_status_id == "Hazırlanıyor") {
            this.counts.bekliyorlar++;
          }
          if (val.order_status_id == "Sipariş Hazırlandı") {
            this.counts.hazirlandi++;
          }
          if (val.order_status_id == "Kuryede") {
            this.counts.kuryede++;
          }
          if (val.order_status_id == "Tamamlandı") {
            this.counts.tamamlandi++;
          }
          if (val.user_ids != null) {
            this.kurye[val.id] = Number(Object.values(JSON.parse(val.user_ids))[0].source);
          } else {
            this.kurye[val.id] = null;
          }
        }
      });
    },

    teslimatacikar(id) {
      const params = {
        order_status_id: 3,
      };
      this.$services.update("adisyon", id, params).then((res) => {
        if (res.data.data.message == "success") {
          ElNotification({
            title: "Başarılı",
            message: "Başarıyla Teslimata Çıkarıldı",
            type: "success",
          });
          this.getKurye();
          this.getAdisyon();
        }
      });
    },

    changeKurye(id) {
      const params = {
        user_ids: JSON.stringify([this.kurye[id]]),
        order_status_id: 3,
      };
      this.$services.update("adisyon", id, params).then((res) => {
        if (res.data.data.message == "success") {
          ElNotification({
            title: "Başarılı",
            message: "Kurye başarıyla atandı",
            type: "success",
          });
          this.getKurye();
          this.getAdisyon();
        }
      });
    },
    changeMusteri(id) {
      const params = {
        customer_id: this.customer_id[id],
      };
      this.$services.update("adisyon", id, params).then((res) => {
        if (res.data.data.message == "success") {
          ElNotification({
            title: "Başarılı",
            message: "Müşteri başarıyla atandı",
            type: "success",
          });
          this.getKurye();
          this.getAdisyon();
        }
      });
    },
  },
};
</script>

<style>
.pasif-kurye {
  background: rgb(240, 249, 235);
}

.aktif-kurye {
  background: rgb(254, 240, 240);
}

.el-badge sup {
  position: inherit !important;
}
</style>
