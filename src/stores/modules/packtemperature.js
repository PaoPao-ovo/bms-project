import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { TempGetService, GetHistoryTempService } from '@/api/bmu'
import { HeatMapTemperatureList } from '@/utils/defaultdata'

// 电池包温度模块数据
export const usePackTemperatureStore = defineStore('packtemperature', () => {
  // 电池包的ID
  const bmuId = ref(1)

  // 修改电池包的ID
  const setBmuId = (clusterid, packid) => {
    bmuId.value = (+clusterid - 1) * 50 + +packid
  }


  // 系统温度数据
  const TemperatureTable = ref([
    {
      key1: '最高温度',
      value1: null,
      key2: '编号',
      value2: null
    },
    {
      key1: '最低温度',
      value1: null,
      key2: '编号',
      value2: null
    },
    {
      key1: '平均温度',
      value1: null,
      key2: '温度极差',
      value2: null
    }
  ])

  // 热力图温度数据
  const HeatMapList = ref(HeatMapTemperatureList)

  // 温度数据修改和重置(系统温度数据)
  const setTemperatureData = async () => {
    try {
      const res = await TempGetService(bmuId.value)

      // 热力图温度数据修改
      for (let i = 0; i < HeatMapList.value.length; i++) {
        HeatMapList.value[i][2] = res.data.temperature[i]
      }

      // 系统温度数据修改
      TemperatureTable.value[0].value1 = res.data['max_temperature'] + ' °C'
      TemperatureTable.value[0].value2 = res.data['max_temperature_id'] + ' 号'
      TemperatureTable.value[1].value1 = res.data['min_temperature'] + ' °C'
      TemperatureTable.value[1].value2 = res.data['min_temperature_id'] + ' 号'
      TemperatureTable.value[2].value1 = res.data['average_of_temperature'] + ' °C'
      TemperatureTable.value[2].value2 = res.data['range_of_temperature'] + ' °C'
    } catch (error) {

      // 热力图温度数据重置
      for (let i = 0; i < HeatMapList.value.length; i++) {
        HeatMapList.value[i][2] = null
      }

      // 系统温度数据重置
      TemperatureTable.value = [
        {
          key1: '最高温度',
          value1: null,
          key2: '编号',
          value2: null
        },
        {
          key1: '最低温度',
          value1: null,
          key2: '编号',
          value2: null
        },
        {
          key1: '平均温度',
          value1: null,
          key2: '温度极差',
          value2: null
        }
      ]
    }
  }

  // 温度变化曲线数据
  const TemperatureLineData = ref([])

  // 温度变化曲线X轴数据
  const xAxisData = ref([])

  // 温度变化曲线数据修改和重置
  const setTemperatureLineData = async (date) => {
    try {
      const res = await GetHistoryTempService(bmuId.value, date)
      TemperatureLineData.value = res.data.temperature
      xAxisData.value = res.data.timedata
    } catch (error) {
      TemperatureLineData.value = []
      xAxisData.value = []
    }
  }

  // 历史温度曲线图
  const HistoryTemperatureChart = shallowRef(null)

  return {
    bmuId,
    TemperatureTable,
    HeatMapList,
    TemperatureLineData,
    xAxisData,
    HistoryTemperatureChart,
    setBmuId,
    setTemperatureData,
    setTemperatureLineData
  }
})
