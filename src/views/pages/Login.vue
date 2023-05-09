<template>
  <div class="w-100 d-flex justify-content-center login-page align-items-center">
    <div class="login-card col-12 col-sm-6 col-md-4 col-xl-3">
      <div class="w-100 d-flex align-items-center justify-content-center mb-4">
        <img src="/_assets/yumurta.png" alt="ishesap.com logo" style="width: 200px" class="m-4" />
        <!-- <h1 class="ml-1 m-0 p-0 text-nowrap">Siber Hesap</h1> -->
      </div>
      <!-- <label for="">Eposta adresiniz:</label>
      <el-input size="large" class="mb-3" v-model="email" placeholder="Eposta adresi" @keypress.enter="giris()" />
      <label for="">Şifreniz:</label>
      <el-input
        size="large"
        class="mb-3"
        v-model="pass"
        type="password"
        show-password
        placeholder="Şifre"
        @keypress.enter="giris()"
      /> -->
      <div class="form-signin w-100 m-auto">
        <div class="form-floating mb-2">
          <input
            type="email"
            class="form-control bE"
            id="floatingInput"
            placeholder="Eposta Adresi"
            v-model="email"
            @keypress.enter="giris()"
          />
          <label for="floatingInput">E-Posta, TCKN</label>
        </div>
        <div class="form-floating mb-1">
          <input
            :type="hides ? 'password' : 'text'"
            class="form-control bP"
            id="floatingPassword"
            placeholder="Şifre"
            v-model="pass"
            @keypress.enter="giris()"
          />
          <el-button
            v-if="pass?.length > 0"
            @click="hides = !hides"
            :icon="hides ? Hide : View"
            class="show-hide"
            link
          ></el-button>
          <label for="floatingPassword">Şifre</label>
        </div>
        <el-button type="primary" class="mt-0 mb-4" link @click="unuttum()">Şifrenizi mi unuttunuz?</el-button>
      </div>
      <el-button type="primary" size="large" class="w-100 my-2 ml-0" @click="giris">Giriş</el-button>

      <el-divider class="text-nowrap">Üyeliğiniz yok mu?</el-divider>
      <el-button type="warning" plain size="large" class="w-100 my-2 ml-0" @click="uyeOl()">Üye Ol</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { ElInput, ElButton, ElDivider, ElNotification } from "element-plus";
import { Hide, View } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      pass: "",
      girisKontro: 0,
      hides: true,
      Hide,
      View,
    };
  },
  methods: {
    giris() {
      if (this.email == "" || this.pass == "") {
        ElNotification({
          title: "Uyarı",
          message: "E-Posta/TCKN ve Şifre boş geçilemez!",
          type: "info",
          position: "top-right",
        });
      } else {
        var params = {
          email: this.email,
          password: this.pass,
        };
        this.$store.dispatch("verification", params);
      }
    },
    uyeOl() {
      this.$router.push("/register");
    },
    unuttum() {
      //https://adisyon.masahesap.com/api/v1/public/missions/5?user=erdoganyesil3@gmail.com
      ElMessageBox.prompt("Kayıtlı bir E-Posta adresi giriniz.", "Şifrenizi mi unuttunuz?", {
        confirmButtonText: "Gönder",
        cancelButtonText: "Vazgeç",
        inputPlaceholder: "E-Posta Adresiniz",
        inputPattern:
          /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: "Lütfen geçerli bir E-Posta adresi giriniz.",
      })
        .then(({ value }) => {
          axios
            .get("public/missions/5?user=" + value)
            .then((res) => {
              if (res.data.data.message == "OK") {
                ElMessage({
                  type: "success",
                  message: `Epostanıza gerekli bilgiler gönderildi`,
                });
              } else {
                ElMessage({
                  type: "error",
                  message: "Bir hata ile karşılaşıldı",
                });
              }
            })
            .catch(() => {
              ElMessage({
                type: "error",
                message: "Bir hata ile karşılaşıldı",
              });
            });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "Vazgeçildi",
          });
        });
    },
  },
  mounted() {
    setTimeout(() => {
      document.getElementById("page-loader").style.display = "none";
      document.getElementById("app").style.display = "block";
    }, 100);
  },
  components: {
    ElInput,
    ElButton,
    ElDivider,
  },
};
</script>

<style>
.login-page {
  height: 100vh;
}
.login-card {
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  padding: 30px 20px;
  min-width: 383px;
}

.dark .login-page {
  background: #18191b;
}
.dark .login-card {
  background: #1e2022;
}
.dark .el-divider__text {
  background: #1e2022;
}

.light .login-page {
  background: #edf1f3;
}
.light .login-card {
  background: #fff;
}
.light .el-divider__text {
  background: #fff;
}
.form-control:focus {
  box-shadow: none;
}
.show-hide {
  position: absolute;
  top: 18px;
  right: 18px;
  font-size: 18px;
}
</style>
