<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex">
        <h2 class=""><i class="text-primary bi bi-building"></i> Firma Ayarları</h2>
      </div>
    </el-card>
    <el-card>
      <dual
        table_name="companies"
        display="page"
        type="edit"
        :id="getUserData.companies?.id"
        @message="cacheClear(getUserData.companies?.id)"
        :column_settings="column_settings"
      ></dual>
    </el-card>
  </div>
</template>

<script>
import Dual from "@/angaryos/dual.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      activeName: "first",
      column_settings: {
        waiter_type_id: { input_visible: false },
        waiter_total: { input_visible: false },
        kuver_total: { input_visible: false },
        kuver_type_id: { input_visible: false },
      },
    };
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
  components: {
    Dual,
  },
  methods: {
    cacheClear() {
      this.$store.dispatch("userDataApi");
    },
  },
};
</script>

<style></style>
