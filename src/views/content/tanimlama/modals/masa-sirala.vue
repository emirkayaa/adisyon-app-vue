<template>
  <el-dialog v-model="dialogVisible" title="Masalar" draggable width="418px" align-center>
    <draggable
      id="bolge-changes-input"
      class="list-group overflow-auto h-100"
      style="min-height: 50px; max-height: 400px"
      :list="masalar"
      group="people"
      @change="siraDegisti"
      :move="checkMove"
      itemKey="name"
    >
      <template #item="{ element }">
        <div class="mb-1 card p-2" style="cursor: move">
          <div class="d-flex justify-content-between w-100">
            <div>{{ element.table_name }}</div>
          </div>
        </div>
      </template>
    </draggable>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Vazgeç</el-button>
        <el-button type="primary" @click="saveSort()"> Kaydet </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import draggable from "vuedraggable";
import { ElNotification } from "element-plus";
export default {
  props: ["visible", "masa_sira_bolge"],
  data() {
    return {
      dialogVisible: false,
      duzenleVisible: false,
      masalar: [],
      record_state: 0,
      update_state: 0,
      edit_data: null,
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val == true) this.getMasalar();
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
      for (const [k, v] of Object.entries(this.masalar)) {
        v.sort_no = k;
      }
    },
    duzenle(data) {
      this.edit_data = data;
      this.duzenleVisible = true;
    },
    newData(data) {
      if (data == "delete") {
        console.log(
          "içerde",
          this.masalar[
            this.masalar.findIndex((e, index) => {
              return e == this.edit_data ? index : "";
            })
          ]
        );
        delete this.masalar[
          this.masalar.findIndex((e, index) => {
            return e == this.edit_data ? index : "";
          })
        ];
        return;
      } else {
        this.masalar.find((e) => {
          if (e.id == data.id) {
            e = data;
          }
        });
      }
    },
    getMasalar() {
      const params = {
        limit: 100,
        page: 1,
        filters: {
          zone_id: {
            type: 1,
            guiType: "select",
            filter: [this.masa_sira_bolge],
          },
        },
        sorts: { sort_no: true },
      };
      this.$services.list("masa", params).then((res) => {
        this.masalar = res.data.data.records;

        this.load_state += 1;
      });
    },
    saveSort() {
      for (const v of Object.values(this.masalar)) {
        this.record_state += 1;
        let change = {
          sort_no: v.sort_no,
        };
        this.$services.update("masa", v.id, change).then((res) => {
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
  },
};
</script>

<style></style>
