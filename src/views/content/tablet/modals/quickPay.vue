<template>
  <el-dialog
    v-model="dialogVisible"
    :title="masaData?.table_name + ' - Hızlı Öde (₺' + formatter.format(masaData?.total) + ')'"
    :width="width"
    align-center
  >
    <div class="row align-items-center justify-content-center">
      <div class="row justify-content-center mt-4">
        <template v-for="t in JSON.parse(getUserData?.companies.pay_type_ids)" :key="t">
          <div class="col-12 col-sm-6 p-1">
            <el-card :body-style="{ padding: '7px' }" class="modal-card" @click="payOrder(t)">
              <div class="d-flex flex-column p-1 align-items-center justify-content-center">
                <img :src="getImages(types.find((e) => e.id == t)?.image)" style="width: 100%" alt="" />
                <div class="h6" v-if="false">{{ types.find((e) => e.id == t)?.pay_type }}</div>
              </div>
            </el-card>
          </div>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ref } from "vue";
import formatter from "@/angaryos/tools/numberFormatter";
import { ElNotification } from "element-plus";
import { mapGetters } from "vuex";
export default {
  props: ["hizliOdemeVisible", "masaData"],
  data() {
    return {
      dialogVisible: false,
      paySettings: "ode",
      radio1: ref("Öde"),
      payType: 1,
      formatter,
      adisyon: {
        product_info_json: "",
      },
      types: [],
      width: "100%",
    };
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
  mounted() {
    if (window.innerWidth < 368) {
      this.width = "100%";
    } else if (window.innerWidth < 768) {
      this.width = "85%";
    } else if (window.innerWidth < 992) {
      this.width = "55%";
    } else if (window.innerWidth < 1200) {
      this.width = "45%";
    } else if (window.innerWidth < 1400) {
      this.width = "40%";
    } else {
      this.width = "30%";
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth < 368) {
        this.width = "100%";
      } else if (window.innerWidth < 768) {
        this.width = "85%";
      } else if (window.innerWidth < 992) {
        this.width = "50%";
      } else if (window.innerWidth < 1200) {
        this.width = "40%";
      } else if (window.innerWidth < 1400) {
        this.width = "35%";
      } else {
        this.width = "25%";
      }
    });
  },
  methods: {
    getAdisyon() {
      this.$services.show("adisyon", this.masaData.adisyon_id).then((res) => {
        this.adisyon = res.data.data.record;
      });
    },
    payOrder(pay) {
      this.payType = pay;
      let params = {
        order_status_id: 5,
        pay_type_id: this.payType,
      };
      this.$services
        .update("adisyon", this.adisyon?.id, params)
        .then((res) => {
          if (res.data.data.message == "success") {
            ElNotification({
              title: "Başarılı",
              message: "Ödeme başarılı bir şekilde alındı. Adisyon kapatıldı.",
              type: "success",
            });
            this.$emit("pay_it", true);
            if (this.payType == 35) {
              let paramet = {
                opening_price: this.adisyon.total,
              };
              this.$services.update("customer", this.adisyon.customer_id, paramet).then((res) => {
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
            }
            setTimeout(() => {
              this.$router.go();
            }, 1200);
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
    getTypes() {
      const params = {
        limit: 50,
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
        //[{"disk": "ftpServer", "file_name": "Tea-PNG-HD.png", "destination_path": "2022/12/30/"}]
      }
    },
  },
  watch: {
    hizliOdemeVisible(v) {
      this.dialogVisible = this.hizliOdemeVisible;
      if (v == true) {
        this.getTypes();
      }
    },
    dialogVisible() {
      this.$emit("update:hizliOdemeVisible", this.dialogVisible);
      this.getAdisyon();
    },
  },
};
</script>

<style></style>
