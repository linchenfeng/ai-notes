<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-07-11 11:53:45
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-08-20 15:33:12
 * @Description  :  项目-业务审核-业务报价-报价审核查询 /project/audit/quotation/detail/:refcode
-->
<template>
  <NavBar />
  <view class="main">
    <view class="topCell">
      <u-cell-group :border="false" :stop="true">
        <u-cell title="客户经理" :value="vm.self.userName" :border="false" />
        <u-cell title="业务主管" :value="vm.self.superiorName" :border="false" />
        <u-cell title="申请编号" :value="vm.self.applyNo" :border="false" />
        <u-cell title="申请日期" :value="vm.self.applyDate ? dateFormat(vm.self.applyDate, 1) : ''" :border="false" />
      </u-cell-group>
    </view>
    <view class="special-audit">
      <!-- 额度基本信息 -->
      <base-info :self="vm.self" />
      <!-- 额度开立结果 -->
      <ty-info-card title="报价信息">
        <view class="card-cell-group">
          <u-cell-group>
            <u-cell title="手续费率(%)" :value="vm.self.quotaRate" />
            <u-cell v-if="vm.self.quotaRemark" title="备注说明" class="vertical-cell">
              <template #value>
                <view class="cell-value">
                  <text>{{ vm.self.quotaRemark }}</text>
                </view>
              </template>
            </u-cell>
          </u-cell-group>
        </view>
      </ty-info-card>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { QuotaInfo } from '@/interfaces/member/project/audit/quotation'
import { useRoute } from '@/uni-simple-router'
import apiQuotation from '@/api/member/project/audit/api.quotation'
import { decodeBase64 } from '@/utils/crypto'
import { onMounted, reactive } from 'vue'
import { dateFormat } from '@/utils/format'
import BaseInfo from './components/BaseInfo.vue'
const route = useRoute()
const refcode = Number(decodeBase64(route.value.params.refcode))
const self: QuotaInfo = {
  address: '',
  applyCcyid: '',
  applyAmt: '',
  applyNo: '',
  applyStatus: '',
  applyDate: '',
  buyerCtyDesc: '',
  buyerOrgname: '',
  ctyDesc: '',
  orgname: '',
  quotaStatus: '',
  superiorName: '',
  userName: '',
  refcode: -1,
  tenor: '',
  quotaRemark: '',
  quotaRate: '',
  checkAmt: '',
  checkCcyid: ''
}
// 业务申请信息
let vm = reactive({
  self: self
})
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 16:53:32
 * @description: 获取业务报价详情
 */
const getQuotaInfo = () => {
  apiQuotation.getQuotaInfo(refcode).then(res => {
    vm.self = res.data.quotaInfo
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
  .input-number {
    width: 100%;
  }
}
</style>
