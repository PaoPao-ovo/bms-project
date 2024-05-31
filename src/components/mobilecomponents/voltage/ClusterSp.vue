<script setup>
import { usePackVoltageStore } from '@/stores/modules/packvoltage'
import { xAxisData } from '@/utils/defaultdata'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
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

const UpdateChart = async () => {
  if (Chart !== null) {
    if (+clusterStore.clusterMode !== 5) {
      if (clusterStore.packVoltageChart != null) {
        clusterStore.packVoltageChart.off('click')
      }
      const promise = await clusterStore.setClusterSp() // 获取数据
      if (promise === null) {
        return false
      } else {
        const option = {
          series: [
            {
              data: clusterStore.clusterSpVoltage.map((item) => item / 1000)
            }
          ]
        }
        Chart.setOption(option)
        return true
      }
    } else {
      clusterStore.packVoltageChart.on('click', 'series.line', (param) => {
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
      return true
    }
  }
}
onMounted(() => {
  const ClusterVoltageSpChart = echarts.init(document.getElementById('ClusterVoltageSp'))
  Chart = ClusterVoltageSpChart
  ClusterVoltageSpChart.setOption(options)
  window.addEventListener('resize', function () {
    ClusterVoltageSpChart.resize()
  })
  UpdateChart().then()
})

const { bmuId } = storeToRefs(clusterStore)

watch(bmuId, () => {
  UpdateChart().then()
})

// 电压更新定时器初始化
let VoltageTimer = setInterval(async function callback() {
  const res = await UpdateChart()
  if (res === false) {
    clearInterval(VoltageTimer)
    let MaxAttempts = 3
    const retryResult = new Promise(function (resolve) {
      const retryTimer = setInterval(async () => {
        const res = await clusterStore.setClusterSp()
        MaxAttempts--
        if (res !== null) {
          clearInterval(retryTimer)
          resolve(true)
        } else if (MaxAttempts === 0) {
          clearInterval(retryTimer)
          resolve(false)
        }
      }, 1000)
    })
    const retryResultRes = await retryResult
    if (retryResultRes === false) {
      ElMessage.error('簇级电压数据获取数据失败，请刷新页面')
    } else {
      ElMessage.success('温簇级电压数据恢复成功')
      VoltageTimer = setInterval(callback, 1000 * 60 * 3)
    }

  }
}, 1000 * 60 * 3)

const TimerId = ref(VoltageTimer)

const { clusterMode } = storeToRefs(clusterStore)

const ModeChange = (newVal) => {
  clusterStore.clusterMode = newVal
  if (+newVal === 5) {
    clearInterval(TimerId.value)
    TimerId.value = null
    clusterStore.clusterSpVoltage = []
    UpdateChart().then()
  } else {
    if (TimerId.value === null) {
      UpdateChart().then()
      TimerId.value = setInterval(async function callback() {
        const res = await UpdateChart()
        if (res === false) {
          clearInterval(TimerId.value)
          let MaxAttempts = 3
          const retryResult = new Promise(function (resolve) {
            const retryTimer = setInterval(async () => {
              const res = await clusterStore.setClusterSp()
              MaxAttempts--
              if (res !== null) {
                clearInterval(retryTimer)
                resolve(true)
              } else if (MaxAttempts === 0) {
                clearInterval(retryTimer)
                resolve(false)
              }
            }, 1000)
          })
          const retryResultRes = await retryResult
          if (retryResultRes === false) {
            ElMessage.error('簇级电压数据获取数据失败，请刷新页面')
          } else {
            ElMessage.success('温簇级电压数据恢复成功')
            TimerId.value = setInterval(callback, 1000 * 60 * 3)
          }

        }
      }, 1000 * 60 * 3)
    } else {
      UpdateChart().then()
    }
  }
}
</script>


<template>
  <div class="clustercontainer">
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
      <div class="chart" id="ClusterVoltageSp1"></div>
      <div class="panel-footer"></div>
    </div>
  </div>
</template>

<style scoped>
.clustercontainer {
  position: relative;
}

.selectbox {
  position: absolute;
  right: 0.25rem;
  top: 0.55rem;
  z-index: 1000;
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
