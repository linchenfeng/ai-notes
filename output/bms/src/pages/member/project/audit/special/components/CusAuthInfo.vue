<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-27 15:55:53
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2026-03-25 15:25:10
 * @Description  : 特批申请-客户授信信息
-->
<template>
  <view>
    <!-- <ty-info-card title="客户授信信息">
      <view class="detail-group">
        <u-cell-group :border="false" :stop="true">
          <u-cell title="授信产品" :value="vm.orgLocListVo.productName" :border="false" />
          <u-cell title="融资利率(%)" :value="rateFormat(vm.orgLocListVo.loanRate)" :border="false" />
          <u-cell title="授信币种" :value="vm.orgLocListVo.ccydesc" :border="false" />
          <u-cell title="综合额度(元)" :value="moneyFormat(vm.orgLocListVo.compreAmt)" :border="false" />
          <u-cell title="区间额度(元)" :value="moneyFormat(vm.orgLocListVo.temporaryAmt)" :border="false" />
          <u-cell title="特批额度(元)" :value="moneyFormat(vm.orgLocListVo.specialAmt)" :border="false" />
          <u-cell title="总额度(元)" :value="moneyFormat(vm.orgLocListVo.totalAmt)" :border="false" />
          <u-cell title="融资余额(元)" :value="moneyFormat(vm.orgLocListVo.financingBalance)" :border="false" />
        </u-cell-group>
      </view>
    </ty-info-card> -->
    <view class="line"></view>
    <u-collapse ref="collapseRef" :value="opinionActive" :border="false">
      <u-collapse-item title="卖方授信信息" name="1" :border="false">
        <template #title>
          <view class="collapse-item-title">
            <text class="u-cell__title-text">卖方授信信息</text>
          </view>
        </template>
        <view class="detail-group">
          <u-cell-group :border="false" :stop="true">
            <u-cell title="授信产品" :value="vm.orgLocListVo.productName" :border="false" />
            <!-- <u-cell v-if="vm.orgLocListVo.loanRate" title="融资利率(%)" :value="rateFormat(vm.orgLocListVo.loanRate)" :border="false" /> -->
            <u-cell title="授信币种" :value="`${vm.orgLocListVo.ccydesc}(${vm.orgLocListVo.ccyid})`" :border="false" />
            <u-cell title="综合额度(万元)" :value="`${vm.orgLocListVo.ccyid} ${moneyFormat(vm.orgLocListVo.compreAmt)}`" :border="false" />
            <u-cell title="区间额度(万元)" :value="`${vm.orgLocListVo.ccyid} ${moneyFormat(vm.orgLocListVo.temporaryAmt)}`" :border="false" />
            <u-cell title="特批额度(万元)" :value="`${vm.orgLocListVo.ccyid} ${moneyFormat(vm.orgLocListVo.specialAmt)}`" :border="false" />
            <u-cell title="总额度(万元)" :value="`${vm.orgLocListVo.ccyid} ${moneyFormat(vm.orgLocListVo.totalAmt)}`" :border="false" />
            <u-cell title="融资余额(万元)" :value="`${vm.orgLocListVo.ccyid} ${moneyFormat(vm.orgLocListVo.financingBalance)}`" :border="false" />
          </u-cell-group>
        </view>
      </u-collapse-item>
    </u-collapse>
    <view class="line"></view>
    <u-collapse ref="collapseRef" :value="loaCcyRateActive" :border="false">
      <u-collapse-item name="1" :border="false">
        <template #title>
          <view class="collapse-item-title">
            <text class="u-cell__title-text">融资利率信息</text>
          </view>
        </template>
        <view class="detail-group">
          <u-cell-group :border="false" :stop="true">
            <u-cell
              v-for="item in vm.orgLocListVo.loaCcyRateList"
              :key="item.refcode"
              :title="getValueByKey(item.ccyid, 'applyCcyid')"
              :value="rateFormat(item.loaRate) + '%'"
              :border="false"
            />
          </u-cell-group>
        </view>
      </u-collapse-item>
    </u-collapse>
  </view>
</template>

<script setup lang="ts">
import { SaveSpecialVo, OrgCreditInfo } from '@/interfaces/member/project/apply/specialApproval'
import { moneyFormat, rateFormat } from '@/utils/format'
import { getValueByKey } from '@/utils/constant'
import type { PropType } from 'vue'
const props = defineProps({
  self: {
    type: Object as PropType<SaveSpecialVo>,
    default: () => ({})
  }
})
const opinionActive = ref(['1'])
const loaCcyRateActive = ref(['1'])
const orgLocListVo: OrgCreditInfo = {
  ccyid: '',
  compreAmt: 0,
  creditApplyProduct: '',
  financingBalance: 0,
  loanRate: 0,
  specialAmt: 0,
  temporaryAmt: 0,
  totalAmt: 0,
  productName: '',
  ccydesc: '',
  loanType: '',
  loaCcyRateList: []
}
const vm = reactive({ orgLocListVo })

watch(
  () => props.self,
  () => {
    if (props.self.orgLocList && props.self.orgLocList[0]) {
      vm.orgLocListVo = props.self.orgLocList[0]
    }
  },
  { deep: true } // 深度监听
)
onMounted(() => {
  if (props.self.orgLocList && props.self.orgLocList[0]) {
    vm.orgLocListVo = props.self.orgLocList[0]
  }
})
</script>

<style lang="scss" scoped>
.line {
  height: 20rpx;
  background-color: #f6f6f6;
}
:deep(.u-collapse-item) {
  background-color: #fff;
  box-shadow: none;
  margin-bottom: 0;
  .collapse-item-title .u-cell__title-text {
    margin-left: -6rpx;
  }
  .u-cell--clickable.u-cell {
    background-color: #fff;
  }
}
.detail-group {
  :deep(.u-cell-group) {
    padding-top: 0;
    margin: 0;
    .u-cell__body {
      align-items: self-start;
    }
  }
}
</style>
