/* eslint-disable no-empty */
<template>
  <div class="hesap-makinesi">
    <el-dialog v-model="state" title="Hesap Makinesi" :show-close="false" width="300px" draggable>
      <template #header>
        <div class="w-100 card p-2 px-4 pt-3">
          <div class="d-flex justify-content-between w-100">
            <label style="font-size: 15px"> Hesap Makinesi </label>
            <div>
              <el-button size="small" type="primary" :icon="CloseBold" circle @click="state = !state"> </el-button>
            </div>
          </div>
        </div>
      </template>
      <div class="calculator" v-if="true">
        <div class="big-input text-end">
          <label for="" class="fs-3">
            {{ hesap }}
          </label>
        </div>
        <el-divider class="mt-2 mb-0"></el-divider>
        <div class="mb-1">
          <input
            type="text"
            v-model="hesapMetin"
            class="form-control text-end"
            @focus="isFocus = true"
            @blur="isFocus = false"
          />
        </div>
        <el-divider class="mb-3 mt-0" border-style="dashed"></el-divider>
        <div class="d-flex flex-column mt-0">
          <div class="d-flex">
            <el-button @click="hesapMetin = ''" type="primary" plain>AC</el-button>
            <el-button @click="click('c')" type="primary" plain>+/-</el-button>
            <el-button @click="click('%')" type="primary" plain>%</el-button>
            <el-button @click="click('/')" type="warning">/</el-button>
          </div>
          <div class="d-flex">
            <el-button @click="click(7)">7</el-button>
            <el-button @click="click(8)">8</el-button>
            <el-button @click="click(9)">9</el-button>
            <el-button @click="click('*')" type="warning">X</el-button>
          </div>
          <div class="d-flex">
            <el-button @click="click(4)">4</el-button>
            <el-button @click="click(5)">5</el-button>
            <el-button @click="click(6)">6</el-button>
            <el-button @click="click('-')" type="warning">-</el-button>
          </div>
          <div class="d-flex">
            <el-button @click="click(1)">1</el-button>
            <el-button @click="click(2)">2</el-button>
            <el-button @click="click(3)">3</el-button>
            <el-button @click="click('+')" type="warning">+</el-button>
          </div>
          <div class="d-flex">
            <el-button @click="click(0)">0</el-button>
            <el-button @click="click('000')">000</el-button>
            <el-button @click="click('.')">,</el-button>
            <el-button @click="click('=')" type="primary">=</el-button>
          </div>
        </div>
      </div>

      <!--template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
      </span>
    </!--template-->
    </el-dialog>
  </div>
</template>

<script>
import { CloseBold } from "@element-plus/icons-vue";
export default {
  props: ["modelValue"],
  data() {
    return {
      CloseBold,
      state: false,
      hesapMetin: "",
      hesap: 0,
      isFocus: false,
    };
  },
  created() {
    localStorage.setItem("hesap", 0);
    document.addEventListener("keyup", (e) => {
      if (this.isFocus == false && this.state == true) {
        if (e.keyCode >= 48 && e.keyCode <= 57) this.click(e.key);
        if (e.keyCode == 8) {
          let hs = this.hesapMetin.toString();
          hs = hs.slice(0, -1);
          this.hesapMetin = hs;
        }
        if (e.key == "½") this.click("c");
        if (e.key == "%") this.click("%");
        if (e.key == "-") this.click("-");
        if (e.key == "*") this.click("*");
      }
      if (e.key == "Enter") this.click("=");
    });
  },
  methods: {
    click(num) {
      if (num == "+" || num == "-" || num == "*" || num == "/") {
        this.hesapMetin += num;
      } else if (num == "%") {
        this.hesap = eval(this.hesapMetin);
        this.hesap /= 100;
        this.hesapMetin = this.hesap;
        this.click("*");
      } else if (num == "=") {
        this.hesap = eval(this.hesapMetin);
        this.hesapMetin = this.hesap;
      } else if (num == "c") {
        this.hesap = eval(this.hesapMetin);
        this.hesap *= -1;
        this.hesapMetin = this.hesap;
      } else {
        if (this.hesapMetin == "0") this.hesapMetin = "";
        this.hesapMetin += num;
        this.hesap = eval(this.hesapMetin);
      }

      localStorage.setItem("hesap", this.hesap);
      //this.hesap = this.hesap <= 15 ? this.hesap : this.hesap.slice(15, this.hesap.length);
    },
  },
  watch: {
    modelValue() {
      this.state = this.modelValue;
    },
    state() {
      this.$emit("update:modelValue", this.state);
    },
  },
};
</script>

<style lang="css">
.calculator input {
  text-align: end !important;
  outline: 0 !important;
  border: none !important;
  border-bottom: none !important;
  background: transparent !important;
}
.calculator button {
  width: 100% !important;
  height: 60px;
  margin-left: 0 !important;
  margin: 1px !important;
}
.hesap-makinesi .el-dialog__header {
  margin: 0;
  padding: 0;
}
.hesap-makinesi .el-overlay {
  background: rgba(0, 0, 0, 0.1);
}
</style>
