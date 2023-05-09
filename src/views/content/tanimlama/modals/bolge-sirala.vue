<template>
  <el-dialog v-model="dialogVisible" title="Bölgeler" draggable width="418px" align-center>
    <draggable
      id="bolge-changes-input"
      class="list-group overflow-auto h-100"
      style="min-height: 50px; max-height: 400px"
      :list="bolgeler"
      group="people"
      @change="siraDegisti"
      :move="checkMove"
      itemKey="name"
    >
      <template #item="{ element }">
        <div v-if="element?.deleted != true" class="mb-1 card p-2" style="cursor: move" @click="duzenle(element)">
          <div class="d-flex justify-content-between w-100">
            <div>{{ element.zone }}</div>
            <i class="bi bi-pen fs-6 text-primary cursor-pointer" id="edit-bolge-button"></i>
          </div>
        </div>
      </template>
    </draggable>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Vazgeç</el-button>
        <el-button type="primary" id="bolge-edit-button" @click="saveSort()"> Kaydet </el-button>
      </span>
    </template>
  </el-dialog>
  <bolgeDuzenle v-model:visible="duzenleVisible" :edit_data="edit_data" @newData="newData($event)"></bolgeDuzenle>
</template>

<script>
import bolgeDuzenle from "@/views/content/tanimlama/modals/bolge-duzenle";
import draggable from "vuedraggable";
import { ElNotification } from "element-plus";
export default {
  props: ["visible"],
  data() {
    return {
      dialogVisible: false,
      duzenleVisible: false,
      bolgeler: [],
      record_state: 0,
      update_state: 0,
      edit_data: null,
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val == true) this.getBolgeler();
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
    update_state(v) {
      if (this.record_state == v) {
        ElNotification({
          title: "Başarılı",
          message: "Bölgeleriniz başarıyla kaydedildi.",
          type: "success",
        });
        this.dialogVisible = false;
        this.$emit("update:visible", false);
      }
    },
  },
  methods: {
    siraDegisti() {
      for (const [k, v] of Object.entries(this.bolgeler)) {
        v.sort_no = k;
      }
    },
    duzenle(data) {
      this.edit_data = data;
      this.duzenleVisible = true;
    },
    newData(data) {
      if (data == "delete") {
        this.bolgeler.find((e) => {
          if (e.id == this.edit_data.id) {
            e.deleted = true;
          }
        });
      } else {
        this.bolgeler.find((e) => {
          if (e.id == data.id) {
            e = data;
          }
        });
      }
    },
    getBolgeler() {
      const params = {
        limit: 100,
        page: 1,
        filters: {},
        sorts: { sort_no: true },
      };
      this.$services.list("zone", params).then((res) => {
        this.bolgeler = res.data.data.records;

        this.load_state += 1;
      });
    },
    saveSort() {
      for (const v of Object.values(this.bolgeler)) {
        if (v?.deleted == true) continue;
        this.record_state += 1;
        let change = {
          sort_no: v.sort_no,
        };
        this.$services.update("zone", v.id, change).then((res) => {
          if (res.data.data.message != "success") {
            ElNotification({
              title: "Hata",
              message: "Beklenmedik bir hata ile karşılaşıldı",
              type: "error",
            });
          } else {
            this.update_state += 1;
          }
        });
      }
    },
  },
  components: {
    draggable,
    bolgeDuzenle,
  },
};
</script>

<style></style>
