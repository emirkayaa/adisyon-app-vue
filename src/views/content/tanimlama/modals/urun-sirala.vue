<template>
  <el-dialog v-model="dialogVisible" title="Ürün Sırala" draggable width="418px" align-center>
    <label class="mb-3">*Aktif kategorideki ürünler gelmektedir.</label>
    <draggable
      id="bolge-changes-input"
      class="list-group overflow-auto h-100"
      style="min-height: 50px; max-height: 400px"
      :list="urunler"
      group="people"
      @change="siraDegisti"
      :move="checkMove"
      itemKey="name"
    >
      <template #item="{ element }">
        <div class="mb-1 card p-2" style="cursor: move">
          <div class="d-flex justify-content-between w-100">
            <div>{{ element.product_name }}</div>
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
</template>

<script>
import draggable from "vuedraggable";
import { ElNotification } from "element-plus";
export default {
  props: ["visible", "ktg_id"],
  data() {
    return {
      dialogVisible: false,
      duzenleVisible: false,
      urunler: [],
      record_state: 0,
      update_state: 0,
      edit_data: null,
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val == true) this.getUrunleri();
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
    update_state(v) {
      if (this.record_state == v) {
        ElNotification({
          title: "Başarılı",
          message: "Ürünleriniz başarıyla kaydedildi.",
          type: "success",
        });
        this.dialogVisible = false;
        this.$emit("update:visible", false);
      }
    },
  },
  methods: {
    siraDegisti() {
      for (const [k, v] of Object.entries(this.urunler)) {
        v.sort_no = k;
      }
    },
    getUrunleri() {
      const params = {
        limit: 100,
        page: 1,
        filters: {
          product_category_id: {
            type: 1,
            guiType: "multiselect",
            filter: [this.ktg_id],
          },
        },
        sorts: { sort_no: true },
      };
      this.$services.list("product", params).then((res) => {
        this.urunler = res.data.data.records;

        this.load_state += 1;
      });
    },
    saveSort() {
      for (const v of Object.values(this.urunler)) {
        if (v?.deleted == true) continue;
        this.record_state += 1;

        let params = {
          sort_no: v.sort_no,
          image_old: [],
        };
        this.$services.edit("product", v.id).then((res) => {
          params.image_old = res.data.data.record.image;
          this.$services.update("product", v.id, params).then((res) => {
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
