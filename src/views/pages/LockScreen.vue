<template>
  <div
    :class="lock == true ? '' : ' d-none'"
    class="lock-screen"
    :style="{ background: 'url(' + image + ')' }"
    @click="focusInput()"
  >
    <div class="d-none d-md-flex h-100 flex-column justify-content-between p-5">
      <div class="d-flex w-100 p-5 justify-content-between">
        <div class="screenlock-logo d-flex align-items-center">
          <img src="/icon/is_white3.png" />
        </div>
      </div>
      <div class="d-flex w-100 p-5 justify-content-between align-items-end">
        <div class="d-flex flex-column">
          <div class="screenlock-saat">
            {{ saat }}
          </div>
          <div class="screenlock-tarih">
            {{ tarih }}
          </div>
        </div>
        <div class="d-none d-lg-flex flex-column">
          <div v-if="getHavaDurumu?.WeatherIcon != undefined" class="mb-4 d-flex justify-content-end">
            <div class="d-flex text-white card-lockscreen" style="width: min-content">
              <img
                :src="'/_assets/weather/' + getHavaDurumu?.WeatherIcon + '.png'"
                style="width: 90px; height: auto"
                class="mr-3"
              />
              <div class="d-flex flex-column">
                <h1 class="m-0 p-0 h1">{{ getHavaDurumu.Temperature?.Value }}°C</h1>
                <label class="text-white m-0 p-0 text-nowrap">{{ getHavaDurumu.IconPhrase }}</label>
                <label for="">{{ this.getCompData.firma_adresi }} </label>
              </div>
            </div>
          </div>
          <div class="d-flex">
            <template v-for="br in getBorsaData" :key="br">
              <template
                v-if="br.SEMBOL == 'TAHVIL' || br.SEMBOL == 'XU100' || br.SEMBOL == 'BRENT' || br.SEMBOL == 'EURUSD'"
              ></template>
              <div v-else class="card-lockscreen p-2 mx-1" style="width: 120px; height: min-content">
                <div class="d-flex align-items-center justify-content-center flex-column">
                  <label class="fs-4 text-white">{{ br.SEMBOL }}</label>
                  <span class="fs-3 m-0 p-0" :class="br.NET > 0 ? 'text-success' : 'text-danger'">
                    {{ Number(br.KAPANIS).toFixed(2) }}
                  </span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="d-md-none w-100 mobil-screenlock text-center pt-5 text-white">
      <div>
        <div class="screenlock-logo d-flex align-items-center justify-content-center">
          <img src="/icon/is_white3.png" />
        </div>
      </div>
      <div class="saat">
        {{ saat }}
      </div>
      <div class="tarih">
        {{ tarih }}
      </div>
    </div>
    <div class="position-absolute h1 text-white" style="left: calc(50vw - 20px); bottom: 20px">
      <i v-if="lockIconState == false" @mouseover="lockIconState = true" class="bi bi-lock-fill"></i>
      <i v-if="lockIconState == true" @mouseleave="lockIconState = false" class="bi bi-unlock-fill"></i>
    </div>
  </div>
  <div :class="lock == false ? '' : ' d-none'">
    <div class="unlock-screen" :style="{ background: 'url(' + image + ')' }"></div>
    <div class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center" style="top: 0">
      <div class="pin-div d-flex">
        <v-otp-input
          id="otpInput"
          input-classes="otp-input"
          separator="|"
          :num-inputs="4"
          :should-auto-focus="false"
          :is-input-num="true"
          @on-change="handleOnChange"
          @on-complete="handleOnComplete"
          :placeholder="['*', '*', '*', '*']"
          inputmode="number"
          input-type="number"
          autocomplete="off"
          v-model="pinCode"
          type="number"
        />
      </div>
    </div>
    <div class="position-absolute h1 text-white" style="left: calc(50vw - 20px); bottom: 20px">
      <i @click="lock = true" class="bi bi-arrow-return-left"></i>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import VOtpInput from "vue3-otp-input";
import { ElNotification } from "element-plus";
import { mapGetters } from "vuex";
import { mask } from "vue-the-mask";
export default {
  directives: { mask },
  data() {
    return {
      image: "",
      lock: true,
      lockIconState: false,
      saat: "",
      tarih: "",
      pinCode: "",
    };
  },

  computed: {
    ...mapGetters(["getBorsaData", "getHavaDurumu", "getCompData"]),
  },
  created() {
    this.getImg();
    setInterval(() => {
      this.saat = new Date().toLocaleTimeString();
      this.tarih = new Date().toLocaleDateString();
    }, 1000);
  },
  mounted() {
    document.addEventListener("keypress", (e) => {
      if (this.lock == true) {
        this.focusInput();
      } else {
        if (e.keyCode == 27) {
          this.lock = false;
        }
      }
    });
    if (this.getCompData.firma_adresi != null) {
      this.$store.dispatch("havaDurumuApi", this.getCompData.firma_adresi);
    }
  },
  methods: {
    getImg() {
      axios.get("https://peapix.com/bing/feed?country=gb").then((res) => {
        this.image = res.data[0].fullUrl;
      });
    },
    handleOnComplete(e) {
      if (this.getCompData.pin_code == e) {
        this.$store.commit("setScreenLock", "false");
      } else {
        ElNotification({
          title: "Hata",
          message: "Yanlış pin girdiniz!",
          type: "error",
          position: "top-left",
        });
      }
    },
    focusInput() {
      const inps = document.getElementsByClassName("otp-input")[0];
      window.setTimeout(() => inps.focus(), 0);
      this.lock = false;
    },
  },
  watch: {
    getCompData() {
      if (this.getCompData.firma_adresi != null) {
        this.$store.dispatch("havaDurumuApi", this.getCompData.firma_adresi);
      }
    },
  },
  components: { VOtpInput },
};
</script>
<style>
.lock-screen {
  width: 100vw;
  height: 100vh;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}
.unlock-screen {
  width: 100vw;
  height: 100vh;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  filter: blur(5px);
  -webkit-filter: blur(5px);
}
.pin-div input {
  font-size: 26px !important;
  width: 40px;
  text-align: center;
  height: 60px !important;
  outline: 0 !important;
  border: 1px solid #000 !important;
  border-radius: 5px !important;
}
.pin-div input:focus-visible {
  outline: 0 !important;
  border: 1px solid #000 !important;
  border-radius: 5px !important;
}
.screenlock-logo {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 20px;
}
.screenlock-logo img {
  height: 80px;
}
@import url("https://fonts.googleapis.com/css2?family=Anton&display=swap");
.screenlock-saat {
  font-family: "Anton";
  font-size: 90px;
  font-weight: 100;
  color: white;
  line-height: 0;
  margin-bottom: 40px;
}
.screenlock-tarih {
  font-family: "Anton";
  font-size: 30px;
  font-weight: 100;
  color: white;
}
.card-lockscreen {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 10px;
}
.card-lockscreen:hover {
  background-color: rgba(0, 0, 0, 0.9);
}

.mobil-screenlock {
  width: 100vw;
  height: 100vh;
}
.mobil-screenlock .saat {
  font-family: "Anton";
  font-size: 50px;
  font-weight: 100;
  color: white;
}
.mobil-screenlock .tarih {
  font-family: "Anton";
  font-size: 30px;
  font-weight: 100;
  color: white;
  margin-bottom: 40px;
}
.pin-div input::-webkit-outer-spin-button,
.pin-div input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
  -webkit-text-security: disc;
}

/* Firefox */
.pin-div input[type="number"] {
  -moz-appearance: textfield;
  -webkit-text-security: disc;
}
</style>
