<template>
  <div class="">
    <el-card class="mb-4">
      <div class="d-flex flex-column align-items-center align-items-sm-start w-100">
        <div class="d-flex">
          <span class="h4"><i class="text-primary bi bi-grid-1x2"></i> Masalar / Bölgeler</span>
        </div>
        <div class="d-flex mb-3">
          <div class="d-flex align-items-center">
            <label for="" class="h5 mb-0 me-2">Ara:</label>
            <el-input v-model="search" @keyup="Ara()" placeholder="" size="large"></el-input>
          </div>
        </div>
        <div class="d-flex justify-content-center justify-content-sm-between flex-wrap w-100">
          <el-button-group class="mb-2">
            <el-button type="primary" plain size="large" id="masa-ekle-dialog-button" @click="masaEkle()"
              >Masa Ekle</el-button
            >
            <el-button type="primary" plain size="large" id="toplu-masa-ekle-dialog-button" @click="topluMasaVisible = true"
              >Toplu Masa Ekle</el-button
            >
          </el-button-group>
          <el-button-group class="mb-2">
            <el-button type="primary" plain size="large" id="bolge-ekle-dialog-button" @click="bolgeEkleVisible = true"
              >Bölge Ekle</el-button
            >
            <el-button type="primary" id="bolge-changes-button" plain size="large" @click="bolgeDuzenleVisivle = true"
              >Bölgeleri Düzenle</el-button
            >
          </el-button-group>
        </div>
      </div>
    </el-card>
    <el-tabs type="border-card" v-loading="loading">
      <el-tab-pane v-for="b in search_bolgeler" :key="b" id="masa-sirala" :label="b.zone" class="">
        <el-button
          v-if="search.length <= 0"
          type="primary"
          plain
          size="large"
          class="my-2"
          @click="(masa_sira_visible = true), (masa_sira_bolge = b.id)"
          >Masa sırasını düzenle</el-button
        >
        <div class="row" v-if="loading">
          <div class="col-12 col-sm-6 col-md-4 col-xxl-3 mb-5" v-for="i in 10" :key="i">
            <el-skeleton :rows="3" animated />
          </div>
        </div>
        <div class="row" v-else>
          <template v-for="i in search_masalar" :key="i.id">
            <template v-if="i.zone_id == b.zone + 'é' + b.id">
              <div class="mb-3 col-12 col-sm-6 col-md-4 col-xxl-3">
                <el-card>
                  <div class="d-flex justify-content-between">
                    <span class="h5 mb-0 ellipsis-1">{{ i.table_name }}</span>
                    <el-button type="" @click="(masa_duzenle_visible = true), (edit_data = i)" circle
                      ><i class="bi bi-pen"></i
                    ></el-button>
                  </div>

                  <label class="mb-2"
                    >Masa Durumu: <span v-if="i.status" class="text-success">Dolu</span> <span v-else>Boş</span></label
                  >
                  <br />
                  <div class="d-flex mb-2 flex-column border rounded p-2" v-if="i.res_status">
                    <span class="fs-6">Rezervasyon</span>
                    <label for="">Rezervasyon zamanı: </label>
                    <span>{{ moment(i.res_time).format("DD/MM/YYYY HH:mm:ss") }}</span>
                    <label for="">Rezervasyon müşteri: </label>
                    <span>{{ i.customer_id.split("é")[0] }}</span>
                  </div>

                  <el-button :type="i.res_status ? 'success' : ''" @click="(masa_reserve_visible = true), (edit_data = i)"
                    >Rezervasyon</el-button
                  >
                </el-card>
              </div>
            </template>
          </template>
        </div>
        <div
          v-if="false"
          id="masa-changes-input"
          class=""
          style="
            min-height: 100vh;
            height: max-content;
            min-width: 100vw;
            width: max-content;

            padding: 10px 20px 0 10px;
          "
        >
          <template v-for="i in masalar.records" :key="i">
            <div
              v-if="i.zone_id == b.zone + 'é' + b.id"
              class="drag-el"
              :class="i.table_type_id == 'Daire' ? 'masa-yuvarlak' : 'masa-kare'"
              @move="onMove"
              @stop="onStop"
              :id="'v-drag' + i.id"
              v-draggable="{ bounds: 'parent', defaultPosition: { x: i.x_axis, y: i.y_axis } }"
            >
              <div class="edit-button">
                <el-button type="" @click="(masa_duzenle_visible = true), (edit_data = i)" circle
                  ><i class="bi bi-pen"></i
                ></el-button>
              </div>
              <span class="h4 ellipsis-1 card p-1 mb-0">{{ i.table_name }}</span>
            </div>
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>

    <topluMasa v-model:visible="topluMasaVisible" @update:visible="$event == false ? getDatas() : ''"></topluMasa>
    <bolgeDuzenle v-model:visible="bolgeDuzenleVisivle" @update:visible="$event == false ? getDatas() : ''"></bolgeDuzenle>
    <masa-ekle v-model:visible="masa_ekle_visible" @update:visible="$event == false ? getDatas() : ''"></masa-ekle>
    <bolge-ekle v-model:visible="bolgeEkleVisible" @update:visible="$event == false ? getDatas() : ''"></bolge-ekle>
    <masa-duzenle
      v-model:visible="masa_duzenle_visible"
      :edit_data="edit_data"
      @update:visible="$event == false ? getDatas() : ''"
    ></masa-duzenle>
    <masa-sirala
      v-model:visible="masa_sira_visible"
      :masa_sira_bolge="masa_sira_bolge"
      @update:visible="$event == false ? getDatas() : ''"
    ></masa-sirala>
    <masa-reservasyon
      v-model:visible="masa_reserve_visible"
      :edit_data="edit_data"
      @update:visible="$event == false ? getDatas() : ''"
    ></masa-reservasyon>
  </div>
</template>

<script>
import topluMasa from "@/views/content/tanimlama/modals/toplu-masa";
import bolgeDuzenle from "@/views/content/tanimlama/modals/bolge-sirala";
import MasaEkle from "./modals/masa-ekle.vue";
import BolgeEkle from "./modals/bolge-ekle.vue";
import MasaDuzenle from "./modals/masa-duzenle.vue";
import MasaSirala from "./modals/masa-sirala.vue";
import MasaReservasyon from "./modals/masa-reservasyon.vue";

import moment from "moment";
export default {
  data() {
    return {
      x: 0,
      y: 0,
      topluMasaVisible: false,
      bolgeDuzenleVisivle: false,
      masa_ekle_visible: false,
      bolgeEkleVisible: false,
      masa_duzenle_visible: false,
      masa_sira_visible: false,
      masa_reserve_visible: false,
      masa_sira_bolge: 0,
      edit_data: {},
      masalar: {},
      bolgeler: {},
      loading: true,
      load_state: 0,
      change_masa: [],
      record_state: 0,
      button_settings: {
        filter: {
          visible: false,
        },
        shows: {
          visible: false,
        },
        print: {
          visible: false,
        },
        create: {
          visible: false,
        },
      },
      column_settings: {
        id: { visible: false },
        adisyon_id: { visible: false, banned: true, input_visible: false },
        sort_no: { visible: false, banned: true, input_visible: false },
        color: { visible: false, banned: true, input_visible: false },
        x_axis: { visible: false, banned: true, input_visible: false },
        y_axis: { visible: false, banned: true, input_visible: false },
        companies_id: { visible: false, banned: true, input_visible: false },
        own_id: { visible: false },
        user_id: { visible: false },
        created_at: { visible: false },
        updated_at: { visible: false },

        zone_id: { select: ["create", "edit"] },
        customer_id: { input_visible: false },
        res_time: { input_visible: false },
        res_status: { input_visible: false },
        state: { input_visible: false, visible: false, banned: true },
        qr_menu: { input_visible: false, visible: false, banned: true },
        table_type_id: { input_visible: false, visible: false, banned: true },
      },
      search: "",
    };
  },
  mounted() {
    this.getDatas();
  },
  methods: {
    moment,
    masaEkle() {
      this.masa_ekle_visible = true;
    },
    getDatas() {
      this.load_state = 0;
      this.loading = true;
      this.getMasalar();
      this.getBolgeler();
    },
    getBolgeler() {
      const params = {
        limit: 100,
        page: 1,
        filters: {},
        sorts: { sort_no: true },
      };
      this.$services.list("zone", params).then((res) => {
        this.bolgeler = res.data.data.records;
        this.search_bolgeler = res.data.data.records;
        this.load_state += 1;
      });
    },
    getMasalar() {
      const params = {
        limit: 100,
        page: 1,
        filters: {},
        sorts: { sort_no: true },
      };
      this.$services.list("masa", params).then((res) => {
        this.masalar = res.data.data.records;
        this.search_masalar = res.data.data.records;
        this.load_state += 1;
      });
    },
    Ara() {
      console.log(this.search.length);
      this.search_bolgeler = {};
      this.search_masalar = [];
      if (this.search.length > 0) {
        for (const val of Object.values(this.masalar)) {
          if (val.table_name.toLowerCase().search(this.search.toLowerCase()) > -1) this.search_masalar.push(val);
        }
        for (const val of Object.values(this.search_masalar)) {
          for (const val2 of Object.values(this.bolgeler)) {
            if (val2.id == val.zone_id.split("é")[1]) {
              this.search_bolgeler[val2.id] = val2;
            }
          }
        }
      } else {
        this.search_bolgeler = this.bolgeler;
        for (const val of Object.values(this.masalar)) {
          this.search_masalar.push(val);
        }
      }
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
  },
  watch: {
    load_state() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
  },
  components: {
    topluMasa,
    bolgeDuzenle,
    MasaEkle,
    BolgeEkle,
    MasaDuzenle,
    MasaSirala,
    MasaReservasyon,
  },
};
</script>

<style></style>
