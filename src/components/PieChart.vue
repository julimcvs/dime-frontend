<template>
  <div ref="chartContainer" style="width: 100%; height: 500px;"></div>
</template>
<script>
export default {
  props: {
    chartData: {
      type: Object,
      default: () => ({items: [], data: []})
    },
    sallary: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: {},
    }
  },

  async mounted() {
    await this.renderChart();
  },

  methods: {
    async renderChart() {
      const echarts = await import('echarts');
      const chartContainer = this.$refs.chartContainer;
      if (chartContainer) {
        this.chart = markRaw(echarts.init(chartContainer));
        const data = this.chartData.data.map((data, index) => {
          return {
            name: this.chartData.items[index],
            value: data,
            sallary: this.sallary
          }
        });
        const option = {
          title: {
            textStyle: {
              color: '#ffffff',
            },
            text: 'Expenses by Category',
            subtext: 'Last 30 days',
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return `${params.marker} ${params.data.name}:
              R$ ${parseFloat(params.value).toFixed(2)}
              <br> ${(params.value / params.data.sallary * 100).toFixed(2)}%
               of your sallary`;
            }
          },
          legend: {
            orient: 'vertical',
            bottom: 'bottom',
            textStyle: {
              color: '#ffffff',
            },
          },
          series: [{
            name: 'Expenses',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 7,
            },
            label: {
              show: false,
              position: 'center',
              fontSize: 10,
              color: '#ffffff',
              formatter: function (params) {
                return `${params.data.name}:\n\n${(params.value / params.data.sallary * 100)
                  .toFixed(2)}%\n\n of your sallary`;
              }
            },
            labelLine: {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: 'bold'
              }
            },
            data,
          }],
        }
        this.chart.setOption(option);
      }
    },
  }
}
</script>
<style>

</style>
