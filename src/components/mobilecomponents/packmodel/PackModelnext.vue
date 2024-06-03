<script setup>
import * as echarts from 'echarts'
import { onMounted, defineModel, ref } from 'vue'
import { PackSetFunc, Interpolation } from '@/utils/defaultdata'
import { CountBmuId } from '@/utils/bmucount'
import { GetClusterAllTempService } from '@/api/bmu'
import { RetryFun2 } from '@/utils/retry'
import { ElMessage } from 'element-plus'

const IdRef = defineModel()

const ModeRef = ref('height')

const options = {
  color: ['#00f2f1'],
  animation: false,
  tooltip: {
    position: 'top',
    formatter: function (params) {
      const ClusterName = CountBmuId(params.dataIndex + 100).ClusterId === 3 ? 'C簇' : 'D簇'
      let htmlStr =
        '<div style="height: auto;max-height: 200px;overflow-y: auto;"><p>' +
        ClusterName +
        CountBmuId(params.dataIndex).PackID.toString() +
        '号电池包'
        ; ('</p>')
      htmlStr +=
        '<p style="color: #666;">' +
        params.marker +
        params.seriesName +
        ': ' +
        params.value[2] +
        ' ℃</p>' +
        '<p style="color: #666;">' +
        params.marker +
        '坐标' +
        ': ' +
        (+params.value[0] + 1) +
        ',' +
        (+params.value[1] + 1) +
        '</p>' +
        '<p style="color: #666;">' +
        params.marker +
        '温度极差' +
        ': ' +
        params.value[3] +
        ' ℃</p></div>'

      return htmlStr
    }
  },
  grid: {
    left: '0%',
    top: '0%',
    right: '0%',
    bottom: '0%',
    containLabel: false
  },
  xAxis: {
    show: false,
    type: 'category',
    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  },
  yAxis: {
    type: 'category',
    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    show: false
  },
  legend: {
    show: false,
    selectedMode: 'single'
  },
  visualMap: {
    show: false,
    calculable: true,
    left: '10%',
    top: '2%'
  },
  series: [
    {
      name: '最高温度',
      type: 'heatmap',
      itemStyle: {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.5)'
      },
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    },
    {
      name: '最低温度',
      type: 'heatmap',
      itemStyle: {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.5)'
      },
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}
let Chart = null
onMounted(async () => {
  const PackChartcontainer1 = echarts.init(document.getElementById('PackChartcontainer4'))
  Chart = PackChartcontainer1
  PackChartcontainer1.setOption(options)
  window.addEventListener('resize', function () {
    PackChartcontainer1.resize()
  })
  PackChartcontainer1.on('click', function (params) {
    IdRef.value.ClusterId = CountBmuId(+params.dataIndex + 100).ClusterId.toString()
    IdRef.value.PackId = CountBmuId(+params.dataIndex + 100).PackID.toString()
  })

  const resA = await GetClusterAllTempService(3)
  const resB = await GetClusterAllTempService(4)

  const MaxTempA = resA.data.max_temperature
  const MaxTempB = resB.data.max_temperature
  const MaxTemp = MaxTempA.concat(MaxTempB)

  const MinTempA = resA.data.min_temperature
  const MinTempB = resB.data.min_temperature

  const MinTemp = MinTempA.concat(MinTempB)

  const SetMaxData = PackSetFunc(MaxTemp)
  const SetMinData = PackSetFunc(MinTemp)

  const inte = Interpolation(SetMaxData, SetMinData);

  for (let i = 0; i < inte.length; i++) {
    SetMaxData[i][3] = inte[i]
    SetMinData[i][3] = inte[i]
  }

  const UlterOptions = {
    series: [
      {
        data: SetMaxData
      },
      {
        data: SetMinData
      }
    ]
  }

  PackChartcontainer1.setOption(UlterOptions)

  let PackTimerId = setInterval(async function callback() {
    try {
      const resA = await GetClusterAllTempService(3)
      const resB = await GetClusterAllTempService(4)
      const MaxTempA = resA.data.max_temperature
      const MaxTempB = resB.data.max_temperature
      const MaxTemp = MaxTempA.concat(MaxTempB)
      const MinTempA = resA.data.min_temperature
      const MinTempB = resB.data.min_temperature
      const MinTemp = MinTempA.concat(MinTempB)
      const SetMaxData = PackSetFunc(MaxTemp)
      const SetMinData = PackSetFunc(MinTemp)
      const inte = Interpolation(SetMaxData, SetMinData);

      for (let i = 0; i < inte.length; i++) {
        SetMaxData[i][3] = inte[i]
        SetMinData[i][3] = inte[i]
      }

      const UlterOptions = {
        series: [
          {
            data: SetMaxData
          },
          {
            data: SetMinData
          }
        ]
      }
      PackChartcontainer1.setOption(UlterOptions)
    } catch (error) {
      const retryresult = RetryFun2(GetClusterAllTempService, 1000, 3, PackTimerId, [3, 4])
      if (retryresult === null) {
        ElMessage.error('获取电池簇温度数据失败,请刷新页面')
      } else {
        ElMessage.success('电池簇温度数据恢复成功')
        PackTimerId = setInterval(callback, 1000 * 60 * 3)
      }
    }

  }, 1000 * 60 * 3)

})

const ModeChange = (newVal) => {
  if (newVal === 'height') {
    Chart.dispatchAction({
      type: 'legendSelect',
      name: '最高温度'
    })
  } else if (newVal === 'low') {
    Chart.dispatchAction({
      type: 'legendSelect',
      name: '最低温度'
    })
  }
}
</script>

<template>
  <div class="packcontainersecond">
    <div class="selectbox">
      <el-radio-group v-model="ModeRef" @change="ModeChange">
        <el-radio value="height">最高温度</el-radio>
        <el-radio value="low">最低温度</el-radio>
      </el-radio-group>
    </div>
    <div>
      <h2>电池仓2</h2>
      <div class="chart" id="PackChartcontainer4"></div>
      <div class="panel-footer"></div>
    </div>
  </div>

</template>


<style scoped>
.packcontainersecond {
  position: relative;
}

.selectbox {
  position: absolute;
  right: 0.25rem;
  bottom: 12rem;
  z-index: 1000;
}
</style>
