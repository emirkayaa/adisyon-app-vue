import axios from "axios";
//import { ElNotification } from "element-plus";
//import services from "@/services/";
//import store from "../index.js";

const actions = {
  /**
   * Borsa verilerini getirmek için atılan api isteği
   * @commit {setBorsaData}
   */
  borsaDataApi() {
    /*axios
      .get("https://api.bigpara.hurriyet.com.tr/doviz/headerlist/anasayfa")
      .then((response) => {
        store.commit("setBorsaData", response.data.data);
      })
      .catch((err) => {
        ElNotification({
          title: "Error",
          message: err.response.data.data.message,
          type: "error",
          position: "top-left",
        });
      });*/
  },
  /**
   * Hava durumu verilerini getirmek için atılan api isteği
   * @param {*} sehir -> string : Şehir ismi
   * @commit {setHavaDurumu}
   */
  havaDurumuApi(store, sehir) {
    axios
      .get(
        "http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=48XEl7FlurR5MjHAdD9sewEDdG7faA5C&q=" +
          sehir +
          "&language=tr-TR"
      )
      .then((res) => {
        axios
          .get(
            "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/" +
              res.data[0].Key +
              "?apikey=48XEl7FlurR5MjHAdD9sewEDdG7faA5C&language=tr-TR&details=true&metric=true"
          )
          .then((res) => {
            store.commit("setHavaDurumu", res.data[0]);
          });
      });
  },
  /**
   * Duyurular tablosundan veri çekmek için atılan api isteği
   * @param {*} store
   * @commit {setDuyuru}
   */
  duyurularApi() {
    /*const dateNow =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1) +
        "-" +
        (new Date().getDate() < 10 ? "0" + (new Date().getDate() + 1) : (new Date().getDate() + 1));
    const params = {
      page: 1,
      limit: 20,
      sorts: [], //{ id: false },
      filters: {
        start_time: {
          type: "2",
          guiType: "datetime",
          filter: dateNow + " 00:00:00",
        },
        // state: {
        //   type: "1",
        //   guiType: "select",
        //   filter: true
        // }
      },
    };
    services.list("bildirimler", params).then((res) => {
      store.commit("setDuyuru", res.data.data.records);
    });
    */
  },
};
export default actions;
