<template>
  <div class="w-100 d-flex justify-content-center login-page align-items-center">
    <div class="login-card col-12 col-sm-6 col-md-4 col-xl-3">
      <div class="w-100 d-flex align-items-center justify-content-center mb-4">
        <img src="/_assets/yumurta.png" alt="ishesap.com logo" style="width: 100px" class="m-4" />
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
          <input type="text" class="form-control bE" placeholder="İsim" v-model="name" />
          <label for="floatingInput">İsim</label>
        </div>
        <div class="form-floating mb-2">
          <input type="text" class="form-control bE" placeholder="Soyisim" v-model="surname" />
          <label for="floatingInput">Soyisim</label>
        </div>
        <div class="form-floating mb-2">
          <input
            type="text"
            class="form-control bE"
            v-mask="'0 ### ### ## ##'"
            id="floatingInput"
            placeholder="Telefon"
            v-model="phone"
          />
          <label for="floatingInput">Telefon</label>
        </div>
        <div class="form-floating mb-2">
          <input type="email" class="form-control bE" placeholder="Eposta Adresi" v-model="email" />

          <label for="floatingInput">E-Posta, TCKN</label>
        </div>
        <div class="form-floating mb-1">
          <input :type="hides ? 'password' : 'text'" class="form-control bP" placeholder="Şifre" v-model="pass" />
          <el-button
            v-if="pass?.length > 0"
            @click="hides = !hides"
            :icon="hides ? Hide : View"
            class="show-hide"
            link
          ></el-button>
          <label for="floatingPassword">Şifre</label>
        </div>
      </div>
      <el-button type="primary" size="large" class="w-100 my-2 ml-0" @click="uyeol">Üye Ol</el-button>

      <el-divider class="text-nowrap">Üyeliğiniz var mı?</el-divider>
      <el-button type="warning" plain size="large" class="w-100 my-2 ml-0" @click="giris()">Giriş yap</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { ElInput, ElButton, ElDivider, ElNotification } from "element-plus";
import { Hide, View } from "@element-plus/icons-vue";
import axios from "axios";
import { mask } from "vue-the-mask";
export default {
  directives: { mask },
  data() {
    return {
      email: "",
      pass: "",
      name: "",
      surname: "",
      phone: "",
      girisKontro: 0,
      hides: true,
      Hide,
      View,
    };
  },
  methods: {
    uyeol() {
      if (this.email == "" || this.pass == "" || this.surname == "" || this.name == "" || this.phone == "") {
        ElNotification({
          title: "Uyarı",
          message: "Lütfen boş alanları doldurunuz",
          type: "info",
          position: "top-right",
        });
      } else {
        var params = {
          email: this.email,
          password: this.pass,
          name_basic: this.name,
          surname: this.surname,
          phone: this.phone,
          column_set_id: 0,
          state: true,
          language_id: 1,
          user_task_id: 5,
          tc: new Date().getTime(),
        };
        axios.post("/public/tables/users/store", params).then((res) => {
          if (res.data.data.message == "success") {
            ElNotification({
              title: "Uyarı",
              message: "Üyelik başarıyla tamamlandı yönlendiriliyorsunuz...",
              type: "success",
              position: "top-right",
            });
            this.$router.push("/login");
          }
        });
      }
    },
    giris() {
      this.$router.push("/login");
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
