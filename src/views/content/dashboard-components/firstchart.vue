<template>
  <div class="row justify-content-center">
    <div class="col-12 col-sm-6 col-md-4 mb-2 mb-md-0">
      <el-card>
        <span> <i class="bi bi-wallet2 fs-5"></i> Günlük Kazanç</span>
        <barChart color="var(--bs-success)" variable="winn" :gun_sonu="gun_sonu"></barChart>
      </el-card>
    </div>
    <div class="col-12 col-sm-6 col-md-4 mb-2 mb-md-0">
      <el-card>
        <span> <i class="bi bi-people fs-5"></i> Günlük Misafir</span>
        <barChart color="var(--bs-blue)" variable="visitor" :gun_sonu="gun_sonu"></barChart>
      </el-card>
    </div>
    <div class="col-12 col-sm-6 col-md-4">
      <el-card>
        <span> <i class="bi bi-arrow-down-up fs-5"></i> Günlük Gider</span>
        <barChart color="var(--bs-danger)" variable="expense" :gun_sonu="gun_sonu"></barChart>
      </el-card>
    </div>
  </div>
</template>

<script>
import barChart from "@/views/content/dashboard-components/bar-chart";
export default {
  props: ["gun_sonu"],
  components: {
    barChart,
  },
};
</script>

<style></style>
