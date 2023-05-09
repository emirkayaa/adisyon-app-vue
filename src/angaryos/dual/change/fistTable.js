import { ElNotification } from "element-plus";
import calculate from "../calculate";
import services from "@/services";
import filling from "@/angaryos/dual/filling";
import column_settings_all from "@/angaryos/modal/column_settings";

const first = {
  data() {
    return {
      table_name: "",
      params: {},
      disabled: {},
      config: {},
      doubleParams: {},
      second_config: {},
      doubleDisabled: {},
      column_settings: {},
      doubleColumns: {},
      dbconfig: {},
    };
  },
  cari_hesap(clmName) {
    clmName;
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
  },
  fatura(clmName) {
    //Fatura tipi iade olduğunda
    if (this.params["fatura_tipi_id"] == 1) {
      this.config.hideGroup[3] = false;
      this.column_settings["iade_fatura_numarasi"] = {};

      this.column_settings["iade_fatura_numarasi"]["required"] = true;
      this.column_settings["iade_fatura_tarihi"] = {};
      this.column_settings["iade_fatura_tarihi"]["required"] = true;
    } else {
      this.config.hideGroup[3] = true;
      this.column_settings["iade_fatura_numarasi"] = {};
      this.column_settings["iade_fatura_numarasi"]["required"] = false;
      this.column_settings["iade_fatura_tarihi"] = {};
      this.column_settings["iade_fatura_tarihi"]["required"] = false;
    }

    //Fatura tipi tevkifat olduğunda
    if (this.params["fatura_tipi_id"] == 3) {
      for (const val of Object.values(this.doubleParams)) {
        if (val["kdv_id"] == 5) {
          ElNotification({
            title: "Dikkat!",
            message: "KDV '%0' Girilemez!",
            type: "warning",
            position: "top-left",
          });
        }
      }
    } else if (this.second_config.column_settings["tevkifat_kodlari_listesi_id"]["input_visible"] == true) {
      this.second_config.column_settings["tevkifat_kodlari_listesi_id"]["input_visible"] = false;
      ElNotification({
        title: "Dikkat!",
        message: "Tevkifat Hesaplaması İptal Edildi!",
        type: "warning",
        position: "top-left",
      });
      this.doubleParams.forEach((val) => {
        val["tevkifat_kodlari_listesi_id"] = null;
      });
    }

    //fatura tipi istisna olduğunda
    if (this.params["fatura_tipi_id"] == 4) {
      for (let index = 0; index < this.doubleParams.length; index++) {
        if (this.doubleParams[index] == undefined) this.doubleParams[index] = {};
        this.doubleDisabled[index]["otv_istisna_muafiyet_sebebi_id"] = false;
        this.doubleDisabled[index]["kdv_istisna_muafiyet_sebebi_id"] = false;
        this.dbconfig["kdv_istisna_muafiyet_sebebi_id"] = true;
        this.dbconfig["otv_istisna_muafiyet_sebebi_id"] = true;
        //this.second_config.column_settings.kdv_istisna_muafiyet_sebebi_id["required"] = true;
        //this.second_config.column_settings.otv_istisna_muafiyet_sebebi_id["required"] = true;
      }
    } else {
      for (let index = 0; index < this.doubleParams.length; index++) {
        if (this.doubleParams[index] == undefined) this.doubleParams[index] = {};
        if (this.doubleDisabled[index] == undefined) this.doubleDisabled[index] = {};
        this.doubleDisabled[index]["otv_istisna_muafiyet_sebebi_id"] = true;
        this.doubleDisabled[index]["kdv_istisna_muafiyet_sebebi_id"] = true;
        this.second_config.column_settings.kdv_istisna_muafiyet_sebebi_id["required"] = false;
        this.second_config.column_settings.otv_istisna_muafiyet_sebebi_id["required"] = false;
        //this.dbconfig["kdv_istisna_muafiyet_sebebi_id"] = false;
        //this.dbconfig["otv_istisna_muafiyet_sebebi_id"] = false;
      }
    }

    //Fatura tipi özel matrah olduğunda
    if (this.params["fatura_tipi_id"] == 5) {
      this.second_config.column_settings["ozel_matrah_kodlari_listesi_id"]["input_visible"] = true;
      this.second_config.column_settings["ozel_matrah_tutari"]["input_visible"] = true;
      this.dbconfig["ozel_matrah_kodlari_listesi_id"] = true;
      this.dbconfig["ozel_matrah_tutari"] = true;
    } else {
      this.second_config.column_settings["ozel_matrah_kodlari_listesi_id"]["input_visible"] = false;
      this.second_config.column_settings["ozel_matrah_tutari"]["input_visible"] = false;
      this.dbconfig["ozel_matrah_kodlari_listesi_id"] = false;
      this.dbconfig["ozel_matrah_tutari"] = false;
      let hesapVarMi = false;
      for (const val of Object.values(this.doubleParams)) {
        if (val["ozel_matrah_tutari"] > 0 && (val["ozel_matrah_kodlari_listesi_id"] || val["ozel_matrah_toplami"])) {
          hesapVarMi = true;
        }
        val["ozel_matrah_tutari"] = null;
        val["ozel_matrah_kodlari_listesi_id"] = null;
        val["ozel_matrah_toplami"] = null;
      }
      if (hesapVarMi) {
        ElNotification({
          title: "Dikkat!",
          message: "Özel Matrah Hesaplaması İptal Edildi!",
          type: "warning",
          position: "top-left",
        });
      }
    }

    // Fatura tipi ihraç kayıtlı olduğunda
    if (this.params["fatura_tipi_id"] == 6) {
      this.second_config.column_settings["ihrac_kayitli_fatura_sebebi_id"]["input_visible"] = true;
      this.dbconfig["ihrac_kayitli_fatura_sebebi_id"] = true;
    } else {
      this.second_config.column_settings["ihrac_kayitli_fatura_sebebi_id"]["input_visible"] = false;
      this.dbconfig["ihrac_kayitli_fatura_sebebi_id"] = false;
    }

    //Faura tipi sgk olduğunda
    if (this.params["fatura_tipi_id"] == 9) {
      this.config.hideGroup[4] = false;
      this.column_settings["sgk_fatura_tipi_id"] = {};
      this.column_settings["sgk_fatura_tipi_id"]["required"] = true;
    } else {
      this.config.hideGroup[4] = true;
      this.column_settings["sgk_fatura_tipi_id"] = {};
      this.column_settings["sgk_fatura_tipi_id"]["required"] = false;
    }

    if (clmName == "kayitli_notlar_id" && this.params["kayitli_notlar_id"] > 0) {
      services.show("kayitli_notlar", this.params["kayitli_notlar_id"]).then((res) => {
        this.params["description"] = res.data.data.record.not;
      });
    }
    if (clmName == "cari_hesap_id") {
      this.params["adres_id"] = null;
    }

    //REVIEW - İrsaliye ve sipariş imputları biri dolunca ddiğer zorunlu olsun
    if (
      this.params["irsaliye_numarasi"] != "" &&
      this.params["irsaliye_numarasi"] != undefined &&
      this.params["irsaliye_numarasi"] != null
    ) {
      this.column_settings["irsaliye_tarihi"]["required"] = true;
    } else {
      this.column_settings["irsaliye_tarihi"]["required"] = false;
    }
    if (
      this.params["irsaliye_tarihi"] != "" &&
      this.params["irsaliye_tarihi"] != undefined &&
      this.params["irsaliye_tarihi"] != null
    ) {
      this.column_settings["irsaliye_numarasi"]["required"] = true;
    } else {
      this.column_settings["irsaliye_numarasi"]["required"] = false;
    }

    if (
      this.params["siparis_numarasi"] != "" &&
      this.params["siparis_numarasi"] != undefined &&
      this.params["siparis_numarasi"] != null
    ) {
      this.column_settings["siparis_tarihi"] = {};
      this.column_settings["siparis_tarihi"]["required"] = true;
    } else {
      this.column_settings["siparis_tarihi"] = {};
      this.column_settings["siparis_tarihi"]["required"] = false;
    }
    if (
      this.params["siparis_tarihi"] != "" &&
      this.params["siparis_tarihi"] != undefined &&
      this.params["siparis_tarihi"] != null
    ) {
      this.column_settings["siparis_numarasi"] = {};
      this.column_settings["siparis_numarasi"]["required"] = true;
    } else {
      this.column_settings["siparis_numarasi"] = {};
      this.column_settings["siparis_numarasi"]["required"] = false;
    }
  },
  finans(clmName) {
    calculate.caseBankTablesCalculate();
    if (clmName == "islem_tipi_id") {
      if (this.params[clmName] == 1) this.column_settings["kasa_karti_id"]["input_visible"] = true;
      else this.column_settings["kasa_karti_id"]["input_visible"] = false;

      if (this.params[clmName] == 2) this.column_settings["banka_karti_id"]["input_visible"] = true;
      else this.column_settings["banka_karti_id"]["input_visible"] = false;

      if (this.params[clmName] == 3) this.column_settings["hizmet_ve_masraf_kartlari_id"]["input_visible"] = true;
      else this.column_settings["hizmet_ve_masraf_kartlari_id"]["input_visible"] = false;

      if (this.params[clmName] == 4) {
        this.column_settings["tip_id"]["input_visible"] = true;
        this.column_settings["cari_hesap_id"]["input_visible"] = true;
        this.column_settings["tip_id"]["required"] = true;
      } else {
        this.column_settings["tip_id"]["input_visible"] = false;
        this.column_settings["cari_hesap_id"]["input_visible"] = false;
        this.column_settings["tip_id"]["required"] = false;
      }
    }
    // tip id: 1 ise fatura, 2 ise çek, 3 ise Senet, 4 ise Sabit Gider, 5 ise Diğer
    if (clmName == "tip_id") {
      this.params["satis_fatura_id"] = null;
      this.params["musteri_cek_id"] = null;
      this.params["musteri_senet_id"] = null;
      this.params["sabit_isletme_giderleri_id"] = null;
      this.params["alis_fatura_id"] = null;
      this.params["firma_cek_id"] = null;
      this.params["firma_senet_id"] = null;
    }
    if (clmName == "tip_id") {
      if (this.table_name == "tahsilat_islem" || this.table_name == "banka_gelen_havale_islemi") {
        if (this.params[clmName] == 1) this.column_settings["satis_fatura_id"]["input_visible"] = true;
        else this.column_settings["satis_fatura_id"]["input_visible"] = false;

        if (this.params[clmName] == 2) this.column_settings["musteri_cek_id"]["input_visible"] = true;
        else this.column_settings["musteri_cek_id"]["input_visible"] = false;

        if (this.params[clmName] == 3) this.column_settings["firma_senet_id"]["input_visible"] = true;
        else this.column_settings["firma_senet_id"]["input_visible"] = false;

        if (this.params[clmName] == 4) this.column_settings["sabit_isletme_giderleri_id"]["input_visible"] = true;
        else this.column_settings["sabit_isletme_giderleri_id"]["input_visible"] = false;

        if (this.params[clmName] == 5) return null;
        else return null;
      }
      if (this.table_name == "odeme_islemi" || this.table_name == "banka_giden_havale_islem") {
        if (this.params[clmName] == 1) this.column_settings["alis_fatura_id"]["input_visible"] = true;
        else this.column_settings["alis_fatura_id"]["input_visible"] = false;

        if (this.params[clmName] == 2) this.column_settings["firma_cek_id"]["input_visible"] = true;
        else this.column_settings["firma_cek_id"]["input_visible"] = false;

        if (this.params[clmName] == 3) this.column_settings["musteri_senet_id"]["input_visible"] = true;
        else this.column_settings["musteri_senet_id"]["input_visible"] = false;

        if (this.params[clmName] == 4) this.column_settings["sabit_isletme_giderleri_id"]["input_visible"] = true;
        else this.column_settings["sabit_isletme_giderleri_id"]["input_visible"] = false;

        if (this.params[clmName] == 5) return null;
        else return null;
      }
    }
    filling.column_settings = this.column_settings;
    filling.params = this.params;
    filling.finans(clmName);
    this.column_settings = column_settings_all[this.table_name];
  },
  cek_senet() {
    calculate.chequeBillCalculate();
    if (this.params["para_birimi_id"] == 1) {
      this.disabled["döviz_kuru"] = true;
      this.column_settings["döviz_kuru"]["input_visible"] = false;
      this.column_settings["kur_tarihi"]["input_visible"] = false;
      this.column_settings["doviz_kuru_kaynagi"]["input_visible"] = false;
      this.column_settings["doviz_kuru_aciklamasi"]["input_visible"] = false;
    } else {
      this.disabled["döviz_kuru"] = false;
      this.column_settings["döviz_kuru"]["input_visible"] = true;
      this.column_settings["kur_tarihi"]["input_visible"] = true;
      this.column_settings["doviz_kuru_kaynagi"]["input_visible"] = true;
      this.column_settings["doviz_kuru_aciklamasi"]["input_visible"] = true;
    }
  },
  hizmet_ve_masraf() {
    calculate.serviceExpense();
  },
  kobi_siparis(clmName) {
    if (clmName == "kobi_odenen_tutar") {
      if (this.params["kobi_odenen_tutar"] > 0) {
        this.column_settings["kasa_banka"]["input_visible"] = true;
        this.column_settings["kasa_banka"]["required"] = true;
      } else {
        this.column_settings["kasa_banka"]["input_visible"] = false;
        this.column_settings[""]["required"] = false;
      }
      if (this.params["kobi_odenen_tutar"] == this.params["vergi_tutar"]) {
        this.params["kobi_taksit_sayisi"] = 0;
        this.params["kobi_taksit_tutari"] = 0;
      }
      if (this.params["kobi_odenen_tutar"] > this.params["vergi_tutar"]) {
        this.params["kobi_odenen_tutar"] = this.params["vergi_tutar"];
        ElNotification({
          title: "Dikkat!",
          message: "Ürün fiyatından daha fazla ödeyemezsiniz!",
          type: "warning",
          position: "top-left",
        });
      }
    }
    if (clmName == "vade_tarihi") {
      this.params["vade_baslangi"] = this.params["vade_tarihi"];
    }
    if (clmName == "kobi_taksit_sayisi") {
      if (this.params["kobi_taksit_sayisi"] == 0 || this.params["kobi_taksit_sayisi"] == 1) {
        this.params["taksitli"] = "0";
      } else if (this.params["kobi_taksit_sayisi"] < 0) {
        ElNotification({
          title: "Uyarı!",
          message: "Sıfırdan küçük taksit girilemez.",
          type: "warning",
          position: "top-left",
        });
      } else {
        this.params["taksitli"] = "1";
      }
    }
    if (clmName == "kasa_banka") {
      if (this.params[clmName] == true) {
        this.column_settings["kasa_karti_id"]["input_visible"] = true;
        this.column_settings["kasa_karti_id"]["disabled"] = true;
        this.column_settings["banka_karti_id"]["input_visible"] = false;
        this.params["banka_karti_id"] = null;
      } else {
        this.column_settings["kasa_karti_id"]["input_visible"] = false;
        this.column_settings["banka_karti_id"]["disabled"] = true;
        this.column_settings["banka_karti_id"]["input_visible"] = true;
        this.params["kasa_karti_id"] = null;
      }
    }
    calculate.smeOrderCalculate();
  },
  mali_personel(clmName) {
    calculate.maliPersonelCalculate();
    if (clmName == "kasa_banka") {
      if (this.params[clmName] == true) {
        this.column_settings["kasa_karti_id"]["input_visible"] = true;
        this.column_settings["kasa_karti_id"]["required"] = true;
        this.column_settings["banka_karti_id"]["input_visible"] = false;
        this.column_settings["banka_karti_id"]["required"] = false;
        this.params["banka_karti_id"] = null;
      } else {
        this.column_settings["kasa_karti_id"]["input_visible"] = false;
        this.column_settings["kasa_karti_id"]["required"] = false;
        this.column_settings["banka_karti_id"]["input_visible"] = true;
        this.column_settings["banka_karti_id"]["required"] = true;
        this.params["kasa_karti_id"] = null;
      }
    }
  },
  filtre(clmName) {
    if (clmName == "mizan_turu_id") {
      if (this.params["mizan_turu_id"] == 2) {
        var clm = {
          aylik_mizan_front: {
            display_name: "Aylık Mizan",
            gui_type_name: "select_static",
            name: "aylik_mizan_front",
          },
        };
        clm = Object.assign({}, clm, this.columns);
        this.columns = clm;

        this.column_settings["donem_baslangic_tarihi"]["input_visible"] = false;
        this.column_settings["donem_bitis_tarihi"]["input_visible"] = false;
        this.column_settings["aylik_mizan_front"] = {
          input_visible: true,
        };
      } else {
        this.column_settings["donem_baslangic_tarihi"]["input_visible"] = true;
        this.column_settings["donem_bitis_tarihi"]["input_visible"] = true;
        this.column_settings["aylik_mizan_front"]["input_visible"] = false;
      }
    }
    if (this.params["aylik_mizan_front"] != null || this.params["aylik_mizan_front"] != undefined) {
      //(this.params["aylik_mizan_front"]);
      let ay =
        this.params["aylik_mizan_front"] < 10 ? "0" + this.params["aylik_mizan_front"] : this.params["aylik_mizan_front"];
      this.params["donem_baslangic_tarihi"] = new Date().getFullYear() + "/" + ay + "/01";
      this.params["donem_bitis_tarihi"] = new Date().getFullYear() + "/" + ay + "/31";
    }
  },
  stok_hareketleri() {
    this.params["tutar"] = parseFloat(this.params["miktar"]) * this.params["birim_fiyat"];
  },
  sabit_kiymet(clmName) {
    if (clmName == "amortisman_listesi_id") {
      services.show("amortisman_listesi", this.params["amortisman_listesi_id"]).then((res) => {
        const data = res.data.data.record;
        this.params["faydali_omur"] = data.faydali_omur;
        this.params["normal_amortisman_oran"] = data.normal_amortisman_oran;
      });
    }
  },
  irsaliye(clmName) {
    if (clmName == "stok_kartlari_id") {
      console.log("stok girdi");
      if (this.params[clmName]) {
        console.log("clm girdi");
        this.column_settings["birim_id"]["disabled"] = true;
        this.column_settings["birim_fiyat"]["disabled"] = true;
      } else {
        this.column_settings["birim_id"]["disabled"] = false;
        this.column_settings["birim_fiyat"]["disabled"] = false;
      }
    }
  },
  stok_kartlari(clmName) {
    if (clmName == "giris_birimi_id" && this.params["giris_birimi_id"] > 0) {
      this.params["cikis_birimi_id"] = this.params["giris_birimi_id"];
    } else {
      this.params["cikis_birimi_id"] = this.params["giris_birimi_id"];
    }
  },
  allColumn(clmName) {
    if (clmName == "cari_hesap_id" && this.params.cari_hesap_id != undefined) {
      this.disabled["adres_id"] = false;
    }
    if (this.params["para_birimi_id"] == 1) {
      this.params["döviz_kuru"] = 1;
      this.disabled["döviz_kuru"] = true;
    } else if (this.params["para_birimi_id"] != 1) {
      this.disabled["döviz_kuru"] = false;
    }
    if (clmName == "bankalar_id") {
      this.params["banka_sube_id"] = null;
    }
    if (clmName == "kayitli_notlar_id" && this.params["kayitli_notlar_id"] > 0) {
      services.show("kayitli_notlar", this.params["kayitli_notlar_id"]).then((res) => {
        this.params["description"] = res.data.data.record.not;
      });
    }
  },
};
export default first;
