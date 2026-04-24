<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-18 17:04:28
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-09-17 11:08:13
 * @Description  : 项目-业务查询-填报申请书查询-买方信息详情 /member/project/query/application/buyerInfo
-->

<template>
  <NavBar />
  <view class="application-BuyerInfo">
    <ty-info-card title="买方基本信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="买方名称" :value="vm.buyerItem.counterpartyName" />
          <u-cell title="买方全称(英文)" :value="vm.buyerItem.buyerEnglishName" />
          <u-cell title="买方所在国" :value="vm.buyerItem.buyerCtyDesc" />
          <u-cell title="详细地址(英文)" :value="vm.buyerItem.buyerAddressEn" />
          <u-cell :title="'公司注册编号\n(Company Registration No)'" :value="vm.buyerItem.buyerCompanyRegistrationNo" />
          <u-cell title="公司联系邮箱" :value="vm.buyerItem.buyerEmail" />
          <u-cell title="公司联系电话/分机" :value="vm.buyerItem.buyerMobilePhone" />
          <u-cell title="联系人姓名" :value="vm.buyerItem.buyerLinkman" />
          <u-cell title="联系人职务" :value="vm.buyerItem.buyerLinkmanPosition" />
          <u-cell title="联系人手机号/通讯工具号" :value="vm.buyerItem.buyerLinkmanMobilePhone" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="贸易基本信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="交易商品名称" :value="vm.buyerItem.buyerTradeName" />
          <u-cell
            title="账期起算日"
            :value="
              vm.buyerItem.buyerTenorStartType !== '5'
                ? getValueByKey(vm.buyerItem.buyerTenorStartType, 'tenorStartType')
                : vm.buyerItem.tenorStartDesc
            "
          />
          <u-cell title="账期(天)" :value="vm.buyerItem.buyerTenor"></u-cell>
          <u-cell title="最早交易年份" :value="vm.buyerItem.buyerFirstTransactionYear" />
          <u-cell title="币种" :value="vm.buyerItem.buyerCcyDesc" />
          <u-cell v-if="!isEmpty(vm.buyerItem.buyerCurrentOrderAmt)" title="当前在手订单金额(万元)">
            <template #value>
              <text class="u-cell__value">
                <text v-if="vm.buyerItem.buyerCcyid && getValueByKey(vm.buyerItem.buyerCcyid, 'applyCcyid')" class="applyCcyid">
                  {{ vm.buyerItem.buyerCcyid }}
                </text>
                <text>{{ moneyFormat(vm.buyerItem.buyerCurrentOrderAmt) }}</text>
              </text>
            </template>
          </u-cell>
          <u-cell v-if="!isEmpty(vm.buyerItem.buyerAccountBalance)" title="当前应收账款余额(万元)">
            <template #value>
              <text class="u-cell__value">
                <text v-if="vm.buyerItem.buyerCcyid && getValueByKey(vm.buyerItem.buyerCcyid, 'applyCcyid')" class="applyCcyid">
                  {{ vm.buyerItem.buyerCcyid }}
                </text>
                <text>{{ moneyFormat(vm.buyerItem.buyerAccountBalance) }}</text>
              </text>
            </template>
          </u-cell>
          <u-cell
            title="支付方式"
            :value="vm.buyerItem.buyerPayType !== '2' ? getValueByKey(vm.buyerItem.buyerPayType, 'payType') : vm.buyerItem.buyerPayTypeDesc"
          />
          <u-cell title="当前是否有逾期" :value="getValueByKey(vm.buyerItem.buyerOverdueFlag, 'yesNo')" />
          <u-cell v-if="vm.buyerItem.buyerOverdueFlag === '1'" title="逾期说明" :value="vm.buyerItem.buyerOverdueRemark" />
          <u-cell title="与买方之间有无禁止债权转让的约定" :value="getValueByKey(vm.buyerItem.buyerDebtTransferFlag, 'haveOrNot')" />
          <u-cell v-if="!isEmpty(vm.buyerItem.remark)" title="备注说明(申请准入)" class="vertical-cell" :border="false">
            <template #value>
              <text class="cell-value">{{ vm.buyerItem.remark }}</text>
            </template>
          </u-cell>
          <u-cell v-if="!isEmpty(vm.buyerItem.buyerDescribe)" title="备注说明(填报申请书)" class="vertical-cell">
            <template #value>
              <text class="cell-value">{{ vm.buyerItem.buyerDescribe }}</text>
            </template>
          </u-cell>
        </u-cell-group>
      </view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { BuyerList } from '@/interfaces/member/project/internationfinancingCommon'
import { getValueByKey } from '@/utils/constant'
import { decodeBase64 } from '@/utils/crypto'
import { getStorage } from '@/utils/storages'
import { useRoute } from '@/uni-simple-router'
import { moneyFormat } from '@/utils/format'
import { isEmpty } from '@/utils/validate'
// import { dateFormat } from '@/utils/format'
const route = useRoute()
const refcode = Number(decodeBase64(route.value.params.refcode)) // 当前买方流水号
const buyerItem: BuyerList = {
  counterpartyName: '',
  buyerEnglishName: '',
  buyerCtyDesc: '',
  buyerAddressEn: '',
  buyerCompanyRegistrationNo: '',
  buyerEmail: '',
  buyerMobilePhone: '',
  buyerLinkman: '',
  buyerLinkmanPosition: '',
  buyerLinkmanMobilePhone: '',
  buyerTradeName: '',
  buyerTenorStartType: '',
  buyerTenor: '',
  buyerFirstTransactionYear: '',
  buyerCcyDesc: '',
  buyerCurrentOrderAmt: '',
  buyerAccountBalance: '',
  remark: '',
  aplRefcode: '',
  annualTurnover: '',
  buyerDebtTransferFlag: '',
  buyerOverdueFlag: '',
  buyerPayType: '',
  ccyid: '',
  ctyDesc: '',
  dctApplyLoanStatus: '',
  ctyid: '',
  futureAnnualTurnover: '',
  logisticsSystemFlag: '',
  productName: '',
  publicBiddingFlag: '',
  refcode: '',
  projectSource: '',
  tenor: '',
  tenorStartType: '',
  transactionYears: '',
  buyerCcyid: ''
}

let buyerList: BuyerList[] = []
let vm = reactive({
  buyerItem: buyerItem,
  buyerList: buyerList
})

onMounted(() => {
  vm.buyerList = getStorage('application-buyerInfo') as BuyerList[]
  vm.buyerList.forEach(item => {
    if (item.refcode === refcode) {
      vm.buyerItem = item
    }
  })
})
</script>

<style lang="scss" scoped>
.application-BuyerInfo {
  padding: 0 0 30rpx 0;
  background: #fff;
  margin-top: -20rpx;
  .collapse-item-title {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
  }
  .otherCcyid {
    display: flex;
    align-items: center;
  }
  .applyCcyid {
    margin-right: 10rpx;
  }
}
.u-cell__value {
  text-align: right !important;
  flex: auto;
  color: #333;
  line-height: 36rpx;
  font-size: 28rpx;
  display: inline-block;
  .ccyid {
    margin-right: 7rpx;
  }
}
</style>
