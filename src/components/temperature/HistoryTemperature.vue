<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { TodayDateFormate, SelectDateFormate } from '@/utils/daytime'
import { usePackTemperatureStore } from '@/stores/modules/packtemperature'
import { FormartHistoryTemperature } from '@/utils/defaultdata'

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

onMounted(() => {
  const TempCompareChart = echarts.init(document.getElementById('TempCompare'))
  packtempStore.HistoryTemperatureChart = TempCompareChart
  TempCompareChart.setOption(options)
  window.addEventListener('resize', function () {
    TempCompareChart.resize()
  })
})

const SelectDate = ref(TodayDateFormate())

const UpdateDate = (selDate) => {
  SelectDate.value = selDate
}

// 定时更新当天的数据（返回当前的定时器ID）
const TemperatureUpdateTimer = setInterval(
  async (date) => {
    if (date === TodayDateFormate()) {
      await packtempStore.setTemperatureLineData(date)
      const options = {
        series: FormartHistoryTemperature(packtempStore.TemperatureLineData),
        xAxis: {
          data: packtempStore.xAxisData
        }
      }
      if (packtempStore.HistoryTemperatureChart !== null) {
        packtempStore.HistoryTemperatureChart.setOption(options)
      }
    }
  },
  1000,
  SelectDate.value
)

// 定时器ID
const TimerID = ref(TemperatureUpdateTimer)

// 监听日期变化（更新数据）
watch(SelectDate, async (newVal) => {
  const SelTime = SelectDateFormate(newVal)
  if (SelTime === TodayDateFormate()) {
    if (TimerID.value === null) {
      TimerID.value = setInterval(async () => {
        await packtempStore.setTemperatureLineData(SelTime)
        const options = {
          series: FormartHistoryTemperature(packtempStore.TemperatureLineData),
          xAxis: {
            data: packtempStore.xAxisData
          }
        }
        if (packtempStore.HistoryTemperatureChart !== null) {
          packtempStore.HistoryTemperatureChart.setOption(options)
        }
      }, 1000)
    }
  } else {
    clearInterval(TimerID.value)
    TimerID.value = null
    await packtempStore.setTemperatureLineData(SelTime)
    const options = {
      series: FormartHistoryTemperature(packtempStore.TemperatureLineData),
      xAxis: {
        data: packtempStore.xAxisData
      }
    }
    packtempStore.HistoryTemperatureChart.setOption(options)
  }
})
</script>

<template>
  <div class="timeselect">
    <el-date-picker
      v-model="SelectDate"
      @change="UpdateDate"
      class="timeselect"
      style="width: 1.5rem; height: 0.3rem"
      type="date"
      :disabled-date="DisabledDate"
      placeholder="选择日期"
    />
  </div>
  <h2>温度变化曲线</h2>
  <div class="chart" id="TempCompare"></div>
  <div class="panel-footer"></div>
</template>

<style scoped>
.timeselect {
  position: absolute;
  right: 0.25rem;
  top: 0.15rem;
}
</style>
