<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'

const options = {
  color: ['#00f2f1'],
  animation: false,
  tooltip: {
    position: 'top',
    formatter: function (params) {
      return (
        params.marker +
        (params.dataIndex + 1) +
        '#' +
        '<br>' +
        '温度' +
        ' : ' +
        params.value[2] +
        '℃'
      )
    }
  },
  grid: {
    left: '0%',
    top: '0%',
    right: '0%',
    bottom: '0%',
    containLabel: false
  },
  xAxis: {
    show: false,
    type: 'category',
    data: ['1', '6']
  },
  yAxis: {
    type: 'category',
    data: ['1', '2'],
    show: false
  },
  visualMap: {
    show: false,
    calculable: true,
    left: '10%',
    top: '2%'
  },
  series: [
    {
      name: 'heatmap',
      type: 'heatmap',
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

onMounted(() => {
  const PackChartcontainer1 = echarts.init(document.getElementById('PackChartcontainer1'))
  PackChartcontainer1.setOption(options)
  window.addEventListener('resize', function () {
    PackChartcontainer1.resize()
  })
})
</script>

<template>
  <div>
    <h2>电池仓1</h2>
    <div class="chart" id="PackChartcontainer1"></div>
    <div class="panel-footer"></div>
  </div>
</template>
<style></style>
