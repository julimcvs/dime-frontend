<template>
  <div id="line-chart" style="width: 100%; height: 400px;"></div>
</template>
<script>
import {markRaw} from 'vue';

export default {
  props: {
    chartData: {
      type: Array,
    },
    markLine: {
      type: Number,
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
      const chartContainer = document.getElementById('line-chart');

      if (chartContainer) {
        this.chart = markRaw(echarts.init(chartContainer));

        const transformedData = {};
        this.chartData.forEach(item => {
          const category = item.category;
          const month = item.month - 1;
          const total = parseFloat(item.total);

          if (!transformedData[category]) {
            transformedData[category] = new Array(12).fill(0);
          }

          transformedData[category][month] = total;
        });

        const series = Object.keys(transformedData).map(category => {
          return {
            name: category,
            type: 'line',
            smooth: true,
            data: transformedData[category]
          }
        });

        const option = {
          title: {
            textStyle: {
              color: '#ffffff',
            },
            text: 'Expenses by Category',
            subtext: 'Last year',
            left: 'center',
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              return `${params[0].name}
                <br/>${params.map(param => `${param.marker} ${param.seriesName}:
                 R$ ${parseFloat(param.value).toFixed(2)}`).join('<br />')}`;
            },
          },
          legend: {
            bottom: 'bottom',
            textStyle: {
              color: '#ffffff',
            },
          },
          xAxis: {
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisLabel: {
              color: '#ffffff',
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: 'R$ {value}'
            }
          },
          series,
        }

        this.chart.setOption(option);
      }
    }
  }
}
</script>
<style>

</style>
