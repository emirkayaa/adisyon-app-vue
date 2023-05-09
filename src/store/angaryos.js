import crypt from "@/hooks/crypt.js";
import services from "@/services";
import store from "@/store";
const angaryos = {
  state: {
    rightModalData: {},
    centerModalData: {},
    modalDatas: [],
    adisyonData: [],

    tableRefresh: 0,
    dualRefresh: 0,
    favorite: {},
    convert_data: {},
    create_data: {},
  },
  mutations: {
    setModalDatas(state, data) {
      state.modalDatas = data;
    },
    setRightModalData(state, data) {
      state.rightModalData = data;
      data["display"] = "right";
      data["windows"] = false;
      if (state.modalDatas.find((e) => e == data)) {
        data;
      } else state.modalDatas.push(data);
      localStorage.setItem("modalDatas", JSON.stringify(state.modalDatas));
    },
    setCenterModalData(state, data) {
      state.centerModalData = data;
      data["display"] = "center";
      data["windows"] = false;
      if (state.modalDatas.find((e) => e == data)) {
        data;
      } else state.modalDatas.push(data);
      localStorage.setItem("modalDatas", JSON.stringify(state.modalDatas));
    },
    setTableRefresh(state) {
      state.tableRefresh++;
    },
    setDualRefresh(state) {
      state.dualRefresh++;
    },
    async setFavorite(state, data) {
      if (data.state == false) {
        delete state.favorite[data.link + "/" + data.table_name];
      } else {
        state.favorite[data.link + "/" + data.table_name] = data;
      }

      localStorage.setItem("favoriler", JSON.stringify(state.favorite));

      const params = {
        name: store.getters.getUserData.user.id + "",
        description: JSON.stringify(state.favorite),
      };

      if (state.favorite.id != undefined) {
        services.update("favoriler", state.favorite.id, params);
      } else {
        store.dispatch("apiFavorite").then(() => {
          if (state.favorite.id != undefined) {
            services.update("favoriler", state.favorite.id, params);
          } else {
            services.add("favoriler", params);
          }
        });
      }
    },
    setConvertData(state, data) {
      state.convert_data = data;
    },
    setCreateData(state, data) {
      state.create_data = data;
      localStorage.setItem("create", crypt(true, data));
    },
    setAdisyonData(state, data) {
      state.adisyonData = data
    }
  },
  actions: {
    async apiFavorite(stor) {
      const params = {
        page: 1,
        limit: 1,
        sorts: {},
        filters: {
          name_basic: { type: 4, guiType: "string", filter: store.getters.getUserData.user.id + "" },
        },
      };
      return await services.list("favoriler", params).then((res) => {
        if (res.data.data.all_records_count > 0) {
          const dt = res.data.data.records[0]?.description;
          stor.state.favorite["id"] = res.data.data.records[0]?.id;
          if (dt != null) {
            for (const [key, val] of Object.entries(JSON.parse(dt))) {
              stor.state.favorite[key] = val;
            }
          }
        }
      });
    },
  },
  getters: {
    getRightModalData(state) {
      return state.rightModalData;
    },
    getCenterModalData(state) {
      return state.centerModalData;
    },
    getTableRefresh(state) {
      return state.tableRefresh;
    },
    getDualRefresh(state) {
      return state.dualRefresh;
    },
    getModalDatas(state) {
      return state.modalDatas;
    },
    getFavorite(state) {
      return state.favorite;
      /*const params = {
        limit: 1,
        page: 1,
        sorts: [],
        filters: {
          name_basic: {
            type: 4,
            guiType: "string",
            filter: store.getters.getUserData.user.id,
          },
        },
      };
      state.favorite = JSON.parse(localStorage.getItem("favorite"));
      services.list("favoriler", params).then((res) => {
        state.favorite = JSON.parse(res.data.data.records?.[0].description);
        
        
      });*/
    },
    getConvertData(state) {
      return state.convert_data;
    },
    getCreateData(state) {
      if (state.create_data == null) state.create_data = {};

      if (Object.values(state.create_data)?.[0] == undefined) {
        if (localStorage.getItem("create") == null) {
          localStorage.setItem("create", "");
        } else {
          state.create_data = crypt(false, localStorage.getItem("create"));
          return state.create_data;
        }
      } else {
        return state.create_data;
      }
    },
    getAdisyonData(state) {
      console.log(state.adisyonData)
      // if (state.adisyonData != undefined) {
      //   let url = window.location.pathname
      //   services.edit("adisyon", url.substring(url.lastIndexOf('/') + 1))
      //   .then(res => {
      //     console.log("dasdasd",res)
      //   })
      // }
      state.adisyonData = {}
      return state.adisyonData
    }
  },
};
export default angaryos;
