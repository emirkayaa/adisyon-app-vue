<template>
  <div class="modal-right">
    <el-dialog
      v-if="modalState == true"
      :show-close="false"
      v-model="modalState"
      :width="width"
      :title="this.getRightModalData.title"
      :fullscreen="fullscreen"
    >
      <template #header>
        <div class="w-100 p-2 px-4 pt-3">
          <div class="d-flex justify-content-between w-100">
            <span style="font-size: 15px; font-weight: bold">{{ this.getRightModalData.title }}</span>
            <label v-if="false" style="font-size: 15px">
              <i
                v-if="
                  getFavorite?.[
                    this.getRightModalData?.table_name +
                      '-' +
                      this.getRightModalData?.type +
                      '-' +
                      (this.getRightModalData?.id == undefined ? '' : this.getRightModalData?.id)
                  ] == undefined
                "
                class="bi bi-bookmark-plus me-2 cursor-pointer"
                @click="addFavorite()"
              ></i>
              <i v-else @click="removeFavorite()" class="bi bi-bookmark-star-fill me-2 cursor-pointer"></i>
              {{ this.getRightModalData.title }}
            </label>
            <div>
              <!--el-button size="small" type="info" :icon="SemiSelect" circle> </!--el-button-->
              <!--el-button size="small" type="success" @click="fullscreen = !fullscreen" circle>
                <i
                  v-if="!fullscreen"
                  class="bi bi-arrows-fullscreen"
                  style="font-size: 11px; font-weight: 900; padding: 1px 0 0 1px"
                ></i>
                <i v-else class="bi bi-fullscreen-exit" style="font-size: 11px; padding: 1px 0 0 1px"></i>
              </!--el-button-->
              <el-button size="small" type="danger" :icon="CloseBold" circle @click="modalState = !modalState"> </el-button>
            </div>
          </div>
        </div>
      </template>
      <div class="pb-5 pb-md-0">
        <modules
          v-if="getRightModalData.state == true"
          :table_name="this.getRightModalData.table_name"
          display="list"
          :type="this.getRightModalData.type"
          :column_settings="this.getRightModalData.column_settings"
          @message="message($event)"
          :id="this.getRightModalData.id"
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
    ...mapGetters(["getRightModalData", "getFavorite"]),
  },
  watch: {
    getRightModalData() {
      if (this.getRightModalData.state == true && this.getRightModalData.display == "right") {
        this.modalState = true;
        this.$.components["modules"] = this.$.components[this.getRightModalData.name];
      } else {
        this.modalState = false;
      }
    },
  },
  methods: {
    message(data) {
      if (data == "success") {
        this.modalState = false;
        this.$store.commit("setRightModalData", {
          state: false,
        });
        this.$store.commit("setTableRefresh");
      }
    },
    addFavorite() {
      this.$store.commit("setFavorite", {
        table_name: this.getRightModalData.table_name,
        type: this.getRightModalData.name == "detail" ? "detail" : this.getRightModalData.type,
        link: "",
        id: this.getRightModalData.id,
      });
    },
    removeFavorite() {
      this.$store.commit("setFavorite", {
        table_name: this.getRightModalData.table_name,
        type: this.getRightModalData.name == "detail" ? "detail" : this.getRightModalData.type,
        link: "",
        id: this.getRightModalData.id,
        state: false,
      });
    },
  },
  mounted() {
    if (window.innerWidth < 368) {
      this.width = "100%";
    } else if (window.innerWidth < 768) {
      this.width = "100%";
    } else if (window.innerWidth < 992) {
      this.width = "60%";
    } else if (window.innerWidth < 1200) {
      this.width = "40%";
    } else if (window.innerWidth < 1400) {
      this.width = "35%";
    } else {
      this.width = "25%";
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth < 368) {
        this.width = "100%";
      } else if (window.innerWidth < 768) {
        this.width = "100%";
      } else if (window.innerWidth < 992) {
        this.width = "60%";
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

<style>
.modal-right .el-dialog {
  margin-top: 0;
  margin-right: 0;
  margin-bottom: 0;
  min-height: 100%;
}
.modal-right .el-dialog {
  width: min-content !important;
}
.modal-right .el-dialog__header {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 0 !important;
  margin-right: 0 !important ;
}
.modal-right .el-dialog__body {
  resize: none;
  overflow: auto;
  height: 100%;
  width: 25rem;
}
</style>
