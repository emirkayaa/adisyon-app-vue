<template>
  <el-dialog v-model="dialogVisible" title="Bölge Düzenle" draggable width="418px" align-center>
    <span>Bölge İsmi:</span>
    <el-input class="mb-2" v-model="data.zone" size="large" placeholder="Bölge ismi"></el-input>

    <template #footer>
      <span class="d-flex justify-content-between">
        <div>
          <el-popconfirm
            confirm-button-text="Evet"
            cancel-button-text="Hayır"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="Silmek istediğinize emin misiniz?"
            @confirm="deleteEvent"
          >
            <template #reference>
              <el-button type="danger" circle> <i class="bi bi-trash"></i></el-button>
            </template>
          </el-popconfirm>
        </div>
        <div>
          <el-button @click="dialogVisible = false">Vazgeç</el-button>
          <el-button type="primary" @click="updateZone()"> Kaydet </el-button>
        </div>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ElNotification } from "element-plus";
export default {
  props: ["visible", "edit_data"],
  data() {
    return {
      dialogVisible: false,
      data: {},
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      this.data = this.edit_data;
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
  },
  methods: {
    updateZone() {
      let change = {
        zone: this.data.zone,
      };
      this.$services.update("zone", this.data.id, change).then((res) => {
        if (res.data.data.message != "success") {
          ElNotification({
            title: "Hata",
            message: "Beklenmedik bir hata ile karşılaşıldı",
            type: "error",
          });
        } else {
          ElNotification({
            title: "Başarılı",
            message: "Bölge başarıyla düzenlendi",
            type: "success",
          });
          this.dialogVisible = false;
          this.$emit("newData", this.data);
        }
      });
    },
    deleteEvent() {
      this.$services.deleted("zone", this.edit_data.id).then((res) => {
        if (res.data.data.message == "success") {
          ElNotification({
            title: "Başarılı",
            message: "Bölge başarıyla silindi.",
            type: "success",
          });
          this.$emit("newData", "delete");
          this.dialogVisible = false;
        }
      });
    },
  },
  components: {},
};
</script>

<style></style>
