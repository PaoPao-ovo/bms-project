<script setup>
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import { usePackVoltageStore } from '@/stores/modules/packvoltage'
import { WarmData } from '@/utils/defaultdata'
import { ref } from 'vue'
const packStore = usePackVoltageStore()

// 报警参数数组
const WarmParam = ref(WarmData)
</script>

<template>
  <div>
    <el-tabs>
      <el-tab-pane label="报警信息" name="first">
        <div class="chart">
          <vue3-seamless-scroll :list="packStore.packWarnList" class="scroll" :step="0.2" :hover="true"
            :limitScrollNum="8">
            <div class="item" v-for="(item, index) in packStore.packWarnList" :key="index">
              <span v-show="item.level != ''">{{ item.updatetime }}</span>
              <span v-show="item.level != ''">{{ item.level }}</span>
              <span v-show="item.level != ''">{{ item.content }}</span>
            </div>
          </vue3-seamless-scroll>
        </div>
      </el-tab-pane>
      <el-tab-pane label="报警参数设置" name="second">
        <div class="chart">
          <el-scrollbar><el-table class="setchart" :data="WarmParam" :cell-style="{ 'text-align': 'center' }"
              :show-header="false" style="
              --el-table-border-color: none;
              --el-table-bg-color: none;
              --el-table-tr-bg-color: none;
              --el-table-header-bg-color: none;
            ">
              <el-table-column prop="type" label=""> </el-table-column>
              <el-table-column prop="third" label="third"> </el-table-column>
              <el-table-column prop="second" label="second"> </el-table-column>
              <el-table-column prop="first" label="first"> </el-table-column>
            </el-table></el-scrollbar>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="panel-footer"></div>
  </div>
</template>

<style>
.scroll {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.scroll .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
}

span {
  color: aliceblue;
  font-size: 16px;
}

.chart .setchart {
  color: white;
}

.chart .setchart tr:hover>td {
  background-color: #134d80 !important;
}
</style>
