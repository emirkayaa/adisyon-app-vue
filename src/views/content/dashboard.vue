<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12 mb-2">
        <firstchart :gun_sonu="gun_sonu"></firstchart>
      </div>

      <div class="col-12 col-md-6 mb-2">
        <timeline :gun_sonu="gun_sonu"></timeline>
      </div>
      <div class="col-12 col-md-6 mb-2" v-yakinda>
        <masaChart></masaChart>
      </div>
      <div class="col-12 mb-2" v-yakinda>
        <headmap></headmap>
      </div>
    </div>
  </div>
</template>

<script>
import headmap from "@/views/content/dashboard-components/headmap";
import firstchart from "@/views/content/dashboard-components/firstchart";
import masaChart from "@/views/content/dashboard-components/masa-chart";
import timeline from "@/views/content/dashboard-components/timeline";
import { mapGetters } from "vuex";
export default {
  components: {
    headmap,
    firstchart,
    masaChart,
    timeline,
  },
  data() {
    return {
      gun_sonu: [],
    };
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
  mounted() {
    this.getGunSonu();
  },
  watch: {
    getUserData() {
      this.getGunSonu();
    },
  },
  methods: {
    getGunSonu() {
      let yetki = this.getUserData?.user?.user_task_id;

      if ((yetki == 4 || yetki == 5) && this.getUserData.companies != null) {
        const params = {
          limit: 100,
          page: 1,
          filters: {},
          sorts: { id: true },
        };
        this.$services.list("end_day", params).then((res) => {
          this.gun_sonu = res.data.data.records;
        });
      }
    },
  },
};
</script>

<style></style>
