<template>
  <div>
    <el-dialog v-model="dialogVisible" title="Kilit ekranı" width="300px">
      <div class="d-flex justify-content-center flex-column align-items-center">
        <span class="fs-6">Pin Kodunuzu Belirleyiniz</span>
        <v-otp-input
          input-classes="otp-input"
          separator="|"
          :num-inputs="4"
          :should-auto-focus="false"
          :is-input-num="true"
          @on-change="handleOnChange"
          @on-complete="handleOnComplete"
          :placeholder="['*', '*', '*', '*']"
          inputmode="number"
          input-type="tel"
          v-model="pinCode"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Vazgeç</el-button>
          <el-button type="primary" @click="save()"> Kaydet </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import VOtpInput from "vue3-otp-input";
import { ElNotification } from "element-plus";
import { mapGetters } from "vuex";
export default {
  props: ["visible"],
  data() {
    return {
      dialogVisible: this.visible,
      pinCode: null,
    };
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
  watch: {
    visible() {
      this.dialogVisible = this.visible;
    },
    dialogVisible() {
      this.$emit("visible", this.dialogVisible);
    },
  },
  methods: {
    save() {
      if (this.pinCode == null || this.pinCode.length < 4) {
        ElNotification({
          title: "Dikkat",
          message: "Pin kodunuzu kontrol ediniz.",
          type: "warning",
          position: "top-left",
        });
      } else {
        const params = {
          pin_code: this.pinCode,
        };
        this.$services.update("companies", this.getUserData.companies.id, params);
        let comp = this.getUserData.companies;
        comp.pin_code = this.pinCode;
        this.$store.commit("setCompData", comp);
        ElNotification({
          title: "Başarılı",
          message: "Pin kodunuz başarıyla kaydedildi.",
          type: "success",
          position: "top-left",
        });
        this.dialogVisible = false;
        this.$emit("visible", this.dialogVisible);
        this.$store.commit("setScreenLock", "true");
      }
    },
    handleOnChange(e) {
      this.pinCode = e;
    },
  },
  components: {
    VOtpInput,
  },
};
</script>

<style>
.otp-input {
  font-size: 26px !important;
  width: 40px;
  text-align: center;
  height: 60px !important;
  outline: 0 !important;
  border: 1px solid #000 !important;
  border-radius: 5px !important;
}
</style>
