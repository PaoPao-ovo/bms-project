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
  if (VoltageList.length !== null) {
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
}

// 报警参数数组
const WarmData = [
  {
    type: null,
    third: '三级报警',
    second: '二级报警',
    first: '一级报警'
  },
  {
    type: '温度上限（℃）',
    third: null,
    second: null,
    first: null
  },
  {
    type: '解除',
    third: null,
    second: null,
    first: null
  },
  {
    type: '温度下限',
    third: null,
    second: null,
    first: null
  },
  {
    type: '解除',
    third: null,
    second: null,
    first: null
  },
  {
    type: '温差大',
    third: null,
    second: null,
    first: null
  },
  {
    type: '解除',
    third: null,
    second: null,
    first: null
  },
  {
    type: '电压上限（mV）',
    third: null,
    second: null,
    first: null
  },
  {
    type: '解除',
    third: null,
    second: null,
    first: null
  },
  {
    type: '电压下限',
    third: null,
    second: null,
    first: null
  },
  {
    type: '解除',
    third: null,
    second: null,
    first: null
  }
]

const alarmDataFormat = (data) => {
  const temparr = []
  let index = 0
  for (let i = 1; i < data.length; i++) {
    temparr[index] = +data[i].third
    temparr[index + 1] = +data[i].second
    temparr[index + 2] = +data[i].first
    index = index + 3
  }
  return temparr
}

const alarmResFormat = (paramarr, data) => {
  let index = 0
  for (let i = 0; i < paramarr.length - 1; i++) {
    paramarr[i + 1].third = +data[index]
    paramarr[i + 1].second = +data[index + 1]
    paramarr[i + 1].first = +data[index + 2]
    index = index + 3
  }
}

// 图表更新函数
const UpdateHeatMapChart = (data, Chart) => {
  // console.log(data);
  if (data.length !== 0) {
    for (let i = 0; i < HeatMapTemperatureList.length; i++) {
      HeatMapTemperatureList[i][2] = data[i]
    }
    const option = {
      series: [
        {
          data: HeatMapTemperatureList
        }
      ]
    }
    Chart.setOption(option)
  } else {
    const option = {
      series: [
        {
          data: []
        }
      ]
    }
    Chart.setOption(option)
  }
}

function getMaxAndMinIndex(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return { max: null, maxIndex: null, min: null, minIndex: null }
  }

  let max = arr[0]
  let maxIndex = 0
  let min = arr[0]
  let minIndex = 0
  let sum = 0

  for (let i = 1; i < arr.length; i++) {
    sum = sum + +arr[i]
    if (arr[i] > max) {
      max = arr[i]
      maxIndex = i
    }
    if (arr[i] < min) {
      min = arr[i]
      minIndex = i
    }
  }

  return [max, +maxIndex + 1, min, +minIndex + 1, max - min, +sum / 50]
}

const UpdateSystemChart = (data) => {
  if (data.length !== 0) {
    return getMaxAndMinIndex(data)
  }
}
// 保留一位小数
const toFixed = (num) => {
  return parseFloat(num).toFixed(1)
}

// 电池包选择数据
let PackData = []
let innerindex = 0
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    PackData[innerindex] = [i, j]
    innerindex++
  }
}

for (let i = 0; i < 100; i = i + 10) {
  const linenum = Math.floor(i / 10) + 1
  let minCount = (linenum - 1) * 10 + 1
  let maxCount = linenum * 10
  if (linenum % 2 !== 0) {
    for (let j = i; j < i + 10; j++) {
      PackData[j][2] = minCount
      minCount++
    }
  } else {
    for (let j = i; j < i + 10; j++) {
      PackData[j][2] = maxCount
      maxCount--
    }
  }
}

PackData = PackData.map((item) => [item[1], item[0], item[2]])

// 电池包数据渲染函数
export const PackSetFunc = (data) => {
  let ResultArr = []
  let innerindex = 0
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      ResultArr[innerindex] = [i, j]
      innerindex++
    }
  }

  for (let i = 0; i < 100; i = i + 10) {
    if (i < 50) {
      const linenum = Math.floor(i / 10) + 1
      let minCount = (linenum - 1) * 10
      let maxCount = linenum * 10 - 1
      if (linenum % 2 !== 0) {
        for (let j = i; j < i + 10; j++) {
          ResultArr[j][2] = data[minCount]
          minCount++
        }
      } else {
        for (let j = i; j < i + 10; j++) {
          ResultArr[j][2] = data[maxCount]
          maxCount--
        }
      }
    } else {
      const index = i - 50
      const linenum = Math.floor(index / 10) + 1
      let minCount = (linenum - 1) * 10
      let maxCount = linenum * 10 - 1
      if (linenum % 2 !== 0) {
        for (let j = i; j < i + 10; j++) {
          ResultArr[j][2] = data[minCount + 50]
          minCount++
        }
      } else {
        for (let j = i; j < i + 10; j++) {
          ResultArr[j][2] = data[maxCount + 50]
          maxCount--
        }
      }
    }
  }

  return ResultArr.map((item) => [item[1], item[0], item[2]])
}

// 计算数据的极差
export const Interpolation = (MaxData, MinData) => {
  let Result = []
  for (let i = 0; i < MaxData.length; i++) {
    Result[i] = [+Math.abs(MaxData[i][2] - MinData[i][2]).toFixed(2)]
  }
  return Result
}
export {
  PackOptions,
  ClusterOptions,
  xAxisData,
  HeatMapTemperatureList,
  WarmData,
  FormartHistoryTemperature,
  FormartHistoryVoltage,
  alarmDataFormat,
  alarmResFormat,
  UpdateHeatMapChart,
  toFixed,
  UpdateSystemChart,
  PackData
}
