<script setup>
import { usePackVoltageStore } from '@/stores/modules/packvoltage'
import { xAxisData } from '@/utils/defaultdata'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import * as echarts from 'echarts'

const clusterStore = usePackVoltageStore()

const options = {
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
        ' V' +
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
    name: '电压(V)',
    min: 9,
    max: 16,
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
      name: '电压',
      type: 'scatter',
      symbolSize: 6
    }
  ]
}

let Chart = null

onMounted(() => {
  const ClusterVoltageSpChart = echarts.init(document.getElementById('ClusterVoltageSp'))
  Chart = ClusterVoltageSpChart
  ClusterVoltageSpChart.setOption(options)
  window.addEventListener('resize', function () {
    ClusterVoltageSpChart.resize()
  })
})

const UpdateChart = async () => {
  if (Chart !== null) {
    if (+clusterStore.clusterMode !== 5) {
      clusterStore.packVoltageChart.off('click')
      await clusterStore.setClusterSp() // 获取数据
      const option = {
        series: [
          {
            data: clusterStore.clusterSpVoltage.map((item) => item / 1000)
          }
        ]
      }
      Chart.setOption(option)
    } else {
      clusterStore.packVoltageChart.on('click', (param) => {
        const temparr = []
        const dataIndex = param.dataIndex
        const series = clusterStore.packVoltageChart.getOption().series
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
      const temparr = []
      const series = clusterStore.packVoltageChart.getOption().series
      for (let i = 0; i < series.length; i++) {
        temparr.push(series[i].data[49])
      }
      const option = {
        series: [
          {
            data: temparr
          }
        ]
      }
      Chart.setOption(option)
    }
  }
}

// 电压更新定时器初始化
const VoltageTimer = setInterval(() => {
  UpdateChart()
}, 1000)

const TimerId = ref(VoltageTimer)

const { clusterMode } = storeToRefs(clusterStore)

const ModeChange = (newVal) => {
  clusterStore.clusterMode = newVal
  if (+newVal === 5) {
    clearInterval(TimerId.value)
    TimerId.value = null
    clusterStore.clusterSpVoltage = []
    UpdateChart()
  } else {
    if (TimerId.value === null) {
      TimerId.value = setInterval(() => {
        UpdateChart()
      }, 1000)
    }
  }
}
</script>

<template>
  <div class="selectbox">
    <el-radio-group v-model="clusterMode" @change="ModeChange">
      <el-radio value="1">A簇</el-radio>
      <el-radio value="2">B簇</el-radio>
      <el-radio value="3">C簇</el-radio>
      <el-radio value="4">D簇</el-radio>
      <el-radio value="5">历史</el-radio>
    </el-radio-group>
  </div>
  <div>
    <h2>簇级电压散点图</h2>
    <div class="chart" id="ClusterVoltageSp"></div>
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
