import store from "./index.js";
import { ElNotification, ElMessageBox } from "element-plus";
import services from "@/services";
const menu = {
  mutations: {
    refreshPage() {
      window.location.reload();
    },
    refreshTable() {
      store.commit("setTableRefresh");
    },
    dataCreate(state, data) {
      state;
      store.commit("setRightModalData", {
        name: "dual",
        type: "create",
        title: "Ekle",
        state: true,
        display: "right",
        table_name: data.table_name,
        column_settings: data.column_settings,
      });
    },
    dataEdit(state, data) {
      state;
      store.commit("setRightModalData", {
        name: "dual",
        type: "edit",
        title: "Düzenle",
        state: true,
        display: "right",
        id: data.id,
        table_name: data.table_name,
        column_settings: data.column_settings,
      });
    },
    dataDelete(state, data) {
      state;
      ElMessageBox.confirm("Seçili veriyi silmek istediğinize emin misiniz!", "Dikkat", {
        confirmButtonText: "Evet",
        cancelButtonText: "Vazgeç",
        type: "warning",
      })
        .then(() => {
          services.deleted(data.table_name, data.id).then((res) => {
            if (res.data.data.message == "success") {
              ElNotification({
                title: "Başarılı",
                message: "Silme işlemi başarıyla gerçekleşti.",
                type: "success",
                position: "top-left",
              });
              store.commit("setTableRefresh");
            } else {
              ElNotification({
                title: "Hata",
                message: "Silme işlemi başarısız.",
                type: "danger",
                position: "top-left",
              });
            }
          });
        })
        .catch(() => {
          ElNotification({
            title: "Bildirim",
            message: "Silmekten vazgeçildi.",
            type: "info",
            position: "top-left",
          });
        });
    },
    help() {
      window.open("/docs" + window.location.pathname);
    },
  },
};

export default menu;
