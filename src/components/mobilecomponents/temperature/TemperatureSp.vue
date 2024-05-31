<script setup>
import { xAxisData } from '@/utils/defaultdata'
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'
import { TempGetService } from '@/api/bmu'
import { usePackTemperatureStore } from '@/stores/modules/packtemperature'
import { storeToRefs } from 'pinia'
import { UpdateHeatMapChart, UpdateSystemChart, toFixed } from '@/utils/defaultdata'
import { RetryFun1, RetryFun } from '@/utils/retry'
import { ElMessage } from 'element-plus'

// 温度数据仓库
const packTemperatureStore = usePackTemperatureStore()


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

// 图表更新函数(散点图)
const UpdateChart = (data) => {
  const option = {
    series: [
      {
        data: data
      }
    ]
  }
  Chart.setOption(option)
}

// 初始化表格
onMounted(async () => {
  const TempertureSpChart = echarts.init(document.getElementById('TempertureSp'))
  Chart = TempertureSpChart
  TempertureSpChart.setOption(option)
  window.addEventListener('resize', function () {
    TempertureSpChart.resize()
  })

  const res = await TempGetService(packTemperatureStore.bmuId)
  const data = res.data.temperature
  UpdateChart(data)
})

const { bmuId } = storeToRefs(packTemperatureStore)
watch(bmuId, async () => {
  const res = await TempGetService(packTemperatureStore.bmuId)
  const data = res.data.temperature
  UpdateChart(data)
})


// 定时更新初始化
let Timer = setInterval(
  async function callback() {
    try {
      const res = await TempGetService(packTemperatureStore.bmuId)
      const data = res.data.temperature
      UpdateChart(data)
    } catch (error) {
      const retryresult = await RetryFun1(
        TempGetService,
        1000,
        3,
        Timer,
        packTemperatureStore.bmuId
      )
      if (retryresult === null) {
        ElMessage.error('获取温度数据失败,请刷新页面')
      } else {
        ElMessage.success('温度数据恢复成功')
        Timer = setInterval(callback, 1000)
      }
      // const data = []
      // UpdateChart(data)
    }
  },
  1000 * 60 * 3
)

// 定时器ID
const TimerId = ref(Timer)

// 当前选择的模式（默认为实时状态）
const { TemperatureChartMode } = storeToRefs(packTemperatureStore)

// 模式切换函数(定时器启停&图表点击事件监听)
const ModeChange = () => {
  if (TemperatureChartMode.value === '1') {
    packTemperatureStore.HistoryTemperatureChart.off('click')
    // 开启定时器
    clearInterval(TimerId.value)
    clearInterval(packTemperatureStore.HeatMapTimerId)
    clearInterval(packTemperatureStore.SystemTemperatureTimerId)
    TimerId.value = setInterval(
      async function callback() {
        try {
          const res = await TempGetService(packTemperatureStore.bmuId)
          const data = res.data.temperature
          UpdateChart(data)
        } catch (error) {
          const retryresult = await RetryFun1(
            TempGetService,
            1000,
            3,
            Timer,
            packTemperatureStore.bmuId
          )
          if (retryresult === null) {
            ElMessage.error('获取温度数据失败,请刷新页面')
          } else {
            ElMessage.success('温度数据恢复成功')
            Timer = setInterval(callback, 1000)
          }
          // const data = []
          // UpdateChart(data)
        }
      },
      1000 * 60 * 3
    )

    packTemperatureStore.HeatMapTimerId = setInterval(async function callback() {
      try {
        const res = await TempGetService(packTemperatureStore.bmuId)
        const data = res.data.temperature
        UpdateHeatMapChart(data, packTemperatureStore.HeatMapChart)
      } catch (error) {
        const retryresult = await RetryFun1(
          TempGetService,
          1000,
          3,
          packTemperatureStore.HeatMapTimerId,
          packTemperatureStore.bmuId
        )
        if (retryresult === null) {
          ElMessage.error('获取温度数据失败,请刷新页面')
        } else {
          ElMessage.success('温度数据恢复成功')
          packTemperatureStore.HeatMapTimerId = setInterval(callback, 1000 * 60 * 3)
        }
      }
    }, 1000 * 60 * 3)

    packTemperatureStore.SystemTemperatureTimerId = setInterval(async function callback() {
      try {
        await packTemperatureStore.setTemperatureData()
      } catch (error) {
        const retryresult = await RetryFun(packTemperatureStore.setTemperatureData, 1000, 3, packTemperatureStore.SystemTemperatureTimerId)
        if (retryresult === null) {
          ElMessage('请求失败,请刷新')
        } else {
          ElMessage.success('恢复成功')
          packTemperatureStore.SystemTemperatureTimerId = setInterval(callback, 1000 * 60 * 3)
        }
      }
    }, 1000 * 60 * 3)
  } else {
    // 取消定时器
    clearInterval(TimerId.value)
    clearInterval(packTemperatureStore.HeatMapTimerId)
    clearInterval(packTemperatureStore.SystemTemperatureTimerId)
    // 添加点击事件
    packTemperatureStore.HistoryTemperatureChart.on('click', 'series', (param) => {
      const temparr = []
      const dataIndex = param.dataIndex
      const series = packTemperatureStore.HistoryTemperatureChart.getOption().series
      for (let i = 0; i < series.length; i++) {
        temparr.push(series[i].data[dataIndex])
      }
      const option = {
        series: [
          {
            data: temparr
          }
        ]
      }
      Chart.setOption(option)
      UpdateHeatMapChart(temparr, packTemperatureStore.HeatMapChart)
      const ResultArr = UpdateSystemChart(temparr)
      packTemperatureStore.TemperatureTable[0].value1 = toFixed(ResultArr[0]) + ' °C'
      packTemperatureStore.TemperatureTable[0].value2 = toFixed(ResultArr[1]) + ' 号'
      packTemperatureStore.TemperatureTable[1].value1 = toFixed(ResultArr[2]) + ' °C'
      packTemperatureStore.TemperatureTable[1].value2 = toFixed(ResultArr[3]) + ' 号'
      packTemperatureStore.TemperatureTable[2].value1 = toFixed(ResultArr[5]) + ' °C'
      packTemperatureStore.TemperatureTable[2].value2 = toFixed(ResultArr[4]) + ' °C'
    })

    // 初始值配置
    const series = packTemperatureStore.HistoryTemperatureChart.getOption().series
    let temparr = []
    for (let i = 0; i < series.length; i++) {
      temparr.push(series[i].data[series[i].data.length - 1])
    }
    const option = {
      series: [
        {
          data: temparr
        }
      ]
    }
    Chart.setOption(option)
    UpdateHeatMapChart(temparr, packTemperatureStore.HeatMapChart)
    const ResultArr = UpdateSystemChart(temparr)
    packTemperatureStore.TemperatureTable[0].value1 = toFixed(ResultArr[0]) + ' °C'
    packTemperatureStore.TemperatureTable[0].value2 = toFixed(ResultArr[1]) + ' 号'
    packTemperatureStore.TemperatureTable[1].value1 = toFixed(ResultArr[2]) + ' °C'
    packTemperatureStore.TemperatureTable[1].value2 = toFixed(ResultArr[3]) + ' 号'
    packTemperatureStore.TemperatureTable[2].value1 = toFixed(ResultArr[5]) + ' °C'
    packTemperatureStore.TemperatureTable[2].value2 = toFixed(ResultArr[4]) + ' °C'
  }
}
</script>

<template>
  <div class="temperaturespcontainer">
    <div class="selectbox">
      <el-radio-group v-model="TemperatureChartMode" @change="ModeChange">
        <el-radio value="1">实时</el-radio>
        <el-radio value="2">历史</el-radio>
      </el-radio-group>
    </div>
    <h2>单体温度散点图</h2>
    <div class="chart" id="TempertureSp1"></div>
    <div class="panel-footer"></div>
  </div>
</template>

<style scoped>
.temperaturespcontainer {
  position: relative;
}

.selectbox {
  position: absolute;
  right: 0.25rem;
  top: 0.55rem;
  z-index: 1000;
  height: 10px;
}

.chart {
  height: 200px;
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
