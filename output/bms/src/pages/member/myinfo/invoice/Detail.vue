<!--
 * @Author       : Charon.Lin
 * @Date         : 2026-02-24 09:40:24
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-19 22:12:34
 * @Description  : 项目-我的-开票管理-发票详情 /member/myinfo/invoice/detail
-->

<template>
  <NavBar />
  <view class="main">
    <up-sticky bg-color="#fff">
      <state-module
        v-if="isNotEmpty(vm.self.showStatus)"
        :state-name="getValueByKey(vm.self.showStatus, 'fgaiAppStatus')"
        :state-color="stateColor[vm.self.showStatus]"
      ></state-module>
    </up-sticky>
    <view v-if="vm.self.appStatus === '0' && isNotEmpty(vm.self.refuseRemark)" class="returnReason">
      <view>
        <text>拒绝原因：</text>
        <text class="reasonValue">
          {{ vm.self.refuseRemark }}
        </text>
      </view>
    </view>
    <view
      v-if="(vm.self.appStatus === '14' || vm.self.appStatus === '12' || vm.self.confirmStatus === '3') && isNotEmpty(vm.self.returnRemark)"
      class="returnReason"
    >
      <view>
        <text>退回原因：</text>
        <text class="reasonValue">
          {{ vm.self.returnRemark }}
        </text>
      </view>
    </view>
    <!-- 基本信息 -->
    <base-info :self="vm.self" title="基本信息" />
    <!-- 开票信息 -->
    <invoice-info v-if="vm.self.bankrollOrgName" :fgai-app-vo="vm.self" />
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { FgaiAppVo } from '@/interfaces/member/myinfo/invoice'
import { useRoute } from '@/uni-simple-router'
import apiInvoice from '@/api/member/myinfo/api.invoice'
import { decodeBase64 } from '@/utils/crypto'
import { isNotEmpty } from '@/utils/validate'
import BaseInfo from './components/BaseInfo.vue'
import InvoiceInfo from './components/InvoiceInfo.vue'
import { getValueByKey } from '@/utils/constant'
import StateModule from '@/plugins/StateModule.vue'

const stateColor = {
  '0': 'error',
  '10': 'warning',
  '11': 'warning',
  '12': 'warning',
  '13': 'warning',
  '4': 'success'
}
const route = useRoute()
const refcode = decodeBase64(route.value.params.refcode)
const self: FgaiAppVo = {} as FgaiAppVo
// 业务申请信息
let vm = reactive({
  self: self
})
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 16:53:32
 * @description: 获取发票详情
 */
const getInvoiceDetail = () => {
  apiInvoice.getInvoiceDetail(refcode).then(res => {
    vm.self = res.data.fgaiAppVo
  })
}
onMounted(() => {
  if (isNotEmpty(refcode)) {
    getInvoiceDetail()
  }
})
</script>

<style lang="scss" scoped>
.main {
  background: #f6f6f6;
  padding: 0;
}
.returnReason {
  background: #fff;
  padding: 60rpx 30rpx 0 30rpx;
  margin-bottom: -20rpx;
  font-size: 28rpx;
  .reasonValue {
    color: $danger;
    word-break: break-all;
    & :first-child {
      word-break: break-all;
    }
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
