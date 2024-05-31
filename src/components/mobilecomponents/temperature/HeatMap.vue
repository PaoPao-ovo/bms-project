<script setup>
import * as echarts from 'echarts'
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { usePackTemperatureStore } from '@/stores/modules/packtemperature'
import { TempGetService } from '@/api/bmu'
import { UpdateHeatMapChart } from '@/utils/defaultdata'
import { RetryFun1 } from '@/utils/retry'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'

// 电池包模块
const packtempStore = usePackTemperatureStore()

// 热力图基础配置
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
    data: ['1', '6', '11', '16', '21', '26', '31', '36', '41', '46']
  },
  yAxis: {
    type: 'category',
    data: ['1', '2', '3', '4', '5'],
    show: false
  },
  visualMap: {
    show: false,
    min: 5,
    max: 65,
    calculable: true,
    orient: 'horizontal',
    left: '10%',
    top: '2%',
    inRange: {
      color: [
        '#313695',
        '#4575b4',
        '#74add1',
        '#abd9e9',
        '#e0f3f8',
        '#ffffbf',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026'
      ]
    }
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

// 表格初始化
onMounted(async () => {
  const HeatMap = echarts.init(document.getElementById('HeatMap'))
  packtempStore.HeatMapChart = HeatMap
  HeatMap.setOption(options)
  window.addEventListener('resize', function () {
    HeatMap.resize()
  })

  const res = await TempGetService(packtempStore.bmuId)
  const data = res.data.temperature
  UpdateHeatMapChart(data, packtempStore.HeatMapChart)
})

const { bmuId } = storeToRefs(packtempStore)

watch(bmuId, async () => {
  const res = await TempGetService(packtempStore.bmuId)
  const data = res.data.temperature
  UpdateHeatMapChart(data, packtempStore.HeatMapChart)
})

// 定时更新初始化
packtempStore.HeatMapTimerId = setInterval(async function callback() {
  try {
    const res = await TempGetService(packtempStore.bmuId)
    const data = res.data.temperature
    UpdateHeatMapChart(data, packtempStore.HeatMapChart)
  } catch (error) {
    const retryresult = await RetryFun1(
      TempGetService,
      1000,
      3,
      packtempStore.HeatMapTimerId,
      packtempStore.bmuId
    )
    if (retryresult === null) {
      ElMessage.error('获取温度数据失败,请刷新页面')
    } else {
      ElMessage.success('温度数据恢复成功')
      packtempStore.HeatMapTimerId = setInterval(callback, 1000 * 60 * 3)
    }
  }
}, 1000 * 60 * 3)

// 组件销毁时清除定时器
onBeforeUnmount(() => {
  clearInterval(packtempStore.HeatMapTimerId)
})
</script>


<template>
  <div>
    <h2>热力图</h2>
    <div class="chart" id="HeatMap1"></div>
    <div class="panel-footer"></div>
  </div>
</template>

<style scoped>
.chart {
  height: 200px;
  width: 100%;
}

h2 {
  height: 0.6rem;
  color: #fff;
  line-height: 0.6rem;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 400;
}
</style>
