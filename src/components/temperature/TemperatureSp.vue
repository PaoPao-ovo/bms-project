<script setup>
import { xAxisData } from '@/utils/defaultdata'
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { TempGetService } from '@/api/bmu'
import { usePackTemperatureStore } from '@/stores/modules/packtemperature'

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

// 初始化表格
onMounted(() => {
  const TempertureSpChart = echarts.init(document.getElementById('TempertureSp'))
  Chart = TempertureSpChart
  TempertureSpChart.setOption(option)
  window.addEventListener('resize', function () {
    TempertureSpChart.resize()
  })
})

// 图表更新函数
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

// 定时更新初始化
const Timer = setInterval(async () => {
  try {
    const res = await TempGetService(packTemperatureStore.bmuId)
    const data = res.data.temperature
    UpdateChart(data)
  } catch (error) {
    const data = []
    UpdateChart(data)
  }
}, 1000)

// 定时器ID
const TimerId = ref(Timer)

// 当前选择的模式（默认为实时状态）
const temperatureMode = ref('1')

// 模式切换函数(定时器启停&图表点击事件监听)
const ModeChange = () => {
  if (temperatureMode.value === '1') {
    clearInterval(TimerId.value)
    TimerId.value = setInterval(async () => {
      try {
        const res = await TempGetService(packTemperatureStore.bmuId)
        const data = res.data.temperature
        UpdateChart(data)
      } catch (error) {
        const data = []
        UpdateChart(data)
      }
    }, 1000)
  } else {
    clearInterval(TimerId.value)
    packTemperatureStore.HistoryTemperatureChart.on('click', (param) => {
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
    })
  }
}
</script>

<template>
  <div class="selectbox">
    <el-radio-group v-model="temperatureMode" @change="ModeChange">
      <el-radio value="1">实时</el-radio>
      <el-radio value="2">历史</el-radio>
    </el-radio-group>
  </div>
  <div>
    <h2>单体温度散点图</h2>
    <div class="chart" id="TempertureSp"></div>
    <div class="panel-footer"></div>
  </div>
</template>

<style scoped>
.selectbox {
  position: absolute;
  right: 0.25rem;
  top: 0.55rem;
  z-index: 1000;
}
</style>
