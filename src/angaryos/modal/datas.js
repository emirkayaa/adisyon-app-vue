import dual from "../dual.vue";
import detail from "../detail.vue";
import odemeDetay from "@/angaryos/modules/odeme-detay";

const components = {
  dual,
  detail,
  odemeDetay,

  modules: null,
};
const modalDatas = {
  name: "dual",
  type: "create",
  title: "Ekle",
  state: true,
  table_name: "",
  column_settings: {},
};
export { components, modalDatas };
