<!--
 * @Author       : longcan.Yang
 * @Date         : 2022-10-10 22:44:59
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-03-13 14:18:42
 * @Description  : 我的客户详情页面 审批进度模块
-->
<template>
  <view class="operationContainer animation">
    <ty-info-card @click="onClick()">
      <template #subtitle>
        <view class="operationName">
          <view>{{ '审批进度' }}</view>
          <view class="badge-margin">
            <u-badge :value="countTotal" max="999" :show-zero="true"></u-badge>
          </view>
        </view>
      </template>
      <view class="detail">
        <view class="apply" @click="toDetail('1')">
          <view class="activeIcon">
            <view class="inside">{{ vm.approvalProcessVo.financingTotal <= 999 ? vm.approvalProcessVo.financingTotal : 999 }}</view>
          </view>
          <view class="describe">{{ getValueByKey('1', 'approveStatus') }}</view>
        </view>
        <view>
          <view class="omit">
            <cover-image :src="dataLine" alt="过渡" />
          </view>
        </view>
        <view class="apply" @click="toDetail('2')">
          <view class="activeIcon">
            <view class="inside">{{ vm.approvalProcessVo.operationAuditTotal <= 999 ? vm.approvalProcessVo.operationAuditTotal : 999 }}</view>
          </view>
          <view class="describe">{{ getValueByKey('2', 'approveStatus') }}</view>
        </view>
        <view>
          <view class="omit">
            <cover-image :src="dataLine" alt="过渡" />
          </view>
        </view>
        <view class="apply" @click="toDetail('3')">
          <view class="activeIcon">
            <view class="inside">{{ vm.approvalProcessVo.financialAuditTotal <= 999 ? vm.approvalProcessVo.financialAuditTotal : 999 }}</view>
          </view>
          <view class="describe">{{ getValueByKey('3', 'approveStatus') }}</view>
        </view>
        <view>
          <view class="omit">
            <cover-image :src="dataLine" alt="过渡" />
          </view>
        </view>
        <view class="apply" @click="toDetail('4')">
          <view class="activeIcon">
            <view class="inside">{{ vm.approvalProcessVo.financialLoanTotal <= 999 ? vm.approvalProcessVo.financialLoanTotal : 999 }}</view>
          </view>
          <view class="describe">{{ getValueByKey('4', 'approveStatus') }}</view>
        </view>
      </view>
    </ty-info-card>
  </view>
</template>
<script lang="ts">
export default {
  name: 'ApprovalProcess'
}
</script>
<script setup lang="ts">
// import noDataLine from '@/assets/member/customer/noDataLine.png'
import dataLine from '@/assets/member/customer/dataLine.png'
import { ApprovalProcess } from '@/interfaces/member/customer/approvalProcess'
import apiCustormer from '@/api/member/api.custormer'

import { getValueByKey } from '@/utils/constant'
import { encodeBase64 } from '@/utils/crypto'
import { useRouter } from '@/uni-simple-router'
let unfoldFlag = ref(true)
let countTotal = ref(0)
const props = defineProps<{ refcode: number }>()
let approvalProcess: ApprovalProcess = {
  financingTotal: 0,
  operationAuditTotal: 0,
  financialAuditTotal: 0,
  financialLoanTotal: 0
}
const vm = reactive({
  approvalProcessVo: approvalProcess
})
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-13 16:51:56
 * @return {*}
 * @description: 获取审批进度数据
 */
const getCustomApprovalInfo = () => {
  apiCustormer.getCustomApprovalInfo(props.refcode).then(res => {
    if (res.data) {
      vm.approvalProcessVo = res.data
      countTotal.value = res.data.financialAuditTotal + res.data.financialLoanTotal + res.data.financingTotal + res.data.operationAuditTotal
    }
  })
}

const onClick = async () => {
  unfoldFlag.value = !unfoldFlag.value
}
let router = useRouter()
/**
 * @Author: longcan.Yang
 * @Date: 2023-07-28 17:20:51
 * @param {*} approveStatus 审批进度
 * @description: 点击状态进入项目信息
 */
const toDetail = (approveStatus): void => {
  router.push(`/member/customer/projectStatistics/info/${encodeBase64(props.refcode)}/${encodeBase64(approveStatus)}`)
}
onMounted(() => {
  getCustomApprovalInfo()
})
</script>

<style lang="scss" scoped>
uni-cover-image {
  overflow: inherit;
}
.badge-margin {
  position: relative;
  left: 10rpx;
  top: -20rpx;
}
.operationContainer.animation {
  .operation {
    padding: 40rpx 30rpx 0;
  }
}

.detail {
  display: flex;
  justify-content: space-evenly;
  .omit {
    height: 76rpx;
    display: flex;
    align-items: center;
    // margin-top: -10rpx;
    cover-image {
      width: 34rpx;
      height: 2px;
      // margin-bottom: 5rpx;
    }
  }
  .apply {
    font-size: 28rpx;
    color: #0f6dd2;
    .describe {
      font-size: 26rpx;
      margin-top: 11rpx;
      white-space: nowrap;
    }

    .activeIcon {
      display: flex;
      justify-content: center;
      align-items: center;
      // padding: 3rpx;
      width: 76rpx;
      height: 76rpx;
      margin: 0 auto;
      border-radius: 50%;
      background-color: #b9d2ff;
      .inside {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        text-align: center;
        // padding: 5rpx;
        line-height: 60rpx;
        color: #fff;
        background-color: $primary;
      }
    }
    &.noValue {
      color: #d8d8d8;
      .activeIcon {
        background: #f6f6f6;
        .inside {
          background: #d8d8d8;
        }
      }
    }
  }
}
</style>
