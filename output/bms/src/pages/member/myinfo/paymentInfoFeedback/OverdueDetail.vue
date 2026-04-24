<!--
 * @Author       : MingChun.Cheng
 * @Date         : 2023-09-08 13:25:17
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-03-04 11:34:26
 * @Description  : 融资企业融资逾期明细 /member/myinfo/paymentInfoFeedback/OverdueDetail/:refcode
-->
<template>
  <NavBar />
  <!-- 融资企业融资逾期明细-->
  <view class="wap-overdue-buyer-detail">
    <view v-if="vm.self.overDueList && vm.self.overDueList.length" :border="false">
      <u-collapse :value="activeNames">
        <!-- <view class="top-padding"></view> -->
        <view v-for="(item, index) in vm.self.overDueList" :key="item.loanNo">
          <u-collapse-item title="融资申请编号" :value="item.duebillnum" :name="`${index + 1}`" :border="false">
            <view class="container">
              <u-cell-group :border="false">
                <view class="item-title">
                  <u-cell title="申请融资金额(元)" :value="moneyFormat(item.applyAmt)"></u-cell>
                </view>
                <view class="item-title">
                  <u-cell title="应收账款金额(元)" :value="moneyFormat(item.accountsAmt)"></u-cell>
                </view>
                <view class="item-title">
                  <u-cell title="融资金额(元)" :value="moneyFormat(item.loanAmt)"></u-cell>
                </view>
                <view class="item-title">
                  <view class="duedate-container">
                    <u-cell title="融资到期日">
                      <template #value>
                        <view class="u-cell__value">
                          <text>{{ dateFormat(item.loanDueDate) }}</text>
                          <text v-if="item.overdueDay" class="danger-color">(已逾期{{ item.overdueDay }}天)</text>
                        </view>
                      </template>
                    </u-cell>
                  </view>
                  <!-- <view class="border-line"></view> -->
                </view>
                <view class="item-title">
                  <u-cell title="已回款金额(元)" :value="moneyFormat(item.actualAmt)"></u-cell>
                </view>
                <view class="item-title red-color">
                  <u-cell title="融资余额(元)" :value="moneyFormat(item.otstAmt)"></u-cell>
                </view>
                <view class="item-title">
                  <u-cell title="已预缴逾期利息截止日" :value="dateFormat(item.prepaidDate)"></u-cell>
                </view>
              </u-cell-group>
            </view>
          </u-collapse-item>
          <view :class="vm.self.overDueList.length === index + 1 ? 'hiden' : ''" class="line"></view>
        </view>
      </u-collapse>
    </view>
    <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
  </view>
</template>
<script lang="ts">
import empty from '@/assets/empty/empty.png'
export default {
  name: 'MyinfoPaymentInfoFeedbackOverdueDetail',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import { decodeBase64 } from '@/utils/crypto'
import { moneyFormat, dateFormat } from '@/utils/format'
import { FadlRemindMVo } from '@/interfaces/member/myinfo/paymentInfoFeedback'
import apiPaymentInfoFeedback from '@/api/member/api.paymentInfoFeedback'
import { useRoute } from '@/uni-simple-router'
const Detail: FadlRemindMVo = {
  orgname: '',
  bussType: '',
  buyerName: '',
  busscontNo: '',
  finalPayName: '',
  loanDueDate: '',
  ccyid: '',
  totalUnpaidAmt: 0,
  totalOtstAmt: 0,
  paidNum: 0,
  overDueNum: 0,
  bybRefcode: 0,
  repaymentDate: '',
  overDueList: []
}
const activeNames = ref([1])
let route = useRoute()
let refcode = decodeBase64(String(route.value.params.refcode))

// 定义数据
let vm = reactive({
  // 详情数据
  self: Detail
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
  apiPaymentInfoFeedback.getPrePaymentInfo(refcode).then(res => {
    if (res.data) {
      vm.self = res.data.fadlRemindMVo
    }
  })
}
</script>
<style lang="scss" scoped>
.wap-overdue-buyer-detail {
  :deep(.u-cell__title) {
    font-weight: normal !important;
  }
  padding-bottom: 20rpx;
  .hiden {
    display: none;
  }
  .container {
    margin: 8rpx 0 0 0;
    :deep(.u-cell-group) {
      padding: 0;
      margin: 0;
    }
  }
  :deep(.u-collapse-item) {
    padding-bottom: 4rpx;
    margin-bottom: 0;
    box-shadow: none;
    .u-cell .u-cell__body {
      .u-cell__body__content .u-cell__title-text {
        font-weight: normal;
        color: $sub-color;
      }
      .u-cell__value {
        color: $default-color;
        font-size: 28rpx;
      }
    }
    .u-line {
      display: none;
    }
  }
}
.line {
  width: 100%;
  margin: 0 auto;
  height: 20rpx;
  background: #f6f6f6;
}
</style>
