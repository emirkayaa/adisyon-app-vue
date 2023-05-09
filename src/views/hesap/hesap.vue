<template>
  <div>
    <el-card class="mb-4">
      <div class="d-flex">
        <h2 class=""><i class="text-primary bi bi-file-earmark-text"></i> Hesap</h2>
      </div>
    </el-card>

    <div class="row" v-yakinda>
      <div class="col-12 col-md-6">
        <el-card>
          <div class="d-flex flex-column">
            <div class="d-flex justify-content-between">
              <label for="" class="m-0">Üyelik Tarihiniz:</label>
              <span> 01.01.2023</span>
            </div>
            <el-divider class="my-3"></el-divider>
            <div class="d-flex justify-content-between">
              <label for="" class="m-0">Kalan Gün:</label>
              <span> 25 Gün</span>
            </div>
            <el-divider class="my-3"></el-divider>
            <div class="d-flex justify-content-between">
              <label for="" class="m-0">Üyelik Bitişi:</label>
              <span> 01.02.2023</span>
            </div>
            <el-divider class="my-3"></el-divider>
            <div class="d-flex align-items-center justify-content-between">
              <div class="me-2">
                <el-progress color="red" type="circle" :percentage="25" />
              </div>
              <el-button type="" size="large">Üyelik Satın Al</el-button>
            </div>
          </div>
        </el-card>
      </div>
      <div class="col-12 col-md-6">
        <el-card>
          <tableVue table_name="users" :column_settings="{}"></tableVue>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import tableVue from "@/angaryos/table";
export default {
  components: {
    tableVue,
  },
};
</script>

<style></style>
