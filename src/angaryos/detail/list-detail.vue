<template>
  <div v-for="d in columns" :key="d">
    <!-- Kolon ayarlaronda banlanmışları gösterme -->
    <template v-if="column_settings?.[d.name]?.banned == true"></template>
    <!-- Kolon ayarlaronda banlanmışları gösterme -->
    <!-- Detaylar -->
    <div v-else class="d-flex justify-content-between">
      <!------------------ Başlık --------------------->
      <template
        v-if="d.display_name == 'Resimler' || d.display_name == 'Resim' || d.display_name == 'Mal Hizmet json'"
      ></template>
      <label v-else class="text-nowrap me-1">
        {{
          d.display_name[d.display_name.length - 1] == "*"
            ? d.display_name.substring(0, d.display_name.length - 1)
            : d.display_name
        }}:
        <div v-if="adminMode">{{ d.name }}</div>
      </label>
      <!------------------ Başlık --------------------->
      <!------------------ Format: Para --------------------->
      <span v-if="column_settings?.[d.name]?.['format'] == 'money'">
        <el-tooltip :show-after="500" :content="formatter.format(detailData[d.name])" effect="tooltip-theme">
          <label>{{ formatter.format(detailData[d.name] == "NaN" ? 0 : detailData[d.name]) }}</label>
        </el-tooltip>
      </span>
      <!------------------ Format: Para --------------------->
      <!------------------ İçerik --------------------->
      <template v-else>
        <div
          v-if="
            d.gui_type_name == 'select' || d.gui_type_name == 'select:static' || d.gui_type_name == 'multiselectdragdrop'
          "
        >
          <div v-if="d.name == 'kdv_id'">
            <el-tooltip :show-after="500" :content="'%' + detailData[d.name][0]?.display" effect="tooltip-theme">
              <label class=""
                ><el-tag type="info">{{ "%" + detailData[d.name][0]?.display }}</el-tag></label
              >
            </el-tooltip>
          </div>
          <div
            v-else-if="column_settings?.[d.name]?.detail == true"
            @click="getSelectDetail(d.name)"
            class="d-flex justify-content-between align-items-center"
          >
            <a class="me-2"> {{ detailData[d.name][0]?.display }}</a>
            <el-tooltip :show-after="500" content="Detaylar" effect="tooltip-theme">
              <el-button type="warning" class="clm-detail-button"><i class="bi bi-search"></i> <span></span></el-button>
            </el-tooltip>
          </div>
          <div v-else>
            <el-tooltip :show-after="500" :content="detailData[d.name][0]?.display" effect="tooltip-theme">
              <label class="rightTexts">{{ detailData[d.name][0]?.display }}</label>
            </el-tooltip>
          </div>
        </div>
        <div v-else-if="d.gui_type_name == 'date' || d.gui_type_name == 'datetime'">
          <el-tooltip
            :show-after="500"
            :content="
              new Date(detailData[d.name]).toLocaleDateString('tr-TR', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            "
            effect="tooltip-theme"
          >
            <label>{{ detailData[d.name] ? dateFormatter.format(new Date(detailData[d.name])) : "---" }}</label>
          </el-tooltip>
        </div>
        <template v-else>
          <div v-if="column_settings?.[d.name]?.['format'] == 'money'">
            <el-tooltip :show-after="500" :content="formatter.format(detailData[d.name])" effect="tooltip-theme">
              <label class="rightTexts">{{ formatter.format(detailData[d.name]) }}</label>
            </el-tooltip>
          </div>
          <div v-else-if="d.name == 'kobi_alinan_satilan'">
            <el-tooltip
              :show-after="500"
              :content="detailData[d.name] == true ? 'Satılan' : 'Alınan'"
              effect="tooltip-theme"
            >
              <label v-if="detailData[d.name] == true" class=""><el-tag type="success">Satılan</el-tag></label>
              <label v-else class=""><el-tag type="danger">Alınan</el-tag></label>
            </el-tooltip>
          </div>
          <div v-else-if="d.name == 'diger_vergiler_toplami'" class="d-flex flex-column align-items-end">
            <div v-if="JSON.parse(detailData[d.name]) == '0: []'">
              <label class="mb-1"><el-tag type="danger">Boş</el-tag></label>
              <!-- Çalışmıyor? -->
            </div>
            <div v-else class="d-flex flex-column align-items-end">
              <el-tooltip
                v-for="detail in JSON.parse(detailData[d.name])?.[0]"
                :key="detail"
                :show-after="500"
                :content="detail.display ? detail.display : '---'"
                effect="tooltip-theme"
              >
                <label class="mb-1"
                  ><el-tag type="danger">{{ detail.display ? detail.display : "---" }}: %{{ detail.oran }}</el-tag></label
                >
              </el-tooltip>
            </div>
          </div>
          <div v-else-if="d.name == 'mal_hizmet_json'">
            <el-collapse v-model="activeNames" @change="handleChange" class="mb-4" style="width: 360px">
              <el-collapse-item name="1">
                <template #title>
                  <div class="text-primary fs-6">Mal Hizmet Listesi</div>
                </template>
                <el-tooltip
                  v-for="(detail, key) in JSON.parse(detailData[d.name])"
                  :key="key"
                  :show-after="500"
                  :content="formatter.format(detail.mal_hizmet_tutari)"
                  effect="tooltip-theme"
                >
                  <label class="mb-1 d-flex justify-content-between align-items-center"
                    >{{ key + 1 }}. Mal Hizmet Tutarı:<el-tag type="primary">{{
                      formatter.format(detail.mal_hizmet_tutari)
                    }}</el-tag></label
                  >
                </el-tooltip>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div v-else-if="d.name == 'kasa_banka'">
            <el-tooltip :show-after="500" :content="detailData[d.name] == true ? 'Kasa' : 'Banka'" effect="tooltip-theme">
              <label v-if="detailData[d.name] == true" class=""><el-tag type="primary">Kasa</el-tag></label>
              <label v-else class=""><el-tag type="warning">Banka</el-tag></label>
            </el-tooltip>
          </div>
          <div v-else-if="d.name == 'kdv_dahil_buton'">
            <el-tooltip :show-after="500" :content="detailData[d.name] == true ? 'Dahil' : 'Hariç'" effect="tooltip-theme">
              <label v-if="detailData[d.name] == true" class=""><el-tag type="primary">Dahil</el-tag></label>
              <label v-else class=""><el-tag type="warning">Hariç</el-tag></label>
            </el-tooltip>
          </div>
          <div v-else-if="d.name == 'taksitli'">
            <el-tooltip
              :show-after="500"
              :content="detailData[d.name] == true ? 'Taksitli' : 'Değil'"
              effect="tooltip-theme"
            >
              <label v-if="detailData[d.name] == true" class=""><el-tag type="primary">Taksitli</el-tag></label>
              <label v-else class=""><el-tag type="warning">Değil</el-tag></label>
            </el-tooltip>
          </div>
          <div v-else-if="d.name == 'tahsilat_tamamlandi'">
            <el-tooltip
              :show-after="500"
              :content="detailData[d.name] == true ? 'Tahsilat Tamamlandı' : 'Tahsilat Yapılmadı'"
              effect="tooltip-theme"
            >
              <label v-if="detailData[d.name] == true" class=""><el-tag type="success">Tahsilat Tamamlandı</el-tag></label>
              <label v-else class=""><el-tag type="danger">Tahsilat Yapılmadı</el-tag></label>
            </el-tooltip>
          </div>
          <template v-else-if="d.name == 'images' || d.name == 'image'">
            <template v-for="img in JSON.parse(detailData[d.name])" :key="img">
              <el-image
                style="width: 100%; max-width: 350px"
                :src="'https://adisyon.masahesap.com/' + img.disk + '/' + img.destination_path + img.file_name"
                fit="cover"
                loading="lazy"
              />
            </template>
          </template>
          <div v-else>
            <el-tooltip :show-after="500" :content="detailData[d.name]" effect="tooltip-theme">
              <label class="rightTexts">{{ detailData[d.name] }}</label>
            </el-tooltip>
          </div>
        </template>
      </template>
      <!------------------ İçerik --------------------->
    </div>
    <!-- Detaylar -->
    <!---------------------------------------------->
    <!-- Kolon ayarlaronda banlanmışları gösterme -->
    <template v-if="column_settings[d.name]?.banned == true"></template>
    <!-- Kolon ayarlaronda banlanmışları gösterme -->
    <!-- Ayraç -->
    <el-divider v-else border-style="dotted" class="my-2" />
    <!-- Ayraç -->
  </div>
</template>

<script>
import formatter from "../tools/numberFormatter";
import dateFormatter from "../tools/dateFormatter";
import column_settings from "@/angaryos/modal/column_settings";
import { mapGetters } from "vuex";
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    table_name: {
      type: String,
      required: true,
    },
    column_settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      detailData: {},
      columns: [],
      formatter,
      dateFormatter,
    };
  },
  computed: {
    ...mapGetters(["adminMode"]),
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$services.edit(this.table_name, this.id).then((res) => {
        this.detailData = res.data.data.record;
        this.columns = res.data.data.column_set.column_arrays[0].columns;
      });
    },
    getSelectDetail(clm) {
      this.$store.commit("setCenterModalData", {
        name: "detail",
        title: this.detailData[clm][0].display,
        state: true,
        display: "center",
        table_name: this.columns[clm].relation.table_name,
        id: this.detailData[clm][0].source,
        column_settings: column_settings[this.columns[clm].relation.table_name],
      });
    },
  },
};
</script>

<style>
.rightTexts {
  text-align: right;
  word-break: break-word;
}
</style>
