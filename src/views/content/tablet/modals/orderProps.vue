<template>
  <el-dialog v-model="dialogVisible" :title="adisyon?.product_name" width="800px" align-center>
    <div class="row">
      <div class="col-md-5 col-sm-12">
        <div class="d-flex ekle-butons justify-content-center align-items-center mb-4">
          <el-button type="info" size="large" plain @click="buttonChange(2)" :icon="Minus"></el-button>
          <el-input size="large" class="fs-5" input-style="height: 40px" v-model="prodDetail.product_count"></el-input>
          <el-button type="info" size="large" plain @click="buttonChange(1)" :icon="Plus"></el-button>
        </div>
        <div class="d-flex flex-column buttonies">
          <el-button @click="buttonChange(3)"
            ><i class="bi bi-trash-fill me-2"></i>
            <div>Ürünü Sil</div>
          </el-button>
          <el-button @click="ikramEt()">
            <i class="bi bi-gift-fill me-2"></i>
            <div>İkram Et</div>
          </el-button>
          <el-input
            v-model="this.prodDetail.description"
            :autosize="{ minRows: 3, maxRows: 10 }"
            type="textarea"
            placeholder="Ürün Notu"
            show-word-limit
            maxlength="100"
          />
        </div>
      </div>
      <div class="col-md-7 col-sm-12">
        <div class="d-flex flex-column mb-2">
          <div class="h6 fw-bold text-center">Porsiyonlar</div>
          <div class="d-flex justify-content-around flex-wrap">
            <template v-for="i in portion_json" :key="i">
              <div class="w-50 p-2">
                <el-card
                  :style="
                    prodDetail.selected_portion_json.portion_name == i.portion_name
                      ? 'background:#FDD2C7; border:1px solid #E6ADA0'
                      : ''
                  "
                  class="cursor-pointer"
                  style="user-select: none"
                  @click="selectPortion(i)"
                >
                  <span class="fs-6">{{ i.portion_name }}</span>
                  <br />
                  <span class="fs-5">₺{{ formatter.format(i.price) }}</span>
                </el-card>
              </div>
            </template>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="h6 fw-bold text-center">Özellikler</div>
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-2">
          <div v-for="i in property_json" :key="i">
            <div class="p-2">
              <el-checkbox border v-model="prodDetail.selected_property_json" :label="i" size="large" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { Plus, Minus, Delete } from "@element-plus/icons-vue";
import formatter from "@/angaryos/tools/numberFormatter";
export default {
  props: ["ozelliklerVisible", "adisyonies", "production_key"],
  data() {
    return {
      Plus,
      Minus,
      Delete,
      values: 1,
      birim: 1,
      nots: "",
      dialogVisible: false,
      adisyon: {},
      formatter,
      prodDetail: {},
      property_json: {},
      portion_json: {},
    };
  },
  methods: {
    buttonChange(key) {
      const prodPortion = this.portion_json;
      let portion_price =
        this.adisyonies.product_info_json[this.production_key].selected_portion_json.price != undefined
          ? this.adisyonies.product_info_json[this.production_key].selected_portion_json.price
          : prodPortion.find((e) => e.default == true).price;
      if (key == 1) {
        this.adisyon.product_info_json[this.production_key].product_count += 1;
        this.adisyon.product_info_json[this.production_key].product_total =
          this.adisyon.product_info_json[this.production_key].product_count * portion_price;
        this.adisyon.product_info_json[this.production_key].product_kdv =
          this.adisyon.product_info_json[this.production_key].product_count *
          (portion_price * ((1 + parseFloat(this.prodDetail.kdv_rate)) / 100));
      } else if (key == 2) {
        this.adisyon.product_info_json[this.production_key].product_count -= 1;
        this.adisyon.product_info_json[this.production_key].product_total =
          this.adisyon.product_info_json[this.production_key].product_count * portion_price;
        this.adisyon.product_info_json[this.production_key].product_kdv =
          this.adisyon.product_info_json[this.production_key].product_count *
          (portion_price * ((1 + parseFloat(this.prodDetail.kdv_rate)) / 100));
        if (this.adisyon.product_info_json[this.production_key].product_count <= 0) {
          delete this.adisyon.product_info_json[this.production_key];
        }
      } else if (key == 3) {
        this.adisyon.product_info_json.splice(this.production_key, 1);
      }
      this.adisyon.total = 0;
      this.adisyon.kdv_total = 0;
      for (let vals of Object.values(this.adisyon.product_info_json)) {
        this.adisyon.total = parseFloat(this.adisyon.total) + parseFloat(vals.product_total);
        this.adisyon.kdv_total = parseFloat(this.adisyon.kdv_total) + parseFloat(vals.product_kdv);
      }

      this.$emit("update:adisyonies", this.adisyon);
    },
    ikramEt() {
      this.adisyon.product_info_json[this.production_key].product_total = 0;
      this.$emit("update:adisyonies", this.adisyon);
    },
    selectPortion(prt) {
      this.adisyon.product_info_json[this.production_key].portion_name = prt.portion_name;
      this.adisyon.product_info_json[this.production_key].portion_price = prt.price;
      this.adisyon.product_info_json[this.production_key].selected_portion_json = prt;
      let miktar = this.adisyon.product_info_json[this.production_key].product_count;

      this.adisyon.product_info_json[this.production_key].product_total = parseFloat(miktar) * prt.price;
      this.$emit("update:adisyonies", this.adisyon);
    },
  },
  watch: {
    ozelliklerVisible() {
      this.dialogVisible = this.ozelliklerVisible;
      this.adisyon = this.adisyonies;
      this.prodDetail = this.adisyon.product_info_json[this.production_key];
      console.log("Ürün detayları", this.prodDetail);
      if (this.prodDetail != undefined) {
        this.property_json = JSON.parse(this.prodDetail.prods.property_json);
        this.portion_json = JSON.parse(this.prodDetail.prods.portion_json);
      }
    },
    dialogVisible() {
      this.$emit("update:ozelliklerVisible", this.dialogVisible);
      this.$emit("update:adisyonies", this.adisyon);
    },
  },
};
</script>

<style>
.ekle-butons .el-button:nth-child(1) {
  padding: 16px;
  border-radius: 8px 0 0 8px;
}

.ekle-butons .el-input__wrapper:nth-child(1) {
  border-radius: 0;
}

.ekle-butons .el-button:nth-child(3) {
  padding: 16px;
  border-radius: 0 8px 8px 0;
}

.ekle-butons .el-input__wrapper {
  width: 16px;
  height: 40px;
  text-align: center;
}

.ekle-butons .el-input__wrapper .el-input__inner {
  text-align: center;
}

.buttonies .el-button {
  margin-left: 0;
  padding: 24px;
  margin-bottom: 8px;
  justify-content: left;
}

.pors-card .el-card:hover {
  cursor: pointer;
  border: 1px solid var(--el-color-primary);
}

.portion-button {
  border: 1px solid #f56c6c !important;
}
</style>
