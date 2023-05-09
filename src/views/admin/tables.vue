<template>
  <el-card v-if="true">
    <tableVue table_name="tables" :modules="modules" />
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
    return {
      modules: [
        {
          name: "adminTables",
        },
      ],
    };
  },
};
</script>

<style></style>
