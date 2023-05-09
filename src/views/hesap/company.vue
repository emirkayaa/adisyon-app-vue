<template>
  <div>
    <div class="row">
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
        <comp-card :data="compData"></comp-card>
      </div>
      <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12">
        <div class="row">
          <div class="col-12 col-md-6">
            <el-card style="height: 256px; overflow: auto"> *Geliştirme aşamasındadır. </el-card>
          </div>
          <div class="col-12 col-md-6">
            <el-card style="height: 256px"> *Geliştirme aşamasındadır. </el-card>
          </div>
          <div class="col-12 mt-2">
            <comp-onmuhasebe-tabs
              v-if="
                getUserData.user.firma_sube_adi == 1 ||
                getUserData.user.firma_sube_adi == 4 ||
                getUserData.user.firma_sube_adi == null // Admin için
              "
              @datas="compData = $event"
              :data="compData"
            ></comp-onmuhasebe-tabs>
            <comp-kobi-tabs
              v-else-if="getUserData.user.firma_sube_adi == 3"
              @datas="compData = $event"
              :data="compData"
            ></comp-kobi-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

import compCard from "./firma/card.vue";
import compOnMuhasebeTabs from "./firma/onmuhasbe-tabs.vue";
import compKobiTabs from "./firma/kobi-tabs.vue";
export default {
  data() {
    return {
      compData: {},
    };
  },
  computed: {
    ...mapGetters(["getToken", "getCompData", "getUserData"]),
  },
  mounted() {},
  methods: {
    getData() {
      axios
        .post(this.getToken + "/tables/departments/" + JSON.parse(localStorage.getItem("comp-data")).id + "/edit", {
          params: JSON.stringify({
            column_set_id: this.getUserData.auths.tables.departments.edits[0],
          }),
        })
        .then((res) => {
          this.compData = res.data.data.record;
        });
    },
  },
  components: {
    "comp-card": compCard,
    "comp-onmuhasebe-tabs": compOnMuhasebeTabs,
    "comp-kobi-tabs": compKobiTabs,
  },
};
</script>

<style></style>
