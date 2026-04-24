<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-12-03 14:04:09
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-03 16:24:53
 * @Description  : 项目-业务审核-融资申请审核-历程 /member/project/audit/loanApply/history
-->
<template>
  <NavBar />
  <ty-info-card :show-line="false">
    <view class="nodes">
      <audit-nodes v-for="(item, index) in vm.historyList" :key="index" :audit-item="item" />
    </view>
  </ty-info-card>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import apiLoanApply from '@/api/member/project/audit/api.loanApply'
import { HistoryList } from '@/interfaces/member/project/audit/loanApply'
import { useRoute } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import AuditNodes from './components/AuditNodes.vue'
const route = useRoute()
let refcode = ref('') // 入会结果流水号
let historyList: HistoryList[] = []
let vm = reactive({
  historyList: historyList
})
const getApprovalHistory = () => {
  apiLoanApply.getApprovalHistory(refcode.value).then(res => {
    vm.historyList = res.data.historyList
  })
}
onMounted(() => {
  // 路由带参
  if (route.value.params) {
    refcode.value = decodeBase64(route.value.params.refcode) // 融资申请流水号
  }
  getApprovalHistory()
})
</script>

<style lang="scss" scoped>
.history-list-box {
  background-color: #f6f6f6;
  padding-top: 20rpx;
  padding-bottom: 20rpx;
  .nodes {
    background-color: #fff;
    padding: 0 30rpx;
  }
  :deep(.u-collapse-item) {
    box-shadow: none;
    margin-bottom: 0;
    background-color: #fff;

    .u-cell__title-text {
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
      padding: 27rpx 30rpx !important;
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
