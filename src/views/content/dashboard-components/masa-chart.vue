<template>
  <el-card>
    <apexchart type="treemap" height="350" width="100%" :options="chartOptions" :series="series"></apexchart>
  </el-card>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [
        {
          data: [
            {
              x: "Bölge 1",
              y: 218,
            },
            {
              x: "Bölge 2",
              y: 149,
            },
            {
              x: "Bölge 3",
              y: 184,
            },
            {
              x: "Bölge 4",
              y: 55,
            },
            {
              x: "Bölge 5",
              y: 84,
            },
            {
              x: "Bölge 6",
              y: 31,
            },
          ],
        },
      ],
      chartOptions: {
        legend: {
          show: false,
        },
        chart: {
          height: 350,
          type: "treemap",
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          labels: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
      },
    };
  },
};
</script>

<style></style>
