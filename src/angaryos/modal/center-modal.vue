<template>
  <div class="center-modal" :class="fullscreen ? 'center-fullscreen' : ''">
    <el-dialog
      v-if="modalState == true"
      draggable
      v-model="modalState"
      :title="this.getCenterModalData.title"
      :width="width"
    >
      <div class="p-2 pb-5 pb-md-0">
        <modules
          v-if="getCenterModalData.state == true"
          :table_name="this.getCenterModalData.table_name"
          display="list"
          :type="this.getCenterModalData.type"
          :column_settings="this.getCenterModalData.column_settings"
          @message="message($event)"
          :id="this.getCenterModalData.id"
        ></modules>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { components } from "./datas.js";

import { CloseBold, SemiSelect } from "@element-plus/icons-vue";
export default {
  data() {
    return {
      modalState: false,
      width: "",
      fullscreen: false,
      CloseBold,
      SemiSelect,
    };
  },
  components: components,
  computed: {
    ...mapGetters(["getCenterModalData", "getFavorite"]),
  },
  watch: {
    getCenterModalData() {
      if (this.getCenterModalData.state == true) {
        this.modalState = true;
        this.$.components["modules"] = this.$.components[this.getCenterModalData.name];
      }
    },
    modalState() {
      if (this.modalState == false) {
        let data = this.getCenterModalData;
        data.state = false;
        this.$store.commit("setCenterModalData", data);
      }
    },
  },
  methods: {
    message(data) {
      if (data == "success") {
        this.modalState = false;
        this.$store.commit("setCenterModalData", {
          state: false,
        });
        this.$store.commit("setTableRefresh");
      }
    },
    addFavorite() {
      this.$store.commit("setFavorite", {
        table_name: this.getCenterModalData.table_name,
        type: this.getCenterModalData.name == "detail" ? "detail" : this.getCenterModalData.type,
        link: "",
        id: this.getCenterModalData.id,
      });
    },
    removeFavorite() {
      this.$store.commit("setFavorite", {
        table_name: this.getCenterModalData.table_name,
        type: this.getCenterModalData.name == "detail" ? "detail" : this.getCenterModalData.type,
        link: "",
        id: this.getCenterModalData.id,
        state: false,
      });
    },
  },

  mounted() {
    if (window.innerWidth < 368) {
      this.width = "95%";
    } else if (window.innerWidth < 768) {
      this.width = "70%";
    } else if (window.innerWidth < 992) {
      this.width = "55%";
    } else if (window.innerWidth < 1200) {
      this.width = "45%";
    } else if (window.innerWidth < 1400) {
      this.width = "40%";
    } else {
      this.width = "30%";
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth < 368) {
        this.width = "95%";
      } else if (window.innerWidth < 768) {
        this.width = "70%";
      } else if (window.innerWidth < 992) {
        this.width = "50%";
      } else if (window.innerWidth < 1200) {
        this.width = "40%";
      } else if (window.innerWidth < 1400) {
        this.width = "35%";
      } else {
        this.width = "25%";
      }
    });
  },
};
</script>

<style></style>
