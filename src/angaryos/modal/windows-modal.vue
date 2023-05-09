<template>
  <div class="center-modal" :class="fullscreen ? 'center-fullscreen' : ''">
    <template v-for="m in getModalDatas" :key="m">
      <h1 class="display-1" v-if="m.windows == true">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius consequatur adipisci sint quasi expedita rerum suscipit
        ut natus dolorum tempora repellat amet beatae cupiditate quo error, incidunt excepturi. Consectetur, error.
      </h1>
      <el-dialog
        v-if="m.windows == true"
        draggable
        :show-close="false"
        v-model="m.windows"
        :title="m.title"
        class="pt-1 erdo-dialog"
        style=""
      >
        <template #header>
          <div class="w-100 card p-2 px-4 pt-3">
            <div class="d-flex justify-content-between w-100">
              <label style="font-size: 15px">
                {{ this.getCenterModalData.title }}
              </label>
              <div>
                <!--el-button size="small" type="info" :icon="SemiSelect" circle> </!--el-button-->
                <el-button
                  v-tooltip="!fullscreen ? 'Genişlet' : 'Küçült'"
                  size="small"
                  type="success"
                  @click="fullscreen = !fullscreen"
                  circle
                >
                  <i
                    v-if="!fullscreen"
                    class="bi bi-arrows-fullscreen"
                    style="font-size: 11px; font-weight: 900; padding: 1px 0 0 1px"
                  ></i>
                  <i v-else class="bi bi-fullscreen-exit" style="font-size: 11px; padding: 1px 0 0 1px"></i>
                </el-button>
                <el-button
                  v-tooltip="'Kapat'"
                  size="small"
                  type="danger"
                  :icon="CloseBold"
                  circle
                  @click="modalState = !modalState"
                >
                </el-button>
              </div>
            </div>
          </div>
        </template>
        <div class="p-2">
          <modules
            :table_name="m.table_name"
            display="list"
            :type="m.type"
            :column_settings="m.column_settings"
            @message="message($event)"
            :id="m.id"
          ></modules>
        </div>
      </el-dialog>
    </template>
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
    ...mapGetters(["getCenterModalData", "getModalDatas"]),
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
  },

  mounted() {
    if (window.innerWidth < 368) {
      this.width = "90%";
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
        this.width = "90%";
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
