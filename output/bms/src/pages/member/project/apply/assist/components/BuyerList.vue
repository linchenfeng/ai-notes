<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-07-10 11:10:07
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-10-27 19:29:26
 * @Description  : 买方及贸易信息列表
-->
<template>
  <view>
    <view v-for="(item, i) in buyerList" :key="i" class="buyerList-item" @tap="viewDetail(item)">
      <view class="orgname">{{ item.counterpartyName }}</view>
      <view class="clStatus">
        {{ getValueByKey(item.dctApplyLoanStatus, 'dctApplyLoanStatus') }}
      </view>
      <up-icon name="arrow-right"></up-icon>
    </view>
  </view>
</template>
<script setup lang="ts">
import { BuyerList } from '@/interfaces/member/project/internationfinancingCommon'
import apiInternationfinancing from '@/api/member/project/api.internationfinancingCommon'
import { useRouter } from '@/uni-simple-router'
import { setStorage } from '@/utils/storages'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'

const router = useRouter()
const props = defineProps({
  // 卖方名称
  orgname: {
    type: String,
    default: ''
  },
  // 产品大类
  bizScene: {
    type: String,
    default: ''
  },
  //产品类型
  productType: {
    type: String,
    default: ''
  },
  //客户经理id
  clmUserId: {
    type: String,
    default: ''
  }
})
const buyerList = ref<BuyerList[]>([])
const listPreLoanBuyerBusinessBySellerInfo = () => {
  apiInternationfinancing
    .listPreLoanBuyerBusinessBySellerInfo({
      orgname: props.orgname,
      bizScene: props.bizScene,
      productType: props.productType,
      clmUserId: props.clmUserId
    })
    .then(res => {
      buyerList.value = res.data.fintAplDtcVoList
    })
}
const viewDetail = (item: BuyerList) => {
  let path = ''
  //已准入跳入准入申请详情
  if (item.dctApplyLoanStatus === '1') {
    setStorage('access-buyerInfo', item)
    path = `/member/project/query/access/detail/${encodeBase64(item.aplRefcode)}`
  } else if (item.dctApplyLoanStatus === '2') {
    path = `/member/project/apply/assist/buyerinfo/${encodeBase64(item.refcode)}`
    setStorage('application-buyerInfo', [item])
  } else if (item.dctApplyLoanStatus === '3') {
    path = `/member/project/query/buyerQuota/detail/${encodeBase64(item.clRefcode as string)}`
  }
  router.push(path)
}
onMounted(() => {
  listPreLoanBuyerBusinessBySellerInfo()
})
</script>
<style lang="scss" scoped>
.buyerList-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8rpx;
  padding: 0;
  height: 80rpx;
  &:first-of-type {
    margin-top: -20rpx;
  }
  &:last-of-type {
    margin-bottom: 20rpx;
  }
  .orgname {
    width: 470rpx;
    color: $default-color;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .clStatus {
    color: $u-success;
  }
}
</style>
