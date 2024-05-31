<script setup>
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import { usePackVoltageStore } from '@/stores/modules/packvoltage'
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'

const packStore = usePackVoltageStore()

packStore.setPackWarnList().then()

let Timer = setInterval(async function callback() {
  const res = await packStore.setPackWarnList()
  if (res === null) {
    clearInterval(Timer)
    let MaxAttempts = 3
    const retryPromise = new Promise((resolve) => {
      const retryTimer = setInterval(async () => {
        const res = await packStore.setPackWarnList()
        MaxAttempts--
        if (MaxAttempts === 0) {
          clearInterval(retryTimer)
          resolve(false)
        } else if (res !== null) {
          clearInterval(retryTimer)
          resolve(true)
        }
      }, 1000)
    })
    const retryResult = await retryPromise
    if (retryResult) {
      ElMessage.success('报警数据恢复成功')
      Timer = setInterval(callback, 1000 * 60 * 3)
    } else {
      ElMessage.error('报警数据获取数据失败，请刷新页面')
    }
  }
}, 1000 * 60 * 3)

// 默认展示的页面
const activeName = ref('second')

const Login = async (param) => {
  await packStore.setAlarmParams(param)
  Uploading.value = true
  setTimeout(() => {
    Uploading.value = false
  }, 180000 * 5)
}

const Uploading = ref(false)

watch(activeName, async (newVal) => {
  if (newVal === 'second') {
    await packStore.getAlarmParams()
  }
})
</script>

<template>
  <div>
    <el-tabs v-model="activeName">
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
          <el-scrollbar><el-form :model="packStore.alarmParams">
              <el-table class="setchart" :data="packStore.alarmParams" :cell-style="{ 'text-align': 'center' }"
                :show-header="false" style="
                  --el-table-border-color: none;
                  --el-table-bg-color: none;
                  --el-table-tr-bg-color: none;
                  --el-table-header-bg-color: none;
                ">
                <el-table-column prop="type" label="">
                  <template #default="scope">
                    <span>{{ scope.row.type }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="third" label="third">
                  <template #default="scope">
                    <el-input v-if="scope.$index != 0" v-model="scope.row.third"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="second" label="second">
                  <template #default="scope">
                    <el-input v-if="scope.$index != 0" v-model="scope.row.second"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="first" label="first">
                  <template #default="scope">
                    <el-input v-if="scope.$index != 0" v-model="scope.row.first"></el-input>
                  </template>
                </el-table-column>
              </el-table>
              <el-row>
                <el-col :span="2" :offset="20">
                  <el-button :loading="Uploading" @click="Login(packStore.alarmParams)">{{
                    '提交'
                    }}</el-button>
                </el-col>
              </el-row>
            </el-form></el-scrollbar>
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
  color: white;
}

.chart .setchart {
  color: white;
}

.chart .setchart tr:hover>td {
  background-color: #134d80 !important;
}

.chart {
  height: 200px;
}

h2 {
  height: 0.6rem;
  color: #fff;
  line-height: 0.6rem;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 400;
}
</style>
