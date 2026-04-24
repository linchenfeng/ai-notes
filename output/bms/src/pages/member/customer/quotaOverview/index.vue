<!--
 * @Author       : MingChun.Cheng
 * @Date         : 2023-10-17 13:21:06
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2025-12-02 14:09:42
 * @Description  : 我的客户详情页面 额度概况模块
-->
<template>
  <view class="operationContainer">
    <ty-info-card>
      <template #subtitle>
        <view class="operationName">
          <view>{{ '额度概况' }}</view>
        </view>
        <view v-if="vm.quotaOverview && vm.quotaOverview.clStatus" class="autherized">{{ clStatus[vm.quotaOverview.clStatus] }}</view>
      </template>
      <view class="detail">
        <view v-if="vm.quotaOverview && vm.quotaOverview.clStatus">
          <view class="container">
            <view class="title">可用额度({{ vm.quotaOverview.ccyid === 'RMB' ? 'CNY' : vm.quotaOverview.ccyid }})</view>
            <view class="value remain-amt">{{ moneyFormat(vm.quotaOverview.availableCLAmt) }}</view>
          </view>
          <u-row class="container">
            <u-col span="7">
              <view class="title">总额度({{ vm.quotaOverview.ccyid === 'RMB' ? 'CNY' : vm.quotaOverview.ccyid }})</view>
              <view class="value">{{ moneyFormat(vm.quotaOverview.clAmt) }}</view>
            </u-col>
            <u-col span="5">
              <view class="title">已使用额度({{ vm.quotaOverview.ccyid === 'RMB' ? 'CNY' : vm.quotaOverview.ccyid }})</view>
              <view class="value">{{ moneyFormat(vm.quotaOverview.usedClAmt) }}</view>
            </u-col>
          </u-row>
          <view class="container tips tips-container">
            <cover-image src="@/assets/member/customer/view-tips.png" alt="提醒" />
            <view>
              <text>{{ dateFormat(vm.quotaOverview.expiryDate) }}</text>
              <text v-if="['0', '1'].includes(vm.quotaOverview.clStatus)">
                ({{ vm.quotaOverview.expiryDay }}
                天后)
              </text>
            </view>
            <text>{{ statusTextArr[vm.quotaOverview.clStatus] }}</text>
          </view>
          <view class="container tips special-tips tips-container">注：仅供参考，以实际放款回款为准</view>
        </view>
        <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="160" height="130" />
      </view>
    </ty-info-card>
  </view>
</template>
<script lang="ts">
export default {
  name: 'QuotaOverview'
}
</script>
<script setup lang="ts">
import { QuotaOverviewInfo } from '@/interfaces/member/project/query/projectStatistics'
import empty from '@/assets/empty/empty.png'
import apiCustomer from '@/api/member/api.custormer'
import { moneyFormat, dateFormat } from '@/utils/format'
import { defineProps } from 'vue'
const props = defineProps({ refcode: { type: Number, required: true } })
// let unfoldFlag = ref(true)
// 公众号消息进入默认展开
const quotaOverviewInfo: QuotaOverviewInfo = {
  availableCLAmt: 0,
  clAmt: 0,
  usedClAmt: 0,
  expiryDate: '',
  expiryDay: '',
  clStatus: '',
  ccyid: ''
}
const vm = reactive({
  quotaOverview: quotaOverviewInfo
})

const statusTextArr = {
  '0': '生效',
  '1': '到期',
  '2': '到期',
  '3': '冻结'
}
const clStatus = {
  '0': '未生效',
  '1': '生效中',
  '2': '已到期',
  '3': '已冻结'
}
const getCustomCLInfo = () => {
  apiCustomer.getCustomCLInfo({ refcode: props.refcode }).then(res => {
    vm.quotaOverview = res.data.fclbCusMVo
  })
}

onMounted(() => {
  getCustomCLInfo()
})
</script>

<style lang="scss" scoped>
uni-cover-image {
  overflow: inherit;
}
.title {
  color: $remark-color;
}
.value {
  color: $default-color;
  font-weight: bold;
  margin: 15rpx 0;
  font-size: 32rpx;
}
.operation-status {
  margin: 0 28rpx;
  // color: var(--u-blue-middle);
  font-size: 12rpx;
}
.detail {
  font-size: 28rpx;
  .tips {
    text-align: left;
    color: $remark-color;
    cover-image {
      width: 32rpx;
      height: 32rpx;
      margin-right: 14rpx;
    }
  }
  .container {
    .remain-amt {
      font-size: 48rpx;
      margin: 22rpx 0 40rpx 0;
    }
  }
  .special-tips {
    font-size: 22rpx;
    color: $danger;
  }
}
.tips-container {
  margin-top: 18rpx !important;
  display: flex;
  align-items: center;
}
</style>
