import contentVue from "./content.vue";
import headerVue from "./header.vue";
import footerVue from "./footer.vue";
import { mapGetters } from "vuex";
import services from "@/services";
import rightClickTable from "../right-click/table.vue";

const props = {
  table_name: {
    type: String,
    required: true,
  },
  column_settings: {
    type: Object,
    default: () => {
      return {
        id: {
          visible: true,
          input_visible: true,
          banned: false,
        },
      };
    },
  },
  button_settings: {
    type: Object,
  },
  modules: {
    type: Array,
  },
  table_settings: {
    type: Object,
  },
};
const computed = {
  ...mapGetters(["getTableRefresh", "getUserData"]),
};
const components = {
  contentVue,
  headerVue,
  footerVue,
  rightClickTable,
};
const emits = ["table_data", "refresh"];
const data = () => {
  return {
    table_data: [],
    params: {
      page: 1,
      limit: 10,
      sorts: {},
      filters: {},
    },
    loading: null,
  };
};
const methods = {
  getData() {
    this.loading = true;
    //this.table_data = {};
    let prm = this.params;
    services
      .list(this.table_name, prm)
      .then((res) => {
        this.table_data = res.data.data;
        this.$emit("data", res.data.data);

        this.loading = false;

        this.yonlendir(this.table_data.table_info);
      })
      .finally(() => {
        this.loading = false;
      });
  },
  getDefaultParams() {
    this.params = {
      page: 1,
      limit: 10,
      sorts: {},
      filters: {},
    };
    if (this.table_settings?.params?.limit > 0) {
      this.params.limit = this.table_settings.params.limit;
    }
    for (let [key, val] of Object.entries(this.column_settings)) {
      if (val?.sort != undefined && val.sort != null && val.sort != "") {
        this.params.sorts[key] = val.sort;
      } else {
        delete this.params?.sorts[key];
      }
      if (val?.filters?.filter != undefined && val.filters?.filter != null && val.filters?.filter != "") {
        this.params.filters[key] = {
          type: val.filters.type,
          filter: val.filters.filter,
          filter2: val.filters?.filter2,
          guiType: val.filters.gui_type,
        };
      } else {
        delete this.params.filters[key];
      }
    }
    this.getData();
  },
  updateParams(e) {
    this.params = e;
    this.getData();
  },
  yonlendir(tb) {
    //NOTE - TAB İSİMLENDİRMELERİNİN YAPILDIĞĞI YER
    const route = this.$route.name;
    //route isimleri
    const gitme = [
      "Anasayfa",
      "CariDetay",
      "AlisSatisYonetimiAlisFaturaEkle",
      "AlisSatisYonetimiSatisFaturaEkle",
      "AlisSatisYonetimiAlisFaturaDuzenle",
      "AlisSatisYonetimiSatisFaturaDuzenle",
      "AlisSatisYonetimiIrsaliyeAlisEkle",
      "AlisSatisYonetimiIrsaliyeSatisEkle",
      "AlisSatisYonetimiAlisIrsaliyeDuzenle",
      "AlisSatisYonetimiSatisIrsaliyeDuzenle",
      "AlisSatisYonetimiSiparisAlisEkle",
      "AlisSatisYonetimiSiparisSatisEkle",
      "AlisSatisYonetimiAlisSiparisDuzenle",
      "AlisSatisYonetimiSatisSiparisDuzenle",
      "TeklifEkle",
      "TeklifDuzenle",
    ];
    //tablo isimleri
    const gitme_table = ["hatirlatici"];
    //bu routede sonuna bu ismi ver
    const ozel = [{ route: "Raporlama", name: " - Rapor" }];

    if (gitme.find((e) => e == route)) return;

    if (gitme_table.find((e) => e == this.table_name)) return;
    let table_display = "";
    ozel.find((e) => {
      if (e.route == route) {
        table_display = tb?.display_name + e.name;
      } else {
        table_display = tb.display_name;
      }
    });

    document.title = table_display;
    const history = JSON.parse(localStorage.getItem("history"));
    history.find((h) => {
      if (h.fullPath == this.$route.fullPath) {
        h.meta.title = table_display;
      }
    });
    localStorage.setItem("history", JSON.stringify(history));
    this.$store.commit("historyChange");
  },
};
const watch = {
  getTableRefresh() {
    this.getData();
  },
  params(newData, oldData) {
    if (
      newData.limit != oldData.limit &&
      newData.page != oldData.page &&
      newData.sorts != oldData.sorts &&
      newData.filters != oldData.filters
    )
      this.getData();
  },
  $route() {
    this.getData();
  },
  table_name() {
    this.getDefaultParams();
  },
};
export { props, components, emits, data, methods, computed, watch };
