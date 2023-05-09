<template>
  <el-dialog v-model="dialogVisible" width="90%" align-center :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex flex-column">
          <span :id="titleId" :class="titleClass">{{ masaData?.table_name }}</span>
          <label>{{ masaData?.zone_id?.split("é")[0] }}</label>
        </div>
        <div>
          <el-button type="secondary" size="large" plain :disabled="this.payType == 0" @click="payProd()">Öde</el-button>

          <el-button type="secondary" size="large" plain disabled>Yazdır</el-button>
          <el-button type="secondary" size="large" plain @click="payOrder(1)" disabled>Masayı Kapat</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="danger" size="large" @click="close">X</el-button>
        </div>
      </div>
    </template>
    <div class="row justify-content-center">
      <div class="col-xl-4 col-lg-3 col-md-5 col-sm-12">
        <el-card class="odeme-card">
          <div class="d-flex justify-content-between align-items-center">
            <div class="h6">Parçalı Öde</div>
            <div class="h6">₺{{ this.toplamlar ? formatter.format(this.toplamlar) : formatter.format(0) }}</div>
          </div>
          <el-divider class="my-1"></el-divider>
          <el-collapse v-model="activeName" class="mt-4" accordion>
            <el-collapse-item title="Ödenmemiş Olanlar" name="1">
              <template v-for="(p, k) in adisyonProd" :key="k">
                <template v-if="this.odenmisler.length > 0 && this.odenmisler.find((e) => e.id == p.id && e.key == k)">
                  <div
                    class="d-flex justify-content-between align-items-center py-3 px-1 cursor-pointer border-bottom"
                    v-if="p.remainder_total > this.odenmisler.find((e) => e.id == p.id && e.key == k).count"
                    @click="
                      p.remainder_total - this.odenmisler.find((e) => e.id == p.id && e.key == k).count > 0
                        ? productSelect(p, k, p.portion_price)
                        : null
                    "
                  >
                    <div class="d-flex flex-column">
                      <span v-if="p.remainder_total < p.product_count"
                        >{{ p.product_count - p.remainder_total }} Adet seçildi</span
                      >
                      <label :style="p.remainder_total == 0 ? 'text-decoration:line-through;' : ''"
                        >{{ p.remainder_total - this.odenmisler.find((e) => e.id == p.id && e.key == k).count }}
                        {{ p.portion_name }} - {{ p.product_name }}</label
                      >
                    </div>
                    <div class="d-flex justify-content-center align-items-center">
                      <span class="me-2" :style="p.remainder_total == 0 ? 'text-decoration:line-through;' : ''"
                        >₺{{ formatter.format(p.product_total) }}</span
                      >
                      <el-button
                        v-if="p.remainder_total < p.product_count"
                        type="primary"
                        size="small"
                        plain
                        @click.stop="productDelete(p, k, p.portion_price)"
                        v-tooltip="'Geri Al'"
                        ><i class="bi bi-arrow-clockwise"></i
                      ></el-button>
                      <!-- <el-button type="primary" size="small" @click="payProd(p)">Öde<i class="bi bi-arrow-right-short"></i></el-button> -->
                    </div>
                  </div>
                </template>
                <div
                  v-else
                  class="d-flex justify-content-between align-items-center py-3 px-1 cursor-pointer border-bottom"
                  @click="p.remainder_total > 0 ? productSelect(p, k, p.portion_price) : null"
                >
                  <div class="d-flex flex-column">
                    <span v-if="p.remainder_total < p.product_count"
                      >{{ p.product_count - p.remainder_total }} Adet seçildi</span
                    >
                    <label :style="p.remainder_total == 0 ? 'text-decoration:line-through;' : ''"
                      >{{ p.remainder_total }} {{ p.portion_name }} - {{ p.product_name }}</label
                    >
                  </div>
                  <div class="d-flex justify-content-center align-items-center">
                    <span class="me-2" :style="p.remainder_total == 0 ? 'text-decoration:line-through;' : ''"
                      >₺{{ formatter.format(p.product_total) }}</span
                    >
                    <el-button
                      v-if="p.remainder_total < p.product_count"
                      type="primary"
                      size="small"
                      plain
                      @click.stop="productDelete(p, k, p.portion_price)"
                      v-tooltip="'Geri Al'"
                      ><i class="bi bi-arrow-clockwise"></i
                    ></el-button>
                    <!-- <el-button type="primary" size="small" @click="payProd(p)">Öde<i class="bi bi-arrow-right-short"></i></el-button> -->
                  </div>
                </div>
              </template>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-model="activeName2" class="mt-4" accordion>
            <el-collapse-item title="Ödenmiş Olanlar" name="2">
              <template v-for="q in this.odenmisler" :key="q">
                <div class="d-flex justify-content-between">
                  <div>{{ q.count }} {{ q.portion }} - {{ q.name }}</div>
                  <span>₺{{ formatter.format(q.price * q.count) }}</span>
                </div>
              </template>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
      <div class="col-xl-4 col-lg-3 col-md-5 col-sm-12">
        <el-card class="odeme-card">
          <div class="d-flex justify-content-between align-items-center">
            <div class="h6">Toplam</div>
            <div class="h6">₺{{ formatter.format(adisyon.total) }}</div>
          </div>
          <el-divider class="my-1"></el-divider>
          <div style="min-height: 190px">
            <template v-for="pp in selectedProd" :key="pp">
              <div class="d-flex justify-content-between">
                <div>{{ pp?.prods?.product_count }}</div>
                <div>{{ pp?.prods?.product_name }}</div>
                <div>{{ "₺" + pp?.prods?.product_total }}</div>
              </div>
            </template>
            <div v-if="this.calcValue > this.adisyon.total">Ödeme {{ this.paraUstu }} {{ this.adisyon.total }}</div>
            <template v-for="o in odeme_hazir" :key="o">
              <div class="d-flex justify-content-between">
                <div>{{ o.count }} {{ o.name }}</div>
                <span>
                  ₺{{ formatter.format(o.count * o.price) }}
                  <el-button
                    type="primary"
                    size="small"
                    plain
                    @click="productDelete(o.prods, o.key, o.price)"
                    v-tooltip="'Geri Al'"
                    ><i class="bi bi-arrow-clockwise"></i
                  ></el-button>
                </span>
              </div>
            </template>
          </div>
          <div class="d-flex flex-column justify-content-center align-items-center w-100">
            <div v-if="toplamlar > 0" class="d-flex justify-content-between w-100">
              <span>Ödenecek Tutar:</span>
              <span><span v-if="indirim" class="me-2">(%10)</span>₺{{ formatter.format(toplamlar) }}</span>
            </div>
            <div v-else class="d-flex justify-content-between w-100">
              <span>Ödenecek Tutar:</span>
              <span><span v-if="indirim" class="me-2">(%10)</span>₺{{ formatter.format(calcValue) }}</span>
            </div>
            <div class="grid-container" :style="toplamlar > 0 ? 'pointer-events: none;' : 'pointer-events: all;'">
              <el-button class="grid-item" @click="calculate(7)">7</el-button>
              <el-button class="grid-item" @click="calculate(8)">8</el-button>
              <el-button class="grid-item" @click="calculate(9)">9</el-button>
              <el-button class="grid-item" @click="calculate(12)">Tümü</el-button>
              <el-button class="grid-item" @click="calculate(4)">4</el-button>
              <el-button class="grid-item" @click="calculate(5)">5</el-button>
              <el-button class="grid-item" @click="calculate(6)">6</el-button>
              <el-dropdown>
                <el-button class="grid-item">1/n</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="calculate(13)">1/2</el-dropdown-item>
                    <el-dropdown-item @click="calculate(14)">1/3</el-dropdown-item>
                    <el-dropdown-item @click="calculate(15)">1/4</el-dropdown-item>
                    <el-dropdown-item @click="calculate(16)">1/5</el-dropdown-item>
                    <el-dropdown-item @click="calculate(17)">1/6</el-dropdown-item>
                    <el-dropdown-item @click="calculate(18)">1/7</el-dropdown-item>
                    <el-dropdown-item @click="calculate(19)">1/8</el-dropdown-item>
                    <el-dropdown-item @click="calculate(20)">1/9</el-dropdown-item>
                    <el-dropdown-item @click="calculate(21)">1/10</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button class="grid-item" @click="calculate(1)">1</el-button>
              <el-button class="grid-item" @click="calculate(2)">2</el-button>
              <el-button class="grid-item" @click="calculate(3)">3</el-button>
              <el-button class="grid-item" @click="calculate(11)">İndirim</el-button>
              <el-button class="grid-item" @click="calculate(1)">.</el-button>
              <el-button class="grid-item" @click="calculate(0)">0</el-button>
              <el-button class="grid-item" @click="calculate(10)">Sil</el-button>
              <div class="grid-item"></div>
            </div>
          </div>
        </el-card>
      </div>
      <div class="col-xl-4 col-lg-3 col-md-5 col-sm-12">
        <el-card class="odeme-card">
          <div class="d-flex justify-content-between align-items-center">
            <div class="h6">Ödeme Tipleri</div>
            <!-- <div class="h6">₺{{ formatter.format(adisyon.total) }}</div> -->
          </div>
          <el-divider class="my-1"></el-divider>
          <div class="row justify-content-center mt-4">
            <template v-for="t in types" :key="t">
              <div class="col-6 py-2" v-if="t.state == true" @click="paySelect(t.id)">
                <!-- payProd(t.id) -->
                <el-card
                  :body-style="{ padding: '7px' }"
                  class="modal-card"
                  :class="t.id == this.payType ? 'selected-card' : ''"
                >
                  <div class="d-flex flex-column p-1 align-items-center justify-content-center">
                    <img :src="getImages(t.image)" style="width: 150px" alt="" />
                  </div>
                </el-card>
              </div>
            </template>
          </div>
        </el-card>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ref } from "vue";
import formatter from "@/angaryos/tools/numberFormatter";
import { ElNotification } from "element-plus";
export default {
  props: ["odemeVisible", "masaData"],
  data() {
    return {
      formatter,
      dialogVisible: false,
      activeName: ref("1"),
      activeName2: ref("2"),
      calcValue: "",
      adisyonProd: {},
      payType: 0,
      adisyon: {
        masa_ids: "",
        product_info_json: "",
      },
      selectedProd: [],
      types: [],
      toplamlar: 0,
      indirim: false,
      paraUstu: 0,
      odeme_hazir: [],
      odenmisler: [],
    };
  },
  mounted() {
    document.addEventListener("keydown", (e) => {
      if (this.toplamlar <= 0) {
        if (e.key == "Backspace") this.calculate(10);
        else this.calculate(Number(e.key));
      }
    });
    this.getTypes();
  },
  methods: {
    calculate(val) {
      if (this.toplamlar > 0) this.calcValue = 0;
      else {
        switch (val) {
          case 0:
            this.calcValue != 0 ? (this.calcValue += "0") : null;
            break;
          case 1:
            this.calcValue += "1";
            break;
          case 2:
            this.calcValue += "2";
            break;
          case 3:
            this.calcValue += "3";
            break;
          case 4:
            this.calcValue += "4";
            break;
          case 5:
            this.calcValue += "5";
            break;
          case 6:
            this.calcValue += "6";
            break;
          case 7:
            this.calcValue += "7";
            break;
          case 8:
            this.calcValue += "8";
            break;
          case 9:
            this.calcValue += "9";
            break;
          case 10:
            this.calcValue = this.calcValue.slice(0, -1);
            break; //sil
          case 11:
            this.calcValue = this.adisyon.total / 10;
            break; //indirim
          case 12:
            this.calcValue = this.adisyon.total;
            break; //tüm
          case 13:
            this.calcValue = this.adisyon.total / 2;
            break; //1/2
          case 14:
            this.calcValue = this.adisyon.total / 3;
            break; //1/3
          case 15:
            this.calcValue = this.adisyon.total / 4;
            break; //1/4
          case 16:
            this.calcValue = this.adisyon.total / 5;
            break; //1/5
          case 17:
            this.calcValue = this.adisyon.total / 6;
            break; //1/6
          case 18:
            this.calcValue = this.adisyon.total / 7;
            break; //1/7
          case 19:
            this.calcValue = this.adisyon.total / 8;
            break; //1/8
          case 20:
            this.calcValue = this.adisyon.total / 9;
            break; //1/9
          case 21:
            this.calcValue = this.adisyon.total / 10;
            break; //1/10
          default:
            break;
        }
        if (val == 11) this.indirim = true;
        else this.indirim = false;
      }
    },
    getAdisyon() {
      this.$services.show("adisyon", this.masaData.adisyon_id).then((res) => {
        this.adisyon = res.data.data.record;
        this.adisyonProd = JSON.parse(res.data.data.record.product_info_json);
        this.odenmisler = Object.values(JSON.parse(res.data.data.record.pay_list));
      });
    },
    paySelect(id) {
      if (this.toplamlar > 0 || this.calcValue > 0) {
        this.payType = id;
        console.log(this.payType);
        this.paraUstu = this.calcValue - this.adisyon.total;
      } else {
        ElNotification({
          title: "Uyarı",
          message: "Önce tutar giriniz.",
          type: "warning",
        });
      }
    },
    payOrder(pay) {
      //validation yapılacak
      pay;
      let params = {
        order_status_id: 5,
        pay_type_id: this.payType,
        total: 0,
      };
      this.$services
        .update("adisyon", this.adisyon?.id, params)
        .then((res) => {
          if (res.data.data.message == "success") {
            ElNotification({
              title: "Başarılı",
              message: "Ödeme başarılı bir şekilde alındı. Masa ve adisyon kapatıldı.",
              type: "success",
            });
            setTimeout(() => {
              this.$router.go();
            }, 800);
          } else {
            ElNotification({
              title: "Hata",
              message: "Adisyon ödenirken bir hata oluştu.",
              type: "error",
            });
          }
        })
        .catch(() => {
          ElNotification({
            title: "Hata",
            message: "Adisyon ödenirken bir hata oluştu.",
            type: "error",
          });
        });
    },
    payProd(prod) {
      if (this.toplamlar > 0 || this.calcValue > 0) {
        for (const val of Object.values(this.adisyonProd)) {
          val.remainder_total = val.product_count;
        }
        let params = {
          product_info_json: JSON.stringify(this.adisyonProd),
          total: this.adisyon.total - (this.toplamlar ? this.toplamlar : this.calcValue),
          pay_type: prod,
          pay_list: JSON.stringify(this.odenmisler.concat(this.odeme_hazir)),
        };
        this.$services
          .update("adisyon", this.adisyon?.id, params)
          .then((res) => {
            if (res.data.data.message == "success") {
              ElNotification({
                title: "Başarılı",
                message: "Ödeme başarılı bir şekilde alındı.",
                type: "success",
              });

              if (prod == 35 && this.adisyon.customer_id[0]?.source > 0) {
                let paramet = {
                  opening_price: this.adisyon.total,
                };
                this.$services.update("customer", this.adisyon.customer_id[0]?.source, paramet).then((res) => {
                  if (res.data.data.message == "success") {
                    ElNotification({
                      title: "Başarılı",
                      message: this.adisyon.total + "₺ müşteriye yazıldı.",
                      type: "success",
                    });
                  } else {
                    ElNotification({
                      title: "Hata",
                      message: "Müşteriye aktarılırken sorun oluştu.",
                      type: "error",
                    });
                  }
                });
              } else {
                ElNotification({
                  title: "Hata",
                  message: "Masaya tanımlı bir müşteri bulunamadı.",
                  type: "error",
                });
              }
              this.getAdisyon();
            } else {
              ElNotification({
                title: "Hata",
                message: "Adisyon ödenirken bir hata oluştu.",
                type: "error",
              });
            }
          })
          .catch(() => {
            ElNotification({
              title: "Hata",
              message: "Adisyon ödenirken bir hata oluştu.",
              type: "error",
            });
          });
      } else {
        ElNotification({
          title: "Uyarı",
          message: "Ödeme yapılacak tutarı belirleyiniz.",
          type: "warning",
        });
      }
    },
    productSelect(prod, key, price) {
      console.log(prod, key, price);
      this.toplamlar = this.toplamlar + price;
      if (prod.remainder_total > 0) {
        prod.product_total = prod.product_total - price;
        prod.remainder_total = prod.remainder_total - 1;
        if (this.odeme_hazir.length <= 0) {
          this.odeme_hazir.push({
            key: key,
            id: prod.id,
            name: prod.product_name,
            price: price,
            portion: prod.portion_name,
            count: prod.product_count - prod.remainder_total,
            prods: prod,
          });
        }
        this.odeme_hazir.find((x, k) => {
          if (x.key == key && x.id == prod.id) {
            console.log("gid");
            this.odeme_hazir[k].count = prod.product_count - prod.remainder_total;
          } else {
            console.log("else");
            this.odeme_hazir.push({
              key: key,
              id: prod.id,
              name: prod.product_name,
              price: price,
              portion: prod.portion_name,
              count: prod.product_count - prod.remainder_total,
              prods: prod,
            });
          }
        });
      }
      if (prod.remainder_total == 0) prod.paid = true;
    },
    productDelete(prod, key, price) {
      console.log(prod, key, price);
      this.toplamlar = this.toplamlar - price;
      if (prod.remainder_total < prod.product_count) {
        prod.product_total = prod.product_total + price;
        prod.remainder_total = prod.remainder_total + 1;
        this.odeme_hazir.find((x, k) => {
          if (x.key == key && x.id == prod.id) {
            console.log("gid");
            this.odeme_hazir[k].count = prod.product_count - prod.remainder_total;
          }
          if (x.count <= 0) {
            this.odeme_hazir.splice(k, 1);
          }
        });
      }
      if (prod.remainder_total > 0) prod.paid = false;
    },
    getTypes() {
      const params = {
        limit: 100,
        page: 1,
        filters: {},
        sorts: { id: true },
      };
      this.$services.list("pay_type", params).then((res) => {
        this.types = res.data.data.records;
      });
    },
    getImages(img) {
      if (img == null || img == "[]") {
        return null;
      } else {
        return this.imgBaseUrl + JSON.parse(img)[0].destination_path + "s_" + JSON.parse(img)[0].file_name;
      }
    },
  },
  watch: {
    odemeVisible() {
      this.dialogVisible = this.odemeVisible;
    },
    dialogVisible() {
      this.$emit("update:odemeVisible", this.dialogVisible);
      this.getAdisyon();
    },
  },
};
</script>

<style>
.odeme-card {
  min-height: 600px;
}

.grid-container {
  display: grid;
  grid-template-columns: auto auto auto auto;
  padding: 10px;
}

.grid-item {
  padding: 36px;
  text-align: center;
  margin: 0 !important;
  border: 0.5px solid #ddd;
  border-radius: 0;
}

.grid-container .el-dropdown .grid-item {
  width: 100% !important;
}

.selected-card {
  border: 1px solid red;
  transform: scale(1.1);
}
</style>
