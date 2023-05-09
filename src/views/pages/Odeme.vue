<template>
  <div class="container">
    <div class="row equal-height-container m-5">
      <div class="col-12">
        <h5 class="mb-4">Paketlerimiz</h5>
      </div>

      <div v-for="d in data" :key="d" class="col-md-12 col-lg-4 mb-4 col-item">
        <div class="card">
          <div class="card-body pt-5 pb-5 d-flex flex-lg-column flex-md-row flex-sm-row flex-column">
            <div class="price-top-part">
              <i class="iconsminds-male large-icon"></i>
              <h5 class="mb-0 font-weight-semibold color-theme-1 mb-4">{{ d.name_basic }}</h5>
              <p class="text-large mb-2 text-default">{{ d.price }}₺</p>
              <p class="text-muted text-small">Firma/Aylık</p>
              <p>{{ d.description }}</p>
            </div>
            <div class="pl-3 pr-3 pt-3 pb-0 d-flex price-feature-list flex-column flex-grow-1">
              <ul class="list-unstyled">
                <li>
                  <p class="mb-0">Number of end products 1</p>
                </li>
                <li>
                  <p class="mb-0">Free updates</p>
                </li>
                <li>
                  <p class="mb-0">Forum support</p>
                </li>
              </ul>
              <div class="text-center">
                <button @click="ode(d.id)" class="btn btn-link btn-empty btn-lg d-flex flex-row align-items-center">
                  PURCHASE <i class="simple-icon-arrow-right mx-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <iframe
      :src="'https://www.paytr.com/odeme/guvenli/' + token"
      id="paytriframe"
      frameborder="0"
      style="width: 100%; height: 100vh"
    ></iframe>
  </div>
</template>

<script>
import useScript from "@/hooks/useScript";
import { mapGetters } from "vuex";
import axios from "axios";
import { ElNotification } from "element-plus";
export default {
  data() {
    return {
      publicPath: process.env.BASE_URL,
      data: {},
      token: "",
    };
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
  created() {
    this.getAbonelik();
    useScript(process.env.BASE_URL + "_assets/js/payTr.js");
  },
  methods: {
    getAbonelik() {
      axios
        .post(this.$store.getters.getToken + "/tables/abonelik", {
          params: JSON.stringify({
            page: 1,
            limit: "10",
            column_array_id: this.getUserData?.auths?.tables["abonelik"]?.lists[0],
            column_array_id_query: this.getUserData?.auths?.tables["abonelik"]?.queries[0],
            sorts: {},
            filters: {},
          }),
        })
        .then((res) => {
          this.data = res.data.data.records;
        })
        .catch((err) => {
          ElNotification({
            title: "Error",
            message: err.response.data.data.message,
            type: "error",
            position: "top-left",
          });
        });
    },
    ode(id) {
      axios
        .post(this.$store.getters.getToken + "/payment/create", {
          paymentId: id,
        })
        .then((res) => {
          if (res.data.status == "success") {
            //window.location.href="https://www.paytr.com/odeme/guvenli/"+res.data.token;
            this.token = res.data.token;
          }
        })
        .catch((err) => {
          ElNotification({
            title: "Error",
            message: err.response.data.data.message,
            type: "error",
            position: "top-left",
          });
        });
    },
  },
};
</script>

<style>
.custom_os_odeme_secenek_btn {
  border-radius: 20px !important;
}
</style>
