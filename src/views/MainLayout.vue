<script setup>
import '@/assets/css/main.css'
import '@/assets/js/flexible.js'
import TemperatureSp from '@/components/temperature/TemperatureSp.vue'
import HeatMap from '@/components/temperature/HeatMap.vue'
import TemperatureInfo from '@/components/temperature/TemperatureInfo.vue'
import HistoryTemperature from '@/components/temperature/HistoryTemperature.vue'
import VoltageLine from '@/components/voltage/VoltageLine.vue'
import WarnView from '@/components/warn/WarnView.vue'
import ClusterSp from '@/components/voltage/ClusterSp.vue'
import PackModel from '@/components/packmodel/PackModel.vue'
import PackModelnext from '@/components/packmodel/PackModelnext.vue'
import { usePackTemperatureStore } from '@/stores/modules/packtemperature'
import { VolGetService } from '@/api/bmu'
import { ref, watch, computed } from 'vue'
import { PackOptions, ClusterOptions } from '@/utils/defaultdata'
import { RetryFun } from '@/utils/retry'
import { ElMessage } from 'element-plus'

// 电池包pinia
const packtempStore = usePackTemperatureStore()

// 解构默认的电池包ID
// const { bmuId } = storeToRefs(packtempStore)

// 电池簇和电池包选择的值
const SelectRef = ref({
  ClusterId: '1',
  PackId: '1'
})

// 电池簇ID修改回调函数
const ClusteridChange = (SelVal) => {
  SelectRef.value.ClusterId = SelVal
}

// 电池包ID修改回调函数
const PackidChange = (SelVal) => {
  SelectRef.value.PackId = SelVal
}

// 监听电池簇和电池包的选择值,当发生变化时修改bmuid的值
watch(
  SelectRef,
  async (newVal) => {
    packtempStore.setBmuId(newVal.ClusterId, newVal.PackId)
    await packtempStore.setTemperatureData()
    await TitleFn()
  },
  { deep: true }
)

// 标题的计算属性
const TitleContent = computed(() => {
  if (SelectRef.value.ClusterId === '1') {
    return `A簇${SelectRef.value.PackId}号电池包`
  } else if (SelectRef.value.ClusterId === '2') {
    return `B簇${SelectRef.value.PackId}号电池包`
  } else if (SelectRef.value.ClusterId === '3') {
    return `C簇${SelectRef.value.PackId}号电池包`
  } else {
    return `D簇${SelectRef.value.PackId}号电池包`
  }
})

await packtempStore.setTemperatureData()

// 温度数据定时更新
let TemperaID = setInterval(
  async function callback() {
    const res = await packtempStore.setTemperatureData()
    if (res === null) {
      const retryresult = await RetryFun(packtempStore.setTemperatureData, 1000, 3, TemperaID)
      if (retryresult === null) {
        ElMessage('请求失败,请刷新')
      } else {
        ElMessage.success('恢复成功')
        TemperaID = setInterval(callback, 1000 * 60 * 3)
      }
    }
  },
  1000 * 60 * 3
)

const TitleDataRef = ref({
  Voltage: null,
  Temperature: null
})

const TitleFn = async () => {
  try {
    TitleDataRef.value.Temperature = packtempStore.TemperatureTable[2].value1
    const res = await VolGetService(packtempStore.bmuId)
    TitleDataRef.value.Voltage = res.data.voltage / 1000 + ' V'
    return true
  } catch (error) {
    return null
  }
}

await TitleFn()

// 标题数据定时更新
let TitleId = setInterval(
  async function callback() {
    const res = await TitleFn()
    if (res === null) {
      const retryresult = await RetryFun(TitleFn, 1000, 3, TitleId)
      if (retryresult === null) {
        ElMessage('请求失败,请刷新')
      } else {
        ElMessage.success('恢复成功')
        TitleId = setInterval(callback, 1000 * 60 * 3)
      }
    }
  },
  1000 * 60 * 3
)
</script>

<template>
  <!-- 页面头部 -->
  <div id="mainlayout">
    <header>
      <div class="header-select">
        <el-select v-model="SelectRef.ClusterId" placeholder="选择电池簇" @change="ClusteridChange">
          <el-option
            v-for="item in ClusterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="body-select">
        <el-select v-model="SelectRef.PackId" placeholder="选择电池" @change="PackidChange">
          <el-option
            v-for="item in PackOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <h1>{{ TitleContent }}</h1>
    </header>
    <!-- 页面主体 -->
    <section class="mainbox">
      <!-- 左侧数据展示主体 -->
      <div class="column">
        <!-- 左侧数据展示组件 -->
        <div class="panel">
          <TemperatureSp />
        </div>
        <div class="panel">
          <HeatMap />
        </div>
        <div class="panel">
          <TemperatureInfo />
        </div>
      </div>
      <!-- 中部地图和信息展示 -->
      <div class="column">
        <div class="clockinfo">
          <div class="clockinfo-hd">
            <ul>
              <li>电压：{{ TitleDataRef.Voltage }}</li>
              <li>平均温度：{{ TitleDataRef.Temperature }}</li>
            </ul>
          </div>
        </div>
        <div class="panel">
          <ClusterSp />
        </div>
        <div class="panel">
          <PackModel v-model="SelectRef" />
        </div>
        <div class="panel">
          <PackModelnext v-model="SelectRef" />
        </div>
      </div>
      <div class="column">
        <div class="panel">
          <HistoryTemperature />
        </div>
        <div class="panel">
          <VoltageLine />
        </div>
        <div class="panel">
          <WarnView />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.header-select {
  position: absolute;
  width: 1.3rem;
  left: 0.1rem;
  top: 0.1rem;
}

.body-select {
  position: absolute;
  width: 1.3rem;
  left: 1.5rem;
  top: 0.1rem;
}
</style>
