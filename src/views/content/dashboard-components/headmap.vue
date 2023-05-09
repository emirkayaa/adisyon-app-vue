<template>
  <div class="row justify-content-center">
    <div class="col-12 d-none d-md-block col-md-8">
      <el-card>
        <apexchart
          type="heatmap"
          height="350"
          style="max-width: 800; width: 100%"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </el-card>
    </div>
    <div class="col-12 col-md-4">
      <el-card>
        <div class="d-flex flex-column">
          <div class="d-flex align-items-center justify-content-between">
            <span>En Yoğun Masa:</span>
            <span class="fs-6">MASA-101</span>
          </div>
          <el-divider></el-divider>
          <div class="d-flex align-items-center justify-content-between">
            <span>En Yoğun Saat:</span>
            <span class="fs-6">11:00</span>
          </div>
          <el-divider></el-divider>
          <div class="d-flex align-items-center justify-content-between">
            <span>En Yoğun Gün:</span>
            <span class="fs-6">20 Aralık 2020</span>
          </div>
          <el-divider></el-divider>
          <div class="d-flex align-items-center justify-content-between">
            <span>En Yoğun Çalışan:</span>
            <span class="fs-6">MASA-101</span>
          </div>
          <el-divider></el-divider>
          <div class="d-flex align-items-center justify-content-between">
            <span>Favori Ürün:</span>
            <span class="fs-6">Çay</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
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
          name: "Pazartesi",
          data: this.generateData(20, {
            min: 0,
            max: 1000,
          }),
        },
        {
          name: "Salı",
          data: this.generateData(20, {
            min: 0,
            max: 1000,
          }),
        },
        {
          name: "Çarşamba",
          data: this.generateData(20, {
            min: 0,
            max: 1000,
          }),
        },
        {
          name: "Perşembe",
          data: this.generateData(20, {
            min: 0,
            max: 1000,
          }),
        },
        {
          name: "Cuma",
          data: this.generateData(20, {
            min: 0,
            max: 1000,
          }),
        },
        {
          name: "Cumartesi",
          data: this.generateData(20, {
            min: 0,
            max: 1000,
          }),
        },
        {
          name: "Pazar",
          data: this.generateData(20, {
            min: 0,
            max: 1000,
          }),
        },
      ],
      chartOptions: {
        mode: "dark",
        chart: {
          height: 350,
          width: 745,
          type: "heatmap",
          background: "transparent",
        },
        grid: {
          show: false,
        },
        plotOptions: {
          heatmap: {
            shadeIntensity: 0,
            radius: 10,

            useFillColorAsStroke: false,
            colorScale: {
              ranges: [
                {
                  from: 0,
                  to: 50,
                  name: "Az",
                  color: "#FFEC19",
                },
                {
                  from: 50,
                  to: 250,
                  name: "Orta",
                  color: "#FFC100",
                },
                {
                  from: 250,
                  to: 500,
                  name: "Orta Üstü",
                  color: "#FF9800",
                },
                {
                  from: 500,
                  to: 1000,
                  name: "Fazla",
                  color: "#FF5607",
                },
                {
                  from: 1000,
                  to: 20000,
                  name: "Çok Fazla",
                  color: "#F6412D",
                },
              ],
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        labels: [
          "00:00",
          "01:00",
          "02:00",
          "03:00",
          "04:00",
          "05:00",
          "06:00",
          "07:00",
          "08:00",
          "09:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
        ],

        stroke: {
          width: 37,
        },
      },
    };
  },
  mounted() {},
  methods: {
    generateData(sayi, { min, max }) {
      let numbers = [];
      for (let index = 0; index < sayi; index++) {
        let generate = Number(Math.random() * (max - min) + min).toFixed(0);
        numbers.push(generate);
      }
      return numbers;
    },
  },
};
</script>

<style>
rect {
  stroke: var(--foreground-color);
}
tspan {
  fill: var(--primary-color);
}
.apexcharts-legend-text {
  color: var(--primary-color) !important;
}
.apexcharts-legend-series {
  align-items: baseline !important;
}
.apexcharts-menu {
  background: var(--foreground-color) !important;
}
</style>
