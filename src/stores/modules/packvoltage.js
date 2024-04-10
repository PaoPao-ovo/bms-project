import { defineStore, storeToRefs } from 'pinia'
import { usePackTemperatureStore } from '@/stores/modules/packtemperature.js'
import {
  GetHistoryVolService,
  GetClusterHistoryVolService,
  AlarmGetService,
  GetClusterVolService
} from '@/api/bmu.js'

import { ref, shallowRef } from 'vue'

// 电池包电压模块数据
export const usePackVoltageStore = defineStore('packvoltage', () => {
  // 温度模块数据
  const packTemperatureStore = usePackTemperatureStore()

  // 电池包ID
  const { bmuId } = storeToRefs(packTemperatureStore)

  // 单包电压（电压变化曲线）
  const packVoltage = ref([])

  // 单包X轴（电压变化曲线）
  const packVoltageX = ref([])

  // 设置&重置（单包电压、单包X轴）
  const setPackVoltage = async (date) => {
    try {
      const res = await GetHistoryVolService(bmuId.value, date)
      packVoltage.value = res.data.voltage
      packVoltageX.value = res.data.timedata
    } catch (error) {
      packVoltage.value = []
      packVoltageX.value = []
    }
  }

  // 簇电压（电压变化曲线）
  const clusterVoltage = ref([])

  // 簇X轴（电压变化曲线）
  const clusterVoltageX = ref([])

  // 设置&重置（簇电压、簇X轴）
  const setClusterVoltage = async (clusterid, date) => {
    try {
      const res = await GetClusterHistoryVolService(clusterid, date)
      clusterVoltage.value = res.data.voltage
      clusterVoltageX.value = res.data.timedata
    } catch (error) {
      clusterVoltage.value = []
      clusterVoltageX.value = []
    }
  }

  // 报警信息
  const packWarnList = ref([])

  // 设置&重置（报警信息）
  const setPackWarnList = async () => {
    try {
      const res = await AlarmGetService(bmuId.value)
      packWarnList.value = res.data.alarm
    } catch (error) {
      packWarnList.value = []
    }
  }

  // 簇电压变化曲线的选择模式
  const clusterMode = ref('1')

  // 簇电压变化曲线电压数据
  const clusterSpVoltage = ref([])

  // 设置&重置（簇电压变化曲线数据）
  const setClusterSp = async () => {
    try {
      const res = await GetClusterVolService(+clusterMode.value)
      clusterSpVoltage.value = res.data.voltage
    } catch (error) {
      clusterSpVoltage.value = []
    }
  }

  // 电压曲线实例
  const packVoltageChart = shallowRef(null)

  return {
    bmuId,
    clusterMode,
    packVoltage,
    packVoltageX,
    clusterVoltage,
    clusterVoltageX,
    clusterSpVoltage,
    packWarnList,
    packVoltageChart,
    setPackVoltage,
    setClusterVoltage,
    setPackWarnList,
    setClusterSp
  }
})
