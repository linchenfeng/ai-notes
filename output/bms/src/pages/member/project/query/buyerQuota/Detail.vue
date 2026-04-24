<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-07-14 16:09:16
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-11-03 14:40:12
 * @Description  : 项目-贷前查询-买方额度查询-详情 /member/project/audit/quotaAudit/detail/:refcode
-->
<template>
  <NavBar />
  <view class="main">
    <up-sticky z-index="2" bg-color="#fff">
      <state-module
        v-if="!isEmpty(vm.self.finalStatus)"
        :state-name="getValueByKey(vm.self.finalStatus as string, 'intClFinalStatus')"
        :state-color="stateColor[vm.self.finalStatus as string]"
      ></state-module>
    </up-sticky>
    <view class="topCell">
      <u-cell-group>
        <u-cell title="申请编号" :value="vm.self.applyNo" />
        <u-cell title="客户经理" :value="vm.self.userName" />
        <u-cell title="业务主管" :value="vm.self.superiorName" />
        <u-cell title="申请日期" :value="vm.self.applyDate ? dateFormat(vm.self.applyDate, 1) : ''" />
      </u-cell-group>
    </view>
    <ty-info-card title="卖方信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="卖方名称" :value="vm.self.orgname" />
          <u-cell title="所在国" :value="vm.self.orgCtyDesc" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="买方及额度申请信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="买方名称" :value="vm.self.buyerOrgname" />
          <u-cell :title="'统一社会信用代码\n(Company Registration\n No.或相关登记号)'" :value="vm.self.companyRegistrationNo" />
          <u-cell title="所在国" :value="vm.self.ctyDesc" />
          <u-cell title="详细地址" :value="vm.self.address" />
          <u-cell title="额度申请金额(万元)">
            <template #value>
              <view class="u-cell__value">
                <text class="ccyid">{{ vm.self.applyCcyid }}</text>
                <text>{{ moneyFormat(vm.self.applyAmt) }}</text>
              </view>
            </template>
          </u-cell>
          <u-cell v-if="!isEmpty(vm.self.checkAmt)" title="额度核准金额(万元)">
            <template #value>
              <view class="u-cell__value">
                <text class="ccyid">{{ vm.self.checkCcyid }}</text>
                <text>{{ moneyFormat(vm.self.checkAmt as number) }}</text>
              </view>
            </template>
          </u-cell>
          <u-cell v-if="!isEmpty(vm.self.applyRemark) && vm.self.bizScene === '1'" title="备注说明(额度申请)" class="vertical-cell">
            <template #value>
              <text class="cell-value">{{ vm.self.applyRemark }}</text>
            </template>
          </u-cell>
          <u-cell
            v-if="vm.self.finalStatus === '99' && vm.self.bizScene === '1' && vm.self.reviewResultVo && !isEmpty(vm.self.reviewResultVo.reviewRemark)"
            title="备注说明(额度审核)"
            class="vertical-cell"
          >
            <template #value>
              <text class="cell-value">{{ vm.self.reviewResultVo.reviewRemark }}</text>
            </template>
          </u-cell>
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card v-if="vm.self.fintAppQuotaVo && vm.self.fintAppQuotaVo.quotaStatus && vm.self.fintAppQuotaVo.quotaStatus === '2'" title="报价信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell v-if="!isEmpty(vm.self.fintAppQuotaVo.quotaRate)" title="手续费率(%)" :value="vm.self.fintAppQuotaVo.quotaRate" />
          <u-cell v-if="vm.self.fintAppQuotaVo.quotaDate" title="报价时间" :value="dateFormat(vm.self.fintAppQuotaVo.quotaDate, 2)"></u-cell>
          <u-cell v-if="vm.self.fintAppQuotaVo.quotaRemark" title="备注说明" class="vertical-cell">
            <template #value>
              <view class="cell-value">
                <text>{{ vm.self.fintAppQuotaVo.quotaRemark }}</text>
              </view>
            </template>
          </u-cell>
        </u-cell-group>
      </view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { QuotaInfo } from '@/interfaces/member/project/query/buyerQuotaQuery'
import { useRoute } from '@/uni-simple-router'
import apiQuotaQuery from '@/api/member/project/query/api.buyerQuotaQuery'
import { decodeBase64 } from '@/utils/crypto'
import { onMounted, reactive } from 'vue'
import { dateFormat, moneyFormat } from '@/utils/format'
import { isEmpty } from '@/utils/validate'
import { getValueByKey } from '@/utils/constant'
import StateModule from '@/plugins/StateModule.vue'
const route = useRoute()
const refcode = Number(decodeBase64(route.value.params.refcode))
const stateColor = {
  '0': 'warning',
  '97': 'error',
  '99': 'success'
}
const self: QuotaInfo = {
  applyStatus: '',
  applyNo: '',
  applyCcyid: '',
  applyDate: '',
  buyerOrgname: '',
  companyRegistrationNo: '',
  ctyDesc: '',
  refcode: -1,
  applyAmt: 0,
  superiorName: '',
  userName: '',
  bizScene: '',
  orgname: '',
  orgCtyDesc: '',
  reviewResultVo: {
    applyStatus: '',
    reviewDate: '',
    reviewRemark: '',
    reviewUserid: ''
  }
}
// 业务申请信息
let vm = reactive({
  self: self
})
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 16:53:32
 * @description: 获取额度审核详情
 */
const getQuotaInfo = () => {
  apiQuotaQuery.getQuotaInfo(refcode).then(res => {
    vm.self = res.data.fintAppClVo
  })
}
onMounted(() => {
  getQuotaInfo()
})
</script>

<style lang="scss" scoped>
.main {
  background: #f6f6f6;
  padding: 0;
}
.topCell {
  background-color: #fff;
  padding-top: 70rpx;
}
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  color: $sub-color;
  padding-bottom: 30rpx;
  &.summaryRemark {
    color: #333;
    margin-top: 0;
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
