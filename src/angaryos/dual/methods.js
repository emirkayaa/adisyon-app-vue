/*İlk Yapılacaklar*/
//Default verilen yer

import { ElNotification } from "element-plus";
import filling from "./filling.js";
import calculate from "./calculate.js";
import cFirst from "./change/fistTable.js";
import cSecond from "./change/secondTable.js";
const json_system_tables = [
  "alis_irsaliye",
  "satis_irsaliye",
  "alis_siparis",
  "satis_siparis",
  "teklifler",
  "alis_fatura",
  "satis_fatura",
  "e_fatura",
];
const methods = {
  /**
   * TEST MODU
   */
  testMode() {
    const prm = {
      limit: 1000,
      page: 1,
      sorts: {},
      filters: { tablo_ismi: { type: 1, guiType: "string", filter: this.table_name, columnName: "tablo_ismi", json: "" } },
    };
    this.$services.list("front_test", prm).then((res) => {
      this.front_test_list = res.data.data.records;
    });
  },
  //Son : testMode();
  saveTest() {
    const params = {
      tablo_ismi: this.table_name,
      name: this.test_name,
      test_json: JSON.stringify(this.params),
      test_json_2: JSON.stringify(this.doubleParams),
    };
    this.$services.add("front_test", params).then(() => {
      alert("başarılı");
    });
  },
  setTest(item) {
    if (item.test_json != null) {
      this.params = JSON.parse(item.test_json);
    }
    if (item.test_json_2 != null) {
      this.doubleParams = [];
      this.doubleDisabled = [];
      for (const val of Object.values(JSON.parse(item.test_json_2))) {
        this.doubleParams.push(val);
        this.doubleDisabled.push({});
        let st = JSON.parse(localStorage.getItem("dbconfig"));
        this.doubleColumnSettings.push(st);
        this.digerVergilerColumns.push(JSON.parse(val.diger_vergiler));
      }
    }
  },
  /**
   * Gelen tipe göre(ekle-düzenle) gelecek verilerin ve gidecek verilerin axios ayarlarının yapıldığı,
   * default atamalarının yapılıdığı fonksiyon.
   * * @methods {setDefaultDisable(), getData(), setGroup()}
   * Baş : setConfig()
   */
  async setConfig() {
    this.loading = true;

    if (this.type == "edit") {
      this.config.get = "edit";
      this.config.set = "update";
      this.config.access = "edits";
      this.config.id = "/" + this.id + "/";
    } else if (this.type == "create") {
      this.config.get = "create";
      this.config.set = "store";
      this.config.access = "creates";
      this.config.id = "/";
    }
    if (this.display == "double") {
      if (this.second_config?.column_settings != null) {
        localStorage.setItem("dbconfig", JSON.stringify(this.second_config.column_settings));
      }

      this.doubleColumnSettings.push(this.second_config.column_settings);

      if (this.type == "edit") {
        this.doubleConfig.get = "edit";
        this.doubleConfig.set = "update";
        this.doubleConfig.access = "edits";

        for (let [key, val] of Object.entries(this.second_config)) {
          if (val?.["filters"] != undefined) {
            this.doubleConfig[key] = val["filters"];
          }
        }
        /*İlk Yapılacaklar*/
        if (this.table_name == "e_fatura") {
          this.doubleConfig.parent_name = "bagli_efatura_id";
        }
        if (this.table_name == "e_arsiv_fatura") {
          this.doubleConfig.parent_name = "bagli_efatura_id";
        }
        if (this.table_name == "e_irsaliye") {
          this.doubleConfig.parent_name = "bagli_eirsaliye_id";
        }
        if (this.table_name == "serbest_meslek_makbuzu") {
          this.doubleConfig.parent_name = "bagli_efatura_id";
        }
        if (this.table_name == "fisler") {
          //calculate.receiptCalculation(0);
          this.doubleConfig.parent_name = "fisler_id";
        }
        if (this.table_name == "alis_fatura") {
          this.doubleConfig.parent_name = "alis_fatura_id";
        }
        if (this.table_name == "satis_fatura") {
          this.doubleConfig.parent_name = "satis_fatura_id";
        }
        if (this.table_name == "alis_irsaliye") {
          this.doubleConfig.parent_name = "alis_irsaliye_id";
        }
        if (this.table_name == "satis_irsaliye") {
          this.doubleConfig.parent_name = "satis_irsaliye_id";
        }
        if (this.table_name == "alis_siparis") {
          this.doubleConfig.parent_name = "alis_siparis_id";
        }
        if (this.table_name == "satis_siparis") {
          this.doubleConfig.parent_name = "satis_siparis_id";
        }
        if (this.table_name == "teklifler") {
          this.doubleConfig.parent_name = "teklifler_id";
        }
        if (this.table_name == "e_mustahsil_makbuzu") {
          this.doubleConfig.parent_name = "bagli_efatura_id";
        }
      } else if (this.type == "create") {
        this.doubleConfig.get = "create";
        this.doubleConfig.set = "store";
        this.doubleConfig.access = "creates";
        this.doubleConfig.id = "/";
      }
    }

    this.params = {};
    this.errors = {};
    this.disabled = {};
    this.columns = {};

    this.setDefaultDisable();
    await this.getData().then(() => {
      //REVIEW - Yeni Json sistemi
      if (json_system_tables.find((e) => e == this.table_name)) {
        if (this.type == "edit") {
          this.getDoubleColumns().then((res) => {
            this.doubleColumns = res.data.data.column_set.column_arrays[0].columns;

            this.doubleParams = [];
            this.doubleDisabled = [];
            this.digerVergilerColumns = [];

            if (this.params["mal_hizmet_json"] != undefined) {
              for (const val of Object.values(JSON.parse(this.params["mal_hizmet_json"]))) {
                this.doubleParams.push(val);
                this.doubleDisabled.push({});
                let st = JSON.parse(localStorage.getItem("dbconfig"));
                this.doubleColumnSettings.push(st);
                let dv = val?.diger_vergiler == undefined ? "{}" : val.diger_vergiler;
                this.digerVergilerColumns.push(JSON.parse(dv));
              }
              for (const [key, val] of Object.entries(this.doubleParams)) {
                if (val.diger_vergiler != undefined) {
                  let vergiler = [];
                  for (const vd of Object.values(JSON.parse(val.diger_vergiler))) {
                    if (vd.kod == "0015") continue;
                    vergiler.push({
                      mal_hizmet: vd.mal_hizmet,
                      toplam: vd.toplam,
                      id: vd.id,
                      kod: vd.kod,
                      oran: vd.oran,
                      display: vd.display,
                      istisna_kodu: vd.istisna_kodu,
                      istisna_sebebi: vd.istisna_sebebi,
                    });
                  }
                  this.digerVergilerColumns[key] = vergiler;
                }
              }
            }
            setTimeout(() => {
              this.loading = false;
            }, 100);
            return true;
          });
        } else if (this.type == "create") {
          this.getDoubleCreate().then(() => {
            this.setDataConfig();

            setTimeout(() => {
              //commit test
              this.loading = false;
            }, 100);
          });
        }
      } else {
        this.getDoubleData().then(() => {
          this.setDataConfig();
          setTimeout(() => {
            this.loading = false;
          }, 100);
          return true;
        });
      }
    });
    this.setGroup();
  },
  // Son: setConfig()
  /**
   *   Veriler geldikten sonra tetiklenen method
   * Baş : setDataConfig()
   */
  setDataConfig() {
    /*---------------------------*/
    if (this.table_name == "cari_hesap") {
      if (this.params["tc"]?.length <= 10 || this.params["tc"] == undefined) {
        this.disabled["name_basic"] = true;
        this.disabled["surname"] = true;
        this.column_settings["name_basic"]["required"] = false;
        this.column_settings["surname"]["required"] = false;
      } else {
        this.disabled["name_basic"] = false;
        this.disabled["surname"] = false;
        this.column_settings["name_basic"]["required"] = true;
        this.column_settings["surname"]["required"] = true;
      }
    }
    if (this.getConvertData.first) {
      this.params = this.getConvertData.first;
    }
    if (this.getConvertData.second) {
      this.doubleParams = [];
      this.doubleColumnSettings = [];
      for (const val of Object.values(this.getConvertData.second)) {
        this.doubleParams.push(val);
        let st = JSON.parse(localStorage.getItem("dbconfig"));
        this.doubleColumnSettings.push(st);
      }
    }

    this.$store.commit("setConvertData", {});
    //

    /*---------------------------*/
  },
  //Son: setDataConfig()
  //Önceki kaydı getir
  lastRecord() {
    if (this.type == "create" && this.$store.getters.getCreateData?.[this.table_name] != undefined) {
      this.params = this.$store.getters.getCreateData?.[this.table_name];
    }
  },
  beforeRecord() {
    this.loading = true;
    const params = {
      limit: 1,
      page: 1,
      sorts: [],
      filters: [],
    };
    this.$services.list(this.table_name, params).then((res) => {
      if (res.data.data.all_records_count > 0) {
        this.$services.edit(this.table_name, res.data.data.records[0].id).then((response) => {
          this.columns = response.data.data.column_set.column_arrays[0].columns;
          this.$emit("params", response.data.data.record);
          var record = {};
          if (this.table_name == "e_irsaliye") {
            this.irsaliyePlakaColumns = JSON.parse(response.data.data.record["dorse_plaka"]);
            this.irsaliyeSoforColumns = JSON.parse(response.data.data.record["sofor_bilgileri"]);
          }
          for (const [key, clm] of Object.entries(response.data.data.record)) {
            if (typeof clm == typeof [] && clm?.length > 0) {
              record[key] = clm[0]?.source;
            } else if (typeof clm == typeof [] && clm?.length <= 0) {
              record[key] = null;
            } else if (typeof clm == typeof true) {
              record[key] = clm ? "1" : "0";
            } else {
              record[key] = clm;
            }
          }
          this.params = record;
          for (const [key, val] of Object.entries(this.column_settings)) {
            if (val.input_visible == false) {
              delete this.params[key];
            }
          }
          if (this.display == "double") {
            this.getDoubleColumns().then((res) => {
              this.doubleColumns = res.data.data.column_set.column_arrays[0].columns;

              this.doubleParams = [];
              this.doubleDisabled = [];
              this.digerVergilerColumns = [];

              if (this.params["mal_hizmet_json"] != undefined) {
                let mal_hizmet_say = 0;
                for (const val of Object.values(JSON.parse(this.params["mal_hizmet_json"]))) {
                  this.doubleParams.push(val);
                  this.doubleDisabled.push({});
                  let st = JSON.parse(localStorage.getItem("dbconfig"));
                  this.doubleColumnSettings.push(st);
                  let dv = val?.diger_vergiler == undefined ? "{}" : val.diger_vergiler;

                  this.digerVergilerColumns.push(JSON.parse(dv));
                  cSecond.doubleParams = this.doubleParams;
                  cSecond.fatura_hizmet(mal_hizmet_say, "");
                  mal_hizmet_say++;
                }

                for (const [key, val] of Object.entries(this.doubleParams)) {
                  if (val.diger_vergiler != undefined) {
                    let vergiler = [];
                    for (const vd of Object.values(JSON.parse(val.diger_vergiler))) {
                      if (vd.kod == "0015") continue;
                      vergiler.push({
                        id: vd.id,
                        kod: vd.kod,
                        oran: vd.oran,
                        display: vd.display,
                        istisna_kodu: vd.istisna_kodu,
                        istisna_sebebi: vd.istisna_sebebi,
                        mal_hizmet: vd.mal_hizmet,
                        toplam: vd.toplam,
                      });
                    }
                    this.digerVergilerColumns[key] = vergiler;
                  }
                }
              }

              setTimeout(() => {
                this.loading = false;
              }, 100);
              return true;
            });
          } else {
            setTimeout(() => {
              this.loading = false;
            }, 100);
          }
        });
      } else {
        ElNotification({
          title: "Bulunamadı",
          message: "Daha önce eklenmiş kayıt bulunamadı",
          type: "warning",
          position: "top-left",
        });
        setTimeout(() => {
          this.loading = false;
        }, 100);
      }
    });
  },
  clearRecord() {
    this.$services.create(this.table_name).then((response) => {
      this.columns = response.data.data.column_set.column_arrays[0].columns;
      this.$emit("params", response.data.data.record);

      this.params = {};
      for (const clm of Object.keys(this.columns)) {
        //ANCHOR - DEFAULT VERİLEN YER
        if (clm == "para_birimi_id") {
          this.params[clm] = 1;
        } else if (clm == "kdv_id") {
          this.params[clm] = 5;
        } else if (clm == "kdv_dahil_buton") {
          this.params[clm] = "0";
        } else if (clm == "döviz_kuru") {
          this.params[clm] = 1;
        } else if (clm == "fatura_tipi_id") {
          this.params[clm] = 2;
        }
      }
      this.getDoubleCreate();
    });
  },
  /**
   * Double görünümünde üst tablo verilerini gruplayan fonksiyon.
   * Gizlenecek ve gösterilecek gruplar burada tanımlanır.
   * Baş : setGroup()
   */
  setGroup() {
    if (this.table_name == "e_fatura") {
      this.config.hideGroup = { 3: true, 4: true };
      this.config.group = [
        {
          id: 1,
          name: "Fatura bilgileri",
          items: [
            "firma_adres_id",
            "cari_hesap_id",
            "adres_id",
            "fatura_on_eki_id",
            "fatura_senaryo_id",
            "fatura_tipi_id",
            "fatura_tarihi",
            "para_birimi_id",
            "döviz_kuru",
          ],
        },
        {
          id: 2,
          name: "İrsaliye/Sipariş bilgileri",
          items: ["irsaliye_numarasi", "irsaliye_tarihi", "siparis_numarasi", "siparis_tarihi"],
        },
        {
          id: 3,
          name: "İade bilgileri",
          items: ["iade_fatura_numarasi", "iade_fatura_tarihi"],
        },
        {
          id: 4,
          name: "SGK Bilgileri",
          items: ["sgk_fatura_tipi_id", "mukellef_kodu", "mukellef_adi", "dosya_no"],
        },
      ];
    } else if (this.table_name == "e_irsaliye") {
      this.config.group = [
        {
          id: 1,
          name: "İrsaliye bilgileri",
          items: [
            "firma_adres_id",
            "cari_hesap_id",
            "adres_id",
            "fatura_on_eki_id",
            "irsaliye_tipi_id",
            "irsaliye_tarihi",
            "irsaliye_zamani",
            "para_birimi_id",
            "senaryo_id",
            "döviz_kuru",
          ],
        },
        {
          id: 2,
          name: "Adres Bilgileri",
          items: ["bina_adi", "bina_no", "kapi_no", "kasaba", "mahalle_adi", "sokak_adi", "posta_kodu", "sehirler_id"],
        },
        {
          id: 3,
          name: "Sipariş/Sevk Bilgileri",
          items: ["siparis_numarasi", "siparis_tarihi", "sevk_tarihi", "sevk_zamani"],
        },
        {
          id: 4,
          name: "Şoför Bilgileri",
          items: ["tasiyici_unvan", "tasiyici_vkn", "plaka"],
        },
        {
          id: "sofor",
        },
        {
          id: "plaka",
        },
      ];
    } else if (this.table_name == "e_arsiv_fatura") {
      this.config.group = [
        {
          id: 1,
          name: "E-Arşiv bilgileri",
          items: ["firma_adres_id", "cari_hesap_id", "adres_id", "fatura_on_eki_id", "fatura_senaryo_id", "döviz_kuru"],
        },
        {
          id: 2,
          name: "Fatura bilgileri",
          items: ["fatura_tipi_id", "fatura_tarihi", "fatura_saati", "para_birimi_id", "döviz_kuru"],
        },
      ];
    } else if (this.table_name == "serbest_meslek_makbuzu") {
      this.config.group = [
        {
          id: 1,
          name: "Makbuz bilgileri",
          items: ["firma_adres_id", "cari_hesap_id", "adres_id", "fatura_on_eki_id"],
        },
        {
          id: 2,
          name: "Düzenleme bilgileri",
          items: ["duzenleme_tarihi", "duzenleme_zamani"],
        },
      ];
    } else if (this.table_name == "e_mustahsil_makbuzu") {
      this.config.group = [
        {
          id: 1,
          name: "Makbuz bilgileri",
          items: ["firma_adres_id", "cari_hesap_id", "adres_id", "fatura_on_eki_id"],
        },
        {
          id: 2,
          name: "Düzenleme bilgileri",
          items: ["duzenleme_tarihi", "duzenleme_zamani", "teslim_tarihi"],
        },
      ];
    } else if (this.table_name == "alis_fatura" || this.table_name == "satis_fatura") {
      this.config.hideGroup = { 3: true, 4: true };
      this.config.group = [
        {
          id: 1,
          name: "Fatura Bilgileri",
          items: [
            "firma_adres_id",
            "cari_hesap_id",
            "adres_id",
            "fatura_on_eki_id",
            "fatura_senaryo_id",
            "fatura_tipi_id",
            "fatura_tarihi",
            "para_birimi_id",
            "fatura_numarasi",
            "döviz_kuru",
          ],
        },
        {
          id: 2,
          name: "İrsaliye/Sipariş bilgileri",
          items: ["irsaliye_numarasi", "irsaliye_tarihi", "siparis_numarasi", "siparis_tarihi"],
        },
        {
          id: 3,
          name: "İade bilgileri",
          items: ["iade_fatura_numarasi", "iade_fatura_tarihi"],
        },
        {
          id: 4,
          name: "SGK Bilgileri",
          items: ["sgk_fatura_tipi_id", "mukellef_kodu", "mukellef_adi", "dosya_no"],
        },
      ];
    } else if (this.table_name == "alis_irsaliye" || this.table_name == "satis_irsaliye") {
      this.config.hideGroup = { 3: true, 4: true };
      this.config.group = [
        {
          id: 1,
          name: "İrsaliye Bilgileri",
          items: ["irsaliye_numarasi", "irsaliye_tipi_id", "irsaliye_tarihi", "cari_hesap_id", "tc"],
        },
        {
          id: 2,
          name: "Ek Bilgiler",
          items: ["senaryo_id", "kopya_bilgisi_id", "para_birimi_id", "döviz_kuru"],
        },
        {
          id: 3,
          name: "İade bilgileri",
          items: ["iade_fatura_numarasi", "iade_fatura_tarihi"],
        },
        {
          id: 4,
          name: "SGK Bilgileri",
          items: ["sgk_fatura_tipi_id", "mukellef_kodu", "mukellef_adi", "dosya_no"],
        },
      ];
    } else if (this.table_name == "alis_siparis" || this.table_name == "satis_siparis") {
      this.config.hideGroup = { 3: true, 4: true };
      this.config.group = [
        {
          id: 1,
          name: "Sipariş Bilgileri",
          items: ["siparis_numarasi", "cari_hesap_id", "siparis_tarihi", "teslim_tarihi"],
        },
        {
          id: 2,
          name: "Ek Bilgiler",
          items: ["döviz_kuru", "para_birimi_id"],
        },
        {
          id: 3,
          name: "İade bilgileri",
          items: ["iade_fatura_numarasi", "iade_fatura_tarihi"],
        },
        {
          id: 4,
          name: "SGK Bilgileri",
          items: ["sgk_fatura_tipi_id", "mukellef_kodu", "mukellef_adi", "dosya_no"],
        },
      ];
    }
  },
  // Son: setGroup()
  /**
   * Propslarla beraber gelen disabled verilerini yerine yerleştiren fonksiyon.
   * Baş: setDefaultDisable()
   */
  setDefaultDisable() {
    for (let [clm, val] of Object.entries(this.column_settings)) {
      if (val?.disabled == true) {
        this.disabled[clm] = true;
      }
    }
    if (this.display == "double") {
      for (const key of Object.keys(this.doubleParams)) {
        for (let [clm, val] of Object.entries(this.doubleColumnSettings[key])) {
          if (val?.disabled == true) {
            this.doubleDisabled[key][clm] = true;
          }
        }
      }
    }
  },
  // Son: setDefaultDisable()
  /**
   * Ekleme ve düzenleme verilerini backendden çekmek için kullanılan fonksiyon.
   * Double görünümde üst tablonun verileni çekmek için kullanılır
   * Baş: getData()
   */
  async getData() {
    if (this.config.get == "edit") {
      await this.$services.edit(this.table_name, this.id).then((response) => {
        this.columns = response.data.data.column_set.column_arrays?.[0]?.columns;

        this.$emit("params", response.data.data.record);
        let record = {};

        for (const [key, clm] of Object.entries(response.data.data.record)) {
          if (this.columns[key]?.gui_type_name == "multiselect") {
            record[key] = [];
            clm.map((a, k) => {
              record[key][k] = a.source;
            });
          } else if (typeof clm == typeof [] && clm?.length > 0) {
            record[key] = clm[0]?.source;
          } else if (typeof clm == typeof [] && clm?.length <= 0) {
            record[key] = null;
          } else if (typeof clm == typeof true) {
            record[key] = clm ? "1" : "0";
          } else {
            record[key] = clm;
          }
        }
        this.params = record;
      });
    } else {
      await this.$services.create(this.table_name).then((response) => {
        this.columns = response.data.data.column_set.column_arrays[0].columns;
        this.$emit("params", response.data.data.record);

        this.params = {};
        //ANCHOR - DEFAULT VERİLEN YER
        for (const clm of Object.keys(this.columns)) {
          if (clm == "para_birimi_id") {
            this.params[clm] = 1;
          } else if (clm == "kdv_id") {
            this.params[clm] = 5;
          } else if (clm == "kdv_dahil_buton") {
            //Default verilen yer
            this.params[clm] = 0;
          } else if (clm == "döviz_kuru") {
            this.params[clm] = 1;
          } else if (clm == "fatura_tipi_id") {
            this.params[clm] = 2;
          } else if (clm == "fatura_senaryo_id") {
            this.params[clm] = 1;
          } else if (clm == "fatura_tarihi") {
            this.params[clm] = new Date().toISOString();
          } else if ((this.table_name == "alis_siparis" || this.table_name == "satis_siparis") && clm == "siparis_tarihi") {
            this.params[clm] = new Date().toISOString();
          } else if (clm == "teklif_tarihi") {
            this.params[clm] = new Date().toISOString();
          } else if (clm == "gecerlilik_tarihi") {
            // this.params[clm] = new Date().toISOString();
            let dateFull = new Date().getFullYear();
            let dateMonth = new Date().getMonth() + 1;
            let dateNew = new Date().getDate() + 1;
            this.params[clm] = dateFull + "-" + dateMonth + "-" + dateNew;
          }
        }
      });
    }
  },
  // Son: getData()
  /**
   * Ekleme ve düzenleme kullanıcının girdiği verileri backende göndermek için kullanılan fonksiyon.
   * Double görünümde üst tablonun verileni göndermek için kullanılır
   * Baş: setData()
   */
  async setData() {
    this.saveLoading = true;

    let formData = new FormData();
    this.params["column_set_id"] = this.$store.getters.getUserData.auths.tables[this.table_name]?.[this.config.access][0];
    formData.append("column_set_id", this.$store.getters.getUserData.auths.tables[this.table_name]?.[this.config.access][0]);
    this.$emit("new_params", this.params);
    for (const clm of Object.values(this.columns)) {
      if (clm.gui_type_name == "files") {
        if (
          this.params[clm.name] != undefined &&
          this.params[clm.name].length > 0 &&
          this.params[clm.name]?.search("data:image") > -1
        ) {
          formData.append(clm.name + "[]", this.DataURIToBlob(this.params[clm.name]));
        } else {
          formData.append(clm.name + "_old", this.params[clm.name]);
        }
      } else if (clm.gui_type_name == "multiselect") {
        formData.append(clm.name, JSON.stringify(this.params[clm.name]));
      } else {
        formData.append(clm.name, this.params[clm.name] == null ? "" : this.params[clm.name]);
      }
    }
    if (this.table_name == "users") {
      formData.append("state", "1");
      formData.append("language_id", "1");
      formData.append("tc", new Date().getTime());
    }
    if (this.config.set == "store") {
      return await this.$services
        .add(this.table_name, formData)
        .then((res) => {
          this.response = res.data.data;
          if (res.data.data.message == "success") {
            ElNotification({
              title: "Başarılı",
              message: "Başarıyla kaydedildi.",
              position: "top-left",
              type: "success",
            });
            this.$store.commit("setDualRefresh");
            this.params = {};
            this.$emit("message", "success");
          } else if (res.data.data.message == "error") {
            let errorLength = 0;
            for (let [key, val] of Object.entries(res.data.data.errors)) {
              this.errors[key] = val[0];
              ElNotification({
                type: "error",
                title: "Hata",
                message: val[0],
                position: "top-left",
                offset: 90 * errorLength + 40,
              });
              errorLength++;
            }
          }
        })
        .finally(() => {
          this.saveLoading = false;
          this.$store.commit("setTableRefresh");
        });
    } else if (this.config.set == "update") {
      return await this.$services
        .update(this.table_name, this.id, formData)
        .then((res) => {
          this.response = res.data.data;
          if (res.data.data.message == "success") {
            ElNotification({
              title: "Başarılı",
              message: "Başarıyla kaydedildi.",
              position: "top-left",
              type: "success",
            });
            this.$store.commit("setDualRefresh");
            this.$emit("message", "success");
          } else if (res.data.data.message == "error") {
            let errorLength = 0;
            for (let [key, val] of Object.entries(res.data.data.errors)) {
              this.errors[key] = val[0];
              ElNotification({
                type: "error",
                title: "Hata",
                message: val[0],
                position: "top-left",
                offset: 90 * errorLength + 40,
              });
              errorLength++;
            }
          }
        })
        .finally(() => {
          this.saveLoading = false;
        });
    }
  },
  deleteEvent() {
    this.$services.deleted(this.table_name, this.id).then((res) => {
      if (res.data.data.message == "success") {
        ElNotification({
          title: "Başarılı",
          message: "Veriniz başarıyla silindi.",
          position: "top-left",
          type: "success",
        });
        this.$emit("message", "success");
        this.$emit("new_params", "delete");
      }
    });
  },
  // Son: setData()
  DataURIToBlob(dataURI) {
    const splitDataURI = dataURI.split(",");
    const byteString = splitDataURI[0].indexOf("base64") >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  },
  /**
   * Double görünümde alt tablonun ekleme-düzenleme verilerini çekmek için kullanılan fonksiyon.
   * * @methods: getDoubleCreate(), getDoubleEdit()
   * Baş: getDoubleData()
   */
  async getDoubleData() {
    if (this.second_config?.table_name == undefined) return false;
    this.doubleLoading = true;
    let params = {
      ["column_set_id"]:
        this.$store.getters.getUserData.auths.tables[this.second_config?.table_name]?.[this.config.access]?.[0],
    };
    if (this.type == "create") {
      await this.getDoubleCreate();
    } else if (this.type == "edit") {
      const tablePrm = {
        limit: 100000,
        page: 1,
        filters: {
          [this.doubleConfig.parent_name]: {
            type: 1,
            guiType: "select",
            filter: [this.params["id"]],
          },
        },
        sorts: [],
      };
      await this.$services
        .list(this.second_config.table_name, tablePrm)
        .then(async (res) => {
          this.doubleParams = [];
          this.updateList = res.data.data.records;
          for (const val of Object.values(res.data.data.records)) {
            await this.getDoubleEdit(val.id);
          }
          if (res.data.data.all_records_count <= 0) {
            this.getDoubleCreate(params);
          }
        })
        .finally(() => {
          this.doubleLoading = false;
        });
    }
  },
  // Son: getDoubleData()
  async getDoubleColumns() {
    if (this.second_config?.table_name == undefined) return;
    return await this.$services.create(this.second_config.table_name).finally(() => {
      this.doubleLoading = false;
    });
  },
  /**
   * Double görünümde alt tablonun ekleme verilerini çekmek için kullanılan fonksiyon.
   * * @param 1: Backende gönderilecek parametreler ('column_set_id')
   * Baş: getDoubleCreate()
   */
  async getDoubleCreate() {
    if (this.second_config?.table_name == undefined) return;
    await this.$services
      .create(this.second_config.table_name)
      .then((res) => {
        this.doubleColumns = res.data.data.column_set.column_arrays[0].columns;
        //ANCHOR - DEFAULT VERİLEN YER
        for (const [key, val] of Object.entries(res.data.data.column_set.column_arrays[0].columns)) {
          if (this.doubleParams[0][key] == undefined) {
            if (key == "para_birimi_id") {
              this.doubleParams[0][key] = 1;
            } else if (key == "kdv_id") {
              this.doubleParams[0][key] = 4;
            } else if (key == "kdv_dahil_buton") {
              this.doubleParams[0][key] = "0";
            } else if (key == "döviz_kuru") {
              this.doubleParams[0][key] = 1;
            } else if (key == "iskonto_arttirim") {
              this.doubleParams[0][key] = "0";
            } else if (key == "fatura_senaryo_id") {
              this.doubleParams[0][key] = 1;
            } else if (key == "fatura_tarihi") {
              this.doubleParams[0][key] = new Date().toLocaleDateString("en-EG").replace("/", "-");
            } else {
              this.doubleParams[0][key] = "";
            }

            val;
          }
        }
      })
      .finally(() => {
        this.doubleLoading = false;
      });
  },
  // Son: getDoubleCreate()
  /**
   * Double görünümde alt tablonun düzenleme verilerini çekmek için kullanılan fonksiyon.
   * * @param 1: Backende gönderilecek parametreler ('column_set_id')
   * * @param 2: Düzenlenecek veri id'si
   * Baş: getDoubleEdit()
   */
  getDoubleEdit(id) {
    this.doubleParams = [];
    this.$services
      .edit(this.second_config.table_name, id)
      .then((res) => {
        this.doubleColumns = res.data.data.column_set.column_arrays[0]?.columns;
        let record = {};
        for (const key of Object.keys(this.doubleColumns)) {
          if (res.data.data.record[key]) {
            record[key] = res.data.data.record[key];
          } else {
            record[key] = null;
          }
        }
        for (const key of Object.keys(res.data.data.record)) {
          key;
          this.doubleColumnSettings.push(this.second_config.column_settings);
        }
        this.doubleParams.push(record);
        //  Düzenleme yaparken diğer vergilerin yerine yerleşmesi için kullanılan method
        for (const [key, val] of Object.entries(this.doubleParams)) {
          if (val.diger_vergiler != undefined) {
            let vergiler = [];
            for (const vd of Object.values(JSON.parse(val.diger_vergiler))) {
              if (vd.kod == "0015") continue;
              vergiler.push({
                id: vd.id,
                kod: vd.kod,
                oran: vd.oran,
                display_name: vd.display,
                istisna_kodu: vd.istisna_kodu,
                istisna_sebebi: vd.istisna_sebebi,
                mal_hizmet: vd.mal_hizmet,
                toplam: vd.toplam,
              });
            }
            this.digerVergilerColumns[key] = vergiler;
          }
        }
      })
      .finally(() => {
        this.doubleLoading = false;
      });
  },
  // Son: getDoubleEdit()
  /**
   * Double görünümde alt tablonun ekleme-düzenleme verilerini backende göndermek için kullanılan fonksiyon.
   * * @param 1: Üst tablodan gelen id (alt tablo ile bağlamak için)
   * * @methods: setDoubleUpdate(), setDoubleStore()
   * Üst tablo ile olan ilişkisi burada tanımlanır.
   * Baş: setDoubleData()
   */
  async setDoubleData(id) {
    let errorState = 0;

    for (let [key, val] of Object.entries(this.doubleParams)) {
      val["column_set_id"] =
        this.$store.getters.getUserData.auths.tables[this.second_config.table_name]?.[this.config.access]?.[0];

      if (this.type == "create") {
        //İlk Yapılacaklar
        if (this.second_config.table_name == "e_fatura_mal_hizme") val["bagli_efatura_id"] = id;
        if (this.second_config.table_name == "e_arsiv_hizmet") val["bagli_efatura_id"] = id;
        if (this.second_config.table_name == "e_arsiv_mal_hizmet") val["bagli_efatura_id"] = id;
        if (this.second_config.table_name == "e_irsaliye_mal_hizmet") val["bagli_eirsaliye_id"] = id;
        if (this.second_config.table_name == "serbest_meslek_malhizmet") val["bagli_efatura_id"] = id;
        if (this.second_config.table_name == "fis_satiri") val["fisler_id"] = id;
        if (this.second_config.table_name == "alis_fatura_hizmet") val["alis_fatura_id"] = id;
        if (this.second_config.table_name == "satis_fatura_hizmet") val["satis_fatura_id"] = id;
        if (this.second_config.table_name == "alis_irsaliye_hizmet") val["alis_irsaliye_id"] = id;
        if (this.second_config.table_name == "satis_irsaliye_hizmet") val["satis_irsaliye_id"] = id;
        if (this.second_config.table_name == "alis_siparis_hizmet") val["alis_siparis_id"] = id;
        if (this.second_config.table_name == "satis_siparis_hizmet") val["satis_siparis_id"] = id;
        if (this.second_config.table_name == "teklifler_mal_hizmet") val["teklifler_id"] = id;
        if (this.second_config.table_name == "e_mustahsil_malhizmet") val["bagli_efatura_id"] = id;
        errorState = await this.setDoubleStore(key, val);
      } else if (this.type == "edit") {
        //İlk Yapılacaklar
        if (this.second_config.table_name == "e_fatura_mal_hizme") val["bagli_efatura_id"] = this.params.id;
        if (this.second_config.table_name == "e_arsiv_mal_hizmet") val["bagli_efatura_id"] = this.params.id;
        if (this.second_config.table_name == "e_irsaliye_mal_hizmet") val["bagli_eirsaliye_id"] = this.params.id;
        if (this.second_config.table_name == "serbest_meslek_malhizmet") val["bagli_efatura_id"] = this.params.id;
        if (this.second_config.table_name == "fis_satiri") val["fisler_id"] = this.params.id;
        if (this.second_config.table_name == "alis_fatura_hizmet") val["alis_fatura_id"] = this.params.id;
        if (this.second_config.table_name == "satis_fatura_hizmet") val["satis_fatura_id"] = this.params.id;
        if (this.second_config.table_name == "alis_irsaliye_hizmet") val["alis_irsaliye_id"] = this.params.id;
        if (this.second_config.table_name == "satis_irsaliye_hizmet") val["satis_irsaliye_id"] = this.params.id;
        if (this.second_config.table_name == "alis_siparis_hizmet") val["alis_siparis_id"] = this.params.id;
        if (this.second_config.table_name == "satis_siparis_hizmet") val["satis_siparis_id"] = this.params.id;
        if (this.second_config.table_name == "teklifler_mal_hizmet") val["teklifler_id"] = this.params.id;
        if (this.second_config.table_name == "e_mustahsil_malhizmet") val["bagli_efatura_id"] = this.params.id;
        if (val?.["id"] != undefined) {
          errorState = await this.setDoubleUpdate(key, val);
        } else errorState = await this.setDoubleStore(key, val);
        for (const [key1, control] of Object.entries(val)) {
          if (control == "[]") {
            this.doubleParams[key][key1] = null;
          }
        }
      }
    }

    for (const val of Object.values(this.updateList)) {
      if (this.doubleParams.find((e) => e.id == val.id) == undefined) {
        this.setDoubleDelete(-1, val);
      }
    }

    if (errorState == false) {
      ElNotification({
        title: "Başarılı",
        message: "KAYIT BAŞARILI YÖNLENDİRİLİYOR.",
        position: "bottom-left",
        type: "success",
        duration: 7000,
      });
      this.$router.go(-1);
    }
  },
  // Son: setDoubleData()
  setParamsIdToDouble(id) {
    for (let [key, val] of Object.entries(this.doubleParams)) {
      key;
      val["column_set_id"] =
        this.$store.getters.getUserData.auths.tables[this.second_config.table_name]?.[this.config.access]?.[0];

      if (this.type == "create") {
        //İlk Yapılacaklar
        if (this.second_config.table_name == "e_fatura_mal_hizme") val["bagli_efatura_id"] = id;
        if (this.second_config.table_name == "e_arsiv_hizmet") val["bagli_efatura_id"] = id;
        if (this.second_config.table_name == "e_arsiv_mal_hizmet") val["bagli_efatura_id"] = id;
        if (this.second_config.table_name == "e_irsaliye_mal_hizmet") val["bagli_eirsaliye_id"] = id;
        if (this.second_config.table_name == "serbest_meslek_malhizmet") val["bagli_efatura_id"] = id;
        if (this.second_config.table_name == "fis_satiri") val["fisler_id"] = id;
        if (this.second_config.table_name == "alis_fatura_hizmet") val["alis_fatura_id"] = id;
        if (this.second_config.table_name == "satis_fatura_hizmet") val["satis_fatura_id"] = id;
        if (this.second_config.table_name == "alis_irsaliye_hizmet") val["alis_irsaliye_id"] = id;
        if (this.second_config.table_name == "satis_irsaliye_hizmet") val["satis_irsaliye_id"] = id;
        if (this.second_config.table_name == "alis_siparis_hizmet") val["alis_siparis_id"] = id;
        if (this.second_config.table_name == "satis_siparis_hizmet") val["satis_siparis_id"] = id;
        if (this.second_config.table_name == "teklifler_mal_hizmet") val["teklifler_id"] = id;
        if (this.second_config.table_name == "e_mustahsil_malhizmet") val["bagli_efatura_id"] = id;
      } else if (this.type == "edit") {
        //İlk Yapılacaklar
        if (this.second_config.table_name == "e_fatura_mal_hizme") val["bagli_efatura_id"] = this.params.id;
        if (this.second_config.table_name == "e_arsiv_mal_hizmet") val["bagli_efatura_id"] = this.params.id;
        if (this.second_config.table_name == "e_irsaliye_mal_hizmet") val["bagli_eirsaliye_id"] = this.params.id;
        if (this.second_config.table_name == "serbest_meslek_malhizmet") val["bagli_efatura_id"] = this.params.id;
        if (this.second_config.table_name == "fis_satiri") val["fisler_id"] = this.params.id;
        if (this.second_config.table_name == "alis_fatura_hizmet") val["alis_fatura_id"] = this.params.id;
        if (this.second_config.table_name == "satis_fatura_hizmet") val["satis_fatura_id"] = this.params.id;
        if (this.second_config.table_name == "alis_irsaliye_hizmet") val["alis_irsaliye_id"] = this.params.id;
        if (this.second_config.table_name == "satis_irsaliye_hizmet") val["satis_irsaliye_id"] = this.params.id;
        if (this.second_config.table_name == "alis_siparis_hizmet") val["alis_siparis_id"] = this.params.id;
        if (this.second_config.table_name == "satis_siparis_hizmet") val["satis_siparis_id"] = this.params.id;
        if (this.second_config.table_name == "teklifler_mal_hizmet") val["teklifler_id"] = this.params.id;
        if (this.second_config.table_name == "e_mustahsil_malhizmet") val["bagli_efatura_id"] = this.params.id;
      }
    }
  },
  /**
   * Double görünümde alt tablonun düzenleme verilerini backende göndermek için kullanılan fonksiyon.
   * * @param 1: Düzenlenen verinin doubleParams indexi
   * * @param 2: Düzenlenen veri
   * Baş: setDoubleUpdate()
   */
  async setDoubleUpdate(key, val) {
    let errorState;
    for (const [dk, data] of Object.entries(val)) {
      if (typeof data == typeof [] && data != null) {
        if (data.length <= 0) {
          val[dk] = null;
        }
      }
    }
    await this.$services
      .update(this.second_config.table_name, val["id"], val)
      .then((res) => {
        this.doubleErrors[key] = {};
        if (res.data.data.message == "success") {
          errorState = false;
          ElNotification({
            title: "Başarılı",
            message: "Satır başarıyla kaydedildi.",
            position: "top-left",
            type: "success",
          });
          this.$emit("message", "success");
        } else if (res.data.data.message == "error") {
          var errorLength = 0;
          errorState = true;

          for (let [errKey, errVal] of Object.entries(res.data.data.errors)) {
            this.doubleErrors[key][errKey] = errVal[0];
            ElNotification({
              type: "error",
              title: "Hata",
              message: errVal[0],
              position: "top-left",
              offset: 90 * errorLength + 40,
            });
            errorLength++;
          }
        }
      })
      .catch(() => {
        errorState = true;
      })
      .finally(() => {
        this.saveLoading = false;
      });
    return errorState;
  },
  // Son: setDoubleUpdate()
  /**
   * Double görünümde alt tablonun ekleme verilerini backende göndermek için kullanılan fonksiyon.
   * * @param 1: Eklenen verinin doubleParams indexi
   * * @param 2: Eklenen veri
   * Baş: setDoubleStore()
   */
  async setDoubleStore(key, val) {
    let errorState;
    await this.$services
      .add(this.second_config.table_name, val)
      .then((res) => {
        if (res.data.data.message == "success") {
          this.doubleErrors[key] = {};
          this.doubleParams[key]["id"] = res.data.data.id;
          errorState = false;
          ElNotification({
            title: "Başarılı",
            message: "Satır başarıyla kaydedildi.",
            position: "top-left",
            type: "success",
          });
          this.$emit("message", "success");
        } else if (res.data.data.message == "error") {
          var errorLength = 0;
          errorState = true;
          this.doubleErrors[key] = {};
          for (let [errKey, errVal] of Object.entries(res.data.data.errors)) {
            this.doubleErrors[key][errKey] = errVal[0];
            ElNotification({
              type: "error",
              title: "Hata",
              message: errVal[0],
              position: "top-left",
              offset: 90 * errorLength + 40,
            });
            errorLength++;
          }
        }
      })
      .catch(() => {
        errorState = true;
      })
      .finally(() => {
        this.saveLoading = false;
      });
    return errorState;
  },
  // Son: setDoubleStore()
  /**
   * Double görünümde alt tabloda silinen verilerin backende göndermek için kullanılan fonksiyon.
   * * @param 1: Silinen verinin doubleParams indexi
   * * @param 2: Silinen veri
   * Baş: setDoubleDelete()
   */
  async setDoubleDelete(key, val) {
    let errorState;
    this.$services
      .deleted(this.second_config.table_name, val["id"])
      .then((res) => {
        this.doubleErrors[key] = {};
        if (res.data.data.message == "success") {
          errorState = false;
          ElNotification({
            title: "Başarılı",
            message: "Satır başarıyla silindi.",
            position: "top-left",
            type: "success",
          });
          this.$emit("message", "success");
        } else if (res.data.data.message == "error") {
          var errorLength = 0;
          errorState = true;

          for (let [errKey, errVal] of Object.entries(res.data.data.errors)) {
            this.doubleErrors[key][errKey] = errVal[0];
            ElNotification({
              type: "error",
              title: "Hata",
              message: errVal[0],
              position: "top-left",
              offset: 90 * errorLength + 40,
            });
            errorLength++;
          }
        }
      })
      .catch(() => {
        errorState = true;
      })
      .finally(() => {
        this.saveLoading = false;
      });
    return errorState;
  },
  // Son: setDoubleDelete()

  /**
   * Zorunlu kontrollerinin yapıldığı bölüm.
   * Baş: checkRequired()
   */
  async checkRequired() {
    var errorLength = 0;
    this.errors = {};

    for (const [key, val] of Object.entries(this.column_settings)) {
      if (val?.required != undefined && val?.required == true) {
        if (this.params[key] == undefined || this.params[key] == "") {
          if (this.errors[key] == undefined) this.errors[key] = "";
          this.errors[key] = this.columns[key]?.display_name + " alanı zorunludur.";
          ElNotification({
            type: "error",
            title: "Hata",
            message: this.columns[key].display_name + " alanı zorunludur.",
            position: "top-left",
            offset: 90 * errorLength + 40,
          });
          errorLength++;
        }
      }
      if (val?.min != undefined) {
        if (this.params[key]?.length < val.min) {
          this.errors[key] = this.columns[key].display_name + " en az " + val.min + " karakter olmalıdır.";
          ElNotification({
            type: "error",
            title: "Hata",
            message: this.columns[key].display_name + " en az " + val.min + " karakter olmalıdır ",
            position: "top-left",
            offset: 90 * errorLength + 40,
          });
          errorLength++;
        }
      }
      if (val?.max != undefined) {
        if (this.params[key]?.length > val.max) {
          this.errors[key] = this.columns[key].display_name + " en fazla " + val.max + " karakter olmalıdır.";
          ElNotification({
            type: "error",
            title: "Hata",
            message: this.columns[key].display_name + " en fazla " + val.max + " karakter olmalıdır.",
            position: "top-left",
            offset: 90 * errorLength + 40,
          });
          errorLength++;
        }
      }
      if (val?.minValue != undefined) {
        if (this.params[key] < val.minValue && this.params[key] != "") {
          this.errors[key] = this.columns[key].display_name + " en az " + val.minValue + " değerini almalıdır.";
          ElNotification({
            type: "error",
            title: "Hata",
            message: this.columns[key].display_name + " en az " + val.max + " değerini almalıdır.",
            position: "top-left",
            offset: 90 * errorLength + 40,
          });
          errorLength++;
        }
      }
    }
    if (this.display == "double") {
      for (const [key, params] of Object.entries(this.doubleParams)) {
        params;
        for (const [clm, config] of Object.entries(this.doubleColumnSettings[key])) {
          if (
            config.required == true &&
            (this.doubleParams[key][clm] == null ||
              this.doubleParams[key][clm] == undefined ||
              this.doubleParams[key][clm] == "")
          ) {
            if (this.doubleErrors[key] == undefined) this.doubleErrors[key] = {};
            this.doubleErrors[key][clm] = "Bu alan zorunludur.";

            ElNotification({
              type: "error",
              title: "Hata",
              message: this.doubleColumns[clm].display_name + " alanı zorunludur.",
              position: "top-left",
              offset: 90 * errorLength + 40,
            });
            errorLength++;
          } else if (config?.required == true && !this.isEmpty(this.doubleParams[key][clm])) {
            if (this.doubleErrors[key] == undefined) this.doubleErrors[key] = {};
            delete this.doubleErrors[key][clm];
          }
        }
      }

      for (const [key, val] of Object.entries(this.doubleParams)) {
        if (this.second_config.table_name == "fis_satiri") {
          if (
            val["belge_tipi_id"] == 8 &&
            (val["belge_aciklamasi"] == undefined || val["belge_aciklamasi"] == null || val["belge_aciklamasi"] == "")
          ) {
            this.doubleErrors[key]["belge_aciklamasi"] = "Bu alan zorunludur.";
            ElNotification({
              type: "error",
              title: "Hata",
              message: this.doubleColumns["belge_aciklamasi"].display_name + " alanı zorunludur.",
              position: "top-left",
              offset: 90 * errorLength + 40,
            });
            errorLength++;
          }
        }
      }
    }
    return errorLength == 0;
  },
  // Son: checkRequired()
  /**
   * Dual.vue yüklendiğinde tetiklenen method.
   * Baş: loadConfig()
   */
  loadConfig() {
    if (this.table_name == "cari_hesap") {
      if (this.params["tc"]?.length <= 10 || this.params["tc"] == undefined) {
        this.disabled["name_basic"] = true;
        this.disabled["surname"] = true;
      } else {
        this.disabled["name_basic"] = false;
        this.disabled["surname"] = false;
      }
    }
  },
  // Son:loadConfig()
  /**
   * İrsaliye sayfasında gerçekleşen fonksiyonlar
   * * @param 1: Kolon ismi
   * * @param 2: Kolon ne yapacağı
   * Baş:
   */
  irsaliyeMethods(clm, process, key) {
    if (clm == "sofor" && process == "store") {
      this.irsaliyeSoforColumns.push({
        isim: "",
        soyisim: "",
        tc: "",
      });
    } else if (clm == "sofor" && process == "delete") {
      this.irsaliyeSoforColumns.splice(key, 1);
    } else if (clm == "sofor" && process == "setData") {
      this.params["sofor_bilgileri"] = JSON.stringify(this.irsaliyeSoforColumns);
    }

    if (clm == "plaka" && process == "store") {
      this.irsaliyePlakaColumns.push("");
    } else if (clm == "plaka" && process == "delete") {
      this.irsaliyePlakaColumns.splice(key, 1);
    } else if (clm == "plaka" && process == "setData") {
      this.params["dorse_plaka"] = JSON.stringify(this.irsaliyePlakaColumns);
    }
  },
  // Son: irsaliyeMethods()
  /**
   * Inputlarda herhangi bir değişiklikte bu fonksiyon çalışır.
   * Gizlemek, devre dışı bırakmak yada bir method tetiklemek istendiğinde burada tanımlanır.
   * Double görünümde üst tablo için geçerlidir!
   * * @param 1: Değişiklik yapılan inputun name
   * * @param 2: Select options
   * Baş: onChange()
   */
  onChange(clmName, options) {
    //Hesaplama sınıfı: gerekli verinin sınıfa gönderilmesi
    calculate.params = this.params;
    calculate.columns = this.columns;
    /* ------------------------------------------------------------------------ */
    //Yerleştirme sınıfı: Gerekli verinin sınıfa gönderilmesi
    filling.table_name = this.table_name;
    filling.params = this.params;
    filling.column = this.columns[clmName];
    filling.column_settings = this.column_settings;

    /* ------------------------------------------------------------------------ */
    //Change Event Sınıfı ilk tablo: Gerekli verinin sınıfa gönderilmesi
    cFirst.table_name = this.table_name;
    cFirst.params = this.params;
    cFirst.disabled = this.disabled;
    cFirst.config = this.config;
    cFirst.doubleParams = this.doubleParams;
    cFirst.second_config = this.second_config;
    cFirst.doubleDisabled = this.doubleDisabled;
    cFirst.column_settings = this.column_settings;
    cFirst.table_name = this.table_name;
    cFirst.doubleColumns = this.doubleColumns;
    cFirst.dbconfig = this.dbconfig;
    cFirst.allColumn(clmName);
    /* ------------------------------------------------------------------------ */
    if (this.table_name == "cari_hesap") cFirst.cari_hesap();
    /* ------------------------------------------------------------------------ */
    if (this.table_name == "e_fatura") cFirst.fatura(clmName, options);
    if (this.table_name == "e_arsiv_fatura") cFirst.fatura(clmName, options);
    if (this.table_name == "alis_fatura") cFirst.fatura(clmName, options);
    if (this.table_name == "satis_fatura") cFirst.fatura(clmName, options);
    /* ------------------------------------------------------------------------ */
    if (this.table_name == "tahsilat_islem") cFirst.finans(clmName);
    if (this.table_name == "odeme_islemi") cFirst.finans(clmName);
    if (this.table_name == "banka_gelen_havale_islemi") cFirst.finans(clmName);
    if (this.table_name == "banka_giden_havale_islem") cFirst.finans(clmName);
    /* ------------------------------------------------------------------------ */
    if (this.table_name == "musteri_cek") cFirst.cek_senet();
    if (this.table_name == "firma_cek") cFirst.cek_senet();
    if (this.table_name == "musteri_senet") cFirst.cek_senet();
    if (this.table_name == "firma_senet") cFirst.cek_senet();
    /* ------------------------------------------------------------------------ */
    if (this.table_name == "kobi_siparis") cFirst.kobi_siparis(clmName);
    /* ------------------------------------------------------------------------ */
    if (this.table_name == "filtre") cFirst.filtre(clmName);
    /* ------------------------------------------------------------------------ */
    if (this.table_name == "stok_kartlari") cFirst.stok_kartlari(clmName);
    if (this.table_name == "stok_hareketleri") cFirst.stok_hareketleri(clmName);
    /* ------------------------------------------------------------------------ */
    if (this.table_name == "hizmet_ve_masraf_kartlari") cFirst.hizmet_ve_masraf(clmName);
    /* ------------------------------------------------------------------------ */
    if (this.table_name == "sabit_kiymet_karti") cFirst.sabit_kiymet(clmName);
    if (this.table_name == "mali_personel_hareketi") cFirst.mali_personel(clmName);

    this.params = calculate.params;
    this.doubleParams = cFirst.doubleParams;

    if (this.second_config?.column_settings != null) {
      localStorage.setItem("dbconfig", JSON.stringify(this.second_config.column_settings));
    }
    var dt = this.$store.getters.getCreateData;
    if (dt == null) dt = {};
    dt[this.table_name] = this.params;
    this.$store.commit("setCreateData", dt);
  },
  // Son: onChange()
  /**
   * Double görünümde alt tabloda inputlarda yapılan herhangi bir değişiklikte bu fonksiyon tetiklenir.
   * Gizlemek, devre dışı bırakmak yada bir method tetiklemek istendiğinde burada tanımlanır.
   * @param 1: Değişiklik yapılan satırın doubleParams indexi
   * @param 2: Değişiklik yapılan inputun name
   * Baş: onChangeDP()
   */
  onChangeDP(i, clmName = "") {
    //Hesaplama sınıfı: gerekli verinin sınıfa gönderilmesi
    calculate.doubleParams = this.doubleParams;
    calculate.doubleColumns = this.doubleColumns;
    calculate.doubleTotal = this.doubleTotal;
    calculate.digerVergilerColumns = this.digerVergilerColumns;
    calculate.vergilerJson = this.vergilerJson;
    calculate.tevkifatlar_toplami = this.tevkifatlar_toplami;
    calculate.selectResult = this.selectResult;
    /* ------------------------------------------------------------------------ */
    if (this.doubleDisabled[i] == undefined) {
      this.doubleDisabled[i] = {};
    }
    /* ------------------------------------------------------------------------ */
    //Change Event Sınıfı ikinci tablo: Gerekli verinin sınıfa gönderilmesi
    cSecond.params = this.params;
    cSecond.disabled = this.disabled;
    cSecond.config = this.config;
    cSecond.dbconfig = this.dbconfig;
    cSecond.doubleParams = this.doubleParams;
    cSecond.second_config = this.second_config;
    cSecond.doubleDisabled = this.doubleDisabled;
    cSecond.column_settings = this.column_settings;
    cSecond.table_name = this.table_name;
    cSecond.selectResult = this.selectResult;
    cSecond.digerVergilerColumns = this.digerVergilerColumns;
    cSecond.doubleTotal = this.doubleTotal;
    cSecond.doubleColumnSettings = this.doubleColumnSettings;
    /* ------------------------------------------------------------------------ */
    if (this.second_config.table_name == "alis_fatura_hizmet") cSecond.fatura(i, clmName);
    if (this.second_config.table_name == "satis_fatura_hizmet") cSecond.fatura(i, clmName);
    if (this.second_config.table_name == "e_fatura_mal_hizme") cSecond.fatura(i, clmName);
    if (this.second_config.table_name == "e_arsiv_mal_hizmet") cSecond.fatura(i, clmName);
    /* ------------------------------------------------------------------------ */
    if (this.second_config.table_name == "teklifler_mal_hizmet") cSecond.teklif(i, clmName);
    /* ------------------------------------------------------------------------ */
    if (this.second_config.table_name == "e_irsaliye_mal_hizmet") cSecond.e_irsaliye_mal_hizmet(i);
    /* ------------------------------------------------------------------------ */
    if (this.second_config.table_name == "serbest_meslek_malhizmet") cSecond.serbest_meslek_malhizmet(i);
    /* ------------------------------------------------------------------------ */
    if (this.second_config.table_name == "e_mustahsil_malhizmet") cSecond.e_mustahsil_malhizmet(i, clmName);
    /* ------------------------------------------------------------------------ */
    if (this.second_config.table_name == "fis_satiri") cSecond.fis_satiri(i, clmName);
    /* ------------------------------------------------------------------------ */
    if (this.second_config.table_name == "alis_fatura_hizmet") cSecond.fatura_hizmet(i, clmName);
    if (this.second_config.table_name == "satis_fatura_hizmet") cSecond.fatura_hizmet(i, clmName);

    if (this.second_config.table_name == "alis_irsaliye_hizmet") cSecond.irsaliye_hizmet(i, clmName);
    if (this.second_config.table_name == "satis_irsaliye_hizmet") cSecond.irsaliye_hizmet(i, clmName);

    if (this.second_config.table_name == "alis_siparis_hizmet") cSecond.siparis_hizmet(i, clmName);
    if (this.second_config.table_name == "satis_siparis_hizmet") cSecond.siparis_hizmet(i, clmName);
    /* ------------------------------------------------------------------------ */
    for (const settings of Object.values(this.doubleColumnSettings)) {
      for (const [key, val] of Object.entries(settings)) {
        if (this.dbconfig[key] == undefined) {
          this.dbconfig[key] = val.input_visible;
        } else {
          if (val["input_visible"] != false) {
            this.dbconfig[key] = true;
          }
        }
      }
    }
    this.doubleTotal = cSecond.doubleTotal;
    localStorage.setItem("dbconfig", JSON.stringify(this.second_config.column_settings));
  },
  // Son: onChangeDP()
  /**
   * Double görünümünde alt tabloda satır silmek için kullanılır.
   * * @param 1: silinmek istenen satırın doubleParams indexi
   * Baş: onRemoveDP()
   */
  onRemoveDP(index) {
    this.doubleLoading = true;
    this.doubleParams.splice(index, 1);
    this.digerVergilerColumns[index] = [];
    this.doubleDisabled.splice(index, 1);
    this.doubleColumnSettings.splice(index, 1);
    if (this.doubleParams.length <= 0) this.addDoubleParam();
    this.onChangeDP(0);

    setTimeout(() => {
      this.doubleLoading = false;
    }, 10);
  },
  // Son: onRemoveDP()
  /**
   *  Diğer vergiler kolonundan vergi kaldırmak için kullanılır
   * Baş: onRemoveDV()
   */
  onRemoveDV(key, dvk) {
    this.digerVergilerColumns[key][dvk]["value"] = 0;

    this.onChangeDP(key, this.digerVergilerColumns[key][dvk].name);
    this.doubleColumnSettings[key]["otv_istisna_muafiyet_sebebi_id"]["input_visible"] = false;
    this.digerVergilerColumns[key].splice(dvk, 1);
  },
  //Son: onRemoveDV()
  /**
   * Double görünümünde alt tabloda satır eklemek için kullanılır.
   * Baş: addDoubleParam()
   */
  addDoubleParam() {
    let prm = {};
    for (const key of Object.keys(this.doubleColumns)) {
      prm[key] = null;
    }
    this.doubleParams.push(prm);
    let st = JSON.parse(localStorage.getItem("dbconfig"));
    this.doubleColumnSettings.push(st);
  },
  // Son: addDoubleParam()
  /**
   * İnputlarda keyUp eventi tetiklendiğinde çalışır.
   * Son satıra geldiğinde yeni satır ekleme işlemi yapar.
   * * @param 1: event
   * Baş: keyUpEvent()
   */
  keyUpEvent(e) {
    e;
    /*if (e.keyCode == 13 && false) {
      var inputs = document.getElementsByTagName("input");

      var index = Object.values(inputs)
        .map(function (e) {
          return e;
        })
        .indexOf(e.target);

      setTimeout(() => {
        if (inputs[index + 1].id == "sonEleman") {
          this.doubleParams.push({});
          setTimeout(() => {
            this.keyUpEvent({ target: inputs[index], keyCode: 13 });
          }, 10);
        }
        inputs[index].blur();
        inputs[index + 1].focus();
      }, 100);
    }*/
  },
  // Son: keyUpEvent()
  /**
   * İnputlarda keyDown eventi tetiklendiğinde çalışır.
   * Son satıra geldiğinde yeni satır ekleme işlemi yapar.
   * * @param 1: event
   * Baş: keyDownEvent()
   */
  keyDownEvent(e) {
    if (e.target.id == "sonEleman") {
      let prm;
      for (const key of Object.keys(this.doubleColumns)) {
        prm[key] = null;
      }
      this.doubleParams.push(prm);
      this.addDoubleParam();
    }
    if (e.keyCode == 9 && e.shiftKey == false) {
      var inputs = document.getElementsByTagName("input");

      var index = Object.values(inputs)
        .map(function (e) {
          return e;
        })
        .indexOf(e.target);

      setTimeout(() => {
        if (inputs[index + 1].id == "sonEleman") {
          //this.doubleParams.push({});
          this.addDoubleParam();
          this.keyDownEvent({
            target: inputs[index],
            keyCode: 9,
            shiftKey: false,
          });
        }
        inputs[index].blur();
        inputs[index + 1].focus();
      }, 100);
    }
  },
  // Son: keyDownEvent()
  /**
   * Kaydet butonuna basıldığında gerekli ayarlamalara göre en doğru eklemeyi yapmak için gerekli fonksiyonları çağırır.
   * * @method: setDoubleData(),setData()
   * Baş: save()
   */
  save() {
    this.checkRequired().then((e) => {
      if (e == true) {
        if (this.display == "double") {
          if (this.response?.message == "success" && json_system_tables.find((e) => e != this.table_name)) {
            this.setDoubleData(this.response.id);
          } else {
            //REVIEW - YENİ JSON SİSTEMİ
            if (json_system_tables.find((e) => e == this.table_name)) {
              for (const [key, val] of Object.entries(this.doubleParams)) {
                for (const [key1, val1] of Object.entries(val)) {
                  if (val1 == "") {
                    this.doubleParams[key][key1] = null;
                  }
                }
              }

              this.params["mal_hizmet_json"] = JSON.stringify(this.doubleParams);

              this.setParamsIdToDouble(this.response?.id);

              this.setData().then(() => {
                if (this.response.message == "success") {
                  ElNotification({
                    title: "Başarılı",
                    message: "KAYIT BAŞARILI YÖNLENDİRİLİYOR.",
                    position: "bottom-left",
                    type: "success",
                    duration: 3000,
                  });
                  if (this.table_name == "e_fatura") {
                    this.$router.push("/e-donusum/fatura?tab=first");
                  }
                  if (this.table_name == "e_arsiv_fatura") {
                    this.$router.push("/e-donusum/arsiv");
                  }
                  if (this.table_name == "e_irsaliye") {
                    this.$router.push("/e-donusum/irsaliye");
                  }
                  if (this.table_name == "serbest_meslek_makbuzu") {
                    this.$router.push("/e-donusum/smm");
                  }
                  // if (this.table_name == "fisler") {
                  //   this.$router.push("/e-donusum/e-mm");
                  // }
                  if (this.table_name == "alis_fatura") {
                    this.$router.push("/alis-satis-yonetimi/fatura?tab=first");
                  }
                  if (this.table_name == "satis_fatura") {
                    this.$router.push("/alis-satis-yonetimi/fatura?tab=second");
                  }
                  if (this.table_name == "alis_irsaliye") {
                    this.$router.push("/alis-satis-yonetimi/irsaliye?tab=first");
                  }
                  if (this.table_name == "satis_irsaliye") {
                    this.$router.push("/alis-satis-yonetimi/irsaliye?tab=second");
                  }
                  if (this.table_name == "alis_siparis") {
                    this.$router.push("/alis-satis-yonetimi/siparis?tab=first");
                  }
                  if (this.table_name == "satis_siparis") {
                    this.$router.push("/alis-satis-yonetimi/siparis?tab=second");
                  }
                  if (this.table_name == "teklifler") {
                    this.$router.push("/alis-satis-yonetimi/teklif?tab=first");
                  }
                  if (this.table_name == "e_mustahsil_makbuzu") {
                    this.$router.push("/e-donusum/e-mm");
                  }
                }
              });
            } else {
              this.setData().then(() => {
                if (this.response.message == "success") {
                  this.setDoubleData(this.response.id);
                }
              });
            }
          }
        } else {
          this.setData();
        }
        this.$store.commit("setTableRefresh");
        this.$emit("params", this.params);
      }
    });
  },
  // Son: save()
};
//var method = Object.assign({}, methods, fun);
const func = methods;
export default func;
