<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-10 16:11:28
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-06-23 15:14:24
 * @Description  : 预警解除申请历史审核意见 /member/project/specialAudit/history
-->

<template>
  <div class="history-list-box">
    <u-collapse ref="historyCollapseRef" :value="opinionActive" :border="false">
      <u-collapse-item title="审批历程" name="1" :border="false">
        <template #title>
          <view class="collapse-item-title">
            <text class="u-cell__title-text">审批历程</text>
          </view>
        </template>
        <view class="nodes">
          <audit-nodes v-for="(item, index) in vm.historyList" :key="index" :audit-item="item" @toggle="toggle"></audit-nodes>
        </view>
      </u-collapse-item>
    </u-collapse>
  </div>
</template>

<script setup lang="ts">
// import NavBar from '@/layout/NavBar.vue'
import apiWarningApprovalQuery from '@/api/member/project/query/api.warningApprovalQuery'
import { HistoryItem } from '@/interfaces/member/project/audit/warningApprovalAudit'
import { useRoute } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import AuditNodes from './components/AuditNodes.vue'
const opinionActive = ref(['1'])
const route = useRoute()
const historyCollapseRef = ref()
let refcode = ref('') // 入会结果流水号
let historyList: HistoryItem[] = []
let vm = reactive({
  historyList: historyList
})

const getWarningAppHistoryInfo = () => {
  const data = {
    refcode: refcode.value
  }
  apiWarningApprovalQuery.getWarningAppHistoryInfo(data).then(res => {
    vm.historyList = res.data.historyList
    nextTick(() => {
      setTimeout(() => {
        historyCollapseRef.value.init()
      }, 200)
    })
  })
}
// 切换审批意见展开，同步初始化高度
const toggle = () => {
  nextTick(() => {
    historyCollapseRef.value.init()
  })
}
onMounted(() => {
  // 路由带参
  if (route.value.params) {
    refcode.value = decodeBase64(route.value.params.refcode)
  }
  getWarningAppHistoryInfo()
})
</script>

<style lang="scss" scoped>
.history-list-box {
  padding-top: 20rpx;
  background-color: #f6f6f6;
  .nodes {
    background-color: #fff;
    padding: 0 30rpx;
  }
  :deep(.u-collapse-item) {
    box-shadow: none;
    margin-bottom: 0;
    background-color: #fff;
    .u-cell__title-text {
      margin-left: -8rpx;
      font-size: 28rpx !important;
      font-weight: bold;
    }
    .u-cell--clickable.u-cell {
      background-color: #fff;
    }
    .u-collapse-item__content__text {
      padding: 0;
    }
    .u-cell__body {
      padding: 27rpx 29rpx !important;
    }
    .node-card:last-of-type {
      .node-content {
        border-left: none;
      }
    }
  }
  .collapse-item-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 24rpx;
    .showInviteGroup {
      margin-left: 20rpx;
      background-color: #e4f2fd;
      border-color: #e4f2fd;
      color: #138bec;
      padding: 8rpx 20rpx;
      border-radius: 6rpx;
      font-weight: normal;
      font-size: 26rpx;
    }
  }
}
</style>
