<template>
  <el-dialog v-model="dialogVisible" title="Ürün Ekle" draggable width="90%">
    <div class="row">
      <div class="col-12 col-md-4 border-end py-3">
        <div class="d-flex flex-column">
          <span>Ürün Resmi:</span>
          <inputs :column="create_columns.image" v-model="params.image" :column_settings="{}"></inputs>
          <span class="mt-2">Ürün Adı:</span>
          <inputs :column="create_columns.product_name" v-model="params.product_name" :column_settings="{}"></inputs>
          <span class="mt-2">Kategori:</span>
          <inputs
            :column="create_columns.product_category_id"
            v-model="params.product_category_id"
            table_name="product"
            :column_settings="{}"
          ></inputs>
          <span class="mt-2">Mutfak:</span>
          <inputs
            :column="create_columns.kitchen_group_id"
            v-model="params.kitchen_group_id"
            table_name="product"
            :column_settings="{}"
          ></inputs>
          <el-divider class="my-3"></el-divider>
          <div class="d-flex justify-content-between align-items-center">
            <span>Favori:</span>
            <inputs :column="create_columns.favorite" v-model="params.favorite" :column_settings="{}"></inputs>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <span>QR Menüde Gözüksün:</span>
            <inputs :column="create_columns.qr_menu" v-model="params.qr_menu" :column_settings="{}"></inputs>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-2">
            <span>Renk:</span>
            <inputs :column="create_columns.color" v-model="params.color" :column_settings="{}"></inputs>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <span>KDV (%):</span>

            <inputs
              style="width: 100px"
              :column="create_columns.kdv_rate"
              v-model="params.kdv_rate"
              :column_settings="{}"
            ></inputs>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-8">
        <div class="w-100 d-flex justify-content-end mb-2">
          <el-button type="" @click="handleTabsAdd"> Porsiyon Ekle</el-button>
        </div>
        <el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab" class="demo-tabs">
          <el-tab-pane v-for="(val, k) in params.portion_json" :key="k" :label="val?.portion_name" :name="k">
            <div class="d-flex align-items-end justify-content-between">
              <div style="width: 60%">
                <label for="">Porsiyon Birim İsmi:</label>
                <el-input v-model="params.portion_json[k]['portion_name']" size="large" placeholder=""></el-input>
              </div>
              <div style="width: 35%" class="d-flex justify-content-end align-items-center">
                <label class="me-2">Varsayılan:</label>
                <el-switch v-model="params.portion_json[k]['default']"></el-switch>
              </div>
            </div>
            <div class="mt-2 d-flex flex-wrap justify-content-between">
              <div style="width: 49%">
                <label for="">Fiyat</label>
                <div class="border rounded px-2">
                  <currency-input
                    :options="opt1"
                    v-model="params.portion_json[k]['price']"
                    class="el-input__inner text-end"
                  />
                </div>
              </div>
              <div style="width: 49%">
                <label for="" class="text-danger">Maliyet</label>
                <div class="border rounded px-2">
                  <currency-input
                    :options="opt1"
                    v-model="params.portion_json[k]['cost_total']"
                    class="el-input__inner text-end"
                  />
                </div>
              </div>
            </div>
            <div class="mt-2 d-flex flex-wrap justify-content-between">
              <div style="width: 49%">
                <label for="">Paket Servis Fiyatı</label>
                <div class="border rounded px-2">
                  <currency-input
                    :options="opt1"
                    v-model="params.portion_json[k]['takeaway_price']"
                    class="el-input__inner text-end"
                  />
                </div>
              </div>
              <div style="width: 49%">
                <label for="">Self Servis Fiyatı</label>
                <div class="border rounded px-2">
                  <currency-input
                    :options="opt1"
                    v-model="params.portion_json[k]['selfservis_price']"
                    class="el-input__inner text-end"
                  />
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-divider class="my-3"></el-divider>
        <span>Özellikler:</span>
        <el-select
          v-model="property_json"
          @change="properyChange()"
          multiple
          filterable
          allow-create
          class="w-100 mb-3"
          default-first-option
          :reserve-keyword="false"
          placeholder="Eklemek için 'enter' tuşuna basınız."
        >
          <el-option value="Şekersiz" />
          <el-option value="Ketçapsız" />
          <el-option value="Mayonezsiz" />
        </el-select>
        <span>Açıklama:</span>
        <inputs :column="create_columns.description" v-model="params.description" :column_settings="{}"></inputs>
      </div>
    </div>
    <template #footer>
      <span class="d-flex justify-content-end">
        <div>
          <el-button @click="dialogVisible = false">Vazgeç</el-button>
          <el-button type="primary" @click="saveProduct()"> Kaydet </el-button>
        </div>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import inputs from "../../../../angaryos/inputs.vue";
import CurrencyInput from "@/tools/CurrencyInput.vue";
import opt1 from "@/angaryos/tools/currencyOptions";
import { ElNotification } from "element-plus";
export default {
  components: { inputs, CurrencyInput },
  props: ["visible"],
  data() {
    return {
      opt1,
      dialogVisible: false,
      create_columns: {},
      params: {
        portion_json: [
          {
            portion_name: "Tam",
            price: 0,
            takeaway_price: 0, //Paketservis fiyatı
            selfservis_price: 0, //Selfservis fiyatı
            cost_total: 0, //Maliyet
            default: true,
          },
        ],
        property_json: [],
      },
      editableTabsValue: 0,
      property_json: [],
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val == true) {
        this.getCreateData();
      }
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
  },
  methods: {
    properyChange() {
      this.params.property_json = JSON.stringify(this.property_json);
    },
    removeTab(e) {
      this.params.portion_json.splice(e, 1);
      this.editableTabsValue = e - 1;
    },
    handleTabsAdd() {
      this.params.portion_json.push({
        portion_name: "Yarım",
        price: 0,
        takeaway_price: 0, //Paketservis fiyatı
        selfservis_price: 0, //Selfservis fiyatı
        cost_total: 0, //Maliyet
        default: false,
      });
      this.editableTabsValue = this.params.portion_json.length - 1;
    },
    getCreateData() {
      this.$services.create("product").then((res) => {
        this.create_columns = res.data.data.column_set.column_arrays[0].columns;
      });
    },
    saveProduct() {
      if (this.params["portion_json"].length <= 0) {
        ElNotification({
          title: "Hata",
          message: "Lütfen porsiyon ekleyiniz",
          type: "error",
        });
        return;
      }
      if (
        this.params["product_name"] == undefined ||
        this.params["product_name"] == null ||
        this.params["product_name"] == ""
      ) {
        ElNotification({
          title: "Hata",
          message: "Lütfen ürün ismini giriniz.",
          type: "error",
        });
        return;
      }
      if (this.params["product_category_id"] == undefined || this.params["product_category_id"] == null) {
        ElNotification({
          title: "Hata",
          message: "Lütfen ürün kategorisi giriniz.",
          type: "error",
        });
        return;
      }
      let default_porsiyon = 0;
      for (const val of Object.values(this.params.portion_json)) {
        if (val["portion_name"] == undefined || val["portion_name"] == null || val["portion_name"] == "") {
          ElNotification({
            title: "Hata",
            message: "Lütfen porsiyon ismi giriniz.",
            type: "error",
          });
          return;
        }
        if (val.default != true) default_porsiyon += 1;
      }
      if (default_porsiyon != this.params.portion_json.length - 1) {
        ElNotification({
          title: "Hata",
          message: "Lütfen bir adet varsayılan porsiyon seçiniz.",
          type: "error",
        });
        return;
      }
      let formData = new FormData();
      formData.append("column_set_id", this.$store.getters.getUserData.auths.tables["product"]?.creates[0]);
      for (const clm of Object.values(this.create_columns)) {
        if (clm.gui_type_name == "files") {
          if (
            this.params[clm.name] != undefined &&
            this.params[clm.name].length > 0 &&
            this.params[clm.name]?.search("data:image") > -1
          ) {
            formData.append(clm.name + "[]", this.DataURIToBlob(this.params[clm.name]));
          } else {
            if (this.params[clm.name] != undefined) {
              formData.append(clm.name + "_old", this.params[clm.name]);
            } else {
              formData.append(clm.name + "_old", null);
            }
          }
        } else if (clm.name == "portion_ids") {
          formData.append(clm.name, []);
        } else if (clm.name == "portion_json") {
          formData.append(clm.name, this.params[clm.name] == null ? "" : JSON.stringify(this.params[clm.name]));
        } else {
          formData.append(clm.name, this.params[clm.name] == null ? "" : this.params[clm.name]);
        }
      }
      this.$services.add("product", formData).then((res) => {
        if (res.data.data.message == "success") {
          ElNotification({
            title: "Başarılı",
            message: "Ürün başarıyla kaydedildi",
            type: "success",
          });
          this.dialogVisible = false;
          this.params = {
            portion_json: [
              {
                portion_name: "Tam",
                price: 0,
                takeaway_price: 0, //Paketservis fiyatı
                selfservis_price: 0, //Selfservis fiyatı
                cost_total: 0, //Maliyet
                default: true,
              },
            ],
          };
        }
      });
    },
    DataURIToBlob(dataURI) {
      const splitDataURI = dataURI.split(",");
      const byteString = splitDataURI[0].indexOf("base64") >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
      const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

      return new Blob([ia], { type: mimeString });
    },
  },
};
</script>

<style></style>
