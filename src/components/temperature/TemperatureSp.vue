<script setup>
import { xAxisData } from '@/utils/defaultdata'
import * as echarts from 'echarts'
import { onMounted, watch } from 'vue'
import { usePackTemperatureStore } from '@/stores/modules/packtemperature'
import { storeToRefs } from 'pinia'

// 电池包模块
const packtempStore = usePackTemperatureStore()

// 表格的属性
const option = {
  color: ['#00f2f1'],
  animation: false,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function (params) {
      return (
        params[0].dataIndex +
        1 +
        '号' +
        '<br/>' +
        params[0].marker +
        params[0].seriesName +
        ' ' +
        '<strong>' +
        params[0].value +
        ' ℃' +
        '<strong/>'
      )
    }
  },
  grid: {
    left: '0%',
    top: '40px',
    right: '0%',
    bottom: '4%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: xAxisData,
    axisTick: {
      show: false // 去除刻度线
    },
    axisLine: {
      show: false // 去除轴线
    }
  },
  yAxis: {
    type: 'value',
    name: '温度(℃)',
    min: -10,
    max: 60,
    splitLine: {
      lineStyle: {
        color: '#012f4a'
      }
    },
    nameLocation: 'end',
    nameTextStyle: {
      fontStyle: 'italic',
      color: 'white',
      align: 'left'
    }
  },
  series: [
    {
      name: '温度',
      type: 'scatter',
      symbolSize: 6
    }
  ]
}

let Chart = null

// 初始化表格
onMounted(() => {
  const TempertureSpChart = echarts.init(document.getElementById('TempertureSp'))
  Chart = TempertureSpChart
  TempertureSpChart.setOption(option)
  window.addEventListener('resize', function () {
    TempertureSpChart.resize()
  })
})

// 解构温度散点图温度数据
const { TemperatureSpData } = storeToRefs(packtempStore)

// 监听表格数据的变化,并更新数据
watch(
  TemperatureSpData,
  (newValue) => {
    const option = {
      series: [{ data: newValue }]
    }
    Chart.setOption(option)
  },
  {
    deep: true
  }
)
</script>

<template>
  <div>
    <h2>单体温度散点图</h2>
    <div class="chart" id="TempertureSp"></div>
    <div class="panel-footer"></div>
  </div>
</template>
