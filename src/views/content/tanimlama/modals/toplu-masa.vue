<template>
  <el-dialog v-model="dialogVisible" title="Toplu Masa Ekleme" draggable width="418px" align-center>
    <span>Masa İsmi:</span>
    <el-input
      class="mb-2"
      v-model="params.table_name"
      size="large"
      placeholder="Masa ismi"
      id="toplu-masa-ismi-input"
    ></el-input>
    <span>Bölge:</span>
    <inputs
      :column="create_data.zone_id"
      v-model="params.zone_id"
      table_name="masa"
      :column_settings="{ select: ['edit', 'create'] }"
    ></inputs>
    <span class="mt-2">Kaç Adet:</span><br />
    <el-input-number v-model="kac_adet" min="1" id="toplu-masa-sayisi-input"></el-input-number>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Vazgeç</el-button>
        <el-button type="primary" @click="setData()" id="toplu-masa-ekle-buton"> Kaydet </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import inputs from "../../../../angaryos/inputs.vue";
import { ElNotification } from "element-plus";
export default {
  components: { inputs },
  props: ["visible"],
  data() {
    return {
      dialogVisible: false,
      create_data: {},
      params: {
        table_name: "",
        zone_id: null,
        table_type_id: null,
      },
      kac_adet: 0,
      record_state: 0,
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val == true) {
        this.getCreate();
      }
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
    record_state(v) {
      if (v == this.kac_adet) {
        ElNotification({
          title: "Başarılı",
          message: "Masalarınız başarıyla kaydedildi.",
          type: "success",
        });
        this.dialogVisible = false;
        this.$emit("update:visible", false);
      }
    },
  },
  methods: {
    getCreate() {
      this.$services.create("masa").then((res) => {
        this.create_data = res.data.data.column_set.column_arrays[0].columns;
      });
    },
    setData() {
      for (let index = 1; index <= this.kac_adet; index++) {
        const params = {
          table_name: this.params.table_name + " " + index,
          zone_id: this.params.zone_id,
        };
        this.$services.add("masa", params).then((res) => {
          if (res.data.data.message != "success") {
            ElNotification({
              title: "Hata",
              message: "Beklenmedik bir hata ile karşılaşıldı",
              type: "error",
            });
          } else {
            this.record_state += 1;
          }
        });
      }
    },
  },
};
</script>

<style></style>
