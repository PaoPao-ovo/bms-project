<script setup>
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import { usePackVoltageStore } from '@/stores/modules/packvoltage'

const packStore = usePackVoltageStore()
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
      <el-tab-pane label="报警参数设置" name="second">Config</el-tab-pane>
    </el-tabs>
    <div class="panel-footer"></div>
  </div>
</template>

<style scoped>
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
</style>
