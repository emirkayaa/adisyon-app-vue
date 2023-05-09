<template>
  <div class="w-100 d-flex justify-content-center otp-page align-items-center">
    <div class="otp-card col-12 col-sm-6 col-md-4 col-xl-3 text-center">
      <div class="w-100 d-flex align-items-center justify-content-center mb-4">
        <img src="/icon/is_black3.png" alt="ishesap.com logo" style="width: 200px" class="m-4" />
      </div>
      <h5>{{ getLoginData.token.phone }}</h5>
      <span class="p-2 fs-7">Telefonunuza gönderilen doğrulama kodunu ilgili alana giriniz.</span>
      <el-divider>
        <div v-if="yenidenGonderButton == false">{{ kalanSure }}</div>
        <el-button v-else @click="login()" type="primary" plain>Yeniden Gönder</el-button>
      </el-divider>
      <div class="pin-div">
        <v-otp-input
          v-model="pin"
          ref="otpInput"
          input-classes="otp-input"
          separator="-"
          :num-inputs="6"
          :should-auto-focus="true"
          :is-input-num="true"
          @on-change="handleOnChange"
          @on-complete="handleOnComplete"
        />
      </div>
      <el-divider>
        <el-button v-if="yenidenGonderButton" @click="goLogin()" type="info" plain>Giriş Ekranına Dön</el-button>
      </el-divider>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VOtpInput from "vue3-otp-input";
import { ElDivider } from "element-plus";
export default {
  props: ["data"],
  components: { VOtpInput, ElDivider },
  data() {
    return {
      pin: "",
      kalanSure: "",
      gelenSure: "",
      yenidenGonderButton: false,
    };
  },
  computed: {
    ...mapGetters(["getLoginData"]),
  },
  created() {
    this.sureTetikle();
    addEventListener("paste", (event) => {
      event.preventDefault();

      let val = (event.clipboardData || window.clipboardData).getData("text");
      this.pin = val;
    });
  },
  methods: {
    giris(e) {
      var localData = this.getLoginData;
      var kod = e;
      var params = {};
      params = {
        email: localData.email,
        password: localData.password,
        otp: kod,
      };
      this.$store.dispatch("login", params);
    },
    login() {
      this.sureTetikle();
      this.$store.dispatch("verification", this.getLoginData);
    },
    goLogin() {
      this.$route.push("/login");
    },
    sureTetikle() {
      this.yenidenGonderButton = false;
      var sure = 120;

      //localStorage.getItem('kalanSure') ? sure = localStorage.getItem('kalanSure') : sure = 100;
      var interval = setInterval(() => {
        if (sure > 0 && sure < 60) {
          sure--;
          var saniye = sure % 60 < 10 ? "0" + (sure % 60) : sure % 60;
          this.kalanSure = "00:" + saniye;
          localStorage.setItem("kalanSure", sure);
        } else if (sure >= 60) {
          sure--;
          var dakika = Math.floor(sure / 60) < 10 ? "0" + Math.floor(sure / 60) : sure / 60;
          var saniye1 = sure % 60 < 10 ? "0" + (sure % 60) : sure % 60;
          this.kalanSure = dakika + ":" + saniye1;
          localStorage.setItem("kalanSure", sure);
        } else {
          clearInterval(interval);
          this.yenidenGonderButton = true;
          this.kalanSure = "00:00";
          localStorage.removeItem("kalanSure");
        }
      }, 1000);
    },
    handleOnComplete(e) {
      this.giris(e);
    },
  },
  mounted() {
    setTimeout(() => {
      document.getElementById("page-loader").style.display = "none";
      document.getElementById("app").style.display = "block";
    }, 100);
  },
  watch: {
    loginData() {},
  },
};
</script>

<style>
.pin-div {
  width: 100%;
  display: flex;
  justify-content: center;
}
.pin-div input {
  font-size: 26px !important;
  width: 40px;
  text-align: center;
  height: 60px !important;
  border: 1px solid #000 !important;
  border-radius: 5px !important;
}
.pin-div input:focus-visible {
  outline: 0 !important;
  border: 1px solid #000 !important;
  border-radius: 5px !important;
}

.otp-page {
  height: 100vh;
}
.otp-card {
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  padding: 30px 20px;
}

.dark .otp-page {
  background: #18191b;
}
.dark .otp-card {
  background: #1e2022;
}
.dark .el-divider__text {
  background: #1e2022;
}
.dark .pin-div input {
  border: 1px solid #374051 !important;
}

.light .otp-page {
  background: #edf1f3;
}
.light .otp-card {
  background: #fff;
}
.light .el-divider__text {
  background: #fff;
}
.light .pin-div input {
  border: 1px solid #374051 !important;
}
</style>
