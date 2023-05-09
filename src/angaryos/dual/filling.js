import services from "@/services";
import store from "@/store";
import column_settings_all from "@/angaryos/modal/column_settings";
const json = [
  {
    table_name: "banka_gelen_havale_islemi",
    control: "satis_fatura_id",
    columns: {
      belge_no: "fatura_numarasi",
      islem_tarihi: "fatura_tarihi",
      para_birimi_id: "para_birimi_id",
      kdv_id: "kdv_id",
    },
  },
  {
    table_name: "banka_gelen_havale_islemi",
    control: "musteri_cek_id",
    columns: {
      //tablodaki ismi,çekilen verideki ismi
      belge_no: "cek_numarasi",
      tutar: "tutar",
      para_birimi_id: "para_birimi_id",
      kdv_id: 5,
      vergi_tutar: "tutar",
      döviz_kuru: "döviz_kuru",
    },
  },
];

const finance_tables = [
  {
    clm_name: "musteri_cek_id",
    table_name: "musteri_cek",
    module_name: "cekTahsilat",
    display_name: "Çek Tahsilat",
  },
  {
    clm_name: "firma_cek_id",
    table_name: "firma_cek",
    module_name: "cekOdeme",
    display_name: "Çek Ödeme",
  },
  {
    clm_name: "musteri_senet_id",
    table_name: "musteri_senet",
    module_name: "senetTahsilat",
    display_name: "Senet Tahsilat",
  },
  {
    clm_name: "firma_senet_id",
    table_name: "firma_senet",
    module_name: "senetOdeme",
    display_name: "Senet Ödeme",
  },
  {
    clm_name: "sabit_isletme_giderleri_id",
    table_name: "sabit_isletme_giderleri",
    module_name: "sabitOdeme",
    display_name: "İşletme Giderleri",
  },
  {
    clm_name: "alis_fatura_id",
    table_name: "alis_fatura",
    module_name: "faturaOdeme",
    display_name: "Fatura Ödeme",
  },
  {
    clm_name: "satis_fatura_id",
    table_name: "satis_fatura",
    module_name: "faturaTahsilat",
    display_name: "Fatura Tahsilat",
  },
];

const fun = {
  data() {
    return {
      table_name: "",
      column: {},
      params: {},
      column_settings: {},

      doubleParams: {}, //2.tablo parametreleri
      doubleColumns: {}, //2.tablo sütunları
      doubleColumnSettings: {},
      doubleDisabled: {},
    };
  },
  async changeEvent() {
    for (const val of Object.values(json)) {
      if (this.table_name == val.table_name && this.column.name == val.control) {
        await this.setVisibleConfig(true);
        await this.getData(this.params[this.column.name], val.columns);
      } else {
        await this.setVisibleConfig(false);
      }
    }
  },
  getData(id, columns) {
    services.edit(this.column.relation.table_name, id).then((res) => {
      let datas = res.data.data.record;
      for (const [key, val] of Object.entries(columns)) {
        this.params[key] = null;
        if (typeof val == typeof 0) {
          this.params[key] = val;
        } else if (typeof datas[val] == typeof []) {
          if (datas[val].length > 0) {
            this.params[key] = datas[val][0]["source"];
          }
        } else {
          this.params[key] = datas[val];
        }
      }
    });
  },
  cari_hesap() {},
  setVisibleConfig(state) {
    const config = {
      hide: ["kdv_id", "kdv_dahil_buton", "kdv_tutari", "vergi_tutar", "döviz_kuru", "dovizli_tutar"],
      disabled: ["belge_no", "para_birimi_id"],
    };
    if (state == true) {
      for (const val of config.hide) {
        if (this.column_settings[val] == undefined) {
          this.column_settings[val] = {
            input_visible: false,
          };
        } else {
          this.column_settings[val]["input_visible"] = false;
        }
      }
    } else {
      for (const val of config.hide) {
        if (this.column_settings[val] == undefined) {
          this.column_settings[val] = {
            input_visible: true,
          };
        } else {
          this.column_settings[val]["input_visible"] = true;
        }
      }
    }
  },
  /**
   * Otomatik fatura doldurucu.
   * Seçili mal hizmet, stok yada sabit kıymete göre gerekli alanları doldurur
   */
  async automaticInvoiceFiller(clmName) {
    let config = null;
    let yerlestir; //tablo -> edit
    if (this.table_name == "alis_fatura" || this.table_name == "alis_irsaliye" || this.table_name == "alis_siparis") {
      if (clmName == "stok_kartlari_id" && this.doubleParams[clmName] != undefined) {
        config = {
          table_name: "stok_kartlari",
          id: this.doubleParams[clmName],
        };
        yerlestir = {
          birim_id: "giris_birimi_id",
          birim_fiyat: "alis_fiyati",
          kdv_id: "alis_kdv_orani",
        };
      } else if (clmName == "hizmet_ve_masraf_kartlari_id") {
        config = {
          table_name: "hizmet_ve_masraf_kartlari",
          id: this.doubleParams[clmName],
        };
        yerlestir = {
          birim_fiyat: "birim_fiyat",
          kdv_id: "kdv_id",
          kdv_dahil_buton: "kdv_dahil_buton",
        };
      } else if (clmName == "sabit_kiymet_karti_id" && this.doubleParams[clmName] != undefined) {
        config = {
          table_name: "sabit_kiymet_karti",
          id: this.doubleParams[clmName],
        };
        yerlestir = {
          birim_id: "giris_birimi_id",
          birim_fiyat: "net_deger",
          miktar: "miktar",
        };
      }
    } else if (
      this.table_name == "satis_fatura" ||
      this.table_name == "satis_irsaliye" ||
      this.table_name == "satis_siparis"
    ) {
      if (clmName == "stok_kartlari_id" && this.doubleParams[clmName] != undefined) {
        config = {
          table_name: "stok_kartlari",
          id: this.doubleParams[clmName],
        };
        yerlestir = {
          birim_id: "cikis_birimi_id",
          birim_fiyat: "satis_fiyati",
          kdv_id: "satis_kdv_orani",
        };
      } else if (clmName == "hizmet_ve_masraf_kartlari_id") {
        config = {
          table_name: "hizmet_ve_masraf_kartlari",
          id: this.doubleParams[clmName],
        };
        yerlestir = {
          birim_fiyat: "birim_fiyat",
          kdv_id: "kdv_id",
          kdv_dahil_buton: "kdv_dahil_buton",
        };
      } else if (clmName == "sabit_kiymet_karti_id" && this.doubleParams[clmName] != undefined) {
        config = {
          table_name: "sabit_kiymet_karti",
          id: this.doubleParams[clmName],
        };
        yerlestir = {
          birim_id: "cikis_birimi_id",
          birim_fiyat: "net_deger",
          miktar: "miktar",
        };
      }
    }

    if (config != null && this.doubleParams[clmName] != undefined) {
      await this.getEditDatas(config).then((res) => {
        //const dsb = ["birim_id", "birim_fiyat", "miktar", "kdv_dahil_buton", "kdv_id"];
        /*dsb.forEach((e) => {
          this.doubleDisabled[e] = false;
        });*/
        let editData = res.data.data.record;
        for (const [table, edit] of Object.entries(yerlestir)) {
          if (typeof editData[edit] == typeof []) {
            this.doubleParams[table] = editData[edit][0]["source"];
          } else if (typeof editData[edit] == typeof true) {
            this.doubleParams[table] = editData[edit] ? "1" : "0";
          } else {
            this.doubleParams[table] = editData[edit];
          }

          /*if (clmName != "sabit_kiymet_karti_id") {
            this.doubleDisabled[table] = true;
          }*/
        }
      });
    }
  },
  async getEditDatas(config) {
    return services.edit(config.table_name, config.id);
  },
  finans(clmName) {
    let state = false;
    for (const val of Object.values(finance_tables)) {
      state = this.params[val.clm_name] > 0 || state;
    }
    if (state) {
      this.column_settings["belge_no"]["input_visible"] = false;
      this.column_settings["islem_tarihi"]["input_visible"] = false;
      this.column_settings["tutar"]["input_visible"] = false;
      this.column_settings["description"] =
        this.column_settings["description"] == undefined ? {} : this.column_settings["description"];
      this.column_settings["description"]["input_visible"] = false;
      this.column_settings["para_birimi_id"]["input_visible"] = false;
      this.column_settings["kdv_id"]["input_visible"] = false;
      this.column_settings["kdv_dahil_buton"] =
        this.column_settings["kdv_dahil_buton"] == undefined ? {} : this.column_settings["kdv_dahil_buton"];
      this.column_settings["kdv_dahil_buton"]["input_visible"] = false;
      this.column_settings["kdv_tutari"]["input_visible"] = false;
      this.column_settings["vergi_tutar"]["input_visible"] = false;
      this.column_settings["döviz_kuru"]["input_visible"] = false;
      this.column_settings["dovizli_tutar"]["input_visible"] = false;
      this.column_settings["state"]["input_visible"] = false;
      for (const val of Object.values(finance_tables)) {
        if (clmName == val.clm_name) {
          this.openModulesDialog({
            name: val.module_name,
            display_name: val.display_name,
            table_name: val.table_name,
            id: this.params[val.clm_name],
            column_settings: column_settings_all[val.table_name],
          });
          this.column_settings["belge_no"]["input_visible"] = true;
          this.column_settings["islem_tarihi"]["input_visible"] = true;
          this.column_settings["tutar"]["input_visible"] = true;
          this.column_settings["description"] =
            this.column_settings["description"] == undefined ? {} : this.column_settings["description"];
          this.column_settings["description"]["input_visible"] = true;
          this.column_settings["para_birimi_id"]["input_visible"] = true;
          this.column_settings["kdv_id"]["input_visible"] = true;
          this.column_settings["kdv_dahil_buton"] =
            this.column_settings["kdv_dahil_buton"] == undefined ? {} : this.column_settings["kdv_dahil_buton"];
          this.column_settings["kdv_dahil_buton"]["input_visible"] = true;
          this.column_settings["kdv_tutari"]["input_visible"] = true;
          this.column_settings["vergi_tutar"]["input_visible"] = true;
          this.column_settings["döviz_kuru"]["input_visible"] = true;
          this.column_settings["dovizli_tutar"]["input_visible"] = true;
          this.column_settings["state"]["input_visible"] = true;
        }
      }
      this.params = {};
      store.commit("setRightModalData", {
        state: false,
      });
    } else {
      this.column_settings["belge_no"]["input_visible"] = true;
      this.column_settings["islem_tarihi"]["input_visible"] = true;
      this.column_settings["tutar"]["input_visible"] = true;
      this.column_settings["description"] =
        this.column_settings["description"] == undefined ? {} : this.column_settings["description"];
      this.column_settings["description"]["input_visible"] = true;
      this.column_settings["para_birimi_id"]["input_visible"] = true;
      this.column_settings["kdv_id"]["input_visible"] = true;
      this.column_settings["kdv_dahil_buton"] =
        this.column_settings["kdv_dahil_buton"] == undefined ? {} : this.column_settings["kdv_dahil_buton"];
      this.column_settings["kdv_dahil_buton"]["input_visible"] = true;
      this.column_settings["kdv_tutari"]["input_visible"] = true;
      this.column_settings["vergi_tutar"]["input_visible"] = true;
      this.column_settings["döviz_kuru"]["input_visible"] = true;
      this.column_settings["dovizli_tutar"]["input_visible"] = true;
      this.column_settings["state"] = this.column_settings["state"] == undefined ? {} : this.column_settings["state"];
      this.column_settings["state"]["input_visible"] = false;
    }
  },
  openModulesDialog(m) {
    store.commit("setCenterModalData", {
      name: m.name,
      title: m.display_name,
      state: true,
      display: "right",
      table_name: m.table_name,
      id: m.id,
      column_settings: m.column_settings,
    });
  },
};
export default fun;
