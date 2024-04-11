// 电池包选择框数据
const PackOptions = []

for (let i = 0; i < 50; i++) {
  PackOptions.push({
    value: `${i + 1}`,
    label: `${i + 1}号电池`
  })
}

// 电池簇选择框数据
const ClusterOptions = [
  {
    value: '1',
    label: 'A电池簇'
  },
  {
    value: '2',
    label: 'B电池簇'
  },
  {
    value: '3',
    label: 'C电池簇'
  },
  {
    value: '4',
    label: 'D电池簇'
  }
]

// 温度散点图、电池簇散点图X轴数据(固定)
const xAxisData = []
for (let i = 0; i < 50; i++) {
  xAxisData[i] = i + 1
}

// 热力图数据初始化
const HeatMapTemperatureList = []
let index = 0
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 5; j++) {
    HeatMapTemperatureList[index] = [i, j]
    index++
  }
}

// 历史温度数据格式化
const FormartHistoryTemperature = (Temperaturelist) => {
  let Series = []
  if (Temperaturelist.length > 0) {
    for (let i = 0; i < Temperaturelist.length; i++) {
      Series.push({
        name: `温度${i + 1}`,
        type: 'line',
        data: Temperaturelist[i]
      })
    }
  } else {
    for (let i = 0; i < 50; i++) {
      Series.push({
        name: `温度${i + 1}`,
        type: 'line',
        data: []
      })
    }
  }
  return Series
}

// 簇历史电压数据格式化
const FormartHistoryVoltage = (VoltageList) => {
  let Series = []
  if (VoltageList.length > 0) {
    for (let i = 0; i < VoltageList.length; i++) {
      Series.push({
        name: `${i + 1}号电压`,
        type: 'line',
        data: VoltageList[i].map((item) => item / 1000)
      })
    }
  }
  return Series
}
export {
  PackOptions,
  ClusterOptions,
  xAxisData,
  HeatMapTemperatureList,
  FormartHistoryTemperature,
  FormartHistoryVoltage
}
