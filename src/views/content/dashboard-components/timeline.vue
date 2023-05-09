<template>
  <el-card>
    <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
  </el-card>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
export default {
  props: ["gun_sonu"],
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [
        {
          name: "Masa siparişi",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: "Qr Sipariş",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: "Entegrasyon sipariş",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: "Paket servis",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: "Gel al servis",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              total: {
                enabled: true,
                offsetX: 0,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                },
              },
            },
          },
        },
        stroke: {
          width: 1,
          colors: ["#fff"],
        },
        title: {
          text: "Sipariş tipine göre",
        },
        xaxis: {
          categories: [
            "Ocak",
            "Şubat",
            "Mart",
            "Nisan",
            "Mayıs",
            "Haziran",
            "Temmuz",
            "Ağustos",
            "Eylül",
            "Ekim",
            "Kasım",
            "Aralık",
          ],
          labels: {
            formatter: function (val) {
              return val + "";
            },
          },
        },
        yaxis: {
          title: {
            text: undefined,
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "";
            },
          },
        },
        fill: {
          opacity: 1,
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40,
        },
      },
    };
  },
  mounted() {},
  watch: {
    gun_sonu() {
      this.setData();
    },
  },
  methods: {
    setData() {
      for (const val of Object.values(this.gun_sonu)) {
        this.series[0].data[parseInt(val.add_date.split("-")[1]) - 1] += val.table_order == null ? 0 : val.table_order;
        this.series[1].data[parseInt(val.add_date.split("-")[1]) - 1] += val.qr_order == null ? 0 : val.qr_order;
        this.series[3].data[parseInt(val.add_date.split("-")[1]) - 1] += val.package_order == null ? 0 : val.package_order;
        this.series[4].data[parseInt(val.add_date.split("-")[1]) - 1] += val.get_away_order == null ? 0 : val.get_away_order;
      }
      console.log(this.gun_sonu, this.series);
    },
  },
};
</script>

<style></style>
