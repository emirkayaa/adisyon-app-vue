<template>
  <div class="card p-4 mb-3">
    <h3>Tab builder</h3>
    <button class="btn btn-success" @click="yeniTable()">Yeni table</button>
    <div v-for="t in tables" :key="t">
      <div class="d-flex">
        <input type="text" class="form-control" v-model="t.name" placeholder="name" />
        <input type="text" class="form-control" v-model="t.type" placeholder="type" />
        <input type="text" class="form-control" v-model="t.title" placeholder="title" />
        <textarea class="form-control" v-model="t.column_settings" placeholder="kolon"></textarea>
        <textarea class="form-control" v-model="t.button_settings" placeholder="buton"></textarea>
      </div>
    </div>
    <button class="btn btn-primary" @click="yenile()">yenile</button>
  </div>
  <div v-if="load">
    <div class="card px-3 pb-3 pt-0 mb-4">
      <ul class="nav nav-tabs card-header-tabs" role="tablist">
        <li class="nav-item" v-for="(v, k) in tables" :key="k">
          <a
            class="nav-link"
            :class="activeTab == k ? 'active' : ''"
            @click="saveTab(k)"
            id="first-tab"
            data-toggle="tab"
            :href="'#' + k"
            role="tab"
            :aria-controls="k"
            aria-selected="true"
          >
            {{ v.title }}
          </a>
        </li>
      </ul>
    </div>
    <div class="">
      <div class="tab-content">
        <div
          v-for="(v, k) in tables"
          :key="k"
          class="tab-pane fade"
          :class="activeTab == k ? 'active show' : ''"
          :id="k"
          role="tabpanel"
          :aria-labelledby="k + '-tab'"
        >
          <div class="card p-4">
            <tableVue
              v-if="activeTab == k && v.type == 'table'"
              :table_name="v.name"
              :column_settings="v.column_settings"
              :button_settings="v.button_settings"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <code>
    <pre style="background: var(--theme-color-3-10)" class="p-4 h5">
      <code class="language-javascript" >
        {{ JSON.stringify(tables, null, 2) }}
      </code>
    </pre>
  </code>
</template>

<script>
import tableVue from "@/angaryos/table";
import { mapGetters } from "vuex";
export default {
  components: {
    tableVue,
  },
  data() {
    return {
      activeTab: 0,
      tables: [],
      load: true,
    };
  },
  computed: {
    ...mapGetters({
      adminMode: "adminMode",
    }),
  },
  created() {
    if (this.$route.query.tab != undefined) {
      if (this.$route.query.tab == 1) {
        this.activeTab = "first";
      } else if (this.$route.query.tab == 2) {
        this.activeTab = "second";
      } else if (this.$route.query.tab == 3) {
        this.activeTab = "thirty";
      } else if (this.$route.query.tab == 4) {
        this.activeTab = "fourty";
      } else if (this.$route.query.tab == 5) {
        this.activeTab = "five";
      } else if (this.$route.query.tab == 6) {
        this.activeTab = "six";
      }
    } else {
      this.activeTab = JSON.parse(localStorage.getItem("settings"))?.saveTab?.kasa_banka_kart
        ? JSON.parse(localStorage.getItem("settings")).saveTab.kasa_banka_kart
        : "first";
    }
    var visible = {};
    visible = JSON.parse(localStorage.getItem("visibleColumn"));
    if (visible["serbest_meslek_makbuzu"] == undefined || visible["serbest_meslek_makbuzu"] == null) {
      visible["serbest_meslek_makbuzu"] = this.visible;
    } else {
      this.visible = visible["serbest_meslek_makbuzu"];
    }
    localStorage.setItem("visibleColumn", JSON.stringify(visible));
  },
  methods: {
    saveTab(tab) {
      var setting = JSON.parse(localStorage.getItem("settings"));
      this.activeTab = tab;
      var tabs = setting?.saveTab;
      tabs = tabs == undefined ? {} : tabs;
      tabs["kasa_banka_kart"] = tab;
      var newSet = {
        ilkGiris: setting?.ilkGiris,
        denemeSuresiTakip: setting?.denemeSuresiTakip,
        saveTab: tabs,
      };
      localStorage.setItem("settings", JSON.stringify(newSet));
    },
    yeniTable() {
      this.tables.push({
        name: "",
        column_settings: {},
        button_settings: {},
        type: "",
      });
    },
    yenile() {
      this.load = false;
      //this.tables.column_settings = JSON.parse(this.tables.column_settings);
      setTimeout(() => {
        this.load = true;
      }, 100);
    },
  },
};
</script>
