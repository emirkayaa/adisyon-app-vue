<template>
  <el-dialog v-model="dialogVisible" align-center width="380px" :show-close="false">
    <div class="d-flex flex-wrap cursor-pointer" style="user-select: none">
      <el-card class="m-1" v-for="t in indirimler" :key="t" @click="selectedIndirim(t)">
        <span class="my-3 fs-5" style="width: 120px">{{ t.discount_name }}</span>
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
      indirimler: [],
    };
  },
  computed: {
    ...mapGetters(["getCompData"]),
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
    selectedIndirim(id) {
      this.$emit("indirim", id);
      this.dialogVisible = false;
    },
    getTypes() {
      const params = {
        limit: 100,
        page: 1,
        filters: {},
        sorts: { id: true },
      };
      this.$services.list("discount", params).then((res) => {
        this.indirimler = res.data.data.records;
      });
    },
  },
};
</script>

<style></style>
