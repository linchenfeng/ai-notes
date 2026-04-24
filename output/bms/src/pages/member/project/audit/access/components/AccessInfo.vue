<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-26 10:31:10
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-24 10:28:22
 * @Description  : 本下次申请买方及历史准入买方
-->
<template>
  <view class="basicInfo">
    <ty-info-card v-if="props.self.batchAplList && props.self.batchAplList.length" :title="`本次共申请准入买方(${props.self.batchAplList.length})`">
      <view v-for="(item, i) in props.self.batchAplList" :key="i" class="buyerList-item">
        <view>
          <view class="orgname">{{ item.counterpartyNames }}</view>
          <view class="cty">
            <view class="ctydesc">{{ item.ctyDesc }}</view>
            <view class="divline">/</view>
            <view
              class="clStatus"
              :class="['clStatus' + item.intLoanStatus, { currentbuyer: item.refcode === props.self.fintAplDtcVoList[0].aplRefcode }]"
            >
              {{
                item.refcode === props.self.fintAplDtcVoList[0].aplRefcode
                  ? '当前准入申请' // 满足则固定展示 // 不满足则执行原有逻辑
                  : ['1'].includes(item.intLoanStatus)
                  ? getValueByKey(item.applyStatus, 'applyStatus')
                  : getValueByKey(item.intLoanStatus, 'intLoanStatus')
              }}
            </view>
          </view>
        </view>
      </view>
    </ty-info-card>
    <ty-info-card v-if="baseAplHistoryList && baseAplHistoryList.length" :title="`历史准入买方(${baseAplHistoryList.length})`">
      <view v-for="(item, i) in baseAplHistoryList" :key="i" class="buyerList-item">
        <view>
          <view class="orgname">{{ item.counterpartyNames }}</view>
          <view class="cty">
            <view class="ctydesc">{{ item.ctyDesc }}</view>
            <view class="divline">/</view>
            <view class="nodeStatus" :class="['nodeStatus' + item.nodeStatus]">
              {{ getValueByKey(item.nodeStatus, 'fintNodeStatus') }}
            </view>
          </view>
        </view>
      </view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import apiBusinessAccess from '@/api/member/project/audit/api.businessAccess'

import { QueryBaseAplHistoryList, BaseAplHistoryList } from '@/interfaces/member/project/audit/businessAccess'
import { getValueByKey } from '@/utils/constant'
const props = defineProps({
  self: {
    type: Object,
    default: () => ({})
  }
})
let queryHistoryList = reactive<QueryBaseAplHistoryList>({
  orgname: '',
  orgRefcode: '',
  financingNo: ''
})
// 历史准入买方
let baseAplHistoryList = ref<BaseAplHistoryList[]>([])
const getBaseAplHistoryList = () => {
  queryHistoryList.orgname = props.self.orgname
  queryHistoryList.orgRefcode = props.self.orgRefcode
  queryHistoryList.financingNo = props.self.financingNo
  apiBusinessAccess.getBaseAplHistoryList(queryHistoryList).then(res => {
    baseAplHistoryList.value = res.data.fintAplMList
  })
}

onMounted(() => {
  getBaseAplHistoryList()
})
</script>
<style lang="scss" scoped>
.buyerList-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8rpx;
  padding: 10rpx 0 20rpx 0rpx;
  border-bottom: solid 1rpx #dedede;
  margin-bottom: 10rpx;
  &:first-of-type {
    margin-top: -14rpx;
  }
  &:last-of-type {
    margin-bottom: 40rpx;
  }
  .orgname {
    width: 680rpx;
    color: $default-color;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 10rpx;
  }
  .cty {
    display: flex;
    .divline {
      padding: 0 7rpx;
    }
    .ctydesc {
      color: $default-color;
    }
  }
  .clStatus {
    color: $u-warning;
  }
  .currentbuyer {
    color: $primary !important;
  }
  .clStatus3 {
    color: $u-success !important;
  }
  .clStatus31 {
    color: $u-success !important;
  }
  .clStatus4 {
    color: $danger !important;
  }
  .clStatus8 {
    color: $danger !important;
  }
  .nodeStatus {
    color: $u-warning;
  }
  .nodeStatus3 {
    color: $u-success !important;
  }
  .nodeStatus4 {
    color: $danger !important;
  }
  .nodeStatus6 {
    color: $danger !important;
  }
  .nodeStatus7 {
    color: $danger !important;
  }
  .nodeStatus8 {
    color: $u-success !important;
  }
  .nodeStatus2 {
    color: $danger !important;
  }
  .nodeStatus9 {
    color: $u-success !important;
  }
}
</style>
