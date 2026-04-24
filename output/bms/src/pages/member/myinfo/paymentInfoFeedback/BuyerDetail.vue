<!--
 * @Author       : MingChun.Cheng
 * @Date         : 2023-09-08 11:22:30
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-03-04 09:57:58
 * @Description  : 买方对账回款明细 /member/myinfo/paymentInfoFeedback/BuyerDetail/:busscontNo
-->
<template>
  <NavBar />
  <!-- 买方对账回款明细-->
  <view class="paymentinfo-buyer-detail">
    <view v-if="vm.self && vm.self.length > 0">
      <view v-for="(item, index) in vm.self" :key="index" class="detail-container">
        <u-cell-group :border="false">
          <view class="item-title">
            <u-cell title="对账日" :value="dateFormat(item.reconciliationDate)" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="对账区间" :value="`${dateFormat(item.reconciliationStartDay)}~${dateFormat(item.reconciliationEndDay)}`" :border="false" />
          </view>
          <u-collapse v-model="activeNames" accordion :border="false">
            <u-collapse-item
              title="对账金额(元)"
              :value="moneyFormat(item.reconciliationAmt)"
              :name="`${index + 1}`"
              :border="false"
              :right-icon="caretBottoms"
            >
              <view class="repayment-detail">
                <view v-for="(childItem, childIndex) in item.repaymentList" :key="childItem.reconciliationNo" class="repayment-detail-item">
                  <u-cell-group :border="false">
                    <view class="item-title bold-style">
                      <u-cell title="回款阶段" :value="`第${childIndex + 1}阶段`" :border="false"></u-cell>
                    </view>
                    <view class="item-title red-color">
                      <u-cell title="应回款日" :value="dateFormat(childItem.repaymentDate)" :border="false"></u-cell>
                    </view>
                    <view class="item-title">
                      <u-cell title="回款比例(%)" :value="`${rateFormat(childItem.repaymentPcnt)}%`" :border="false"></u-cell>
                    </view>
                    <view class="item-title">
                      <u-cell title="应回款金额(元)" :value="moneyFormat(childItem.repaymentAmt)" :border="false"></u-cell>
                    </view>
                    <view class="item-title">
                      <u-cell title="已回款金额(元)" :value="moneyFormat(childItem.payAmt)" :border="false"></u-cell>
                    </view>
                    <view class="item-title red-color">
                      <u-cell title="未回款金额(元)" :value="moneyFormat(childItem.unpaidAmt)" :border="false"></u-cell>
                    </view>
                  </u-cell-group>
                </view>
              </view>
            </u-collapse-item>
          </u-collapse>
        </u-cell-group>
        <view v-if="index < vm.self.length - 1" class="cut-line"></view>
      </view>
    </view>
    <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
  </view>
</template>
<script lang="ts">
import empty from '@/assets/empty/empty.png'
export default {
  name: 'MyinfoPaymentInfoFeedbackBuyerDetail',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import { decodeBase64 } from '@/utils/crypto'
import { moneyFormat, dateFormat, rateFormat } from '@/utils/format'
import { ReconDayInfo } from '@/interfaces/member/myinfo/paymentInfoFeedback'
import apiPaymentInfoFeedback from '@/api/member/api.paymentInfoFeedback'
import { useRoute } from '@/uni-simple-router'
import caretBottom from '@/assets/member/customer/caret-bottom.png'
const activeNames = ref()

// 获取列表页面通过路由传过来的refcode
let route = useRoute()
let busscontNo = decodeBase64(String(route.value.params.busscontNo))
let caretBottoms = caretBottom
// 定义数据
let vm = reactive({
  // 详情数据
  self: Array<ReconDayInfo>()
})

onMounted(() => {
  getOverDueInfo()
})

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 获取详情数据
 */
const getOverDueInfo = (): void => {
  apiPaymentInfoFeedback.getActualPayInfo(busscontNo).then(res => {
    if (res.data) {
      vm.self = res.data.reconDataList
    }
  })
}
</script>
<style lang="scss" scoped>
.paymentinfo-buyer-detail {
  .repayment-detail {
    margin: 16rpx 5rpx;
    :deep(.bold-style .u-cell .u-cell__body .u-cell__value) {
      font-weight: bold;
    }
  }

  :deep(.u-collapse) {
    .u-collapse-item {
      box-shadow: none;
      margin-bottom: 0;
      .u-cell .u-cell__body .u-cell__body__content .u-cell__title-text {
        font-weight: normal;
        color: $sub-color;
      }
      .u-collapse-item__content__text {
        padding: 0;
      }
      .u-cell-group {
        padding: 0;
        margin: 0;
      }
    }
  }
}
</style>
