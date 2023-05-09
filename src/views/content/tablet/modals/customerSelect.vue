<template>
  <el-dialog v-model="dialogVisible" title="Müşteri Bilgileri" width="50%" align-center draggable>
    <div class="row justify-content-center">
      <inputs
        :column="adisyonCreate.customer_id"
        v-model="adisyon.customer_id"
        table_name="adisyon"
        :column_settings="{ select: ['edit', 'create'] }"
      ></inputs>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="dialogVisible = false">İptal</el-button>
        <el-button type="primary" @click="dialogVisible = false">Kaydet</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import inputs from "@/angaryos/inputs.vue";
import { Search } from "@element-plus/icons-vue";
import { mapGetters } from "vuex";
export default {
  components: { inputs },
  props: ["musteriSecVisible", "adisyonies"],
  data() {
    return {
      Search,
      adisyon: {},
      dialogVisible: false,
      musteriData: [],
      musteriCreate: "",
      adisyonCreate: "",
    };
  },
  computed: {
    ...mapGetters(["getAdisyonData"]),
  },
  methods: {
    getMusteri() {
      const params = {
        page: 1,
        limit: 10000,
        filters: {},
        sorts: {},
      };
      this.$services.list("customer", params).then((res) => {
        this.musteriData = res.data.data.records;
      });
    },
    getMusteriCreate() {
      this.$services.create("customer").then((res) => {
        this.musteriCreate = res.data.data.column_set.column_arrays[0]?.columns;
      });
    },
    getAdisyonCreate() {
      this.$services.create("adisyon").then((res) => {
        this.adisyonCreate = res.data.data.column_set.column_arrays[0]?.columns;
      });
    },
  },
  watch: {
    musteriSecVisible() {
      this.dialogVisible = this.musteriSecVisible;
      if (this.dialogVisible) {
        this.getMusteri();
        this.getMusteriCreate();
        this.getAdisyonCreate();
        this.adisyon = this.adisyonies;
      }
    },
    dialogVisible() {
      this.$emit("update:musteriSecVisible", this.dialogVisible);
      this.$emit("update:adisyonies", this.adisyon);
    },
  },
};
</script>

<style></style>
