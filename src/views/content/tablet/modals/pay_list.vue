<template>
  <el-dialog v-model="dialogVisible" class="pay-list" align-center width="380px" :show-close="false">
    <div class="d-flex flex-wrap cursor-pointer" style="user-select: none">
      <el-card class="m-1" v-for="t in JSON.parse(getUserData.companies.pay_type_ids)" :key="t" @click="selectedPayType(t)">
        <span class="my-3 fs-5" style="width: 120px">{{ odeme_tipleri.find((e) => e.id == t)?.pay_type }}</span>
        <img v-if="false" :src="getImages(odeme_tipleri.find((e) => e.id == t)?.image)" style="width: 120px" alt="" />
      </el-card>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["visible"],
  data() {
    return {
      dialogVisible: false,
      odeme_tipleri: [],
    };
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
  watch: {
    visible(v) {
      this.dialogVisible = v;
      if (v == true) {
        this.getTypes();
      }
    },
    dialogVisible(v) {
      this.$emit("update:visible", v);
    },
  },
  methods: {
    selectedPayType(id) {
      this.$emit("type", id);
      this.dialogVisible = false;
    },
    getTypes() {
      const params = {
        limit: 100,
        page: 1,
        filters: {},
        sorts: { id: true },
      };
      this.$services.list("pay_type", params).then((res) => {
        this.odeme_tipleri = res.data.data.records;
        this.$emit("odeme_tipleri", this.odeme_tipleri);
      });
    },
  },
};
</script>

<style>
.pay-list header {
  display: none;
}
</style>
