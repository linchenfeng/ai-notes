<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-26 10:31:10
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2025-08-18 11:30:12
 * @Description  : 预警解除基本信息
-->
<template>
  <view class="basicInfo">
    <ty-info-card title="基本信息">
      <view class="topCell">
        <u-cell-group :border="false" :stop="true">
          <view class="item-title">
            <u-cell title="客户名称" :value="props.baseInfo.orgname" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="申请编号" :value="props.baseInfo.applyNo" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="申请类型" :value="getValueByKey(props.baseInfo.applyType, 'applyType')" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="授信产品" :value="getValueByKey(props.baseInfo.creditProduct, 'creditProduct')" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="客户经理" :value="props.baseInfo.clmUserName" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="业务主管" :value="props.baseInfo.managerUserName" :border="false" />
          </view>
        </u-cell-group>
      </view>
    </ty-info-card>
    <!-- 综合额度 -->
    <ty-info-card v-for="item in props.creditInfoList" :key="item.loanType" :title="titleArr[item.creditType]">
      <view class="topCell">
        <u-cell-group :border="false" :stop="true">
          <view class="item-title">
            <u-cell title="核贷类型" :value="getValueByKey(item.loanType, 'loanType')" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="授信性质" :value="getValueByKey(item.creditType, 'creditType')" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="授信币种" :value="item.ccyid" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="授信额度(万元)" :value="moneyFormat(Number(item.predictAmt))" :border="false" />
          </view>
          <!-- <view class="item-title">
            <u-cell title="额度状态" :value="getValueByKey(item.creditStatus, 'creditStatus')" :border="false" />
          </view> -->
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="申请理由">
      <view class="content pre-wrap">{{ baseInfo.remark }}</view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import { getValueByKey } from '@/utils/constant'
import { moneyFormat } from '@/utils/format'
import { FreezeAppInfo, FreezeCreditItem } from '@/interfaces/member/project/audit/freezeApprovalAudit'
import type { PropType } from 'vue'
const titleArr ={1:'综合额度',2:'区间额度',3:'特批额度'}
const props = defineProps({
  baseInfo: {
    type: Object as PropType<FreezeAppInfo>,
    default: () => ({})
  },
  creditInfoList: {
    type: Array<FreezeCreditItem>,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
// .topCell {
//   padding-top: 70rpx;
//   margin-bottom: 6rpx;
// }

:deep(.upload-file) {
  margin-bottom: 30rpx;
}
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  margin-bottom: 30rpx;
}
.basicInfo {
  :deep(.u-cell-group) {
    padding-top: 0;
    margin: 0;
    .u-cell__body {
      align-items: self-start;
    }
  }
}
</style>
