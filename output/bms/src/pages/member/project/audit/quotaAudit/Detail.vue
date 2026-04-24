<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-25 17:48:54
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-07 11:22:20
 * @Description  : 项目-业务审核-额度审核-查询 /member/project/audit/quotaAudit/detail/:refcode
-->

<template>
  <NavBar />
  <view class="main">
    <view class="topCell">
      <u-cell-group>
        <u-cell title="申请编号" :value="vm.self.applyNo" />
        <u-cell title="申请日期" :value="vm.self.applyDate ? dateFormat(vm.self.applyDate, 1) : ''" />
      </u-cell-group>
    </view>
    <view class="special-audit">
      <!-- 额度基本信息 -->
      <base-info :self="vm.self" />
      <!-- 额度开立结果 -->
      <ty-info-card title="额度审核结果">
        <view class="card-cell-group">
          <u-cell-group>
            <u-cell v-if="!isEmpty(vm.self.finalStatus)" title="额度开立结果" :value="getValueByKey(vm.self.finalStatus as string, 'intClStatus')" />
            <u-cell v-if="!isEmpty(vm.self.checkAmt) && vm.self.applyStatus === '98'" title="额度核准金额(万元)">
              <template #value>
                <view class="apply-amt">
                  <text class="ccyid">{{ vm.self.applyCcyid }}</text>
                  <text>{{ moneyFormat(vm.self.checkAmt) }}</text>
                </view>
              </template>
            </u-cell>
            <u-cell v-if="vm.self.reviewRemark" title="备注说明" class="vertical-cell">
              <template #value>
                <view class="cell-value">
                  <text>{{ vm.self.reviewRemark }}</text>
                </view>
              </template>
            </u-cell>
            <u-cell title="审核时间" :value="vm.self.reviewDate ? dateFormat(vm.self.reviewDate, 2) : ''" />
          </u-cell-group>
        </view>
      </ty-info-card>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { QuotaInfo } from '@/interfaces/member/project/audit/quotaAudit'
import { useRoute } from '@/uni-simple-router'
import apiQuotaAudit from '@/api/member/project/audit/api.quotaAudit'
import { decodeBase64 } from '@/utils/crypto'
import { onMounted, reactive } from 'vue'
import { dateFormat, moneyFormat } from '@/utils/format'
import BaseInfo from './components/BaseInfo.vue'
import { getValueByKey } from '@/utils/constant'
import { isEmpty } from '@/utils/validate'
const route = useRoute()
const refcode = Number(decodeBase64(route.value.params.refcode))
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
  checkAmt: 0,
  finalStatus: '',
  bizScene: ''
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
const getQuotaResultInfo = () => {
  apiQuotaAudit.getQuotaResultInfo(refcode).then(res => {
    vm.self = res.data.fintAppClVo
  })
}
onMounted(() => {
  getQuotaResultInfo()
})
</script>

<style lang="scss" scoped>
.main {
  background: #f6f6f6;
  padding: 0;
}
.topCell {
  background-color: #fff;
}
.u-textarea {
  min-height: 160rpx;
  // padding-bottom: 40rpx;
  // margin-bottom: 15px;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
    .input-placeholder {
      font-size: 28rpx;
    }
  }
}
.special-audit {
  background: #f6f6f6;
  padding: 0;
  .button-fixed-bottom {
    .vteam-button {
      padding: 0 30rpx;
      color: $default-color;
      .vteam-button-text {
        font-weight: bold;
      }
    }
  }
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
.apply-amt {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  .ccyid {
    margin-right: 7rpx;
  }
}
</style>
