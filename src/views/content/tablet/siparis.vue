<template>
  <div class="fs-5 position-relative" v-if="width > 900">
    <!--Sipariş ekranı header-->
    <div class="order-container d-flex flex-wrap flex-md-nowrap">
      <el-button @click="geriDon()" class="px-3">
        <div class="d-flex flex-column">
          <i class="bi bi-arrow-left"></i>
          Geri Dön
        </div>
      </el-button>
      <el-button class="px-3" v-yakinda>
        <div class="d-flex flex-column">
          <i class="bi bi-printer"></i>
          Yazdır
        </div>
      </el-button>
      <el-button v-if="this.adisyonies.customer_id > 0" type="danger" @click="musteriSecVisible = true" class="px-3">
        <div class="d-flex flex-column">
          <i class="bi bi-person-check-fill"></i>
          Müşteri
        </div>
      </el-button>
      <el-button v-else class="px-3" @click="musteriSecVisible = true">
        <div class="d-flex flex-column">
          <i class="bi bi-person"></i>
          Müşteri
        </div>
      </el-button>
      <el-input v-model="searching" @keyup="Search()" class="fs-5" style="height: 74px" placeholder="Ara..." />
      <el-button @click="misafirlerVisible = true" class="px-3">
        <div class="d-flex flex-column">
          <div>
            <i class="bi bi-people"></i><span class="fs-6 ms-1">{{ this.adisyonies.customer_count }}</span>
          </div>
          Misafir
        </div>
      </el-button>
      <el-button @click="siparisAciklamaVisible = true" class="px-3">
        <div class="d-flex flex-column">
          <i class="bi bi-card-text"></i>
          Açıklama
        </div>
      </el-button>
      <el-button @click="kuvers()" class="px-4">
        <div class="d-flex flex-column text-center">
          <i class="mdi mdi-account-star-outline"></i>
          Kuver
        </div>
      </el-button>
      <el-button @click="garsoniyes()" class="px-3">
        <div class="d-flex flex-column">
          <i class="bi bi-cash"></i>
          Garsoniye
        </div>
      </el-button>
    </div>
    <!--Sipariş ekranı header-->
    <!--Sipariş ekranı -->
    <div class="d-flex w-100 siparis-ekrani">
      <!--Üürnler -->
      <div class="urunler-panel">
        <el-tabs v-model="active_kategori" type="border-card" style="height: 90vh; overflow: auto">
          <el-tab-pane v-if="width < 1100" label="Favori Ürünler">
            <div class="row w-100 overflow-auto">
              <template v-for="p in product" :key="p">
                <template v-if="p.favorite == true">
                  <div class="col-6 col-sm-4 col-md-4 col-xl-3 col-xxl-2 pb-3">
                    <el-card
                      class="position-relative h-100 cursor-pointer"
                      style="user-select: none"
                      @click="productAdd(p)"
                      :body-style="{ padding: 0 }"
                    >
                      <!--Ürün rengi-->
                      <div
                        class="position-absolute w-100 h-100 top-0 start-0"
                        :style="{ background: p.color }"
                        style="opacity: 0.1"
                      ></div>
                      <!--Ürün rengi-->
                      <!--Ürün Sayacı-->
                      <div v-if="this.counter[p.id] > 0" class="position-absolute bottom-0 end-0 counter-tag">
                        <el-tag size="large" type="primary" effect="dark" class="fs-5 p-2 mb-0">
                          {{ this.counter[p.id] }}
                        </el-tag>
                      </div>
                      <!--Ürün Sayacı-->
                      <div class="d-flex flex-column w-100">
                        <!--Ürün Resmi-->
                        <div style="height: 120px">
                          <el-image fit="cover" :src="getImages(p.image)" style="width: 100%; height: 120px">
                            <template #placeholder>
                              <div class="image-slot">Loading<span class="dot">...</span></div>
                            </template>
                          </el-image>
                        </div>
                        <!--Ürün resmi-->
                        <div
                          style="height: 92px"
                          class="d-flex justify-content-between align-items-center position-relative"
                        >
                          <div class="d-flex flex-column h-100 w-100 justify-content-around p-2">
                            <div class="ellipsis-1">{{ p.product_name }}</div>
                            <div class="fs-6 fw-bold">
                              ₺{{ formatter.format(JSON.parse(p.portion_json).find((e) => e.default == true).price) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </template>
              </template>
            </div>
          </el-tab-pane>
          <template v-for="c in categories" :key="c.id">
            <el-tab-pane :label="c?.product_category" :name="c.id">
              <div class="row w-100">
                <template v-for="p in product" :key="p">
                  <div
                    class="col-6 col-sm-4 col-md-6 col-xl-4 col-xxl-3 pb-3"
                    v-if="c?.product_category + 'é' + c?.id == p.product_category_id"
                  >
                    <el-card
                      class="position-relative h-100 cursor-pointer"
                      style="user-select: none"
                      @click="productAdd(p)"
                      :body-style="{ padding: 0 }"
                    >
                      <!--Ürün rengi-->
                      <div
                        class="position-absolute w-100 h-100 top-0 start-0"
                        :style="{ background: p.color }"
                        style="opacity: 0.1"
                      ></div>
                      <!--Ürün rengi-->
                      <!--Ürün Sayacı-->
                      <div v-if="this.counter[p.id] > 0" class="position-absolute bottom-0 end-0 counter-tag">
                        <el-tag size="large" type="primary" effect="dark" class="fs-5 p-2 mb-0">
                          {{ this.counter[p.id] }}
                        </el-tag>
                      </div>
                      <!--Ürün Sayacı-->
                      <div class="d-flex flex-column w-100">
                        <!--Ürün Resmi-->
                        <div style="height: 120px">
                          <el-card v-if="getImages(p.image) == null" style="width: 100%; height: 120px">
                            Resim bulunamadı
                          </el-card>
                          <el-image v-else fit="cover" :src="getImages(p.image)" style="width: 100%; height: 120px">
                            <template #placeholder>
                              <div class="image-slot">Loading<span class="dot">...</span></div>
                            </template>
                          </el-image>
                        </div>
                        <!--Ürün resmi-->
                        <div
                          style="height: 92px"
                          class="d-flex justify-content-between align-items-center position-relative"
                        >
                          <div class="d-flex flex-column h-100 w-100 justify-content-around p-2">
                            <div class="ellipsis-1">{{ p.product_name }}</div>
                            <div class="fs-6 fw-bold">
                              ₺{{ formatter.format(JSON.parse(p.portion_json).find((e) => e.default == true).price) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </template>
              </div>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
      <!--Favori Ürünler -->
      <div class="favori-wrapper">
        <div class="favs-header d-flex flex-column align-items-center justify-content-center">
          <div class="text-center text-danger h6">Favori Ürünler</div>
        </div>
        <div
          class="d-flex flex-column px-2 py-2 overflow-auto text-center"
          style="height: calc(100vh - 125px); width: 195px; overflow-x: hidden"
        >
          <template v-for="f in favs" :key="f">
            <div style="width: 170px" class="mb-1">
              <el-card class="mb-2 h-100 position-relative cursor-pointer" style="user-select: none" @click="productAdd(f)">
                <!--Ürün rengi-->
                <div
                  class="position-absolute w-100 h-100 top-0 start-0"
                  :style="{ background: f.color }"
                  style="opacity: 0.1"
                ></div>
                <!--Ürün rengi-->
                <span class="ellipsis-1">{{ f.product_name }}</span>
              </el-card>
            </div>
          </template>
        </div>
      </div>
      <adisyon
        v-model:adisyon="adisyonies"
        v-model:sync="senkron"
        @update:adisyon="updateAdisyon($event)"
        :desk="desk"
        v-model:kuverJSON="kuverJSON"
        v-model:garsoniyeToplam="garsoniyeToplam"
      />
    </div>

    <order-props
      v-model:ozelliklerVisible="ozelliklerVisible"
      @update:adisyonies="getOzelliklikAdisyon($event)"
      v-model:adisyonies="adisyonies"
      :production_key="production_key"
    ></order-props>
    <customer-select v-model:musteriSecVisible="musteriSecVisible" v-model:adisyonies="adisyonies"></customer-select>
    <guests v-model:misafirlerVisible="misafirlerVisible" v-model:adisyonies="adisyonies"></guests>
    <order-desc v-model:siparisAciklamaVisible="siparisAciklamaVisible" v-model:adisyonies="adisyonies"></order-desc>
  </div>
  <div v-else class="d-flex postion-relative flex-column justify-content-between mobil-siparis-ekrani">
    <div>
      <div v-show="mobile_active_tab == 'siparis'" class="urunler">
        <el-tabs v-model="active_kategori" type="border-card">
          <template v-for="c in categories" :key="c.id">
            <el-tab-pane :label="c?.product_category" :name="c.id">
              <div class="row w-100 mx-0">
                <template v-for="p in product" :key="p">
                  <div
                    class="col-6 col-sm-4 col-md-6 col-xl-4 col-xxl-3 pb-3"
                    v-if="c?.product_category + 'é' + c?.id == p.product_category_id"
                  >
                    <el-card
                      class="position-relative h-100 cursor-pointer"
                      style="user-select: none"
                      @click="productAdd(p)"
                      :body-style="{ padding: 0 }"
                    >
                      <!--Ürün rengi-->
                      <div
                        class="position-absolute w-100 h-100 top-0 start-0"
                        :style="{ background: p.color }"
                        style="opacity: 0.1"
                      ></div>
                      <!--Ürün rengi-->
                      <!--Ürün Sayacı-->
                      <div v-if="this.counter[p.id] > 0" class="position-absolute bottom-0 end-0 counter-tag">
                        <el-tag size="large" type="primary" effect="dark" class="fs-5 p-2 mb-0">
                          {{ this.counter[p.id] }}
                        </el-tag>
                      </div>
                      <!--Ürün Sayacı-->
                      <div class="d-flex flex-column w-100">
                        <!--Ürün Resmi-->
                        <div style="height: 120px">
                          <el-card v-if="getImages(p.image) == null" style="width: 100%; height: 120px">
                            Resim bulunamadı
                          </el-card>
                          <el-image v-else fit="cover" :src="getImages(p.image)" style="width: 100%; height: 120px">
                            <template #placeholder>
                              <div class="image-slot">Loading<span class="dot">...</span></div>
                            </template>
                          </el-image>
                        </div>
                        <!--Ürün resmi-->
                        <div
                          style="height: 92px"
                          class="d-flex justify-content-between align-items-center position-relative"
                        >
                          <div class="d-flex flex-column h-100 w-100 justify-content-around p-2">
                            <div class="ellipsis-1">{{ p.product_name }}</div>
                            <div class="fs-6 fw-bold">
                              ₺{{ formatter.format(JSON.parse(p.portion_json).find((e) => e.default == true).price) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </template>
              </div>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
      <div v-show="mobile_active_tab == 'musteri'">
        <div class="overflow-auto" style="height: 85vh !important">
          <div class="row mx-0 p-3">
            <span class="fs-5 m-2">Müşteri Sayısı</span>
            <div class="d-flex ekle-butons justify-content-center align-items-center mb-4 mobile-siparis-bottom">
              <el-button size="large" type="info" plain @click="adisyonies.customer_count--">-</el-button>
              <el-input v-model="adisyonies.customer_count" input-style="height: 60px" />
              <el-button type="info " size="large" plain @click="adisyonies.customer_count++">+</el-button>
            </div>
            <el-divider></el-divider>
            <span class="fs-5 m-2">Müşteri</span>
            <inputs
              :column="{
                id: 237,
                name: 'customer_id',
                display_name: 'Müşteri',
                gui_type_name: 'select',
                column_table_relation_id: 80,
                relation: {
                  table_name: 'customer',
                  source_column_name: 'id',
                },
              }"
              v-model="adisyonies.customer_id"
              table_name="adisyon"
              :column_settings="{ select: ['edit', 'create'] }"
            >
            </inputs>
            <el-divider></el-divider>
            <el-button-group class="fs-5 w-100 justify-content-center d-flex">
              <el-button @click="kuvers()" class="px-4 h-100">
                <div class="d-flex fs-4 flex-column text-center">
                  <i class="mdi fs-1 mdi-account-star-outline"></i>
                  Kuver Ekle
                </div>
              </el-button>
              <el-button @click="garsoniyes()" class="px-3 h-100">
                <div class="d-flex flex-column fs-4">
                  <i class="bi bi-cash fs-1"></i>
                  Garsoniye Ekle
                </div>
              </el-button>
            </el-button-group>
            <el-divider></el-divider>
            <span class="fs-5 m-2">Sipariş Notu</span>
            <el-input
              v-model="adisyonies.description"
              :autosize="{ minRows: 3, maxRows: 10 }"
              type="textarea"
              placeholder="Sipariş Notu"
              show-word-limit
              maxlength="100"
            />
          </div>
        </div>
      </div>
      <div v-show="mobile_active_tab == 'favori'">
        <div class="row w-100 mx-0 px-3 pt-3 overflow-auto" style="height: 85vh">
          <template v-for="p in product" :key="p">
            <template v-if="p.favorite == true">
              <div class="col-6 col-sm-4 col-md-4 col-xl-3 col-xxl-2 pb-3">
                <el-card
                  class="position-relative h-100 cursor-pointer"
                  style="user-select: none"
                  @click="productAdd(p)"
                  :body-style="{ padding: 0 }"
                >
                  <!--Ürün rengi-->
                  <div
                    class="position-absolute w-100 h-100 top-0 start-0"
                    :style="{ background: p.color }"
                    style="opacity: 0.1"
                  ></div>
                  <!--Ürün rengi-->
                  <!--Ürün Sayacı-->
                  <div v-if="this.counter[p.id] > 0" class="position-absolute bottom-0 end-0 counter-tag">
                    <el-tag size="large" type="primary" effect="dark" class="fs-5 p-2 mb-0">
                      {{ this.counter[p.id] }}
                    </el-tag>
                  </div>
                  <!--Ürün Sayacı-->
                  <div class="d-flex flex-column w-100">
                    <!--Ürün Resmi-->
                    <div style="height: 120px">
                      <el-image fit="cover" :src="getImages(p.image)" style="width: 100%; height: 120px">
                        <template #placeholder>
                          <div class="image-slot">Loading<span class="dot">...</span></div>
                        </template>
                      </el-image>
                    </div>
                    <!--Ürün resmi-->
                    <div style="height: 92px" class="d-flex justify-content-between align-items-center position-relative">
                      <div class="d-flex flex-column h-100 w-100 justify-content-around p-2">
                        <div class="ellipsis-1">{{ p.product_name }}</div>
                        <div class="fs-6 fw-bold">
                          ₺{{ formatter.format(JSON.parse(p.portion_json).find((e) => e.default == true).price) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
            </template>
          </template>
        </div>
      </div>
      <div v-show="mobile_active_tab == 'adisyon'">
        <adisyon
          v-model:adisyon="adisyonies"
          v-model:sync="senkron"
          @update:adisyon="updateAdisyon($event)"
          :desk="desk"
          v-model:kuverJSON="kuverJSON"
          v-model:garsoniyeToplam="garsoniyeToplam"
          :mobile="true"
        />
      </div>
    </div>
    <el-card class="position-fixed w-100 bottom-0 mobile-siparis-bottom" body-style="padding:10px">
      <div class="px-4 py-2 d-flex align-items-center">
        <transition name="el-zoom-in-start">
          <el-input v-show="search_visible" v-model="searching" @keyup="Search()" class="me-2 w-100" placeholder="Ara..." />
        </transition>
        <div class="d-flex align-items-center justify-content-between text-center" :class="!search_visible ? 'w-100' : ''">
          <button
            class="btn btn-outline-danger"
            style="height: 32px; margin-top: 0 !important"
            @click="search_visible = !search_visible"
          >
            <i v-show="search_visible == false" class="bi bi-search"></i>
            <i v-show="search_visible == true" class="bi bi-x-lg"></i>
          </button>
          <transition name="el-zoom-in-end">
            <div v-show="!search_visible" style="display: flex" class="flex-nowrap">
              <span class="fs-5 me-3">{{ formatter.format(this.adisyonies.total) }}₺</span>

              <button
                @click="this.$route.params.id > 0 ? adisyonEdit() : adisyonSave()"
                class="btn btn-danger"
                style="height: 32px; margin-top: 0 !important"
              >
                Kaydet
              </button>
            </div>
          </transition>
        </div>
      </div>
      <div class="d-flex justify-content-center" :class="button_yon">
        <el-button v-if="width > 577" link @click="button_yon = 'justify-content-sm-start'">
          <i class="bi bi-arrow-left-short"></i>
        </el-button>
        <el-button type="" size="large" @click="geriDon()"><i class="bi bi-box-arrow-left"></i></el-button>
        <el-button :type="mobile_active_tab == 'musteri' ? 'primary' : ''" @click="mobile_active_tab = 'musteri'">
          <i class="bi bi-journal-text"></i>
        </el-button>
        <el-button :type="mobile_active_tab == 'favori' ? 'primary' : ''" @click="mobile_active_tab = 'favori'">
          <i class="bi bi-star"></i>
        </el-button>
        <el-button :type="mobile_active_tab == 'siparis' ? 'primary' : ''" @click="mobile_active_tab = 'siparis'">
          <i class="bi bi-egg-fried"></i>
        </el-button>
        <el-button :type="mobile_active_tab == 'adisyon' ? 'primary' : ''" @click="mobile_active_tab = 'adisyon'">
          <i class="bi bi-receipt"></i>
        </el-button>
        <el-button v-if="width > 577" link @click="button_yon = 'justify-content-sm-end'">
          <i class="bi bi-arrow-right-short"></i>
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import orderProps from "../tablet/modals/orderProps.vue";
import customerSelect from "../tablet/modals/customerSelect.vue";
import guests from "../tablet/modals/guests.vue";
import orderDesc from "../tablet/modals/orderDesc.vue";
import adisyon from "./siparis-adisyon.vue";
import { ElNotification } from "element-plus";
import { mapGetters } from "vuex";

import formatter from "@/angaryos/tools/numberFormatter";
import inputs from "@/angaryos/inputs.vue";

export default {
  components: { orderProps, customerSelect, guests, orderDesc, adisyon, inputs },
  data() {
    return {
      desk: {},
      deskCreate: [],
      ozelliklerVisible: false,
      musteriSecVisible: false,
      misafirlerVisible: false,
      siparisAciklamaVisible: false,

      searching: "",
      searchedProd: [],

      categories: [],
      product: [],
      base_categories: [],
      base_product: [],
      favs: [],
      adisyon: [],
      kuverToplam: 0,
      kuverSayisi: 0,
      kuverTotal: 0,
      kuverJSON: {},
      garsoniyeTotal: [],
      garsoniyeToplam: {},
      product_info_json: [],

      adisyonValue: "",
      adisyonOrders: {},
      adisyonData: [],

      productPropsVal: [],
      productPropsProd: [],

      propsid: 0,
      defaultPorsiyon: {},
      defaultPorsiyonFavs: {},

      counter: {},

      adisyonies: {
        cost_total: 0, //Maliyet Tutarı
        customer_count: 1, //müşteri sayısı
        customer_id: "", //müşteri
        description: "", //sipariş açıklaması
        kdv_total: 0, //KDV Tutar
        kuver_settings_id: "", //Kuver Ayarları
        masa_ids: {}, //Masalar
        net_total: 0, //Brüt Tutar
        order_status_id: 1, //Sipariş Durumu - Bekliyor
        product_ids: [], //Ürünler
        product_info_json: {},
        received_total: 0, //Tahsil Edilen Tutar
        total: 0, //Toplam Tutar
        waiter_settings_id: "", //Garsoniye Ayarları
        waiter_total: 0, //Garsoniye Ayarları
        discount_total: 0,
      },
      selectedProduct: [],
      errors: [],
      formatter,
      senkron: 0,
      production_key: null,
      width: 0,
      active_kategori: 1,

      button_yon: "",
      mobile_active_tab: "adisyon",
      search_visible: false,
    };
  },
  computed: {
    ...mapGetters(["getAdisyonData", "getUserData"]),
  },
  methods: {
    adisyonEdit() {
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
            this.$router.go(-1);
            //this.$router.push("/panel/garson");
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
    updateAdisyon(e) {
      this.counter = {};
      for (let vals of Object.values(e.product_info_json)) {
        if (this.counter[vals.id] == undefined) this.counter[vals.id] = 0;
        this.counter[vals.id] = this.counter[vals.id] + vals.product_count;
      }

      this.adisyonies = e;
      this.selectedProduct = this.adisyonies.product_info_json;
    },
    geriDon() {
      if (this.$route.query.masa > 0) {
        this.$router.push("/panel/garson");
      } else if (this.$route.query.selfservis > 0) {
        this.$router.push("/panel/self-servis");
      } else if (this.$route.query.paket > 0) {
        this.$router.push("/panel/paket");
      }
    },
    kuvers() {
      this.$services.show("kuver_settings", this.getUserData.companies.kuver_settings_id).then((res) => {
        const val = {
          product_name: "Kuver Ücreti",
          id: "kuver",
          portion_json: JSON.stringify([
            {
              default: true,
              portion_name: "Kuver Ücreti",
              price: res.data.data.record.kuver_total, //FIXME - Kuverden alınacak
            },
          ]),
          kdv_rate: 1,
        };
        this.productAdd(val);
      });

      /*this.kuverSayisi += 1;
      this.kuverToplam = this.kuverTotal * this.kuverSayisi;
      this.kuverJSON = {
        kuverToplam: this.kuverToplam,
        kuverSayisi: this.kuverSayisi,
        kuverTotal: this.kuverTotal,
      };*/
    },
    garsoniyes() {
      this.$services.show("waiter_settings", this.getUserData.companies.waiter_settings_id).then((res) => {
        const val = {
          product_name: "Garsoniye Ücreti",
          id: "garsoniye",
          portion_json: JSON.stringify([
            {
              default: true,
              portion_name: "Garsoniye Ücreti",
              price: res.data.data.record.waiter_total, //FIXME - Kuverden alınacak
            },
          ]),
          kdv_rate: 1,
        };
        this.productAdd(val);
      });

      /*this.garsoniyeToplam = {
        garsoniyeTotal: this.garsoniyeTotal[0]?.waiter_total,
        garsoniyeTipi: this.garsoniyeTotal[0]?.waiter_type_id,
      };*/
    },
    buttonChange(key, val) {
      if (key == 1) {
        if (this.adisyonies.product_info_json[val.id] == undefined) {
          this.adisyonies.product_info_json[val.id] = {
            id: val?.id, // Ürün ID
            product_name: val?.product_name, // Ürün Adı
            product_count: 1, // Ürün Sayısı
            pay_count: 0, // Ödenen Ürün Sayısı
            pay_type: "Nakit", // Ödenen Ürün Ödeme Türü
            portion_name: JSON.parse(val.portion_json).find((e) => e.default == true).portion_name, // Ürün Porsiyon Adı
            portion_price: JSON.parse(val.portion_json).find((e) => e.default == true).price, // Ürün Birim Fiyatı
            product_total: JSON.parse(val.portion_json).find((e) => e.default == true).price, // Ürün Toplam Tutarı
            product_kdv:
              JSON.parse(val.portion_json).find((e) => e.default == true).price * ((1 + parseFloat(val.kdv_rate)) / 100), // Ürün KDV'li Toplamı
            remainder_total: 0, // Kalan Tutar
            paid: false, // Ödendi mi
            status: "1",
          };
          this.adisyonTest.push();
          console.log(this.adisyonTest);
        } else {
          this.adisyonies.product_info_json[val.id].product_count += 1;
          this.adisyonies.product_info_json[val.id].remainder_total = 0;
          this.adisyonies.product_info_json[val.id].product_total =
            this.adisyonies.product_info_json[val.id].product_count *
            JSON.parse(val.portion_json).find((e) => e.default == true).price;
          this.adisyonies.product_info_json[val.id].product_kdv =
            this.adisyonies.product_info_json[val.id].product_count *
            (JSON.parse(val.portion_json).find((e) => e.default == true).price * ((1 + parseFloat(val.kdv_rate)) / 100));
        }
      } else if (key == 2) {
        this.adisyonies.product_info_json[val.id].product_count -= 1;
        this.adisyonies.product_info_json[val.id].remainder_total = 0;
        this.adisyonies.product_info_json[val.id].product_total =
          this.adisyonies.product_info_json[val.id].product_count *
          JSON.parse(val.portion_json).find((e) => e.default == true).price;
        this.adisyonies.product_info_json[val.id].product_kdv =
          this.adisyonies.product_info_json[val.id].product_count *
          (JSON.parse(val.portion_json).find((e) => e.default == true).price * ((1 + parseFloat(val.kdv_rate)) / 100));
        if (this.adisyonies.product_info_json[val.id].product_count <= 0) {
          console.log("bura delete");
          delete this.adisyonies.product_info_json[val.id];
        }
      } else if (key == 3) {
        delete this.adisyonies.product_info_json[val.id];
      }
      this.adisyonies.total = 0;
      this.adisyonies.kdv_total = 0;
      for (let vals of Object.values(this.adisyonies.product_info_json)) {
        this.adisyonies.total = parseFloat(this.adisyonies.total) + parseFloat(vals.product_total);
        this.adisyonies.kdv_total = parseFloat(this.adisyonies.kdv_total) + parseFloat(vals.product_kdv);
      }
    },
    getOzelliklikAdisyon(e) {
      this.adisyonies = e;
    },
    productAdd(value) {
      if (this.selectedProduct[0] == undefined) this.selectedProduct = [];
      if (value.property_json != null && JSON.parse(value.portion_json).length > 1) {
        this.selectedProduct.push({
          id: value.id,
          product_name: value?.product_name, // Ürün Adı
          product_count: 1, // Ürün Sayısı
          pay_count: 0, // Ödenen Ürün Sayısı
          pay_type: "Nakit", // Ödenen Ürün Ödeme Türü
          portion_name: JSON.parse(value.portion_json).find((e) => e.default == true).portion_name, // Ürün Porsiyon Adı
          portion_price: JSON.parse(value.portion_json).find((e) => e.default == true).price, // Ürün Birim Fiyatı
          selected_portion_json: JSON.parse(value.portion_json).find((e) => e.default == true),
          product_total: JSON.parse(value.portion_json).find((e) => e.default == true).price, // Ürün Toplam Tutarı
          product_kdv:
            JSON.parse(value.portion_json).find((e) => e.default == true).price * ((1 + parseFloat(value.kdv_rate)) / 100), // Ürün KDV'li Toplamı
          remainder_total: 0, // Kalan Tutar
          portion_json: value.portion_json,
          paid: false, // Ödendi mi
          status: "1",
          prods: value, // Tüm data
          description: "",
          selected_property_json: [],
        });
        this.adisyonies.product_info_json = this.selectedProduct; // adisyoniesin içine atma
        if (this.counter[value.id] == undefined) this.counter[value.id] = 0; //her ürünün sayacını arttırma
        this.counter[value.id] = this.counter[value.id] + this.selectedProduct.find((x) => x.id == value.id).product_count;

        this.adisyonies.total = 0;
        this.adisyonies.kdv_total = 0;

        for (let vals of Object.values(this.adisyonies.product_info_json)) {
          //toplam ve kdv toplam hesabı
          this.adisyonies.total = parseFloat(this.adisyonies.total) + parseFloat(vals.product_total);
          this.adisyonies.kdv_total = parseFloat(this.adisyonies.kdv_total) + parseFloat(vals.product_kdv);
        }

        this.production_key = this.selectedProduct.length - 1;
        this.ozelliklerVisible = true;
      } else {
        //Ürünlere tıklandığında adisyona ekleme işlemi yapar
        this.selectedProduct.push({
          id: value.id,
          product_name: value?.product_name, // Ürün Adı
          product_count: 1, // Ürün Sayısı
          pay_count: 0, // Ödenen Ürün Sayısı
          pay_type: "Nakit", // Ödenen Ürün Ödeme Türü
          portion_name: JSON.parse(value.portion_json).find((e) => e.default == true).portion_name, // Ürün Porsiyon Adı
          portion_price: JSON.parse(value.portion_json).find((e) => e.default == true).price, // Ürün Birim Fiyatı
          selected_portion_json: JSON.parse(value.portion_json).find((e) => e.default == true),
          product_total: JSON.parse(value.portion_json).find((e) => e.default == true).price, // Ürün Toplam Tutarı
          product_kdv:
            JSON.parse(value.portion_json).find((e) => e.default == true).price * ((1 + parseFloat(value.kdv_rate)) / 100), // Ürün KDV'li Toplamı
          remainder_total: 0, // Kalan Tutar
          portion_json: value.portion_json,
          paid: false, // Ödendi mi
          status: "1",
          prods: value, // Tüm data
          description: "",
          selected_property_json: [],
        });
        this.adisyonies.product_info_json = this.selectedProduct; // adisyoniesin içine atma

        if (this.counter[value.id] == undefined) this.counter[value.id] = 0; //her ürünün sayacını arttırma
        this.counter[value.id] = this.counter[value.id] + this.selectedProduct.find((x) => x.id == value.id).product_count;

        this.adisyonies.total = 0;
        this.adisyonies.kdv_total = 0;

        for (let vals of Object.values(this.adisyonies.product_info_json)) {
          //toplam ve kdv toplam hesabı
          this.adisyonies.total = parseFloat(this.adisyonies.total) + parseFloat(vals.product_total);
          this.adisyonies.kdv_total = parseFloat(this.adisyonies.kdv_total) + parseFloat(vals.product_kdv);
        }
      }

      console.log(this.adisyonies);
    },
    productEdit(value) {
      //gelen edit datasını adisyona dönüşytürür
      this.selectedProduct.push(value);
      this.adisyonies.product_info_json = this.selectedProduct; // adisyoniesin içine atma

      if (this.counter[value.id] == undefined) this.counter[value.id] = 0; //her ürünün sayacını arttırma
      this.counter[value.id] = this.counter[value.id] + this.selectedProduct.find((x) => x.id == value.id).product_count;

      this.adisyonies.total = 0;
      this.adisyonies.kdv_total = 0;
      for (let vals of Object.values(this.adisyonies.product_info_json)) {
        //toplam ve kdv toplam hesabı
        this.adisyonies.total = parseFloat(this.adisyonies.total) + parseFloat(vals.product_total);
        this.adisyonies.kdv_total = parseFloat(this.adisyonies.kdv_total) + parseFloat(vals.product_kdv);
      }
      console.log(this.adisyonies);
    },
    getCategories() {
      const params = {
        page: 1,
        limit: 10000,
        filters: {},
        sorts: { sort_no: true },
      };
      this.$services.list("product_category", params).then((res) => {
        this.categories = res.data.data.records;
        this.base_categories = res.data.data.records;
        this.active_kategori = this.categories[0].id;
      });
    },
    getProduct() {
      const params = {
        page: 1,
        limit: 10000,
        filters: {},
        sorts: { sort_no: true },
      };
      this.$services.list("product", params).then((res) => {
        this.product = res.data.data.records;
        this.base_product = res.data.data.records;
        this.favs = [];
        for (const val of Object.values(this.product)) {
          for (const v of Object.values(JSON.parse(val?.portion_json))) {
            if (v.default) this.defaultPorsiyon = v.price;
          }
          if (val.favorite == true) {
            this.favs.push(val);
            for (const v of Object.values(JSON.parse(val?.portion_json))) {
              if (v.default) this.defaultPorsiyonFavs = v.price;
            }
          }
        }
      });
    },
    getAdisyon() {
      if (this.$route.params.id == 0) return null;
      else {
        this.$services.edit("adisyon", this.$route.params.id).then((res) => {
          const rec = res.data.data.record;
          this.adisyonies = {
            id: this.$route.params.id,
            masa_ids: rec.masa_ids,
            cost_total: rec.cost_total,
            customer_count: rec.customer_count,
            customer_id: rec.customer_id?.[0]?.source,
            description: rec.description,
            kdv_total: rec.kdv_total,
            kuver_settings_id: rec.kuver_settings_id?.[0]?.source,
            //"masa_ids: ["112"],
            net_total: rec.net_total,
            order_status_id: rec.order_status_id?.[0]?.source,
            //product_ids: rec.kdv_total,
            product_info_json: JSON.parse(rec.product_info_json),
            received_total: rec.received_total,
            total: rec.total,
            waiter_settings_id: rec.waiter_settings_id?.[0]?.source,
            waiter_total: rec.waiter_total,
            discount_total: rec.discount_total,
          };
          for (const val of Object.values(this.adisyonies.product_info_json)) {
            this.productEdit(val);
          }
        });
      }
    },
    getAdisyonCreate() {
      this.$services.create("adisyon").then((res) => {
        this.deskCreate = res.data.data.column_set.column_arrays[0]?.columns;
      });
    },
    Search() {
      this.mobile_active_tab = "siparis";
      this.categories = [];
      this.product = [];
      if (this.searching.length > 0) {
        for (const val of Object.values(this.base_product)) {
          if (val.product_name.toLowerCase().search(this.searching.toLowerCase()) > -1) this.product.push(val);
        }
        this.categories = [];
        for (const val of Object.values(this.product)) {
          for (const val2 of Object.values(this.base_categories)) {
            if (val2.id == val.product_category_id.split("é")[1]) {
              this.categories[val2.id] = val2;
              this.active_kategori = val2.id;
            }
          }
        }
      } else {
        this.categories = this.base_categories;
        for (const val of Object.values(this.base_product)) {
          this.product.push(val);
        }
        this.active_kategori = this.categories[0].id;
      }
      this.categories = Object.values(this.categories);
    },
    getImages(img) {
      if (img == null || img == "[]") {
        return null;
      } else {
        return this.imgBaseUrl + JSON.parse(img)[0].destination_path + "s_" + JSON.parse(img)[0].file_name;
      }
    },
    getDesk(id) {
      this.$services.show("masa", id).then((res) => {
        this.desk = res.data.data.record;
      });
    },
    getKuvers() {
      let params = {
        page: 1,
        limit: 100,
        filters: {
          own_id: {
            type: 1,
            gui_type: "select",
            filter: [this.$store.getters.getUserData.user.companies_id],
          },
        },
        sorts: {},
      };
      this.$services.list("kuver_settings", params).then((res) => {
        this.kuverTotal = res.data.data.records[0]?.kuver_total;
      });
      // TODO düzeltilecek
      // console.log("qqwewe",this.$store.getters.getCompData)
      // this.$services.show("kuver_settings", this.$store.getters.getCompData)
    },
    getGarsoniye() {
      let params = {
        page: 1,
        limit: 100,
        filters: {
          own_id: {
            type: 1,
            gui_type: "select",
            filter: [this.$store.getters.getUserData.user.companies_id],
          },
        },
        sorts: {},
      };
      this.$services.list("waiter_settings", params).then((res) => {
        this.garsoniyeTotal = res.data.data.records;
      });
    },
  },
  mounted() {
    this.width = window.innerWidth;
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
    });
    this.getCategories();
    this.getProduct();
    this.getAdisyon();
    this.getAdisyonCreate();
    if (this.$route.query.masa > 0) {
      this.adisyonies.masa_ids = [this.$route.query.masa];
      this.adisyonies.adisyon_type_id = 1;
      this.getDesk(this.$route.query.masa);
    } else if (this.$route.query.selfservis > 0) {
      this.desk["table_name"] = "Self Servis";
      this.adisyonies.adisyon_type_id = 3;
      this.adisyonies.masa_ids = null;
    } else if (this.$route.query.paket > 0) {
      this.desk["table_name"] = "Paket Siparişi";
      this.adisyonies.adisyon_type_id = 2;
      this.adisyonies.masa_ids = null;
    }
  },
};
</script>

<style>
.mobile-siparis-bottom .el-button {
  --mobile-buttons: 60px;
  width: var(--mobile-buttons);
  height: var(--mobile-buttons);
  font-size: 26px;
}

.mobile-siparis-bottom .el-input__wrapper {
  height: var(--mobile-buttons);
  font-size: 26px;
}

.mobil-siparis-ekrani .urunler .el-tabs__content {
  height: calc(100% - 182px);
  position: absolute;
  overflow: auto;
  width: 100vw;
}

@media only screen and (max-width: 1100px) {
  .favori-wrapper {
    display: none !important;
  }

  .urunler-panel {
    width: calc(100% - 450px) !important;
  }
}

@media only screen and (max-width: 880px) {
  .siparis-ekrani {
    flex-wrap: wrap !important;
  }

  .urunler-panel {
    width: 100% !important;
  }
}

.favori-wrapper {
  height: 100% !important;
}

.siparis-ekrani {
  flex-wrap: nowrap;
}

.urunler-panel {
  width: calc(100% - 593px);
}

.order-container {
  width: 100%;
}

.order-container .el-button {
  margin: 0;
  padding: 36px;
  border-radius: 0;
}

.order-container .el-button i {
  font-size: 24px;
}

.order-container .el-input__wrapper {
  margin: 0;
  border-radius: 0;
  /* background-color: #909399; */
  background-color: var(--el-bg-color-overlay);
}

.icecek-wrapper .icecek-card .el-card__body {
  padding: 0px 0px 0px 10px !important;
}

.order-container .desk-input .el-input__wrapper {
  background-color: #909399;
  color: #fff;
}

.order-container .desk-input .el-input__wrapper .el-input__inner {
  color: #fff;
}

.order-main .el-card {
  border-radius: 0;
  height: 90.8vh;
}

.order-main .el-button {
  margin: 0;
  padding: 22px;
  border-radius: 0;
}

.order-main .el-card__body {
  padding-bottom: 0;
}

.main-buttons {
  margin: 0;
  padding: 0;
}

.main-buttons .el-tabs__item,
.el-tabs,
.el-tabs__header {
  border-radius: 0 !important;
}

.main-buttons .el-tabs {
  width: 100%;
}

.main-buttons .el-tag {
  --el-tag-border-color: #fff;
  border-color: #fff;
  background-color: transparent;
  border-width: 0;
  border-style: none;
}

.orders .el-tag {
  --el-tag-border-color: #fff;
  border-color: #fff;
  background-color: #fff;
  border-width: 0;
  border-style: none;
}

.main-buttons .el-tabs__content .el-card {
  height: 100% !important;
  border-radius: 10px;
}

.main-buttons .el-card {
  box-shadow: rgba(0, 0, 0, 0.25) 1.95px 1.95px 2.6px;
  border: 0 !important;
}

.main-buttons .el-card__body {
  padding: 0;
  height: 100% !important;
}

.ekle-buton .el-button:nth-child(1) {
  padding: 16px;
  border-radius: 8px 8px 0 0;
}

.ekle-buton .el-input__wrapper:nth-child(1) {
  border-radius: 0;
}

.ekle-buton .el-button:nth-child(3) {
  padding: 16px;
  border-radius: 0 0 8px 8px;
}

.ekle-buton .el-input__wrapper {
  width: 16px;
  text-align: center;
}

.ekle-buton .el-input__wrapper .el-input__inner {
  text-align: center;
}

.adisyon-buttons .el-button {
  padding: 20px;
}

.more-button-icon .el-icon {
  transform: rotate(90deg);
}

.total-button {
  width: 24px !important;
  padding: 12px !important;
  position: absolute;
  right: -20px;
  top: -31px;
}

.desk-input {
  margin: 0 !important;
}

.desk-input .el-input {
  width: 180px;
}

.desk-input .el-input .el-input__wrapper {
  padding: 22px;
}

.orders {
  height: 65vh;
}

.kaydet-btn {
  padding: 8px !important;
  position: sticky;
  bottom: 0;
}

.favs-header {
  z-index: 9;
  background: var(--foreground-color);
  position: relative;
  top: 0;
  padding: 11px 0;
  border-bottom: 1px solid #ddd;
}

.counter-tag .el-tag {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}
</style>
