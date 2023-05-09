<template>
  <div class="d-flex justify-content-end mt-3 px-3">
    <el-button type="" @click="(show_odendi = !show_odendi), show_odendi ? this.odenenData() : ''"> Ödenenler</el-button>
  </div>
  <div class="row w-100 ps-2 justify-content-center">
    <div v-if="getUserData.companies?.is_kitchen == true" :class="show_odendi ? 'col-lg-3' : 'col-md-4'" class="col-12">
      <div class="text-center">
        <span>Bekliyor/Hazırlanıyor</span>
        <el-divider></el-divider>
        <div>
          <template v-for="t in this.adisyon" :key="t">
            <el-card v-if="t.order_status_id == 'Bekliyor' || t.order_status_id == 'Hazırlanıyor'" class="mb-3">
              <div class="d-flex flex-column w-100">
                <div class="d-flex justify-content-between w-100">
                  <div>
                    <span class="fs-5 text-danger" v-if="t.adisyon_type_id == 1">Masa Siparişi</span>
                    <span class="fs-5 text-danger" v-if="t.adisyon_type_id == 2">Paket Siparişi</span>
                    <span class="fs-5 text-danger" v-if="t.adisyon_type_id == 3">Self Servis</span>
                    <div class="fs-6">
                      Sipariş No: <span>{{ t.id }}</span>
                    </div>
                  </div>
                  <div>
                    <el-tag type="warning" effect="plain" class="me-3">{{ t.order_status_id }}</el-tag>
                    <el-button type="" plain circle size="large"><i class="bi fs-5 bi-printer"></i></el-button>
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
                            <div class="d-flex">
                              <div class="d-flex justify-content-center align-items-center flex-column">
                                <el-tag size="medium" type="info" class="fs-7">
                                  {{ toHoursAndMinutes((time_now - p.bekliyor) / 1000).h }}:
                                  {{ toHoursAndMinutes((time_now - p.bekliyor) / 1000).m }}:
                                  {{ toHoursAndMinutes((time_now - p.bekliyor) / 1000).s }}
                                </el-tag>
                              </div>
                              <span class="ms-2 fs-6">₺{{ formatter.format(p.product_total) }}</span>
                            </div>
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
          </template>
        </div>
      </div>
    </div>

    <div :class="
      getUserData.companies?.is_kitchen != true
        ? show_odendi
          ? 'col-lg-4'
          : 'col-md-6'
        : show_odendi
          ? 'col-lg-3'
          : 'col-md-4'
    " class="col-12">
      <div class="text-center">
        <span>Sipariş Hazırlandı</span>
        <el-divider></el-divider>
        <div>
          <template v-for="t in this.adisyon" :key="t">
            <el-card v-if="t.order_status_id == 'Sipariş Hazırlandı'" class="mb-3">
              <div class="d-flex flex-column w-100">
                <div class="d-flex justify-content-between w-100">
                  <div>
                    <span class="fs-5 text-danger" v-if="t.adisyon_type_id == 1">Masa Siparişi</span>
                    <span class="fs-5 text-danger" v-if="t.adisyon_type_id == 2">Paket Siparişi</span>
                    <span class="fs-5 text-danger" v-if="t.adisyon_type_id == 3">Self Servis</span>
                    <div class="fs-6">
                      Sipariş No: <span>{{ t.id }}</span>
                    </div>
                  </div>
                  <div>
                    <el-tag type="success" effect="plain" class="me-3">{{ t.order_status_id }}</el-tag>
                    <el-button type="" plain circle size="large"><i class="bi fs-5 bi-printer"></i></el-button>
                  </div>
                </div>
              </div>
              <div class="my-2">
                <div class="demo-collapse">
                  <el-collapse accordion>
                    <el-collapse-item name="1">
                      <template #title>
                        <span>Adisyon</span>
                      </template>
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
                            <div class="d-flex">
                              <div class="d-flex justfiy-content-center align-items-center flex-column">
                                <el-tag size="medium" type="info" class="fs-7">
                                  {{ toHoursAndMinutes((time_now - p.hazirlaniyor) / 1000).h }}:
                                  {{ toHoursAndMinutes((time_now - p.hazirlaniyor) / 1000).m }}:
                                  {{ toHoursAndMinutes((time_now - p.hazirlaniyor) / 1000).s }}
                                </el-tag>
                              </div>
                              <span class="fs-6 ms-2">₺{{ formatter.format(p.product_total) }}</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <div class="d-flex justify-content-start">
                  <el-button @click="$router.push('/panel/siparis/' + t.id + '?selfservis=1')">Siparişe Git</el-button>
                  <el-button @click="orderFastPay(t)">Hızlı Öde</el-button>
                  <el-button @click="orderPaying(t)">Öde</el-button>
                </div>
                <div class="fs-5">
                  Toplam: <span>₺{{ this.formatter.format(t.total) }}</span>
                </div>
              </div>
            </el-card>
          </template>
        </div>
      </div>
    </div>

    <div :class="
      getUserData.companies?.is_kitchen != true
        ? show_odendi
          ? 'col-lg-4'
          : 'col-md-6'
        : show_odendi
          ? 'col-lg-3'
          : 'col-md-4'
    " class="col-12">
      <div class="text-center">
        <span>Kuryede</span>
        <el-divider></el-divider>
        <div>
          <template v-for="t in this.adisyon" :key="t">
            <el-card v-if="t.order_status_id == 'Kuryede'" class="mb-3">
              <div class="d-flex flex-column w-100">
                <div class="d-flex justify-content-between w-100">
                  <div>
                    <span class="fs-5 text-danger" v-if="t.adisyon_type_id == 1">Masa Sipdivşi</span>
                    <span class="fs-5 text-danger" v-if="t.adisyon_type_id == 2">Paket Siparişi</span>
                    <span class="fs-5 text-danger" v-if="t.adisyon_type_id == 3">Self Servis</span>
                    <div class="fs-6">
                      Sipariş No: <span>{{ t.id }}</span>
                    </div>
                  </div>
                  <div>
                    <el-tag type="danger" effect="plain" class="me-3">{{ t.order_status_id }}</el-tag>
                    <el-button type="" plain circle size="large"><i class="bi fs-5 bi-printer"></i></el-button>
                  </div>
                </div>
              </div>
              <div class="my-2">
                <div class="demo-collapse">
                  <el-collapse accordion>
                    <el-collapse-item name="1">
                      <template #title>
                        <span>Adisyon</span>
                      </template>
                      <div>
                        <ul v-if="true">
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
                            <div class="d-flex">
                              <div class="d-flex justfiy-content-center align-items-center flex-column">
                                <el-tag size="medium" type="info" class="fs-7">
                                  {{ toHoursAndMinutes((time_now - p.kuryede) / 1000).h }}:
                                  {{ toHoursAndMinutes((time_now - p.kuryede) / 1000).m }}:
                                  {{ toHoursAndMinutes((time_now - p.kuryede) / 1000).s }}
                                </el-tag>
                              </div>
                              <span class="fs-6 ms-2">₺{{ formatter.format(p.product_total) }}</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <el-button @click="$router.push('/panel/siparis/' + t.id + '?selfservis=1')">Siparişe Git</el-button>
                <div class="d-flex justify-content-end">
                  <el-button @click="orderFastPay(t)">Hızlı Öde</el-button>
                  <el-button @click="orderPaying(t)">Öde</el-button>
                </div>
                <div class="fs-5">
                  Toplam: <span>₺{{ this.formatter.format(t.total) }}</span>
                </div>
              </div>
            </el-card>
          </template>
        </div>
      </div>
    </div>

    <div :class="getUserData.companies?.is_kitchen != true ? 'col-lg-4' : 'col-lg-3'" v-if="show_odendi">
      <div class="text-center">
        <span>Ödendi</span>
        <el-divider></el-divider>
        <div>
          <template v-for="t in this.odenen" :key="t">
            <el-card v-if="t.order_status_id == 'Ödendi'" class="mb-3">
              <div class="d-flex flex-column w-100">
                <div class="d-flex justify-content-between w-100">
                  <div>
                    <span class="fs-5 text-danger" v-if="t.adisyon_type_id == 1">Masa Siparişi</span>
                    <span class="fs-5 text-danger" v-if="t.adisyon_type_id == 2">Paket Siparişi</span>
                    <span class="fs-5 text-danger" v-if="t.adisyon_type_id == 3">Self Servis</span>
                    <div class="fs-6">
                      Sipariş No: <span>{{ t.id }}</span>
                    </div>
                  </div>
                  <div>
                    <el-tag type="warning" effect="plain" class="me-3">{{ t.order_status_id }}</el-tag>
                    <el-button type="" plain circle size="large"><i class="bi fs-5 bi-printer"></i></el-button>
                  </div>
                </div>
              </div>
              <div class="my-2">
                <div class="demo-collapse">
                  <el-collapse accordion>
                    <el-collapse-item name="1">
                      <template #title>
                        <span>Ödenenler</span>
                      </template>
                      <div>
                        <ul v-if="true">
                          <li v-for="p in JSON.parse(t.pay_list)" :key="p"
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
                  Toplam: <span>₺{{ this.formatter.format(this.pay[t.id]) }}</span>
                </div>
              </div>
            </el-card>
          </template>
        </div>
      </div>
    </div>
    <pay v-model:visible="pay_visible" :adisyon_id="masa_data.adisyon_id" @pay_it="adisyondata()">
    </pay>
    <quickPay v-model:hizliOdemeVisible="fast_pay_visible" :masaData="masa_data" @pay_it="adisyondata()"></quickPay>
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
      formatter,
      adisyon: {},
      adisyoniesdata: {},
      show_odendi: false,
      pay_visible: false,
      fast_pay_visible: false,
      time_now: 0,
      odenen: {},
      masa_data: {},
      paylist: {},
      pay: {},
    };
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
  methods: {
    adisyondata() {
      const params = {
        limit: 100,
        page: 1,
        filters: {},
        sorts: { id: true },
        column_array_id: 0,
        column_array_id_query: 0,
      };
      this.$services.list("adisyon", params).then((res) => {
        this.adisyon = res.data.data.records;
      });
    },
    orderPaying(data) {
      this.masa_data = { adisyon_id: data.id };
      this.pay_visible = true;
      console.log(data);
    },
    orderFastPay(data) {
      this.masa_data = { adisyon_id: data.id, table_name: "adisyon", total: data.total };
      this.fast_pay_visible = true;
    },
    odenenData() {
      const params = {
        limit: 100,
        page: 1,
        filters: {},
        sorts: {},
        column_array_id: 0,
        column_array_id_query: 0,
      };
      this.$services.list("paid", params).then((res) => {
        this.odenen = res.data.data.records;
        this.pay = {};
        for (const val of Object.values(res.data.data.records)) {
          if (val.pay_list == null) continue;
          for (const por of Object.values(JSON.parse(val.pay_list))) {
            console.log(val, por.product_name, por.portion_price);
            if (this.pay[val.id] == null) this.pay[val.id] = 0;
            this.pay[val.id] += por.portion_price;
          }
        }
        console.log(this.pay);
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
  mounted() {
    setInterval(() => {
      this.time_now = new Date().getTime();
    }, 1000);
    this.adisyondata();
  },
  components: {
    pay,
    quickPay,
  },
};
</script>

<style></style>
