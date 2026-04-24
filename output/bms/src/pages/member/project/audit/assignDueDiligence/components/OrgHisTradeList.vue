<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-07-10 11:10:07
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-20 15:00:48
 * @Description  : 企业历史交易信息
-->
<template>
  <view>
    <view v-for="(item, i) in props.orgHisTradeList" :key="i" class="buyerList-item" @tap="viewDetail(item)">
      <view class="orgname">{{ item.orgname }}</view>
      <view class="clStatus">
        {{ getValueByKey(String(item.businessScene), 'dctApplyLoanStatus') }}
      </view>
      <up-icon name="arrow-right"></up-icon>
    </view>
  </view>
</template>
<script setup lang="ts">
import { OrgHisTradeList } from '@/interfaces/member/project/audit/assignDueDiligence'
import { useRouter } from '@/uni-simple-router'
import { setStorage } from '@/utils/storages'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { PropType } from 'vue'
const router = useRouter()
const props = defineProps({
  // 卖方名称
  orgHisTradeList: {
    type: Array as PropType<OrgHisTradeList[]>,
    default: () => {
      return []
    }
  }
})
const viewDetail = (item: OrgHisTradeList) => {
  let path = ''
  //已准入跳入准入申请详情
  if (item.businessScene === '1') {
    setStorage('access-buyerInfo', item)
    path = `/member/project/query/access/detail/${encodeBase64(item.businessRefcode)}`
  } else if (item.businessScene === '2') {
    path = `/member/project/apply/assist/buyerinfo/${encodeBase64(item.businessRefcode)}`
  }
  if (path) {
    router.push(path)
  }
}
</script>
<style lang="scss" scoped>
.buyerList-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8rpx;
  padding: 0;
  height: 100rpx;
  &:first-of-type {
    margin-top: -20rpx;
  }
  &:last-of-type {
    margin-bottom: 40rpx;
  }
  .orgname {
    width: 470rpx;
    color: $default-color;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .clStatus {
    // min-width: 180rpx;
    // text-align: right;
    color: $u-success;
  }
}
</style>
