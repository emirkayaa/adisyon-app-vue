import { Upload, ArrowDown, Plus, FolderOpened, QuestionFilled } from "@element-plus/icons-vue";
import draggable from "vuedraggable";
import { mapGetters } from "vuex";
import axios from "axios";
import inputs from "../../inputs.vue";
import importModel from "../content/import-model.vue";

const data = () => {
  return {
    gizliList: [],
    gosterList: [],
    filter_column: "",
    filter_value: null,
    filter_value2: null,
    filter_type: null,

    filterPopover: false,
    visiblePopoper: false,

    convertedJSON: [],
    importState: false,
    Params: {},
    showFilters: {},
    width: 0,
    info: {},
  };
};
const props = {
  table_name: {
    type: String,
    required: true,
  },
  button_settings: {
    type: Object,
  },
  modelValue: {
    type: Object,
  },
  column_settings: {
    type: Object,
  },
  table_data: {
    type: Object,
  },
};
const components = {
  Upload,
  ArrowDown,
  Plus,
  FolderOpened,
  QuestionFilled,
  draggable,
  inputs,
  importModel,
};
const emits = ["modelValue", "refresh"];
const methods = {
  changeLimit(limit) {
    this.Params.limit = limit;
    this.Params.page = 1;
    this.setShowVisible();
    this.$emit("update:modelValue", this.Params);
    this.$store.commit("setTableRefresh");
    // this.getTable();
  }, //Limit değiştir
  createTrigger() {
    if (this.button_settings?.["create"]?.["url"] != undefined && this.button_settings?.["create"]?.["url"] != "") {
      this.$router.push(this.button_settings["create"]["url"]);
    } else if (this.button_settings?.["create"]?.["custom"]) {
      this.$store.commit("setRightModalData", {
        name: this.button_settings?.["create"]?.["custom"],
        type: "create",
        title: "Ekle",
        state: true,
        display: "right",
        table_name: this.table_data.table_info.name,
        column_settings: this.column_settings,
      });
    } else {
      this.$store.commit("setRightModalData", {
        name: "dual",
        type: "create",
        title: "Ekle",
        state: true,
        display: "right",
        table_name: this.table_name,
        column_settings: this.column_settings,
      });
    }
  },
  report(type) {
    let params = {
      page: this.Params.page,
      limit: this.Params.limit,
      column_array_id: this.getUserData?.auths?.tables[this.table_name]?.lists[0],
      column_array_id_query: this.getUserData?.auths?.tables[this.table_name]?.queries[0],
      sorts: this.Params.sorts,
      filters: this.Params.filters,
      report_format: type,
      record_id: 0,
      report_id: 0,
    };
    //https://adisyon.masahesap.com/api/v1/YcBFw6XBQ4Xvz2T9d1/tables/cari_hesap/report?params={page:1,limit:10,column_array_id:0,column_array_id_query:0,sorts:{},filters:{},editMode:false,liveDataMode:false,columnNames:[id,cari_hesap_adi,tc,name_basic,surname,vergi_daireleri_id,cari_gruplari_id,vade,ticaret_sicil_no,oda_sicil_no,meslek_odasi,phone,etiket,department_id,sube_id,toplam_tutar,kategori_id,own_id,user_id,created_at,updated_at],filterColumnNames:[],report_format:xlsx,record_id:0,report_id:0}
    window.open(
      axios.defaults.baseURL +
        this.$store.getters.getToken +
        "/tables/" +
        this.table_name +
        "/report?" +
        "params=" +
        JSON.stringify(params),
      "_blank"
    );
  },
  getShowHide() {
    this.gizliList = [];
    this.gosterList = [];
    for (const val of Object.values(this.table_data?.columns)) {
      if (this.column_settings[val.name]?.banned != true) {
        let say = 0;
        if (this.column_settings[val.name]?.visible == false) {
          this.gizliList.push({
            id: say,
            name: val.display_name,
            column: val.name,
          });
        } else {
          this.gosterList.push({
            id: say,
            name: val.display_name,
            column: val.name,
          });
        }
        say++;
      }
    }
  },
  changeVisible() {
    for (let val of Object.values(this.gizliList)) {
      if (this.column_settings[val.column] == undefined) {
        this.column_settings[val.column] = {};
      }
      this.column_settings[val.column]["visible"] = false;
    }
    for (let val2 of Object.values(this.gosterList)) {
      if (this.column_settings[val2.column] == undefined) {
        this.column_settings[val2.column] = {};
      }

      this.column_settings[val2.column]["visible"] = true;
    }
    this.setShowVisible();
    this.getShowHide();
  },
  filtrele() {
    let guitype = this.table_data.columns[this.filter_column].gui_type_name;
    if (this.filter_value != null) {
      if (guitype == "datetime") {
        this.Params.filters[this.filter_column] = {
          type: this.filter_type,
          guiType: guitype,
          filter: this.filter_value,
          filter2: this.filter_value2,
        };
      } else if (guitype == "date") {
        this.Params.filters[this.filter_column] = {
          type: this.filter_type,
          guiType: guitype,
          filter: this.filter_value,
          filter2: this.filter_value2,
        };
      } else if (guitype == "string") {
        this.Params.filters[this.filter_column] = {
          type: this.filter_type,
          guiType: guitype,
          filter: this.filter_value,
        };
      } else if (guitype == "numeric") {
        this.Params.filters[this.filter_column] = {
          type: this.filter_type,
          guiType: guitype,
          filter: this.filter_value,
        };
      } else if (guitype == "boolean:fastchange" || guitype == "boolean") {
        this.Params.filters[this.filter_column] = {
          type: 1,
          guiType: "boolean",
          filter: this.filter_value,
        };
      } else if (guitype == "phone") {
        this.Params.filters[this.filter_column] = {
          type: this.filter_type,
          guiType: guitype,
          filter: this.filter_value,
        };
      } else if (guitype == "select" || guitype == "select:static") {
        this.Params.filters[this.filter_column] = {
          type: this.filter_type,
          guiType: guitype,
          filter: [this.filter_value],
        };
      }
      this.$emit("update:modelValue", this.Params);
      this.$store.commit("setTableRefresh");
    } else {
      delete this.Params.filters[this.filter_column];
      this.$emit("update:modelValue", this.Params);
      this.$store.commit("setTableRefresh");
    }
    this.setShowVisible();
  }, //Filtreleme işlemi
  filtre_temizle() {
    this.Params.filters = {};
    this.showFilters = {};
    this.$emit("update:modelValue", this.Params);
    this.$store.commit("setTableRefresh");
  }, //Tüm filtreleri kaldır
  filtreSil(column) {
    delete this.Params.filters[column];
    delete this.showFilters[column];
    this.$emit("update:modelValue", this.Params);
    this.$store.commit("setTableRefresh");
  }, //Tek filtre kaldır
  setShowVisible() {
    for (const key of Object.keys(this.Params.filters)) {
      if (this.column_settings[key]?.filters == undefined) {
        this.showFilters[key] = this.Params.filters[key];
      }
    }
  },
  addFavorite() {
    this.$store.commit("setFavorite", {
      table_name: this.table_name,
      type: "list",
      link: this.$route.fullPath,
      id: this.$route.params.id,
    });
  },
  removeFavorite() {
    this.$store.commit("setFavorite", {
      table_name: this.table_name,

      type: "list",
      link: this.$route.fullPath,
      id: this.$route.params.id,
      state: false,
    });
  },
};
const computed = {
  ...mapGetters(["getUserData", "adminMode", "getFavorite"]),
};
export { data, props, components, emits, methods, computed };
