import axios from "axios";
import { ElNotification, ElMessageBox } from "element-plus";
import { ArrowLeft, ArrowRight, Coin, Money } from "@element-plus/icons-vue";
import formatter from "../../tools/numberFormatter";
import dateFormatter from "../../tools/dateFormatter";
import tabletr from "@/angaryos/right-click/tabletr";
const props = {
  table_data: Object,
  column_settings: Object,
  modules: Array,
  button_settings: Object,
  table_settings: Object,
};
const components = {
  ArrowLeft,
  ArrowRight,
  tabletr,
  Coin,
  Money,
};
const data = () => {
  return {
    modulesState: {
      cekOdeme: { column: "tahsilat_tamamlandi", value: true, if: "!=" },
      cekTahsilat: { column: "tahsilat_tamamlandi", value: true, if: "!=" },
      senetOdeme: { column: "tahsilat_tamamlandi", value: true, if: "!=" },
      senetTahsilat: { column: "tahsilat_tamamlandi", value: true, if: "!=" },
      faturaOdeme: { column: "kalan_odeme_tutari", value: 0, if: "<=" },
      faturaTahsilat: { column: "kalan_odeme_tutari", value: 0, if: "<=" },
      gelenFatura: {},
      gidenFatura: {},
      gelenIrsaliye: {},
      gidenIrsaliye: {},
      sabitOdeme: { column: "tahsilat_tamamlandi", value: true, if: "!=" },
      kobiOdeme: { column: "taksitli", value: 1, if: "<=" },
      kobiTaksit: { column: "kobi_taksit", value: 1, if: "<" },
      gidenSiparisTeklif: { column: "state", value: true, if: "==" },
    },
    formatter,
    dateFormatter,
  };
};
const methods = {
  triggerPage(command) {
    var page = command[0];
    var id = command[1];
    if (page == "detail") {
      this.tableRowClick({ id: id });
      /*this.$store.commit("setRightModalData", {
        name: "detail",
        title: "Detay",
        state: true,
        display: "right",
        table_name: this.table_data.table_info.name,
        id: id,
        column_settings: this.column_settings,
      });*/
    } else if (page == "edit") {
      if (this.button_settings?.["edit"]?.["url"] != undefined && this.button_settings?.["edit"]?.["url"] != "") {
        this.$router.push(this.button_settings["edit"]["url"] + id);
      } else if (this.button_settings?.["edit"]?.["custom"]) {
        this.$store.commit("setRightModalData", {
          id: id,
          name: this.button_settings?.["edit"]?.["custom"],
          type: "edit",
          display: "right",
          title: "Düzenle",
          state: true,
          table_name: this.table_data.table_info.name,
          column_settings: this.column_settings,
        });
      } else {
        this.$store.commit("setRightModalData", {
          id: id,
          name: "dual",
          type: "edit",
          display: "right",
          title: "Düzenle",
          state: true,
          table_name: this.table_data.table_info.name,
          column_settings: this.column_settings,
        });
      }
    } else if (page == "delete") {
      this.table_data?.records.find((e) => {
        if (e.id == command[1]) {
          if (!this.isEmpty(e?.kobi_odenmis_tutar) && e?.kobi_odenmis_tutar > 0) {
            ElMessageBox.alert("Seçili kayıt silinemez. Daha önce ödeme alınmış!", "Hata", {
              confirmButtonText: "Tamam",
              type: "error",
            });
          } else {
            ElMessageBox.confirm("Seçili kayıtı silmek istediğinize emin misiniz?", "Dikkat", {
              confirmButtonText: "Evet",
              cancelButtonText: "Vazgeç",
              type: "warning",
            })
              .then(() => {
                axios
                  .post(
                    this.$store.getters.getToken + "/tables/" + this.table_data.table_info.name + "/" + id + "/delete",
                    {}
                  )
                  .then((res) => {
                    if (res.data.data.message == "success") {
                      ElNotification({
                        title: "Başarılı",
                        message: "Kayıt başarıyla silindi.",
                        type: "success",
                        position: "top-left",
                      });
                      this.$store.commit("setTableRefresh");
                    } else {
                      ElNotification({
                        title: "Hata",
                        message: res.data.data.message,
                        type: "error",
                        position: "top-right",
                      });
                    }
                  })
                  .catch((err) => {
                    ElNotification({
                      title: "Hata",
                      message: err.response.data.data.message,
                      type: "error",
                      position: "top-right",
                    });
                  });
              })
              .catch(() => {
                ElNotification({
                  title: "Uyarı",
                  message: "Kayıt silme iptal edildi.",
                  type: "info",
                  position: "top-left",
                });
              });
          }
        }
      });
    }
  },

  triggerModules(m, id) {
    this.$store.commit("setCenterModalData", {
      name: m.name,
      title: m.display_name,
      state: true,
      display: "right",
      table_name: this.table_data.table_info.name,
      id: id,
      column_settings: this.column_settings,
    });
  },

  tableRowClick(tr) {
    if (this.button_settings?.["detail"]?.["url"] != undefined && this.button_settings?.["detail"]?.["url"] != "") {
      this.$router.push(this.button_settings["detail"]["url"] + tr.id);
    } else if (this.button_settings?.["detail"]?.visible != false) {
      this.$store.commit("setRightModalData", {
        name: "detail",
        title: "Detay",
        state: true,
        display: "right",
        table_name: this.table_data.table_info.name,
        id: tr.id,
        column_settings: this.column_settings,
      });
    }
  },
  openFaturaPage(id, ettn) {
    this.$store.commit("setCenterModalData", {
      name: "fatura",
      title: "Fatura",
      state: true,
      display: "center",
      table_name: this.table_data.table_info.name,
      id: { id: id, ettn: ettn },
      column_settings: this.column_settings,
    });
  },
  teklifSayfasi(tr, durum) {
    if (durum == "page") {
      window.open("/teklif?token=" + tr.tokent, "_blank");
    } else if (durum == "copy") {
      var copyText = window.location.origin + "/teklif?token=" + tr.tokent;
      navigator.clipboard.writeText(copyText);
    }
  },
};
export { data, props, methods, components };
