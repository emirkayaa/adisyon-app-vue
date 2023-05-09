<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getToken"]),
  },
  mounted() {
    this.setRoute();
  },
  watch: {
    $route() {
      this.setRoute();
    },
  },
  methods: {
    setRoute() {
      console.log(window.location.pathname);
      if (this.getToken) {
        window.location.href = "/";
      } else if (window.location.pathname == "/") {
        this.$router.push("/login");
      } else if (this.$route.path == "/login") {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i];
          var eqPos = cookie.indexOf("=");
          var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        if (localStorage.getItem("frontToken") != null) {
          this.$store.dispatch("logOut");
        }
      }
    },
  },
};
</script>
