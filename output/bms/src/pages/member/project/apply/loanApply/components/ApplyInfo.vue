<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-12-03 09:12:42
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-12 15:57:27
 * @Description  : 申请融资基础信息
-->
<template>
  <view class="basicInfo">
    <up-sticky bg-color="#fff">
      <state-module
        v-if="!isEmpty(props.fintLoaVo.loanStatus)"
        :state-name="getValueByKey(props.fintLoaVo.loanStatus, 'fintLoanStatus')"
        :state-color="stateColor[props.fintLoaVo.loanStatus]"
      ></state-module>
    </up-sticky>
    <ty-info-card :show-line="false">
      <view class="card-cell-group top-cell">
        <u-cell-group>
          <u-cell title="客户经理" :value="props.fintLoaVo.applyUsername" />
          <u-cell title="业务主管" :value="props.fintLoaVo.superiorUsername" />
          <u-cell v-if="!isEmpty(props.fintLoaVo.applyDate)" title="申请日期" :value="dateFormat(props.fintLoaVo.applyDate)"></u-cell>
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card>
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="业务产品" :value="getProduceType" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="客户基本信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="用户编号" :value="props.fintLoaVo.companyCreditCode" />
          <u-cell title="客户名称" :value="props.fintLoaVo.orgname" />
          <u-cell title="法定代表人" :value="props.fintLoaVo.legalPerson" />
          <u-cell v-if="isNotEmpty(props.fintLoaVo.borrowerPerson)" title="共借人名称" :value="props.fintLoaVo.borrowerPerson" />
          <u-cell v-if="isNotEmpty(props.fintLoaVo.borrowerLegalPerson)" title="法定代表人" :value="props.fintLoaVo.borrowerLegalPerson" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="担保人信息">
      <view v-for="(item, index) in props.fintLoaVo.guaList" :key="index" class="card-cell-group gua-list">
        <u-cell-group>
          <u-cell title="担保人名称" :value="item.guarantor" />
          <u-cell title="担保人身份" :value="item.guarantorType === '9' ? item.remark : getValueByKey(item.guarantorType, 'fintLoanGuaType')" />
          <!-- <u-cell v-if="item.guarantorType === '9'" title="其他说明" :value="item.remark" /> -->
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="申请融资信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="授信产品" :value="getValueByKey(props.fintLoaVo.creditProducts, 'fintCreditPro')" />
          <u-cell
            v-if="props.fintLoaVo.creditProducts && props.fintLoaVo.creditProducts.includes('2')"
            title="年利率(%)"
            :value="props.fintLoaVo.loanYearRate"
          />
          <u-cell
            v-if="props.fintLoaVo.creditProducts && props.fintLoaVo.creditProducts.includes('1')"
            title="月利率(%)"
            :value="props.fintLoaVo.loanMonthRate"
          />
          <u-cell title="币种" :value="getValueByKey(props.fintLoaVo.loanCcyid, 'applyCcyid')" />
          <u-cell v-if="!isEmpty(props.fintLoaVo.quotaRemark)" title="预估额度说明" class="vertical-cell">
            <template #value>
              <text class="cell-value">{{ props.fintLoaVo.quotaRemark }}</text>
            </template>
          </u-cell>
          <u-cell title="支付渠道" :value="props.fintLoaVo.channelName" />
          <u-cell title="是否需要过桥" :value="getValueByKey(props.fintLoaVo.bridgeLoanFlag as string, 'yesNo')" />
          <u-cell
            v-if="props.fintLoaVo.bridgeLoanFlag === '1'"
            title="过桥类型"
            :value="getValueByKey(props.fintLoaVo.bridgeLoanType, 'fintBridgeType')"
          />
          <u-cell v-if="props.fintLoaVo.bridgeLoanFlag === '1'" title="过桥对手方" :value="props.fintLoaVo.bridgeCounterparty" />
          <u-cell v-if="!isEmpty(props.fintLoaVo.applyRemark)" title="备注说明" class="vertical-cell">
            <template #value>
              <text class="cell-value">{{ props.fintLoaVo.applyRemark }}</text>
            </template>
          </u-cell>
        </u-cell-group>
      </view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import { FintLoaVo } from '@/interfaces/member/project/apply/loanApply'
import { getValueByKey } from '@/utils/constant'
import type { PropType } from 'vue'
import { isEmpty, isNotEmpty } from '@/utils/validate'
import { dateFormat } from '@/utils/format'
import StateModule from '@/plugins/StateModule.vue'
const props = defineProps({
  fintLoaVo: {
    type: Object as PropType<FintLoaVo>,
    default: () => ({})
  },
  // apply申请|audit详情
  type: {
    type: String,
    default: 'query'
  }
})
const stateColor = {
  '0': 'warning',
  '1': 'warning',
  '2': 'warning',
  '3': 'error',
  '4': 'warning',
  '9': 'success'
}
const getProduceType = computed(() => {
  const bizScene = getValueByKey(props.fintLoaVo.bizScene as string, 'intBizScene')
  return bizScene ? `${bizScene}-${props.fintLoaVo.productType}` : props.fintLoaVo.productType
})
</script>

<style lang="scss" scoped>
.top-cell {
  padding-top: 60rpx;
}
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  margin-bottom: 20rpx;
  margin-top: 20rpx;
  border-radius: 4px;
  background: #f7f7f7;
  padding: 30rpx 20rpx;
  color: #666;
}
.apply-amt {
  line-height: 48rpx;
  font-size: 28rpx;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  .ccyid {
    margin-right: 7rpx;
  }
}
:deep(.node-card:last-of-type) {
  .node-content {
    border-left: none;
  }
}
.review-name-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  .reviewTime {
    font-size: 24rpx;
    color: $remark-color;
  }
}
.gua-list {
  border-bottom: 1rpx solid $border-color;
  &:not(:first-child) {
    margin-top: 30rpx;
  }
}
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}
</style>
