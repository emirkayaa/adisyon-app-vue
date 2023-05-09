<template>
  <el-dialog v-model="dialogVisible" title="Masa Değiştir - Masa 1" width="40%" align-center>
    <div class="d-flex flex-column justify-content-center align-items-center">
      <el-card class="text-center col-4">
        <div class="d-flex justify-content-between">
          <div class="d-flex flex-column align-items-start">
            <div class="h6 text-primary">{{ masaData.table_name }}</div>
            <label>{{ masaData.user_id }}</label>
          </div>
        </div>
        <div class="h4 my-2">125,00₺</div>
      </el-card>
      <i class="bi bi-arrow-down-up h1 mt-4 mb-2"></i>
    </div>
    <div class="row">
      <template v-for="t in tableData" :key="t">
        <el-card v-if="masaData.zone_id == t.zone_id" class="col-xl-4 col-lg-4 col-md-6 col-sm-12 offset-md-1 mb-4 modal-card" :class="datas.find((x)=>x.id == t.id)?.id == t.id ? 'active-table' : ''" @click="selectTable(t)">
          <div class="d-flex justify-content-between">
            <div class="d-flex flex-column align-items-start">
              <div class="h6 text-primary">{{ t.table_name }}</div>
              <label>{{ t.user_id }}</label>
            </div>
          </div>
          <div class="h4 my-2">66,00₺</div>
        </el-card>
      </template>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">İptal</el-button>
        <el-button type="primary" @click="dialogVisible = false"> Kaydet </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: ["masaBirlestirVisible", "masaData"],
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      datas: [],
    };
  },
  methods: {
    async getTable() {
      const params = {
        page: 1,
        limit: 10000,
        filters: {
          id: {
            type: 2,
            guiType: "numeric",
            filter: [this.masaData.id],
          },
        },
        sorts: {},
      };
      await this.$services.list("masa", params).then((res) => {
        this.tableData = res.data.data.records;
      });
    },
    selectTable(t) {
        this.datas.push({
            table_name: t?.table_name,
            user_id: t?.user_id,
            id: t?.id,
        })
        
        console.log("asd",this.datas.find((x)=>x.id == t.id)?.id)
        //TODO Silme yapılacak
    },
  },
  watch: {
    masaBirlestirVisible() {
      this.dialogVisible = this.masaBirlestirVisible;
      if (this.dialogVisible) this.getTable();
    },
    dialogVisible() {
      this.$emit("update:masaBirlestirVisible", this.dialogVisible);
    },
  },
};
</script>

<style>
.active-table {
    border: 1px solid red;
    transform: scale(1.05);
}
</style>
