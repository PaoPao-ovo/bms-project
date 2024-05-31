<template>
  <div class="headercontainer">
    <h2>{{ TitleContent }}</h2>
  </div>
  <div class="selconntainer">
    <el-select v-model="SelectRef.ClusterId" placeholder="选择电池簇" @change="ClusteridChange">
      <el-option
        v-for="item in ClusterOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select v-model="SelectRef.PackId" placeholder="选择电池" @change="PackidChange">
      <el-option
        v-for="item in PackOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
  <div style="height: 66px"></div>
  <div class="chartmobile">
    <TemperatureInfo />
  </div>
  <div class="chartmobile">
    <HistoryTemperature />
  </div>
  <div class="chartmobile">
    <HeatMap />
  </div>
  <div class="chartmobile">
    <TemperatureSp />
  </div>
  <div class="chartmobile">
    <ClusterSp />
  </div>
  <div class="chartmobile">
    <VoltageLine />
  </div>
  <div class="chartmobile">
    <WarnView />
  </div>
  <div style="height: 100px"></div>
</template>

<script setup>
import TemperatureSp from '@/components/mobilecomponents/temperature/TemperatureSp.vue'
import HeatMap from '@/components/mobilecomponents/temperature/HeatMap.vue'
import HistoryTemperature from '@/components/mobilecomponents/temperature/HistoryTemperature.vue'
import ClusterSp from '@/components/mobilecomponents/voltage/ClusterSp.vue'
import VoltageLine from '@/components/mobilecomponents/voltage/VoltageLine.vue'
import TemperatureInfo from '@/components/mobilecomponents/temperature/TemperatureInfo.vue'
import WarnView from '@/components/mobilecomponents/warn/WarnView.vue'
import { usePackTemperatureStore } from '@/stores/modules/packtemperature'
// import { VolGetService } from '@/api/bmu'
import { ref, watch, computed } from 'vue'
import { PackOptions, ClusterOptions } from '@/utils/defaultdata'

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
  (newVal) => {
    packtempStore.setBmuId(newVal.ClusterId, newVal.PackId)
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
</script>
<style>
body {
  /* background-color: rgb(207, 27, 27); */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background: url(../assets/image/bgc.png) no-repeat top center;
  background-size: 100% 100%;
}

.headercontainer {
  background: url(../assets/image/headmobile.png) no-repeat top center;
  width: 100%;
  height: 66px;
  background-size: 100%;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 0px;
  position: fixed;
  top: 0;
  z-index: 2000;
}

.headercontainer h2 {
  color: #f1e7e7;
  font-size: 20px;
  font-weight: 500;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 0px;
  text-align: center;
  line-height: 60px;
}

.chartmobile {
  margin: 8px 0px 8px 0px;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(25, 186, 139, 0.17);
  background: url(../assets/image/line1.png) rgba(255, 255, 255, 0.03);
}

.selconntainer {
  display: flex;
  position: fixed;
  z-index: 2001;
  width: 150px;
  height: 20px;
  top: 10px;
}
</style>
