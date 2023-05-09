import { ElNotification } from "element-plus";
import calculate from "../calculate";
import filling from "../filling.js";

const second = {
  data() {
    return {
      params: {},
      disabled: {},
      config: {},
      doubleParams: {},
      second_config: {},
      doubleDisabled: {},
      column_settings: {},
      selectResult: {},
      digerVergilerColumns: {},
      doubleTotal: {},
      vergilerJson: {},
      dbconfig: {},
    };
  },
  isEmpty(val) {
    if (val == "" || val == undefined || val == null) return true;
    else false;
  },
  /**
   * Fatura tablolarında yapılan değişikliğe göre yapılan hesaplamalar ve ayarlar.
   * @param {*} i Değişiklik yapılan satırın doubleParams indexi
   * @param {*} clmName Kolon veritabanı ismi
   * @returns
   */
  fatura(i, clmName) {
    if (this.doubleParams[i]["mal_hizmet_turu_id"] == 1) {
      this.doubleColumnSettings[i]["stok_kartlari_id"]["input_visible"] = true;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["input_visible"] = true;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["input_visible"] = false;
    } else if (this.doubleParams[i]["mal_hizmet_turu_id"] == 2) {
      this.doubleColumnSettings[i]["stok_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["input_visible"] = true;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["input_visible"] = false;
    } else if (this.doubleParams[i]["mal_hizmet_turu_id"] == 3) {
      this.doubleColumnSettings[i]["stok_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["input_visible"] = true;
    }
    if (
      this.isEmpty(this.doubleParams[i]["stok_kartlari_id"]) != true &&
      this.isEmpty(this.selectResult.stok_kartlari_id) != true
    ) {
      this.doubleParams[i]["mal_hizmet"] = this.selectResult.stok_kartlari_id.find(
        (e) => e.id == this.doubleParams[i]["stok_kartlari_id"]
      ).text;
    }
    if (this.isEmpty(this.doubleParams[i]["hizmet_ve_masraf_kartlari_id"]) != true) {
      this.doubleParams[i]["mal_hizmet"] = this.selectResult.hizmet_ve_masraf_kartlari_id.find(
        (e) => e.id == this.doubleParams[i]["hizmet_ve_masraf_kartlari_id"]
      ).text;
    }
    if (this.isEmpty(this.doubleParams[i]["sabit_kiymet_karti_id"]) != true) {
      this.doubleParams[i]["mal_hizmet"] = this.selectResult.sabit_kiymet_karti_id.find(
        (e) => e.id == this.doubleParams[i]["sabit_kiymet_karti_id"]
      ).text;
    }

    //Seçilen vergiye göre kolon ekleme
    if (clmName == "vergiler_id") {
      if (this.doubleParams[i][clmName] == null || this.doubleParams[i][clmName] == "") return;

      if (this.doubleParams[i]["vergiler_id"] == 19) {
        if (this.params["fatura_tipi_id"] == 3) {
          this.second_config.column_settings["tevkifat_kodlari_listesi_id"]["input_visible"] = true;
          this.dbconfig["tevkifat_kodlari_listesi_id"] = true;
        } else {
          ElNotification({
            title: "Dikkat!",
            message: "Fatura tipi 'Tevkifat' olmalıdır!",
            type: "warning",
            position: "top-left",
          });
        }
        return;
      }

      var Selected = this.selectResult[clmName].find((e) => e.id == this.doubleParams[i][clmName]);
      this.digerVergilerColumns[i] = this.digerVergilerColumns[i] == undefined ? [] : this.digerVergilerColumns[i];
      if (this.digerVergilerColumns[i].find((e) => e.id == this.doubleParams[i][clmName])) return;
      this.digerVergilerColumns[i].push({
        display: Selected.text.split("#")[0],
        kod: Selected.text.split("#")[1],
        gui_type_name: "numeric",
        oran: 0,
        id: this.doubleParams[i][clmName],
        mask: "digerVergi",
      });

      this.doubleParams[i]["vergiler_id"] = null;
    }

    //tevkifat hesaplama

    this.doubleParams[i]["tevfikat_tutar"] = {};
    if (this.doubleParams[i]["tevkifat_kodlari_listesi_id"] > 0) {
      var Tevfikat = this.selectResult?.["tevkifat_kodlari_listesi_id"]?.find(
        (e) => e.id == this.doubleParams[i]["tevkifat_kodlari_listesi_id"]
      );
      if (Tevfikat != null) {
        this.doubleParams[i]["tevfikat_tutar"] = {
          code: Tevfikat.text.split("#")[2],
          hesap: eval(Tevfikat.text.split("#")[1]),
          oran: Tevfikat.text.split("#")[1],
          text: Tevfikat.text.split("#")[0],
          id: Tevfikat.id,
        };
      }
    }

    if (this.digerVergilerColumns[i] != undefined) {
      //Ötv istisna sebebi visible durumu
      this.digerVergilerColumns[i].filter((e) => {
        if (e.id == 8 || e.id == 9 || e.id == 10 || e.id == 11 || e.id == 12 || e.id == 13) {
          if (e.oran > 0) {
            this.doubleDisabled[i]["otv_istisna_muafiyet_sebebi_id"] = false;
            this.doubleParams[i]["otv_istisna_muafiyet_sebebi_id"] = null;
            this.doubleColumnSettings[i]["otv_istisna_muafiyet_sebebi_id"]["input_visible"] = false;
            this.doubleColumnSettings[i]["otv_istisna_muafiyet_sebebi_id"]["required"] = false;
          } else {
            this.doubleColumnSettings[i]["otv_istisna_muafiyet_sebebi_id"] = {
              input_visible: true,
            };
            this.doubleColumnSettings[i]["otv_istisna_muafiyet_sebebi_id"]["required"] = true;
            if (this.params["fatura_tipi_id"] != 4) {
              this.doubleParams[i]["otv_istisna_muafiyet_sebebi_id"] = 9;
              this.doubleDisabled[i]["otv_istisna_muafiyet_sebebi_id"] = true;
            }
          }
        }
      });
    }

    //KDV tevkifat hatası
    if (this.params["fatura_tipi_id"] == 3 && this.doubleParams[i]["kdv_id"] == 5) {
      this.doubleParams[i]["kdv_id"] = null;
      ElNotification({
        title: "Hata!",
        message: "Fatura tipi tevkifat'dır. KDV '%0' olamaz!",
        type: "error",
        position: "top-left",
      });
    }

    //kdv muafiyet sebebi visible durumu
    if (this.doubleParams[i]["kdv_id"] == 5) {
      this.doubleColumnSettings[i]["kdv_istisna_muafiyet_sebebi_id"]["input_visible"] = true;
      this.doubleColumnSettings[i]["kdv_istisna_muafiyet_sebebi_id"]["required"] = true;
      if (this.params["fatura_tipi_id"] != 4) {
        this.doubleParams[i]["kdv_istisna_muafiyet_sebebi_id"] = 137;
        this.doubleDisabled[i]["kdv_istisna_muafiyet_sebebi_id"] = true;
      } else {
        this.doubleDisabled[i]["kdv_istisna_muafiyet_sebebi_id"] = false;
      }
    } else {
      this.doubleColumnSettings[i]["kdv_istisna_muafiyet_sebebi_id"]["input_visible"] = false;
      this.doubleParams[i]["kdv_istisna_muafiyet_sebebi_id"] = null;
      this.doubleDisabled[i]["kdv_istisna_muafiyet_sebebi_id"] = false;
      this.doubleColumnSettings[i]["kdv_istisna_muafiyet_sebebi_id"]["required"] = false;
    }

    //Tabloya göre hesaplama
    calculate.invoinceCalculate(i);

    this.doubleParams = calculate.doubleParams;
    this.doubleTotal = calculate.doubleTotal;
    this.params["diger_vergiler_toplami"] = JSON.stringify(calculate.vergilerJson);
    this.params["e_fatura_durumu_id"] = 1;
    this.params.hesaplanan_kdv = this.doubleTotal.hesaplanan_kdv;
    this.params.odenecek_tutar = this.doubleTotal.odenecek_tutar;
    this.params.toplam_iskonto = this.doubleTotal.toplam_iskonto;
    this.params.urun_hizmet_toplam_tutar = this.doubleTotal.urun_hizmet_toplam_tutar;
    this.params.vergiler_dahil_toplam_tutar = this.doubleTotal.vergiler_dahil_toplam_tutar;
    this.params.tevkifat_toplami = this.doubleTotal.tevkifat_toplami;
    this.params.toplam_vergi_tutari = this.doubleTotal.toplam_vergi_tutari;
    this.params.ozel_matrah_toplami = this.doubleTotal.ozel_matrah_toplami;
  },
  teklif(i) {
    if (this.doubleParams[i]["mal_hizmet_turu_id"] == 1) {
      this.doubleColumnSettings[i]["stok_kartlari_id"]["input_visible"] = true;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["input_visible"] = true;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["input_visible"] = false;
    } else if (this.doubleParams[i]["mal_hizmet_turu_id"] == 2) {
      this.doubleColumnSettings[i]["stok_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["input_visible"] = true;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["input_visible"] = false;
    } else if (this.doubleParams[i]["mal_hizmet_turu_id"] == 3) {
      this.doubleColumnSettings[i]["stok_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["input_visible"] = true;
    }
    //Tabloya göre hesaplama
    calculate.teklifHesap(i);

    this.doubleParams = calculate.doubleParams;
    this.doubleTotal = calculate.doubleTotal;
    this.params.toplam_kdv = this.doubleTotal.hesaplanan_kdv;
    this.params.odenecek_tutar = this.doubleTotal.odenecek_tutar;
    this.params.toplam_iskonto =
      this.doubleTotal.toplam_iskonto < 0 ? this.doubleTotal.toplam_iskonto * -1 : this.doubleTotal.toplam_iskonto;
    this.params.urun_hizmet_toplam_tutar = this.doubleTotal.urun_hizmet_toplam_tutar;
    this.params.vergiler_dahil_toplam_tutar = this.doubleTotal.vergiler_dahil_toplam_tutar;
    this.params.toplam_tutar = this.doubleTotal.odenecek_tutar;
    this.params.toplam_vergi_tutari = this.doubleTotal.toplam_vergi_tutari;

    this.params.ozel_matrah_toplami = this.doubleTotal.ozel_matrah_toplami;
  },
  e_irsaliye_mal_hizmet(i) {
    calculate.waybillCalculate(i);

    this.doubleParams = calculate.doubleParams;
    this.doubleTotal = calculate.doubleTotal;

    this.params["toplam_tutar"] = this.doubleTotal.mal_hizmet_tutari;
    this.params["e_fatura_durumu_id"] = 1;
    this.params["sofor_bilgileri"] = JSON.stringify(this.irsaliyeSoforColumns);
    this.params["dorse_plaka"] = JSON.stringify(this.irsaliyePlakaColumns);
  },
  e_mustahsil_malhizmet(i, clmName) {
    calculate.producerReceiptCalculate(i);
    if (clmName == "e_mustahsil_vergi_id") {
      if (this.doubleParams[i][clmName] == 1) {
        this.doubleColumnSettings[i]["mera_fonu_orani"]["input_visible"] = true;
      } else if (this.doubleParams[i][clmName] == 2) {
        this.doubleColumnSettings[i]["borsa_tescil_ucreti_orani"]["input_visible"] = true;
      } else if (this.doubleParams[i][clmName] == 3) {
        this.doubleColumnSettings[i]["sgk_prim_kesintisi_orani"]["input_visible"] = true;
      }
    }

    this.doubleParams = calculate.doubleParams;
    this.doubleTotal = calculate.doubleTotal;

    this.params["diger_vergiler_toplam_tutar"] = this.doubleTotal.diger_vergiler_toplam_tutar;
    this.params["hesaplanan_gv_stopaj"] = this.doubleTotal.gv_stopaj_tutari;
    this.params["borsa_tescil_ucreti_tutari"] = this.doubleTotal.borsa_tescil_ucreti_tutari;
    this.params["urun_hizmet_toplam_tutar"] = this.doubleTotal.mal_hizmet_tutari;
    this.params["mera_fonu_tutari"] = this.doubleTotal.mera_fonu_tutari;
    this.params["sgk_prim_kesintisi_tutari"] = this.doubleTotal.sgk_prim_kesintisi_tutari;
    this.params["e_fatura_durumu_id"] = 1;
    this.params["odenecek_tutar"] = this.doubleTotal.odenecek_tutar;
  },
  serbest_meslek_malhizmet(i) {
    calculate.selfEmploymentReceiptCalculate(i);

    this.doubleParams = calculate.doubleParams;
    this.doubleTotal = calculate.doubleTotal;
    this.params["gv_stopaj_tutari"] = this.doubleTotal.gv_stopaj_tutari;
    this.params["net_ucret"] = this.doubleTotal.net_ucret;
    this.params["kdv_tutari"] = this.doubleTotal.kdv_tutari;
    this.params["kdv_tevkifat_tutari"] = this.doubleTotal.kdv_tevkifat_tutari;
    this.params["e_fatura_durumu_id"] = 1;
    this.params["tahsil_edilen_kdv"] = this.doubleTotal.tahsil_edilen_kdv;
    this.params["odenecek_tutar"] = this.doubleTotal.odenecek_tutar;
  },
  fis_satiri(i, clmName) {
    if (clmName == "alacak" && this.doubleParams[i]["alacak"] > 0) this.doubleParams[i]["borc"] = 0;
    if (clmName == "borc" && this.doubleParams[i]["borc"] > 0) this.doubleParams[i]["alacak"] = 0;

    calculate.receiptCalculation(i);

    this.doubleParams = calculate.doubleParams;
    this.doubleTotal = calculate.doubleTotal;
  },
  fatura_hizmet(i, clmName) {
    if (this.doubleParams[i]["mal_hizmet_turu_id"] == 1) {
      this.doubleColumnSettings[i]["stok_kartlari_id"]["input_visible"] = true;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["input_visible"] = true;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["input_visible"] = false;

      this.doubleColumnSettings[i]["stok_kartlari_id"]["required"] = true;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["required"] = true;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["required"] = false;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["required"] = false;
    } else if (this.doubleParams[i]["mal_hizmet_turu_id"] == 2) {
      this.doubleColumnSettings[i]["stok_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["input_visible"] = true;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["input_visible"] = false;

      this.doubleColumnSettings[i]["stok_kartlari_id"]["required"] = false;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["required"] = false;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["required"] = true;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["required"] = false;
    } else if (this.doubleParams[i]["mal_hizmet_turu_id"] == 3) {
      this.doubleColumnSettings[i]["stok_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["input_visible"] = true;

      this.doubleColumnSettings[i]["stok_kartlari_id"]["required"] = false;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["required"] = false;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["required"] = false;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["required"] = true;
    }

    filling.doubleColumnSettings = this.doubleColumnSettings?.[i];
    filling.doubleParams = this.doubleParams[i];
    filling.doubleColumns = this.doubleColumns;
    filling.doubleDisabled = this.doubleDisabled[i];
    filling.automaticInvoiceFiller(clmName);

    this.doubleParams = calculate.doubleParams;
    this.doubleTotal = calculate.doubleTotal;

    this.params.diger_vergiler_toplami = JSON.stringify(this.digerVergilerColumns);
    this.params["e_fatura_durumu_id"] = 1;
    this.params.hesaplanan_kdv = this.doubleTotal.kdv_tutari;
    this.params.odenecek_tutar = this.doubleTotal.odenecek_tutar;
    this.params.toplam_iskonto = this.doubleTotal.iskonto_tutari;
    this.params.urun_hizmet_toplam_tutar = this.doubleTotal.mal_hizmet_tutari;
    this.params.vergiler_dahil_toplam_tutar = this.doubleTotal.vergi_tutar;
    this.params.tevkifat_toplami = this.doubleTotal.tevfikat_tutar;
    this.params.dovizli_tutar = this.doubleTotal.dovizli_tutar;
  },
  irsaliye_hizmet(i, clmName) {
    clmName;
    calculate.waybillCalculate(i);
    this.doubleParams = calculate.doubleParams;
    this.doubleTotal = calculate.doubleTotal;

    filling.doubleColumnSettings = this.doubleColumnSettings?.[i];
    filling.doubleParams = this.doubleParams[i];
    filling.doubleColumns = this.doubleColumns;
    filling.doubleDisabled = this.doubleDisabled[i];
    filling.automaticInvoiceFiller(clmName);

    if (clmName == "stok_kartlari_id") {
      if (this.doubleParams[i]["stok_kartlari_id"]) {
        this.doubleDisabled[i]["birim_id"] = true;
        this.doubleDisabled[i]["birim_fiyat"] = true;
      } else {
        this.doubleDisabled[i]["birim_id"] = false;
        this.doubleDisabled[i]["birim_fiyat"] = false;
        this.doubleParams[i]["birim_id"] = null;
        this.doubleParams[i]["birim_fiyat"] = null;
      }
    }

    this.params.toplam_tutar = this.doubleTotal.mal_hizmet_tutari;
  },
  siparis_hizmet(i, clmName) {
    clmName;
    if (this.doubleParams[i]["mal_hizmet_turu_id"] == 1) {
      this.doubleColumnSettings[i]["stok_kartlari_id"]["input_visible"] = true;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["input_visible"] = true;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["input_visible"] = false;
    } else if (this.doubleParams[i]["mal_hizmet_turu_id"] == 2) {
      this.doubleColumnSettings[i]["stok_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["input_visible"] = true;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["input_visible"] = false;
    } else if (this.doubleParams[i]["mal_hizmet_turu_id"] == 3) {
      this.doubleColumnSettings[i]["stok_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["depo_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["hizmet_ve_masraf_kartlari_id"]["input_visible"] = false;
      this.doubleColumnSettings[i]["sabit_kiymet_karti_id"]["input_visible"] = true;
    }
    //Tabloya göre hesaplama
    calculate.OnMhsbReceiptCalculate(i);

    this.doubleParams = calculate.doubleParams;
    this.doubleTotal = calculate.doubleTotal;

    this.params.toplam_kdv = this.doubleTotal.hesaplanan_kdv;
    this.params.odenecek_tutar = this.doubleTotal.odenecek_tutar;
    this.params.toplam_iskonto =
      this.doubleTotal.toplam_iskonto < 0 ? this.doubleTotal.toplam_iskonto * -1 : this.doubleTotal.toplam_iskonto;
    this.params.urun_hizmet_toplam_tutar = this.doubleTotal.urun_hizmet_toplam_tutar;
    this.params.vergiler_dahil_toplam_tutar = this.doubleTotal.vergiler_dahil_toplam_tutar;
    this.params.toplam_tutar = this.doubleTotal.odenecek_tutar;
    this.params.toplam_vergi_tutari = this.doubleTotal.toplam_vergi_tutari;

    this.params.ozel_matrah_toplami = this.doubleTotal.ozel_matrah_toplami;
  },
};
export default second;
