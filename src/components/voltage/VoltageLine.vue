<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { usePackVoltageStore } from '@/stores/modules/packvoltage'
import { TodayDateFormate, SelectDateFormate } from '@/utils/daytime'
import { FormartHistoryVoltage } from '@/utils/defaultdata'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'

const packvoltageStore = usePackVoltageStore()

const options = {
  color: ['#00f2f1'],
  tooltip: {
    trigger: 'axis',
    triggerOn: 'click',
    axisPointer: {
      type: 'shadow'
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
          ' V</p>'
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
    min: 9,
    max: 16,
    splitLine: {
      lineStyle: {
        color: '#012f4a'
      }
    }
  }
}

const DisabledDate = (time) => {
  return time.getTime() > Date.now()
}

// 更新图表属性
const ChartOptionUpdate = async () => {
  if (ModeRef.value === '5') {
    const res = await packvoltageStore.setPackVoltage(SelectDateFormate(DateRef.value))
    if (res === null) {
      return false
    } else {
      if (packvoltageStore.packVoltageChart !== null) {
        const options = {
          xAxis: [
            {
              data: packvoltageStore.packVoltageX
            }
          ],
          series: [
            {
              name: '电压',
              type: 'line',
              data: packvoltageStore.packVoltage.map((item) => item / 1000)
            }
          ]
        }
        packvoltageStore.packVoltageChart.setOption(options, {
          replaceMerge: ['series']
        })
      }
    }
  } else {
    const res = await packvoltageStore.setClusterVoltage(
      +ModeRef.value,
      SelectDateFormate(DateRef.value)
    )
    if (res === null) {
      return false
    } else {
      if (packvoltageStore.packVoltageChart !== null) {
        const options = {
          xAxis: [
            {
              data: packvoltageStore.clusterVoltageX
            }
          ],
          series: FormartHistoryVoltage(packvoltageStore.clusterVoltage)
        }
        packvoltageStore.packVoltageChart.setOption(options, {
          replaceMerge: ['series']
        })
      }
    }
  }
}

onMounted(() => {
  const VoltagesCompareChart = echarts.init(document.getElementById('VoltagesCompare'), {
    useCoarsePointer: true
  })
  packvoltageStore.packVoltageChart = VoltagesCompareChart
  VoltagesCompareChart.setOption(options)
  window.addEventListener('resize', function () {
    VoltagesCompareChart.resize()
  })
  ChartOptionUpdate().catch(() => {
    ElMessage.error('单包电压数据初始化失败')
  })
})

const { bmuId } = storeToRefs(packvoltageStore)

watch(bmuId, () => {
  ChartOptionUpdate().catch(() => {
    ElMessage.error('单包电压数据初始化失败')
  })
})

// 选择日期
const DateRef = ref(TodayDateFormate())

// 修改选择的日期
const DateUpdate = (val) => {
  DateRef.value = val
}
// 选择电池包类型
const ModeRef = ref('5')

// 修改电池包类型
const ChangeMode = (val) => {
  ModeRef.value = val
}

// 默认更新当日单包数据（定时器）
let VoltageTimer = setInterval(
  async function callback() {
    const res = await ChartOptionUpdate()
    if (res === false) {
      clearInterval(VoltageTimer)
      let MaxAttempts = 3
      const retryResult = new Promise(function (resolve) {
        const retryTimer = setInterval(async function callback() {
          const res = await ChartOptionUpdate()
          MaxAttempts--
          if (res !== false) {
            clearInterval(retryTimer)
            resolve(true)
          }

          if (MaxAttempts === 0) {
            clearInterval(retryTimer)
            resolve(false)
          }
        }, 1000)
      })

      const retryResultRes = await retryResult
      if (retryResultRes === false) {
        ElMessage.error('单包电压数据获取失败')
      } else {
        ElMessage.success('单包电压数据恢复成功')
        VoltageTimer = setInterval(callback, 1000 * 60 * 3)
      }
    }
  },
  1000 * 60 * 3
)

// 定时器ID
const TimerId = ref(VoltageTimer)

// 监听日期变化,更新图表并调整定时器
// watch(DateRef, (newVal) => {
//   if (SelectDateFormate(newVal) !== TodayDateFormate()) {
//     clearInterval(TimerId.value)
//     TimerId.value = null
//     ChartOptionUpdate()
//   } else {
//     TimerId.value = setInterval(() => {
//       ChartOptionUpdate()
//     }, 1000)
//   }
// })

watch(DateRef, async () => {
  clearInterval(TimerId.value)
  const res = await ChartOptionUpdate()
  if (res === false) {
    let MaxAttempts = 3
    const retryResult = new Promise(function (resolve) {
      const retryTimer = setInterval(async function callback() {
        const res = await ChartOptionUpdate()
        MaxAttempts--
        if (res !== false) {
          clearInterval(retryTimer)
          resolve(true)
        }

        if (MaxAttempts === 0) {
          clearInterval(retryTimer)
          resolve(false)
        }
      }, 1000)
    })

    const retryResultRes = await retryResult
    if (retryResultRes === false) {
      ElMessage.error('单包电压数据获取失败')
    } else {
      ElMessage.success('单包电压数据恢复成功')
    }
  }
  TimerId.value = setInterval(
    async function callback() {
      const res = await ChartOptionUpdate()
      if (res === false) {
        let MaxAttempts = 3
        const retryResult = new Promise(function (resolve) {
          const retryTimer = setInterval(async function callback() {
            const res = await ChartOptionUpdate()
            MaxAttempts--
            if (res !== false) {
              clearInterval(retryTimer)
              resolve(true)
            }

            if (MaxAttempts === 0) {
              clearInterval(retryTimer)
              resolve(false)
            }
          }, 1000)
        })

        const retryResultRes = await retryResult
        if (retryResultRes === false) {
          ElMessage.error('单包电压数据获取失败')
        } else {
          ElMessage.success('单包电压数据恢复成功')
          TimerId.value = setInterval(callback, 1000 * 60 * 3)
        }
      }
    },
    1000 * 60 * 3
  )
})

// 电池包类型变化,更新图表并调整定时器
watch(ModeRef, () => {
  if (SelectDateFormate(DateRef.value) !== TodayDateFormate()) {
    ChartOptionUpdate()
  } else {
    clearInterval(TimerId.value)
    ChartOptionUpdate().then()
    TimerId.value = setInterval(
      async function callback() {
        const res = await ChartOptionUpdate()
        if (res === false) {
          let MaxAttempts = 3
          const retryResult = new Promise(function (resolve) {
            const retryTimer = setInterval(async function callback() {
              const res = await ChartOptionUpdate()
              MaxAttempts--
              if (res !== false) {
                clearInterval(retryTimer)
                resolve(true)
              }

              if (MaxAttempts === 0) {
                clearInterval(retryTimer)
                resolve(false)
              }
            }, 1000)
          })

          const retryResultRes = await retryResult
          if (retryResultRes === false) {
            ElMessage.error('单包电压数据获取失败')
          } else {
            ElMessage.success('单包电压数据恢复成功')
            TimerId.value = setInterval(callback, 1000 * 60 * 3)
          }
        }
      },
      1000 * 60 * 3
    )
  }
})
</script>

<template>
  <div class="selectbox">
    <el-radio-group v-model="ModeRef" @change="ChangeMode">
      <el-radio value="1">A簇</el-radio>
      <el-radio value="2">B簇</el-radio>
      <el-radio value="3">C簇</el-radio>
      <el-radio value="4">D簇</el-radio>
      <el-radio value="5">单包</el-radio>
    </el-radio-group>
  </div>
  <div class="timeselect">
    <el-date-picker
      v-model="DateRef"
      @change="DateUpdate"
      class="timeselect"
      style="width: 1.5rem; height: 0.3rem"
      type="date"
      :disabled-date="DisabledDate"
      placeholder="选择日期"
    />
  </div>
  <h2>电压变化曲线</h2>
  <div class="chart" id="VoltagesCompare"></div>
  <div class="panel-footer"></div>
</template>

<style scoped>
.timeselect {
  position: absolute;
  right: 0.25rem;
  top: 0.15rem;
}

.selectbox {
  position: absolute;
  right: 0.25rem;
  top: 0.65rem;
  z-index: 1000;
}
</style>
