<template>
  <div class="">
    <el-tabs v-model="activeTab" type="border-card" class="demo-tabs rounded" @tab-click="handleClick">
      <el-tab-pane class="rounded" v-for="(v, k) in tables" :key="k" :label="v.title" :name="k">
        <table-vue
          v-if="activeTab == k && v.type == 'table'"
          :table_name="v.name"
          :column_settings="v.column_settings"
          :button_settings="v.button_settings"
          :modules="v.modules"
          @data="setData($event, v.name)"
        />
        <div class="d-none">
          <table-vue
            v-if="v.name == 'hatirlatici'"
            class="d-none"
            :table_name="v.name"
            :column_settings="v.column_settings"
            :button_settings="v.button_settings"
            :modules="v.modules"
            @data="setData($event, v.name)"
          />
          <dual
            v-if="v.name == 'cari_hesap'"
            type="edit"
            :id="this.$route.params.id"
            display="page"
            table_name="cari_hesap"
            :column_settings="v.column_settings"
            @params="setData($event, v.name)"
          />
        </div>
        <dual
          v-if="v.type == 'edit' && yenile"
          :type="v.type"
          :id="this.$route.params.id"
          display="page"
          :table_name="v.name"
          :column_settings="v.column_settings"
          @params="setData($event, v.name)"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tableVue from "@/angaryos/table";
import { mapGetters } from "vuex";
import dual from "@/angaryos/dual";
export default {
  props: {
    tables: {
      type: Object,
      required: true,
    },
    id: {
      type: Number,
    },
  },
  components: {
    "table-vue": tableVue,
    dual,
  },
  data() {
    return {
      activeTab: "first",
      tableData: {},
      tableId: 0,
      yenile: true,
    };
  },
  mounted() {
    if (this.$route.query.tab != undefined) {
      this.activeTab = this.$route.query.tab;
    }
  },

  methods: {
    setData(data, table_name) {
      this.tableData[table_name] = data;
      this.$emit("data", this.tableData);
    },
    handleClick(e) {
      //NOTE - TAB İSİMLENDİRMELERİNİN YAPILDIĞĞI YER
      const gitme = ["CariDetay", "PersonelYonetimiDetay"];
      if (gitme.find((e) => e == this.$route.name)) return;
      this.$router.push(this.$route.path + "?tab=" + e.props.name);
    },
  },
  computed: {
    ...mapGetters({
      adminMode: "adminMode",
      getTableRefresh: "getTableRefresh",
    }),
  },
  watch: {
    id() {
      this.tableId = this.id;
    },
    getTableRefresh() {
      this.yenile = false;
      setTimeout(() => {
        this.yenile = true;
      }, 100);
    },
    $route() {
      if (this.$route.query.tab != undefined) {
        this.activeTab = this.$route.query.tab;
      }
    },
    $router() {
      if (this.$route.query.tab != undefined) {
        this.activeTab = this.$route.query.tab;
      }
    },
  },
};
</script>
