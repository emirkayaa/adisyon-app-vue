<template>
  <div id="chart" class="">
    <apexchart type="bar" height="150" width="100%" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import moment from "moment";
export default {
  props: ["color", "gun_sonu", "variable"],
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [
        {
          name: "",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          background: "transparent",
          brush: {
            enabled: false,
            target: undefined,
            autoScaleYaxis: false,
          },
          toolbar: {
            show: false,
          },
          sparkline: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          type: "",
        },
        colors: [this.color],
        grid: {
          show: true,
          borderColor: "rgba(125,125,125,0.3)",
          strokeDashArray: 0,
          position: "back",
          column: {
            opacity: 0.01,
          },
        },
        stroke: {
          width: 3,
          curve: "smooth",
        },
        xaxis: {
          labels: {
            show: false,
          },
          categories: [],
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
      },
    };
  },
  watch: {
    gun_sonu() {
      for (const val of Object.values(this.gun_sonu)) {
        this.series[0].data.push(val[this.variable]);
        this.chartOptions.xaxis.categories.push(moment(val.created_at).format("d"));
      }
    },
  },
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
  stroke-width: 5;
}
</style>
