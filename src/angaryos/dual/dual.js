import inputs from "../inputs.vue";
import display_name from "./display.json";
import { mapGetters } from "vuex";
import formatter from "../tools/numberFormatter";

const components = {
  inputs,
};
const props = {
  table_name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["create", "edit"],
  },
  display: {
    type: String,
  },
  column_settings: {
    type: Array,
    required: true,
  },
  id: {
    type: Number,
  },
  second_config: {
    type: Object,
  },
  modules_first: {
    type: Object,
  },
  modules_second: {
    type: Object,
  },
};
const data = () => {
  return {
    display_name,
    dialogState: false, //diğer vergiler dialog
    config: {
      get: "",
      set: "",
      access: "",
      group: [],
      hideGroup: [],
    },
    params: {}, //1.tablo parametreleri
    columns: {}, //1.tablo sütunları
    disabled: {}, //1.tablo disabled parametreleri
    errors: {}, //1.tablo error parametreleri
    formatter,

    loading: true, // sayfa yükleniyor
    saveLoading: false, //button yükleniyor
    response: null, //store-update sonrası gelen response
    selectResult: {}, //inputlardan dönen select listesi

    doubleLoading: true, //tablo body yükleniyor
    doubleConfig: {
      get: "",
      set: "",
      access: "",
      parent_name: "",
    },
    doubleParams: [{}], //2.tablo parametreleri
    doubleColumns: {}, //2.tablo sütunları
    doubleDisabled: [{}], //2.tablo disabled parametreleri
    doubleErrors: [{}], //2.tablo error parametreleri
    doubleTotal: {}, //2.tablo toplam parametreleri
    doubleColumnSettings: [],
    dbconfig: {},

    updateList: [], //edit isteğinde 2.tablo veri listesi
    vergilerJson: {}, // TÜM VERGİLER
    digerVergilerKey: 0, //Dialog tetiklendiğinde hangi vergilerin geleceğini belirleyen key değeri
    digerVergilerColumns: {}, //2.tablo elle ekleme yapılan diğer vergiler sütunları // SATIR BAŞI VERGİLER
    irsaliyeSoforColumns: [], //2.tablo elle ekleme yapılan irsaliye söför sütunları
    irsaliyePlakaColumns: [], //2.tablo elle ekleme yapılan irsaliye plaka sütunları
    tevkifatlar_toplami: {}, // tevkifatların efaturadaki verileri

    test_name: "",
    front_test_list: {},
    table_head_style: {
      mal_hizmet: "min-width:200px!important;width:200px!important",
      miktar: "min-width:100px!important;width:100px!important",
      kdv_id: "min-width:70px!important;width:70px!important",
      kdv_dahil_buton: "min-width:125px!important;width:125px!important;",
      iskonto_arttirim: "min-width:110px!important;width:110px!important;",
      vergiler_id: "min-width:110px!important;width:110px!important;",
    },
  };
};
const computed = {
  ...mapGetters(["adminMode", "getDualRefresh", "getConvertData", "isAdmin"]),
};

const watch = {
  id() {
    this.setConfig();
  },
  type() {
    this.setConfig();
  },
  table_name() {
    this.setConfig();
  },
  adminMode(val) {
    if (val == true) {
      this.testMode();
    }
  },
};
export { components, props, data, computed, watch };
