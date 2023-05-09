<template>
  <div></div>
</template>
<script>
import { mapGetters } from "vuex";
import store from "@/store";
import axios from "axios";
export default {
  created() {
    if (localStorage.getItem("user-data") == null) {
      store.dispatch("userDataApi");
    } else {
      //store.dispatch("borsaDataApi");
      //store.dispatch("duyurularApi");
      //store.commit("setIsAdmin");
    }

    setInterval(() => {
      store.dispatch("duyurularApi");
      store.dispatch("borsaDataApi");
    }, 60000);
  },
  mounted() {
    this.systemControl();
  },
  computed: {
    ...mapGetters({
      getUserData: "getUserData",
      getCompData: "getCompData",
      userDataChange: "userDataChange",
    }),
  },
  watch: {
    userDataChange() {
      setTimeout(() => {
        document.getElementById("page-loader").style.display = "none";
        document.getElementById("app").style.display = "block";
      }, 100);
    },
    getCompData() {
      store.commit("setIsAdmin");

      store.dispatch("borsaDataApi");
      store.dispatch("duyurularApi");
      setInterval(() => {
        store.dispatch("duyurularApi");
        store.dispatch("borsaDataApi");
      }, 60000);
    },
    $route() {
      this.systemControl();
    },
  },
  methods: {
    systemControl() {
      //document.getElementById("page-loader").style.display = "flex";
      document.getElementById("page-loader").style.display = "none";
      document.getElementById("app").style.display = "block";
      axios
        .post("/" + store.getters.getToken)
        .then((res) => {
          if (res.data.data.message == "fail.token") {
            store.dispatch("logOut");
          }
        })
        .catch((e) => {
          this.$services.setError({
            istek_link: "/" + store.getters.getToken,
            kullanici_bilgileri: JSON.stringify(this.$store.getters.getUserData.user),
            payloads: "system-control",
            preview: JSON.stringify(e.response),
            tablo_ismi: "system-control",
            token_bilgisi: this.$store.getters.getToken,
          });
          if (e.response.data.data.message == "fail.token") store.dispatch("logOut");
        })
        .finally(() => {
          /*setTimeout(() => {
            document.getElementById("page-loader").style.display = "none";
            document.getElementById("app").style.display = "block";
          }, 300);*/
        });
    },
  },
};
</script>
<style>
.menu-sifirla {
  transform: translateX(-230px);
}
</style>
