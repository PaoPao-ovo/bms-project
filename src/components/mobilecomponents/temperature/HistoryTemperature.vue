<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { TodayDateFormate, SelectDateFormate } from '@/utils/daytime'
import { usePackTemperatureStore } from '@/stores/modules/packtemperature'
import { FormartHistoryTemperature } from '@/utils/defaultdata'
import { RetryFun1 } from '@/utils/retry'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'

const packtempStore = usePackTemperatureStore()

// 图表默认属性
const options = {
  dataZoom: [
    {
      type: 'inside',
      orient: 'horizontal'
    }
  ],
  tooltip: {
    trigger: 'axis',
    triggerOn: 'click',
    axisPointer: {
      type: 'shadow',
      snap: true
    },
    confine: true,
    enterable: true,
    formatter: function (params) {
      let htmlStr =
        '<div style="height: auto;max-height: 200px;overflow-y: auto;"><p>' +
        params[0].axisValue +
        '</p>'
      for (let i = 0; i < params.length; i++) {
        htmlStr +=
          '<p style="color: #666;">' +
          params[i].marker +
          params[i].seriesName +
          ': ' +
          params[i].value +
          ' ℃</p>'
      }
      htmlStr += '</div>'
      return htmlStr
    }
  },
  animation: false,
  grid: {
    left: '0%',
    top: '40px',
    right: '0%',
    bottom: '4%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      axisTick: {
        show: false // 去除刻度线
      },
      axisLine: {
        show: false // 去除轴线
      }
    }
  ],
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#012f4a'
      }
    }
  }
}

// 禁用的日期回调函数
const DisabledDate = (time) => {
  return time.getTime() > Date.now()
}

onMounted(async () => {
  const TempCompareChart = echarts.init(document.getElementById('TempCompare1'), {
    useCoarsePointer: true
  })
  packtempStore.HistoryTemperatureChart = TempCompareChart
  TempCompareChart.setOption(options)
  window.addEventListener('resize', function () {
    TempCompareChart.resize()
  })

  await packtempStore.setTemperatureLineData(TodayDateFormate())
  const optionsother = {
    series: FormartHistoryTemperature(packtempStore.TemperatureLineData),
    xAxis: {
      data: packtempStore.xAxisData
    }
  }
  packtempStore.HistoryTemperatureChart.setOption(optionsother)
})

const { bmuId } = storeToRefs(packtempStore)

watch(bmuId, async () => {
  await packtempStore.setTemperatureLineData(TodayDateFormate())
  const optionsother = {
    series: FormartHistoryTemperature(packtempStore.TemperatureLineData),
    xAxis: {
      data: packtempStore.xAxisData
    }
  }
  packtempStore.HistoryTemperatureChart.setOption(optionsother)
})

const SelectDate = ref(TodayDateFormate())

const UpdateDate = (selDate) => {
  SelectDate.value = selDate
}

// 定时更新当天的数据（返回当前的定时器ID）
let TemperatureUpdateTimer = setInterval(
  async function callback(date) {
    if (date === TodayDateFormate()) {
      const res = await packtempStore.setTemperatureLineData(date)
      if (res === true) {
        const options = {
          series: FormartHistoryTemperature(packtempStore.TemperatureLineData),
          xAxis: {
            data: packtempStore.xAxisData
          }
        }
        if (packtempStore.HistoryTemperatureChart !== null) {
          packtempStore.HistoryTemperatureChart.setOption(options)
        }
      } else {
        const retryresult = await RetryFun1(
          packtempStore.setTemperatureLineData,
          1000,
          3,
          TemperatureUpdateTimer,
          date
        )
        if (retryresult === null) {
          ElMessage.error('获取温度数据失败,请刷新页面')
        } else {
          ElMessage.success('温度数据恢复成功')
          TemperatureUpdateTimer = setInterval(callback, 1000 * 60 * 3, SelectDate.value)
        }
      }
    }
  },
  1000 * 60 * 3,
  SelectDate.value
)

// 定时器ID
const TimerID = ref(TemperatureUpdateTimer)

// 监听日期变化（更新数据）
// watch(SelectDate, async (newVal) => {
//   const SelTime = SelectDateFormate(newVal)
//   if (SelTime === TodayDateFormate()) {
//     if (TimerID.value === null) {
//       TimerID.value = setInterval(async () => {
//         await packtempStore.setTemperatureLineData(SelTime)
//         const options = {
//           series: FormartHistoryTemperature(packtempStore.TemperatureLineData),
//           xAxis: {
//             data: packtempStore.xAxisData
//           }
//         }
//         if (packtempStore.HistoryTemperatureChart !== null) {
//           packtempStore.HistoryTemperatureChart.setOption(options)
//         }
//       }, 1000)
//     }
//   } else {
//     clearInterval(TimerID.value)
//     TimerID.value = null
//     await packtempStore.setTemperatureLineData(SelTime)
//     const options = {
//       series: FormartHistoryTemperature(packtempStore.TemperatureLineData),
//       xAxis: {
//         data: packtempStore.xAxisData
//       }
//     }
//     packtempStore.HistoryTemperatureChart.setOption(options)
//   }
// })

watch(SelectDate, async (newVal) => {
  const SelTime = SelectDateFormate(newVal)
  clearInterval(TimerID.value)
  const res = await packtempStore.setTemperatureLineData(SelTime)
  if (res === true) {
    const options = {
      series: FormartHistoryTemperature(packtempStore.TemperatureLineData),
      xAxis: {
        data: packtempStore.xAxisData
      }
    }
    if (packtempStore.HistoryTemperatureChart !== null) {
      packtempStore.HistoryTemperatureChart.setOption(options)
    }
  } else {
    const retryresult = await RetryFun1(
      packtempStore.setTemperatureLineData,
      1000,
      3,
      TimerID.value,
      SelTime
    )
    if (retryresult === null) {
      ElMessage.error('获取温度数据失败,请刷新页面')
    } else {
      ElMessage.success('温度数据恢复成功')
    }
  }
  TimerID.value = setInterval(
    async function callback() {
      const res = await packtempStore.setTemperatureLineData(SelTime)
      if (res === true) {
        const options = {
          series: FormartHistoryTemperature(packtempStore.TemperatureLineData),
          xAxis: {
            data: packtempStore.xAxisData
          }
        }
        if (packtempStore.HistoryTemperatureChart !== null) {
          packtempStore.HistoryTemperatureChart.setOption(options)
        }
      } else {
        const retryresult = await RetryFun1(
          packtempStore.setTemperatureLineData,
          1000,
          3,
          TimerID.value,
          SelTime
        )
        if (retryresult === null) {
          ElMessage.error('获取温度数据失败,请刷新页面')
        } else {
          ElMessage.success('温度数据恢复成功')
          TimerID.value = setInterval(callback, 1000 * 60 * 3)
        }
      }
    },
    1000 * 60 * 3
  )
})
</script>
<template>
  <div class="historytemperaturecontainer">
    <div class="timeselect">
      <el-date-picker
        v-model="SelectDate"
        @change="UpdateDate"
        class="timeselect"
        style="width: 120px; height: 20px"
        type="date"
        :disabled-date="DisabledDate"
        placeholder="选择日期"
      />
    </div>
    <h2>温度变化曲线</h2>
    <div class="chart" id="TempCompare1"></div>
    <div class="panel-footer"></div>
  </div>
</template>

<style scoped>
.historytemperaturecontainer {
  position: relative;
}

.timeselect {
  position: absolute;
  right: 20px;
  top: 0px;
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
