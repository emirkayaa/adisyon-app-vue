const mutations = {
  setBorsaData(state, borsaData) {
    state.borsaData = borsaData;
    localStorage.setItem("borsaData", JSON.stringify(borsaData));
  },
  setHavaDurumu(state, data) {
    state.havaDurumu = data;
  },
  setDuyuru(state, data) {
    state.duyuru = data;
  },
};
export default mutations;
