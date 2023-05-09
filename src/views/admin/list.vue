<template>
  <el-card v-if="true">
    <tableVue :table_name="this.$route.params.table_name" />
  </el-card>
</template>

<script>
import tableVue from "@/angaryos/table";
import { mapGetters } from "vuex";
export default {
  components: { tableVue },
  computed: {
    ...mapGetters(["isAdmin"]),
  },
  data() {
    return {};
  },
};
</script>

<style></style>
