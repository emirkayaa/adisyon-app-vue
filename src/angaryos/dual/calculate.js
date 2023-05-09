const calculate = {
  data() {
    return {
      params: {},
      columns: {},
      doubleParams: {},
      doubleColumns: {},
      doubleTotal: {},
      digerVergilerColumns: {},
      vergilerJson: {},
      tevkifatlar_toplami: {},
      selectResult: {},
    };
  },
  /**
   * Fişler hesaplaması için kullanılan fonksiyon.
   * * @param 1: Tetiklenen satırın doubleParams indexi
   * Baş: receiptCalculation()
   */
  receiptCalculation(val) {
    let params = this.doubleParams[val];
    params["dovizli_tutar"] =
      parseFloat(params["alacak"] > 0 ? params["alacak"] : params["borc"]) * parseFloat(params["döviz_kuru"]);
    this.doubleTotal = {
      alacak: 0,
      borc: 0,
      dovizli_tutar: 0,
    };
    this.doubleParams.forEach((e) => {
      this.doubleTotal.alacak += parseFloat(e["alacak"] == undefined ? 0 : e["alacak"]);
      this.doubleTotal.borc += parseFloat(e["borc"] == undefined ? 0 : e["borc"]);
      if (e["dovizli_tutar"] + "" == "NaN") e["dovizli_tutar"] = 0;
      this.doubleTotal.dovizli_tutar += parseFloat(e["dovizli_tutar"] == undefined ? 0 : e["dovizli_tutar"]);
    });
  },
  /**
   * Efatura hesaplaması için kullanılan fonksiyon.
   * * @param 1: Tetiklenen satırın doubleParams indexi
   * Baş: invoinceCalculate()
   */
  invoinceCalculate(i) {
    if (this.doubleParams == undefined) return;
    let kdv = this.getKdv(this.doubleParams[i]["kdv_id"]);
    let params = this.doubleParams[i];
    let OTVHesap = 0;
    let DVHesap = 0;

    this.digerVergilerColumns[i] = this.isEmpty(this.digerVergilerColumns[i]) ? [] : this.digerVergilerColumns[i];

    if (this.digerVergilerColumns[i] != null && this.digerVergilerColumns[i] != undefined) {
      for (const dv of Object.values(this.digerVergilerColumns[i])) {
        //ötv kolonlarının belirlenmesi
        const if_otv =
          dv.id == 8 || dv.id == 22 || dv.id == 21 || dv.id == 13 || dv.id == 12 || dv.id == 11 || dv.id == 10 || dv.id == 9;
        //vergi toplamını 0'a eşitleme
        dv["toplam"] = 0;

        DVHesap = this.isEmpty(DVHesap) ? 0 : DVHesap;
        if (if_otv) {
          const value_otv = dv.oran ? parseFloat(dv.oran) : 0;
          OTVHesap = parseFloat(OTVHesap) + (parseFloat(kdv) * value_otv) / 100;
        }
      }
    } else {
      DVHesap = 0;
    }

    if (this.digerVergilerColumns[i] != undefined) {
      for (const dv of Object.values(this.digerVergilerColumns[i])) {
        //STOPAJ İSE
        if (dv.id == 3 || dv.id == 4) {
          dv["toplam"] = parseFloat(dv["toplam"]) - (params["mal_hizmet_tutari"] * dv.oran) / 100;
        }
        //KKDF KESİNTİSİ İSE
        else if (dv.id == 7) {
          dv["toplam"] = parseFloat(dv["toplam"]) + (params["mal_hizmet_tutari"] / 100) * dv.oran; // 100 + kdv / (dv.value <= 0 ? 1 : dv.value);
        }
        //DİĞERLERİ
        else {
          dv["toplam"] = parseFloat(dv["toplam"]) + (params["mal_hizmet_tutari"] * dv.oran) / 100;
        }
      }
    }
    //Boş olan number kolonlarının sıfıra eşitlenmesi
    if (this.isEmpty(params["iskonto_orani"])) params["iskonto_orani"] = 0;
    //if (params["miktar"] == "") params["miktar"] = 0;

    const if_kdvdahil = params["kdv_dahil_buton"] == 1;
    // BAŞ: KDV DAHİL
    if (if_kdvdahil) {
      //ISKONTO HESAPLAMA
      if (params["iskonto_arttirim"] != true) {
        params["iskonto_tutari"] =
          ((((params["birim_fiyat"] * params["miktar"]) / (parseFloat(kdv) / 100 + 1)) * params["iskonto_orani"]) / 100) *
          -1;
      } else {
        params["iskonto_tutari"] =
          (((params["birim_fiyat"] * params["miktar"]) / (parseFloat(kdv) / 100 + 1)) * params["iskonto_orani"]) / 100;
      }
      //ISKONTO HESAPLAMA

      //MAL HIZMET TUTARI
      params["mal_hizmet_tutari"] =
        (params["birim_fiyat"] * params["miktar"]) / (parseFloat(kdv) / 100 + 1) + params["iskonto_tutari"];
      // DİĞER VERGİLER TUTARI
      // KDV TUTARI
      let ozl_mtrh = this.isEmpty(params["ozel_matrah_tutari"])
        ? 1
        : parseFloat(params["ozel_matrah_tutari"]) / parseFloat(params["mal_hizmet_tutari"]);

      let ozl_otv = params["mal_hizmet_tutari"] * (this.isEmpty(params["ozel_matrah_tutari"]) ? OTVHesap : 0);

      params["kdv_tutari"] =
        ((params["birim_fiyat"] * params["miktar"] - params["mal_hizmet_tutari"]) * ozl_mtrh + ozl_otv) / 100;

      // DİĞER VERGİLER TEK HESAPLAMA

      params["vergi_tutar"] = parseFloat(params["mal_hizmet_tutari"]) + parseFloat(params["kdv_tutari"]);
    }
    // SON: KDV DAHİL
    // BAŞ: KDV HARİÇ
    else {
      //ISKONTO HESAPLAMA
      if (params["iskonto_arttirim"] != true) {
        params["iskonto_tutari"] =
          ((parseFloat(params["birim_fiyat"]) * parseFloat(params["miktar"]) * parseFloat(params["iskonto_orani"])) / 100) *
          -1;
      } else {
        params["iskonto_tutari"] =
          (parseFloat(params["birim_fiyat"]) * parseFloat(params["miktar"]) * parseFloat(params["iskonto_orani"])) / 100;
      }

      //MAL HİZMET TUTARINI HESAPLAMA
      params["mal_hizmet_tutari"] =
        parseFloat(params["birim_fiyat"]) * parseFloat(params["miktar"]) + parseFloat(params["iskonto_tutari"]);
      // KDV TUTARINI HESAPLAMA
      let kvd_hsp = parseFloat(kdv) + (this.isEmpty(params["ozel_matrah_tutari"]) ? parseFloat(OTVHesap) : 0);
      let ozl_mtrh = this.isEmpty(params["ozel_matrah_tutari"])
        ? 1
        : parseFloat(params["ozel_matrah_tutari"]) / params["mal_hizmet_tutari"];

      params["kdv_tutari"] = ((params["mal_hizmet_tutari"] * kvd_hsp) / 100) * ozl_mtrh;

      params["vergi_tutar"] = parseFloat(params["mal_hizmet_tutari"]) + parseFloat(params["kdv_tutari"]);
    }
    // son: KDV HARİÇ

    //ÖZEL MATRAH HESABI
    params["ozel_matrah_tutari"] = this.isEmpty(params["ozel_matrah_tutari"]) ? 0 : parseFloat(params["ozel_matrah_tutari"]);
    params["ozel_matrah_toplami"] = (params["kdv_tutari"] / 100) * params["ozel_matrah_tutari"];

    //NUMBER PARSLAMACA
    params["mal_hizmet_tutari"] = Number(params["mal_hizmet_tutari"]).toFixed(2);
    params["tutar"] = Number(params["mal_hizmet_tutari"]).toFixed(2);
    params["kdv_tutari"] = Number(params["kdv_tutari"]).toFixed(2);
    params["vergi_tutar"] = Number(params["vergi_tutar"]).toFixed(2);
    params["iskonto_tutari"] = Number(params["iskonto_tutari"]).toFixed(2);
    params["dovizli_tutar"] = Number(params["vergi_tutar"] * params["döviz_kuru"]).toFixed(2);

    if (params["mal_hizmet_tutari"] == "NaN") params["mal_hizmet_tutari"] = 0;
    if (params["kdv_tutari"] == "NaN") params["kdv_tutari"] = 0;
    if (params["vergi_tutar"] == "NaN") params["vergi_tutar"] = 0;
    if (params["iskonto_tutari"] == "NaN") params["iskonto_tutari"] = 0;
    if (params["dovizli_tutar"] == "NaN") params["dovizli_tutar"] = 0;

    let otvToplam = 0;
    for (const dv of Object.values(this.digerVergilerColumns[i])) {
      const if_otv =
        dv.id == 8 || dv.id == 22 || dv.id == 21 || dv.id == 13 || dv.id == 12 || dv.id == 11 || dv.id == 10 || dv.id == 9;
      if (if_otv) {
        otvToplam = parseFloat(otvToplam) + parseFloat(dv.toplam);
      }
      if (dv.id == 7) {
        params["kdv_tutari"] = parseFloat(params["kdv_tutari"]) * (1 + dv.oran / 100);
      }
    }

    //KDV İSTİSNA KODLARININ BELİRLENMESİ
    let istisna_kodu = params["kdv_istisna_muafiyet_sebebi_id"];
    let istisna_sebebi = this.selectResult?.["kdv_istisna_muafiyet_sebebi_id"]?.find((e) => e.id == istisna_kodu)?.["text"];
    istisna_sebebi = istisna_sebebi == undefined ? "İstisna olmayan diğer" : istisna_sebebi;
    //SATIR VERGİLERİNE KDV EKLENMESİ
    let satirVergileri = [
      {
        id: null,
        kod: "0015",
        oran: kdv,
        toplam: Number(Math.abs(params["kdv_tutari"])).toFixed(2),
        mal_hizmet: Number(Math.abs(parseFloat(params["mal_hizmet_tutari"]) + parseFloat(otvToplam))).toFixed(2),
        display: "KDV",
        istisna_sebebi: kdv == 0 ? istisna_sebebi : null,
        istisna_kodu: istisna_kodu,
      },
    ];

    let istisna_kodu_otv = params["otv_istisna_muafiyet_sebebi_id"];
    let istisna_sebebi_otv = this.selectResult?.["otv_istisna_muafiyet_sebebi_id"]?.find((e) => e.id == istisna_kodu)?.[
      "text"
    ];
    istisna_sebebi_otv = istisna_sebebi_otv == undefined ? "İstisna olmayan diğer" : istisna_sebebi_otv;

    //SATIR VERGİLERİNE DİĞER VERGİLERİN EKLENMESİ
    for (const val of Object.values(this.digerVergilerColumns[i])) {
      const if_otv =
        val.id == 8 ||
        val.id == 22 ||
        val.id == 21 ||
        val.id == 13 ||
        val.id == 12 ||
        val.id == 11 ||
        val.id == 10 ||
        val.id == 9;
      if (if_otv) {
        satirVergileri.push({
          kod: val.kod,
          oran: val.oran,
          toplam: Number(Math.abs(val.toplam)).toFixed(2),
          mal_hizmet: Number(Math.abs(params["mal_hizmet_tutari"])).toFixed(2),
          display: val.display,
          id: val.id,
          istisna_kodu: istisna_kodu_otv,
          istisna_sebebi: val.oran == 0 ? istisna_sebebi_otv : null,
        });
      } else {
        satirVergileri.push({
          kod: val.kod,
          oran: val.oran,
          toplam: Number(Math.abs(val.toplam)).toFixed(2),
          mal_hizmet: Number(Math.abs(params["mal_hizmet_tutari"])).toFixed(2),
          display: val.display,
          id: val.id,
          istisna_kodu: val.istisna_kodu,
          istisna_sebebi: val.istisna_sebebi,
        });
      }
    }

    //Satır tevkifatlarının eklenmesi
    let tevkifat = {};
    if (params["tevkifat_kodlari_listesi_id"] > 0) {
      tevkifat = {
        kod: "9015",
        tevfikat_kod: params["tevfikat_tutar"]["code"],
        oran: eval(params["tevfikat_tutar"]["oran"]) * 100,
        toplam: Number(Math.abs(parseFloat(params["tevfikat_tutar"]["hesap"]) * parseFloat(params["kdv_tutari"]))).toFixed(
          2
        ),
        display: params["tevfikat_tutar"]["text"],
        mal_hizmet: Number(Math.abs(parseFloat(params["kdv_tutari"]))).toFixed(2),
      };
    }
    params["tevkifatlar"] = JSON.stringify(tevkifat);
    params["diger_vergiler"] = JSON.stringify(satirVergileri);
    //SATIRLAR TOPLAMININ BULUNMASI
    this.vergilerJson = {};
    this.doubleTotal = {
      urun_hizmet_toplam_tutar: 0,
      toplam_iskonto: 0,
      hesaplanan_kdv: 0,
      diger_vergiler_toplam_tutar: 0,
      toplam_vergi_tutari: 0,
      vergiler_dahil_toplam_tutar: 0,
      odenecek_tutar: 0,
      tevkifat_toplami: 0,
      ozel_matrah_toplami: 0,
      yazi: "",
      dovizli_tutar: 0,
    };
    params["diger_vergiler_toplam_tutar"] = 0;
    params["toplam_vergi_tutari"] = 0;
    params["odenecek_tutar"] = 0;

    for (const val of Object.values(this.digerVergilerColumns[i])) {
      if (val.id == 3 || val.id == 4) {
        params["odenecek_tutar"] = parseFloat(params["odenecek_tutar"]) + parseFloat(val.toplam);
      } else {
        params["diger_vergiler_toplam_tutar"] = parseFloat(params["diger_vergiler_toplam_tutar"]) + parseFloat(val.toplam);
      }
    }

    for (const vergiler of Object.values(this.digerVergilerColumns)) {
      for (const val of Object.values(vergiler)) {
        if (this.vergilerJson[val.oran + "_" + val.kod] == undefined) {
          this.vergilerJson[val.oran + "_" + val.kod] = {
            kod: val.kod,
            oran: val.oran,
            toplam: Number(Math.abs(val.toplam)).toFixed(2),
            display: val.display,
            mal_hizmet: Number(Math.abs(params["mal_hizmet_tutari"])).toFixed(2),
            id: val.id,
            istisna_kodu: val.id >= 8 && val.id <= 13 ? istisna_kodu_otv : null,
            istisna_sebebi: val.id >= 8 && val.id <= 13 ? (val.oran == 0 ? istisna_sebebi_otv : null) : null,
          };
        } else {
          this.vergilerJson[val.oran + "_" + val.kod]["toplam"] =
            parseFloat(this.vergilerJson[val.oran + "_" + val.kod]["toplam"]) + parseFloat(val.amount);

          this.vergilerJson[val.oran + "_" + val.kod]["mal_hizmet_tutari"] =
            this.vergilerJson[val.oran + "_" + val.kod]["mal_hizmet_tutari"] == undefined
              ? 0
              : this.vergilerJson[val.oran + "_" + val.kod]["mal_hizmet_tutari"];

          this.vergilerJson[val.oran + "_" + val.kod]["mal_hizmet_tutari"] =
            parseFloat(this.vergilerJson[val.oran + "_" + val.kod]["mal_hizmet_tutari"]) +
            parseFloat(params["mal_hizmet_tutari"]);
        }
      }
    }

    params["vergi_tutar"] = 0;
    params["toplam_vergi_tutari"] =
      parseFloat(params["toplam_vergi_tutari"]) +
      parseFloat(params["diger_vergiler_toplam_tutar"]) +
      parseFloat(params["kdv_tutari"]);
    params["vergi_tutar"] = parseFloat(params["mal_hizmet_tutari"]) + parseFloat(params["toplam_vergi_tutari"]);
    //params["vergi_tutar"] = parseFloat(params["vergi_tutar"]) + parseFloat(params["diger_vergiler_toplam_tutar"]);
    params["odenecek_tutar"] = parseFloat(params["odenecek_tutar"]) + parseFloat(params["vergi_tutar"]);
    params["kdv_tevkifat_tutari"] = Number(
      parseFloat(params["kdv_tutari"]) * parseFloat(this.doubleParams[i]["tevfikat_tutar"]?.hesap)
    ).toFixed(2);
    for (const toplamlar of Object.values(this.doubleParams)) {
      if (
        this.getKdv(toplamlar["kdv_id"]) != undefined &&
        this.vergilerJson[this.getKdv(toplamlar["kdv_id"]) + "_0015"] == undefined
      ) {
        let kdv_istisna_sebebi = this.selectResult?.["kdv_istisna_muafiyet_sebebi_id"]?.find(
          (e) => e.id == toplamlar["kdv_istisna_muafiyet_sebebi_id"]
        )?.["text"];
        let kdv_kdv_oran = this.getKdv(toplamlar["kdv_id"]);
        this.vergilerJson[this.getKdv(toplamlar["kdv_id"]) + "_0015"] = {
          id: null,
          kod: "0015",
          oran: kdv_kdv_oran,
          toplam: Number(Math.abs(parseFloat(toplamlar["kdv_tutari"]))).toFixed(2),
          display: "KDV ",
          mal_hizmet: Number(Math.abs(parseFloat(params["mal_hizmet_tutari"]) + parseFloat(otvToplam))).toFixed(2),
          istisna_sebebi: kdv_kdv_oran == 0 ? kdv_istisna_sebebi : null,
          istisna_kodu: kdv_kdv_oran == 0 ? toplamlar["kdv_istisna_muafiyet_sebebi_id"] : null,
        };
      } else if (this.getKdv(toplamlar["kdv_id"]) != undefined) {
        this.vergilerJson[this.getKdv(toplamlar["kdv_id"]) + "_0015"]["toplam"] =
          parseFloat(this.vergilerJson[this.getKdv(toplamlar["kdv_id"]) + "_0015"]["toplam"]) +
          parseFloat(toplamlar["kdv_tutari"]);
      }

      this.doubleParams[i]["tevfikat_tutar"]["hesap"] =
        this.doubleParams[i]["tevfikat_tutar"]["hesap"] == undefined ? 0 : this.doubleParams[i]["tevfikat_tutar"]["hesap"];

      if (params["tevkifat_kodlari_listesi_id"] > 0) {
        let toplam_tevkifat = JSON.parse(toplamlar.tevkifatlar);
        this.tevkifatlar_toplami[toplam_tevkifat["oran"] + "_0015"] = toplam_tevkifat;
        /*

        this.tevkifatlar_toplami[this.doubleParams[i]["tevfikat_tutar"]["oran"] + "_0015"] = {
          kod: this.doubleParams[i]["tevfikat_tutar"]["kod"],
          tevfikat_kod: this.doubleParams[i]["tevfikat_tutar"]["tevfikat_kod"],
          oran: this.doubleParams[i]["tevfikat_tutar"]["oran"],
          toplam: Number(Math.abs(this.doubleParams[i]["tevfikat_tutar"]["hesap"])).toFixed(2),
          display: this.doubleParams[i]["tevfikat_tutar"]["text"],
          mal_hizmet: Number(Math.abs(parseFloat(params["mal_hizmet_tutari"]))).toFixed(2),
        };*/
      }
      /*-----------------*/
      this.params["tevkifatlar_toplami"] = JSON.stringify(tevkifat);
      this.doubleTotal.tevkifat_toplami =
        parseFloat(this.doubleTotal.tevkifat_toplami) +
        parseFloat(toplamlar["kdv_tutari"]) * parseFloat(this.doubleParams[i]["tevfikat_tutar"]?.hesap);
      this.doubleTotal.urun_hizmet_toplam_tutar =
        parseFloat(this.doubleTotal.urun_hizmet_toplam_tutar) +
        parseFloat(toplamlar["mal_hizmet_tutari"]) -
        parseFloat(toplamlar["iskonto_tutari"]);

      this.doubleTotal.hesaplanan_kdv = parseFloat(this.doubleTotal.hesaplanan_kdv) + parseFloat(toplamlar["kdv_tutari"]);

      this.doubleTotal.toplam_iskonto =
        parseFloat(this.doubleTotal.toplam_iskonto) + parseFloat(toplamlar["iskonto_tutari"]);

      toplamlar["diger_vergiler_toplam_tutar"] = this.isEmpty(toplamlar["diger_vergiler_toplam_tutar"])
        ? 0
        : parseFloat(toplamlar["diger_vergiler_toplam_tutar"]);

      this.doubleTotal.diger_vergiler_toplam_tutar =
        parseFloat(this.doubleTotal.diger_vergiler_toplam_tutar) + parseFloat(toplamlar["diger_vergiler_toplam_tutar"]);

      this.doubleTotal.ozel_matrah_toplami =
        parseFloat(this.doubleTotal.ozel_matrah_toplami) + parseFloat(toplamlar["ozel_matrah_toplami"]);

      this.doubleTotal.toplam_vergi_tutari =
        parseFloat(this.doubleTotal.toplam_vergi_tutari) + parseFloat(toplamlar["toplam_vergi_tutari"]);

      this.doubleTotal.vergiler_dahil_toplam_tutar =
        parseFloat(this.doubleTotal.vergiler_dahil_toplam_tutar) + parseFloat(toplamlar["vergi_tutar"]);

      this.doubleTotal.odenecek_tutar =
        parseFloat(this.doubleTotal.odenecek_tutar) + parseFloat(toplamlar["odenecek_tutar"]);

      /*-----------------*/
      this.doubleTotal.urun_hizmet_toplam_tutar = Number(this.doubleTotal.urun_hizmet_toplam_tutar).toFixed(2);
      this.doubleTotal.tevkifat_toplami = Number(parseFloat(this.doubleTotal.tevkifat_toplami)).toFixed(2);
      this.doubleTotal.hesaplanan_kdv = Number(this.doubleTotal.hesaplanan_kdv).toFixed(2);
      this.doubleTotal.toplam_iskonto = Number(this.doubleTotal.toplam_iskonto).toFixed(2);

      if (this.doubleTotal.ozel_matrah_toplami == 0 || isNaN(this.doubleTotal.ozel_matrah_toplami)) {
        delete this.doubleTotal.ozel_matrah_toplami;
      } else {
        this.doubleTotal.ozel_matrah_toplami = Number(this.doubleTotal.ozel_matrah_toplami).toFixed(2);
      }

      this.doubleTotal.toplam_vergi_tutari = Number(this.doubleTotal.toplam_vergi_tutari).toFixed(2);
      this.doubleTotal.vergiler_dahil_toplam_tutar = Number(this.doubleTotal.vergiler_dahil_toplam_tutar).toFixed(2);
      this.doubleTotal.odenecek_tutar = Number(this.doubleTotal.odenecek_tutar).toFixed(2);
      if (this.doubleTotal.odenecek_tutar < 0) {
        this.doubleTotal.yazi = "Eksi" + this.intToText(this.doubleTotal.odenecek_tutar * -1);
      } else {
        this.doubleTotal.yazi = this.intToText(this.doubleTotal.odenecek_tutar);
      }

      /*-----------------*/
    }
    if (this.params["döviz_kuru"] > 1) {
      this.doubleTotal.dovizli_tutar = parseFloat(this.params["döviz_kuru"]) * parseFloat(this.doubleTotal.odenecek_tutar);
    } else {
      this.doubleTotal.dovizli_tutar = parseFloat(this.doubleTotal.odenecek_tutar);
    }
    if (this.doubleTotal.tevkifat_toplami == 0 || isNaN(this.doubleTotal.tevkifat_toplami)) {
      delete this.doubleTotal.tevkifat_toplami;
    } else {
      this.doubleTotal.odenecek_tutar =
        parseFloat(this.doubleTotal.odenecek_tutar) - parseFloat(this.doubleTotal.tevkifat_toplami);
    }
  },

  isEmpty(data) {
    if (data == "" || data == null || data == undefined) {
      return true;
    } else return false;
  },
  /**
   * Teklif Hesaplama
   */
  teklifHesap(i) {
    if (this.doubleParams == undefined) return;
    let kdv = this.getKdv(this.doubleParams[i]["kdv_id"]);
    let params = this.doubleParams[i];
    let OTVHesap = 0;

    if (params["iskonto_orani"] == "") params["iskonto_orani"] = 0;
    if (params["kdv_dahil_buton"] == true) {
      // BAŞ: KDV DAHİL
      // BAŞ: İSKONTO VAR
      if (params["iskonto_orani"] != null) {
        if (params["iskonto_arttirim"] != true) {
          params["iskonto_tutari"] =
            ((((params["birim_fiyat"] * params["miktar"]) / (parseFloat(kdv) / 100 + 1)) * params["iskonto_orani"]) / 100) *
            -1;
        } else {
          params["iskonto_tutari"] =
            (((params["birim_fiyat"] * params["miktar"]) / (parseFloat(kdv) / 100 + 1)) * params["iskonto_orani"]) / 100;
        }
        //ISKONTO TUTARI

        //MAL HIZMET TUTARI
        params["mal_hizmet_tutari"] =
          (params["birim_fiyat"] * params["miktar"]) / (parseFloat(kdv) / 100 + 1) + params["iskonto_tutari"];
        // DİĞER VERGİLER TUTARI
        // KDV TUTARI
        params["kdv_tutari"] =
          params["mal_hizmet_tutari"] * (parseFloat(kdv) / 100) + OTVHesap * (parseFloat(params["mal_hizmet_tutari"]) / 100);
        // DİĞER VERGİLER TEK HESAPLAMA
        // TEVKİFAT TUTARI
        /*if (this.tevkifat[s] != null) {
          this.tevkifat[s]["tutar"] =
            parseFloat(params["kdv_tutari"]) *
            parseFloat(eval(this.tevkifat[s].text.split("#")[1] == undefined ? 0 : this.tevkifat[s].text.split("#")[1]));
        }*/
        params["toplam_tutar"] = parseFloat(params["mal_hizmet_tutari"]) + parseFloat(params["kdv_tutari"]);
        //- this.tevkifat[s]["tutar"];
      }
      // SON: İSKONTO VAR
      // BAŞ: İSKONTO YOK
      else {
        params["mal_hizmet_tutari"] = (params["birim_fiyat"] * params["miktar"]) / (parseFloat(kdv) / 100 + 1);

        params["kdv_tutari"] =
          (params["birim_fiyat"] * params["miktar"] - params["mal_hizmet_tutari"]) *
            (params["ozel_matrah_tutari"] == undefined ? 1 : parseFloat(params["ozel_matrah_tutari"]) / 100) +
          (params["mal_hizmet_tutari"] * OTVHesap) / 100;
        /*if (this.tevkifat[s] != null) {
          this.tevkifat[s]["tutar"] =
            parseFloat(params["kdv_tutari"]) *
            parseFloat(eval(this.tevkifat[s].text.split("#")[1] == undefined ? 0 : this.tevkifat[s].text.split("#")[1]));
        }*/
        params["toplam_tutar"] = parseFloat(params["mal_hizmet_tutari"]) + parseFloat(params["kdv_tutari"]);
        //- this.tevkifat[s]["tutar"];
      }
      // BAŞ: İSKONTO YOK
    }
    // SON: KDV DAHİL
    // BAŞ: KDV HARİÇ
    else {
      // BAŞ: ISKONTO VAR
      if (params["iskonto_orani"] != null) {
        //ISKONTO HESAPLAMA
        if (params["iskonto_arttirim"] != true) {
          params["iskonto_tutari"] =
            ((parseFloat(params["birim_fiyat"]) * parseFloat(params["miktar"]) * parseFloat(params["iskonto_orani"])) /
              100) *
            -1;
        } else {
          params["iskonto_tutari"] =
            (parseFloat(params["birim_fiyat"]) * parseFloat(params["miktar"]) * parseFloat(params["iskonto_orani"])) / 100;
        }

        //MAL HİZMET TUTARINI HESAPLAMA
        params["mal_hizmet_tutari"] =
          parseFloat(params["birim_fiyat"]) * parseFloat(params["miktar"]) + parseFloat(params["iskonto_tutari"]);
        // KDV TUTARINI HESAPLAMA
        params["kdv_tutari"] =
          ((params["mal_hizmet_tutari"] * (parseFloat(kdv) + parseFloat(OTVHesap))) / 100) *
          (params["ozel_matrah_tutari"] == undefined ? 1 : parseFloat(params["ozel_matrah_tutari"]) / 100);

        /*if (this.tevkifat[s] != null) {
          this.tevkifat[s]["tutar"] =
            parseFloat(params["kdv_tutari"]) *
            parseFloat(eval(this.tevkifat[s].text.split("#")[1] == undefined ? 0 : this.tevkifat[s].text.split("#")[1]));
        }*/

        params["toplam_tutar"] = parseFloat(params["mal_hizmet_tutari"]) + parseFloat(params["kdv_tutari"]);
        //- (this.tevkifat[s]["tutar"] == undefined);
      }
      // SON: ISKONTO VAR
      // BAŞ: ISKONTO YOK
      else {
        params["mal_hizmet_tutari"] = params["birim_fiyat"] * params["miktar"];
        params["kdv_tutari"] =
          ((params["mal_hizmet_tutari"] * (parseFloat(kdv) + parseFloat(OTVHesap))) / 100) *
          (params["ozel_matrah_tutari"] == undefined ? 1 : parseFloat(params["ozel_matrah_tutari"]) / 100);

        params["toplam_tutar"] = parseFloat(params["mal_hizmet_tutari"]) + parseFloat(params["kdv_tutari"]);
        //- this.tevkifat[s]["tutar"];
      }
      // SON: ISKONTO YOK
    }

    params["mal_hizmet_tutari"] = Number(params["mal_hizmet_tutari"]).toFixed(2);
    params["tutar"] = Number(params["mal_hizmet_tutari"]).toFixed(2);
    params["kdv_tutari"] = Number(params["kdv_tutari"]).toFixed(2);
    params["toplam_tutar"] = Number(params["toplam_tutar"]).toFixed(2);
    params["iskonto_tutari"] = Number(params["iskonto_tutari"]).toFixed(2);
    params["dovizli_tutar"] = Number(params["vergi_tutar"] * params["döviz_kuru"]).toFixed(2);

    if (params["mal_hizmet_tutari"] == "NaN") params["mal_hizmet_tutari"] = 0;
    if (params["kdv_tutari"] == "NaN") params["kdv_tutari"] = 0;
    if (params["toplam_tutar"] == "NaN") params["toplam_tutar"] = 0;
    if (params["iskonto_tutari"] == "NaN") params["iskonto_tutari"] = 0;
    if (params["dovizli_tutar"] == "NaN") params["dovizli_tutar"] = 0;

    this.doubleTotal = {
      urun_hizmet_toplam_tutar: 0,
      toplam_iskonto: 0,
      hesaplanan_kdv: 0,
      vergiler_dahil_toplam_tutar: 0,
      odenecek_tutar: 0,
      yazi: "",
      dovizli_tutar: 0,
    };
    params["toplam_vergi_tutari"] = 0;
    params["odenecek_tutar"] = 0;
    params["toplam_tutar"] = Number(params["toplam_tutar"]).toFixed(2);
    params["toplam_vergi_tutari"] = parseFloat(params["toplam_vergi_tutari"]) + parseFloat(params["kdv_tutari"]);
    params["odenecek_tutar"] = parseFloat(params["odenecek_tutar"]) + parseFloat(params["toplam_tutar"]);

    for (const toplamlar of Object.values(this.doubleParams)) {
      /*-----------------*/

      this.doubleTotal.urun_hizmet_toplam_tutar =
        parseFloat(this.doubleTotal.urun_hizmet_toplam_tutar) +
        parseFloat(toplamlar["mal_hizmet_tutari"]) -
        parseFloat(toplamlar["iskonto_tutari"]);

      this.doubleTotal.hesaplanan_kdv = parseFloat(this.doubleTotal.hesaplanan_kdv) + parseFloat(toplamlar["kdv_tutari"]);
      this.doubleTotal.toplam_iskonto =
        parseFloat(this.doubleTotal.toplam_iskonto) + parseFloat(toplamlar["iskonto_tutari"]);

      this.doubleTotal.vergiler_dahil_toplam_tutar =
        parseFloat(this.doubleTotal.vergiler_dahil_toplam_tutar) + parseFloat(toplamlar["toplam_tutar"]);
      this.doubleTotal.odenecek_tutar =
        parseFloat(this.doubleTotal.odenecek_tutar) + parseFloat(toplamlar["odenecek_tutar"]);
      /*-----------------*/
      this.doubleTotal.urun_hizmet_toplam_tutar = Number(this.doubleTotal.urun_hizmet_toplam_tutar).toFixed(2);

      this.doubleTotal.hesaplanan_kdv = Number(this.doubleTotal.hesaplanan_kdv).toFixed(2);
      this.doubleTotal.toplam_iskonto = Number(this.doubleTotal.toplam_iskonto).toFixed(2);

      this.doubleTotal.vergiler_dahil_toplam_tutar = Number(this.doubleTotal.vergiler_dahil_toplam_tutar).toFixed(2);
      this.doubleTotal.odenecek_tutar = Number(this.doubleTotal.odenecek_tutar).toFixed(2);
      if (this.doubleTotal.odenecek_tutar < 0) {
        this.doubleTotal.yazi = "Eksi" + this.intToText(this.doubleTotal.odenecek_tutar * -1);
      } else {
        this.doubleTotal.yazi = this.intToText(this.doubleTotal.odenecek_tutar);
      }
      /*-----------------*/

      if (this.params["döviz_kuru"] > 1) {
        this.doubleTotal.dovizli_tutar = parseFloat(this.params["döviz_kuru"]) * parseFloat(this.doubleTotal.odenecek_tutar);
      }
    }
  },
  /**
   * Eirsaliye hesaplama için kullanılan fonksiyon
   */
  waybillCalculate(i) {
    let params = this.doubleParams?.[i];
    params["mal_hizmet_tutari"] = params["birim_fiyat"] * params["miktar"];
    params["mal_hizmet_tutari"] = Number(params["mal_hizmet_tutari"]).toFixed(2);

    if (params["mal_hizmet_tutari"] == "NaN") params["mal_hizmet_tutari"] = 0;
    params["tutar"] = params["mal_hizmet_tutari"];
    this.doubleTotal = {
      mal_hizmet_tutari: 0,
      odenecek_tutar: 0,
      yazi: "",
      dovizli_tutar: "",
    };
    this.doubleParams.forEach((e) => {
      this.doubleTotal.mal_hizmet_tutari += parseFloat(e["mal_hizmet_tutari"] == undefined ? 0 : e["mal_hizmet_tutari"]);
    });
    this.doubleTotal.odenecek_tutar = this.doubleTotal.mal_hizmet_tutari;
    if (this.doubleTotal.odenecek_tutar < 0) {
      this.doubleTotal.yazi = "Eksi" + this.intToText(this.doubleTotal.odenecek_tutar * -1);
    } else {
      this.doubleTotal.yazi = this.intToText(this.doubleTotal.odenecek_tutar);
    }
    if (this.params["döviz_kuru"] > 1) {
      this.doubleTotal.dovizli_tutar = parseFloat(this.params["döviz_kuru"]) * parseFloat(this.doubleTotal.odenecek_tutar);
    } else {
      this.doubleTotal.dovizli_tutar = parseFloat(this.doubleTotal.odenecek_tutar);
    }
  },
  // Son: waybillCalculate()
  /**
   * Ön muhasebe sipariş hesaplama için kullanılan fonksiyon
   */
  OnMhsbReceiptCalculate(i) {
    if (this.doubleParams == undefined) return;
    let kdv = this.getKdv(this.doubleParams[i]["kdv_id"]);
    let params = this.doubleParams[i];
    let OTVHesap = 0;

    if (params["iskonto_orani"] == "") params["iskonto_orani"] = 0;
    if (params["kdv_dahil_buton"] == true) {
      // BAŞ: KDV DAHİL
      // BAŞ: İSKONTO VAR
      if (params["iskonto_orani"] != null) {
        if (params["iskonto_arttirim"] != true) {
          params["iskonto_tutari"] =
            ((((params["birim_fiyat"] * params["miktar"]) / (parseFloat(kdv) / 100 + 1)) * params["iskonto_orani"]) / 100) *
            -1;
        } else {
          params["iskonto_tutari"] =
            (((params["birim_fiyat"] * params["miktar"]) / (parseFloat(kdv) / 100 + 1)) * params["iskonto_orani"]) / 100;
        }
        //ISKONTO TUTARI

        //MAL HIZMET TUTARI
        params["mal_hizmet_tutari"] =
          (params["birim_fiyat"] * params["miktar"]) / (parseFloat(kdv) / 100 + 1) + params["iskonto_tutari"];
        // DİĞER VERGİLER TUTARI
        // KDV TUTARI
        params["kdv_tutari"] =
          params["mal_hizmet_tutari"] * (parseFloat(kdv) / 100) + OTVHesap * (parseFloat(params["mal_hizmet_tutari"]) / 100);
        // DİĞER VERGİLER TEK HESAPLAMA
        // TEVKİFAT TUTARI
        /*if (this.tevkifat[s] != null) {
          this.tevkifat[s]["tutar"] =
            parseFloat(params["kdv_tutari"]) *
            parseFloat(eval(this.tevkifat[s].text.split("#")[1] == undefined ? 0 : this.tevkifat[s].text.split("#")[1]));
        }*/
        params["toplam_tutar"] = parseFloat(params["mal_hizmet_tutari"]) + parseFloat(params["kdv_tutari"]);
        //- this.tevkifat[s]["tutar"];
      }
      // SON: İSKONTO VAR
      // BAŞ: İSKONTO YOK
      else {
        params["mal_hizmet_tutari"] = (params["birim_fiyat"] * params["miktar"]) / (parseFloat(kdv) / 100 + 1);

        params["kdv_tutari"] =
          (params["birim_fiyat"] * params["miktar"] - params["mal_hizmet_tutari"]) *
            (params["ozel_matrah_tutari"] == undefined ? 1 : parseFloat(params["ozel_matrah_tutari"]) / 100) +
          (params["mal_hizmet_tutari"] * OTVHesap) / 100;
        /*if (this.tevkifat[s] != null) {
          this.tevkifat[s]["tutar"] =
            parseFloat(params["kdv_tutari"]) *
            parseFloat(eval(this.tevkifat[s].text.split("#")[1] == undefined ? 0 : this.tevkifat[s].text.split("#")[1]));
        }*/
        params["toplam_tutar"] = parseFloat(params["mal_hizmet_tutari"]) + parseFloat(params["kdv_tutari"]);
        //- this.tevkifat[s]["tutar"];
      }
      // BAŞ: İSKONTO YOK
    }
    // SON: KDV DAHİL
    // BAŞ: KDV HARİÇ
    else {
      // BAŞ: ISKONTO VAR
      if (params["iskonto_orani"] != null) {
        //ISKONTO HESAPLAMA
        if (params["iskonto_arttirim"] != true) {
          params["iskonto_tutari"] =
            ((parseFloat(params["birim_fiyat"]) * parseFloat(params["miktar"]) * parseFloat(params["iskonto_orani"])) /
              100) *
            -1;
        } else {
          params["iskonto_tutari"] =
            (parseFloat(params["birim_fiyat"]) * parseFloat(params["miktar"]) * parseFloat(params["iskonto_orani"])) / 100;
        }

        //MAL HİZMET TUTARINI HESAPLAMA
        params["mal_hizmet_tutari"] =
          parseFloat(params["birim_fiyat"]) * parseFloat(params["miktar"]) + parseFloat(params["iskonto_tutari"]);
        // KDV TUTARINI HESAPLAMA
        params["kdv_tutari"] =
          ((params["mal_hizmet_tutari"] * (parseFloat(kdv) + parseFloat(OTVHesap))) / 100) *
          (params["ozel_matrah_tutari"] == undefined ? 1 : parseFloat(params["ozel_matrah_tutari"]) / 100);

        /*if (this.tevkifat[s] != null) {
          this.tevkifat[s]["tutar"] =
            parseFloat(params["kdv_tutari"]) *
            parseFloat(eval(this.tevkifat[s].text.split("#")[1] == undefined ? 0 : this.tevkifat[s].text.split("#")[1]));
        }*/

        params["toplam_tutar"] = parseFloat(params["mal_hizmet_tutari"]) + parseFloat(params["kdv_tutari"]);
        //- (this.tevkifat[s]["tutar"] == undefined);
      }
      // SON: ISKONTO VAR
      // BAŞ: ISKONTO YOK
      else {
        params["mal_hizmet_tutari"] = params["birim_fiyat"] * params["miktar"];
        params["kdv_tutari"] =
          ((params["mal_hizmet_tutari"] * (parseFloat(kdv) + parseFloat(OTVHesap))) / 100) *
          (params["ozel_matrah_tutari"] == undefined ? 1 : parseFloat(params["ozel_matrah_tutari"]) / 100);

        params["toplam_tutar"] = parseFloat(params["mal_hizmet_tutari"]) + parseFloat(params["kdv_tutari"]);
        //- this.tevkifat[s]["tutar"];
      }
      // SON: ISKONTO YOK
    }

    params["mal_hizmet_tutari"] = Number(params["mal_hizmet_tutari"]).toFixed(2);
    params["tutar"] = Number(params["mal_hizmet_tutari"]).toFixed(2);
    params["kdv_tutari"] = Number(params["kdv_tutari"]).toFixed(2);
    params["toplam_tutar"] = Number(params["toplam_tutar"]).toFixed(2);
    params["iskonto_tutari"] = Number(params["iskonto_tutari"]).toFixed(2);
    params["dovizli_tutar"] = Number(params["vergi_tutar"] * params["döviz_kuru"]).toFixed(2);

    if (params["mal_hizmet_tutari"] == "NaN") params["mal_hizmet_tutari"] = 0;
    if (params["kdv_tutari"] == "NaN") params["kdv_tutari"] = 0;
    if (params["toplam_tutar"] == "NaN") params["toplam_tutar"] = 0;
    if (params["iskonto_tutari"] == "NaN") params["iskonto_tutari"] = 0;
    if (params["dovizli_tutar"] == "NaN") params["dovizli_tutar"] = 0;

    this.doubleTotal = {
      urun_hizmet_toplam_tutar: 0,
      toplam_iskonto: 0,
      hesaplanan_kdv: 0,
      vergiler_dahil_toplam_tutar: 0,
      odenecek_tutar: 0,
      yazi: "",
      dovizli_tutar: "",
    };
    params["toplam_vergi_tutari"] = 0;
    params["odenecek_tutar"] = 0;
    params["toplam_tutar"] = Number(params["toplam_tutar"]).toFixed(2);
    params["toplam_vergi_tutari"] = parseFloat(params["toplam_vergi_tutari"]) + parseFloat(params["kdv_tutari"]);
    params["odenecek_tutar"] = parseFloat(params["odenecek_tutar"]) + parseFloat(params["toplam_tutar"]);

    for (const toplamlar of Object.values(this.doubleParams)) {
      /*-----------------*/

      this.doubleTotal.urun_hizmet_toplam_tutar =
        parseFloat(this.doubleTotal.urun_hizmet_toplam_tutar) +
        parseFloat(toplamlar["mal_hizmet_tutari"]) -
        parseFloat(toplamlar["iskonto_tutari"]);

      this.doubleTotal.hesaplanan_kdv = parseFloat(this.doubleTotal.hesaplanan_kdv) + parseFloat(toplamlar["kdv_tutari"]);
      this.doubleTotal.toplam_iskonto =
        parseFloat(this.doubleTotal.toplam_iskonto) + parseFloat(toplamlar["iskonto_tutari"]);

      this.doubleTotal.vergiler_dahil_toplam_tutar =
        parseFloat(this.doubleTotal.vergiler_dahil_toplam_tutar) + parseFloat(toplamlar["toplam_tutar"]);
      this.doubleTotal.odenecek_tutar =
        parseFloat(this.doubleTotal.odenecek_tutar) + parseFloat(toplamlar["odenecek_tutar"]);
      /*-----------------*/
      this.doubleTotal.urun_hizmet_toplam_tutar = Number(this.doubleTotal.urun_hizmet_toplam_tutar).toFixed(2);

      this.doubleTotal.hesaplanan_kdv = Number(this.doubleTotal.hesaplanan_kdv).toFixed(2);
      this.doubleTotal.toplam_iskonto = Number(this.doubleTotal.toplam_iskonto).toFixed(2);

      this.doubleTotal.vergiler_dahil_toplam_tutar = Number(this.doubleTotal.vergiler_dahil_toplam_tutar).toFixed(2);
      this.doubleTotal.odenecek_tutar = Number(this.doubleTotal.odenecek_tutar).toFixed(2);
      if (this.doubleTotal.odenecek_tutar < 0) {
        this.doubleTotal.yazi = "Eksi" + this.intToText(this.doubleTotal.odenecek_tutar * -1);
      } else {
        this.doubleTotal.yazi = this.intToText(this.doubleTotal.odenecek_tutar);
      }
      /*-----------------*/
    }
    if (this.params["döviz_kuru"] > 1) {
      this.doubleTotal.dovizli_tutar = parseFloat(this.params["döviz_kuru"]) * parseFloat(this.doubleTotal.odenecek_tutar);
    } else {
      this.doubleTotal.dovizli_tutar = parseFloat(this.doubleTotal.odenecek_tutar);
    }
  },
  // Son: OnMhsbReceiptCalculate()
  /**
   * Müstahsil makbuzu hesaplama için kullanılan fonksiyon
   * Baş:producerReceiptCalculate()
   */
  producerReceiptCalculate(i) {
    let params = this.doubleParams[i];
    params["mal_hizmet_tutari"] = parseFloat(params["miktar"]) * parseFloat(params["birim_fiyat"]);
    params["gv_stopaj_tutari"] = parseFloat(params["mal_hizmet_tutari"]) * (parseFloat(params["gv_stopaj_orani"]) / 100);
    params["mera_fonu_tutari"] = parseFloat(params["mal_hizmet_tutari"]) * (parseFloat(params["mera_fonu_orani"]) / 100);
    params["sgk_prim_kesintisi_tutari"] =
      parseFloat(params["mal_hizmet_tutari"]) * (parseFloat(params["sgk_prim_kesintisi_orani"]) / 100);

    var borsaTescilKesintisi =
      parseFloat(params["gv_stopaj_tutari"] ? params["gv_stopaj_tutari"] : 0) +
      parseFloat(params["mera_fonu_tutari"] ? params["mera_fonu_tutari"] : 0) +
      parseFloat(params["sgk_prim_kesintisi_tutari"] ? params["sgk_prim_kesintisi_tutari"] : 0);
    params["borsa_tescil_ucreti_tutari"] =
      (parseFloat(params["mal_hizmet_tutari"]) - parseFloat(borsaTescilKesintisi)) *
      (parseFloat(params["borsa_tescil_ucreti_orani"]) / 100);
    params["diger_vergiler_toplam_tutar"] =
      parseFloat(borsaTescilKesintisi) +
      parseFloat(params["borsa_tescil_ucreti_tutari"] ? params["borsa_tescil_ucreti_tutari"] : 0);

    params["mal_hizmet_tutari"] = Number(params["mal_hizmet_tutari"]).toFixed(2);
    params["gv_stopaj_tutari"] = Number(params["gv_stopaj_tutari"]).toFixed(2);
    params["mera_fonu_tutari"] = Number(params["mera_fonu_tutari"]).toFixed(2);
    params["sgk_prim_kesintisi_tutari"] = Number(params["sgk_prim_kesintisi_tutari"]).toFixed(2);
    params["borsa_tescil_ucreti_tutari"] = Number(params["borsa_tescil_ucreti_tutari"]).toFixed(2);

    if (params["mal_hizmet_tutari"] == "NaN") params["mal_hizmet_tutari"] = 0;
    if (params["gv_stopaj_tutari"] == "NaN") params["gv_stopaj_tutari"] = 0;
    if (params["mera_fonu_tutari"] == "NaN") params["mera_fonu_tutari"] = 0;
    if (params["sgk_prim_kesintisi_tutari"] == "NaN") params["sgk_prim_kesintisi_tutari"] = 0;
    if (params["borsa_tescil_ucreti_tutari"] == "NaN") params["borsa_tescil_ucreti_tutari"] = 0;

    this.doubleTotal = {
      mal_hizmet_tutari: 0,
      mera_fonu_tutari: 0,
      gv_stopaj_tutari: 0,
      diger_vergiler_toplam_tutar: 0,
      sgk_prim_kesintisi_tutari: 0,
      borsa_tescil_ucreti_tutari: 0,
      odenecek_tutar: 0,
      yazi: "",
      dovizli_tutar: "",
    };

    this.doubleParams.forEach((e) => {
      this.doubleTotal.mal_hizmet_tutari += parseFloat(e["mal_hizmet_tutari"] == undefined ? 0 : e["mal_hizmet_tutari"]);
      this.doubleTotal.mera_fonu_tutari += parseFloat(e["mera_fonu_tutari"] == undefined ? 0 : e["mera_fonu_tutari"]);
      this.doubleTotal.gv_stopaj_tutari += parseFloat(e["gv_stopaj_tutari"] == undefined ? 0 : e["gv_stopaj_tutari"]);
      this.doubleTotal.sgk_prim_kesintisi_tutari += parseFloat(
        e["sgk_prim_kesintisi_tutari"] == undefined ? 0 : e["sgk_prim_kesintisi_tutari"]
      );
      this.doubleTotal.borsa_tescil_ucreti_tutari += parseFloat(
        e["borsa_tescil_ucreti_tutari"] == undefined ? 0 : e["borsa_tescil_ucreti_tutari"]
      );
      this.doubleTotal.diger_vergiler_toplam_tutar += parseFloat(
        e["diger_vergiler_toplam_tutar"] == undefined ? 0 : e["diger_vergiler_toplam_tutar"]
      );
    });
    this.doubleTotal.odenecek_tutar = this.doubleTotal.mal_hizmet_tutari - this.doubleTotal.diger_vergiler_toplam_tutar;
    if (this.doubleTotal.odenecek_tutar < 0) {
      this.doubleTotal.yazi = "Eksi" + this.intToText(this.doubleTotal.odenecek_tutar * -1);
    } else {
      this.doubleTotal.yazi = this.intToText(this.doubleTotal.odenecek_tutar);
    }
    if (this.params["döviz_kuru"] > 1) {
      this.doubleTotal.dovizli_tutar = parseFloat(this.params["döviz_kuru"]) * parseFloat(this.doubleTotal.odenecek_tutar);
    } else {
      this.doubleTotal.dovizli_tutar = parseFloat(this.doubleTotal.odenecek_tutar);
    }
  },
  // Son: producerReceiptCalculate()
  /**
   * Serbest meslek makbuzu için kullanılan fonksiyon
   * Baş:selfEmploymentReceiptCalculate()
   */
  selfEmploymentReceiptCalculate(i) {
    let params = this.doubleParams[i];
    if (params["gv_stopaj_orani"] == null) params["gv_stopaj_orani"] = 0;
    if (params["kdv_orani"] == null) params["kdv_orani"] = 0;
    if (params["kdv_tevkifat_orani"] == null) params["kdv_tevkifat_orani"] = 0;

    params["net_ucret"] =
      parseFloat(params["brut_ucret"]) - parseFloat(params["brut_ucret"]) * (parseFloat(params["gv_stopaj_orani"]) / 100);
    params["gv_stopaj_tutari"] = parseFloat(params["brut_ucret"]) * (parseFloat(params["gv_stopaj_orani"]) / 100);
    params["kdv_tutari"] = parseFloat(params["brut_ucret"]) * (parseFloat(params["kdv_orani"]) / 100);
    params["kdv_tevkifat_tutari"] = parseFloat(params["kdv_tutari"]) * (parseFloat(params["kdv_tevkifat_orani"]) / 100);
    params["tahsil_edilen_kdv"] = parseFloat(params["kdv_tutari"]) - parseFloat(params["kdv_tevkifat_tutari"]);
    params["net_tahsilat"] =
      parseFloat(params["net_ucret"]) + parseFloat(params["kdv_tutari"]) - parseFloat(params["kdv_tevkifat_tutari"]);

    params["net_ucret"] = Number(params["net_ucret"]).toFixed(2);
    params["kdv_tutari"] = Number(params["kdv_tutari"]).toFixed(2);
    params["kdv_tevkifat_tutari"] = Number(params["kdv_tevkifat_tutari"]).toFixed(2);
    params["net_tahsilat"] = Number(params["net_tahsilat"]).toFixed(2);
    params["tahsil_edilen_kdv"] = Number(params["tahsil_edilen_kdv"]).toFixed(2);
    params["gv_stopaj_tutari"] = Number(params["gv_stopaj_tutari"]).toFixed(2);

    if (params["net_ucret"] == "NaN") params["net_ucret"] = 0;
    if (params["kdv_tutari"] == "NaN") params["kdv_tutari"] = 0;
    if (params["kdv_tevkifat_tutari"] == "NaN") params["kdv_tevkifat_tutari"] = 0;
    if (params["net_tahsilat"] == "NaN") params["net_tahsilat"] = 0;
    if (params["tahsil_edilen_kdv"] == "NaN") params["tahsil_edilen_kdv"] = 0;
    if (params["gv_stopaj_tutari"] == "NaN") params["gv_stopaj_tutari"] = 0;

    this.doubleTotal = {
      net_ucret: 0,
      kdv_tutari: 0,
      kdv_tevkifat_tutari: 0,
      net_tahsilat: 0,
      gv_stopaj_tutari: 0,
      odenecek_tutar: 0,
      yazi: "",
    };

    this.doubleParams.forEach((e) => {
      this.doubleTotal.net_ucret += parseFloat(e["net_ucret"] == undefined ? 0 : e["net_ucret"]);
      this.doubleTotal.kdv_tutari += parseFloat(e["kdv_tutari"] == undefined ? 0 : e["kdv_tutari"]);
      this.doubleTotal.kdv_tevkifat_tutari += parseFloat(
        e["kdv_tevkifat_tutari"] == undefined ? 0 : e["kdv_tevkifat_tutari"]
      );
      this.doubleTotal.net_tahsilat += parseFloat(e["net_tahsilat"] == undefined ? 0 : e["net_tahsilat"]);
      this.doubleTotal.gv_stopaj_tutari += parseFloat(e["gv_stopaj_tutari"] == undefined ? 0 : e["gv_stopaj_tutari"]);
    });

    this.doubleTotal.odenecek_tutar = this.doubleTotal.net_tahsilat;
    if (this.doubleTotal.odenecek_tutar < 0) {
      this.doubleTotal.yazi = "Eksi" + this.intToText(this.doubleTotal.odenecek_tutar * -1);
    } else {
      this.doubleTotal.yazi = this.intToText(this.doubleTotal.odenecek_tutar);
    }
  },
  // Son: selfEmploymentReceiptCalculate()
  /**
   * tahsilat_islem,odeme_islemi, banka_gelen_havale_islemi, banka_giden_havale_islem tablosu hesaplamaları
   * Baş:caseBankTablesCalculate()
   */
  caseBankTablesCalculate() {
    let kdv = this.getKdv(this.params.kdv_id);
    if (this.params["kdv_dahil_buton"] == true) {
      this.params["kdv_tutari"] = this.params["tutar"] - this.params["tutar"] / (1 + kdv / 100);
      this.params["vergi_tutar"] = this.params["tutar"];
    } else {
      this.params["kdv_tutari"] = (this.params["tutar"] * kdv) / 100;
      this.params["vergi_tutar"] = parseFloat(this.params["tutar"]) + this.params["kdv_tutari"];
    }
    this.params["kdv_tutari"] = Number(this.params["kdv_tutari"]).toFixed(3);
    this.params["vergi_tutar"] = Number(this.params["vergi_tutar"]).toFixed(3);
    this.params["dovizli_tutar"] = Number(this.params["vergi_tutar"] * this.params["döviz_kuru"]).toFixed(3);
    if (this.params["tutar"] == "NaN") {
      this.params["tutar"] = 0;
    }
    if (this.params["kdv_tutari"] == "NaN") {
      this.params["kdv_tutari"] = 0;
    }
    if (this.params["vergi_tutar"] == "NaN") {
      this.params["vergi_tutar"] = 0;
    }
    if (this.params["iskonto_tutari"] == "NaN") {
      this.params["iskonto_tutari"] = 0;
    }
  },
  //Son: caseBankTablesCalculate()
  /**
   * musteri_cek, firma_cek, musteri_senet, firma_senet tablosu hesaplamaları
   * Baş :chequeBillCalculate()
   */
  chequeBillCalculate() {
    this.params["dovizli_tutar"] = Number(this.params["tutar"] * this.params["döviz_kuru"]).toFixed(3);
    if (this.params["tutar"] == "NaN") {
      this.params["tutar"] = 0;
    }
    if (this.params["dovizli_tutar"] == "NaN") {
      this.params["dovizli_tutar"] = 0;
    }
  },
  //Son: chequeBillCalculate()
  maliPersonelCalculate() {
    this.params["dovizli_tutar"] = Number(this.params["tutar"] * this.params["döviz_kuru"]).toFixed(3);
    if (this.params["tutar"] == "NaN") {
      this.params["tutar"] = 0;
    }
    if (this.params["dovizli_tutar"] == "NaN") {
      this.params["dovizli_tutar"] == 0;
    }
  },
  /**
   * Kobi sipariş hesaplaması
   * Baş: smeOrderCalculate()
   */
  smeOrderCalculate() {
    let kdv = this.getKdv(this.params.kdv_id);
    if (this.params["kdv_dahil_buton"] == true) {
      this.params["kdv_tutari"] = this.params["tutar"] - this.params["tutar"] / (1 + kdv / 100);
      this.params["vergi_tutar"] = this.params["tutar"];
    } else {
      this.params["kdv_tutari"] = (this.params["tutar"] * kdv) / 100;
      this.params["vergi_tutar"] = this.params["tutar"] + this.params["kdv_tutari"];
    }
    this.params["kdv_tutari"] = Number(this.params["kdv_tutari"]).toFixed(3);
    this.params["vergi_tutar"] = Number(this.params["vergi_tutar"]).toFixed(3);
    if (this.params["kobi_odenen_tutar"] > 0) {
      this.params["kobi_taksit_tutari"] = Number(
        (this.params["vergi_tutar"] - this.params["kobi_odenen_tutar"]) /
          (this.params["kobi_taksit_sayisi"] <= 0 ? 1 : this.params["kobi_taksit_sayisi"])
      ).toFixed(3);
    } else {
      this.params["kobi_taksit_tutari"] = Number(
        this.params["vergi_tutar"] / (this.params["kobi_taksit_sayisi"] <= 0 ? 1 : this.params["kobi_taksit_sayisi"])
      ).toFixed(3);
    }
    if (this.params["tutar"] == "NaN") {
      this.params["tutar"] = 0;
    }
    if (this.params["kdv_tutari"] == "NaN") {
      this.params["kdv_tutari"] = 0;
    }
    if (this.params["vergi_tutar"] == "NaN") {
      this.params["vergi_tutar"] = 0;
    }
  },
  //Son: smeOrderCalculate()

  /**
   * Gelen kdv_id'ye göre kdv oranını döndürür.
   * * @param 1: kdv_id
   * Baş: getKdv()
   */
  getKdv(id) {
    if (id == 4) {
      return 18;
    } else if (id == 5) {
      return 0;
    } else if (id == 3) {
      return 8;
    } else if (id == 2) {
      return 1;
    } else if (id == 7) return 21.5;
    else return;
  },
  /**
   * Gönderilen sayıyı yazi olarak döndürür. Sonuna tl ekler.
   * * @param 1: sayi
   * Baş: intToText()
   */
  intToText(sayi) {
    let sonuc = [];
    let i, j, c, tamsayi, ondalik;
    let adim = 0;

    sayi = sayi.toString().replace(".", ",");
    let rakam = sayi
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      .split(",");
    tamsayi = rakam[0];
    ondalik = rakam[1] || "";

    let birler = ["", "Bir", "İki", "Üç", "Dört", "Beş", "Altı", "Yedi", "Sekiz", "Dokuz"];
    let onlar = ["", "On", "Yirmi", "Otuz", "Kirk", "Elli", "Altmiş", "Yetmiş", "Seksen", "Doksan"];
    let binler = [
      "",
      "Bin",
      "Milyon",
      "Milyar",
      "Triliyon",
      "Quadrilyon",
      "Quintilyon",
      "Sextilyon",
      "Septilyon",
      "Octilyon",
      "Nonilyon",
    ];
    for (i = tamsayi.split(".").length; i > 0; i--) {
      sayi = tamsayi.split(".")[i - 1];
      if (sayi.length == 1) {
        sayi = "00" + sayi;
      }
      if (sayi.length == 2) {
        sayi = "0" + sayi;
      }
      c = "";

      for (j = 1; j < sayi.length + 1; j++) {
        if (j == 1 && sayi[j - 1] == 1) {
          c += "Yüz";
        } else if (j == 1 && birler[sayi[j - 1]] != "") {
          c += birler[sayi[j - 1]] + "Yüz";
        } else if (j == 2) {
          c += onlar[sayi[j - 1]] + "";
        } else if (j == 3 && tamsayi.length == 5 && sayi[j - 1] == 1 && adim == 1) {
          c += "Bir";
        } else if (j == 3) {
          c += birler[sayi[j - 1]] + "";
        }
      }

      if (c != "") {
        sonuc.push(c + binler[adim]);
      }
      adim++;
    }

    if (sonuc.length != 0) {
      sonuc = sonuc.reverse().join("") + " TL ";
    } else {
      sonuc = "";
    }
    if (ondalik.length == 1) {
      ondalik = ondalik + "0";
    }
    if (ondalik != "") {
      sonuc += "" + onlar[ondalik[0]] + "" + birler[ondalik[1]] + " KR";
    }

    sonuc = sonuc.replace(/ /g, " ").trim();

    return sonuc;
  },
  /**
   * Hizmet ve Masraf Kartları Hesaplamaları
   * Baş: serviceExpense()
   */
  serviceExpense() {
    let kdv = this.getKdv(this.params.kdv_id);
    this.params["vergi_tutar"] = Number(this.params["birim_fiyat"] + this.params["birim_fiyat"] * (kdv / 100)).toFixed(3);
    if (this.params["vergi_tutar"] == "NaN") {
      this.params["vergi_tutar"] = 0;
    }
  },
};
export default calculate;
