<!--
 * @Author       : Charon.Lin
 * @Date         : 2026-02-24 09:40:24
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-17 14:57:27
 * @Description  : 项目-业务审核-开票审核-发票详情 /member/myinfo/invoice/audit
-->

<template>
  <NavBar />
  <view class="main">
    <!-- 基本信息 -->
    <base-info :self="vm.self" title="基本信息" />
    <!-- 开票信息 -->
    <invoice-info v-if="vm.self.bankrollOrgName" :fgai-app-vo="vm.self" type="audit" />
    <ty-info-card v-if="vm.self.appStatus === '11'" title="备注说明">
      <u-textarea
        v-model="submitData.auditRemark"
        :confirm-type="null"
        maxlength="300"
        placeholder-style="font-size: 28rpx;"
        class="inputValueClass"
        count
        auto-height
        placeholder="请输入备注说明"
      ></u-textarea>
    </ty-info-card>
    <ty-info-card v-if="vm.self.appStatus !== '11' && vm.self.auditRemark" title="备注说明">
      <view class="content pre-wrap summaryRemark">{{ vm.self.auditRemark }}</view>
    </ty-info-card>
    <view v-if="vm.self.appStatus === '11' && getHasPermissionsById('member:project:audit:invoice:submit')" class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button :loading="loading" block type="error" native-type="submit" @click="getInvoiceDetail('reject')">拒绝</u-button>
        <u-button :loading="loading" block type="warning" native-type="submit" @click="getInvoiceDetail('return')">退回</u-button>
        <u-button :loading="loading" block type="primary" native-type="submit" @click="getInvoiceDetail('check')">通过</u-button>
      </view>
    </view>
    <u-modal
      :show="showModalFlag"
      title="温馨提示"
      confirm-text="确定"
      :show-cancel-button="true"
      class="accessModal"
      @confirm="onConfirm"
      @cancel="showModalFlag = false"
    >
      <view class="slot-content">
        <view v-if="submitData.auditOpinion === '0'">是否确认拒绝？</view>
      </view>
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { FgaiAppVo } from '@/interfaces/member/myinfo/invoice'
import { useRoute, useRouter } from '@/uni-simple-router'
import apiInvoice from '@/api/member/myinfo/api.invoice'
import { decodeBase64 } from '@/utils/crypto'
import { isEmpty, isNotEmpty } from '@/utils/validate'
import BaseInfo from '@/pages/member/myinfo/invoice/components/BaseInfo.vue'
import InvoiceInfo from '@/pages/member/myinfo/invoice/components/InvoiceInfo.vue'
import apiAudit from '@/api/member/project/audit/api.invoice'
import { SubmitData } from '@/interfaces/member/project/audit/invoice'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
let loading = ref(false)
const route = useRoute()
const router = useRouter()

const refcode = decodeBase64(route.value.params.refcode)
const self: FgaiAppVo = {} as FgaiAppVo
// 业务申请信息
let vm = reactive({
  self: self
})
let submitData = reactive<SubmitData>({
  refcode: refcode,
  auditOpinion: '',
  auditRemark: ''
})
let showModalFlag = ref(false) // 是否显示确认弹窗
const onConfirm = () => {
  showModalFlag.value = false
  loading.value = true
  apiAudit.doSubmitAudit(submitData).then(
    () => {
      showToast('操作成功')
      setTimeout(() => {
        router.back(1)
      }, 1000)
    },
    () => {
      loading.value = false
    }
  )
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 16:53:32
 * @description: 获取发票详情
 */
const getInvoiceDetail = (type: string) => {
  apiInvoice.getInvoiceDetail(refcode).then(res => {
    if (['reject', 'return', 'check'].includes(type)) {
      if (res.data.fgaiAppVo.appStatus !== '11') {
        showToast('当前业务申请已撤回')
        setTimeout(() => {
          router.back(1)
        }, 1000)
        return
      }
      submitData.auditOpinion = type === 'check' ? '1' : type === 'reject' ? '0' : '2'
      if (['reject', 'return'].includes(type) && isEmpty(submitData.auditRemark)) {
        showToast('请输入备注说明')
        return
      }
      if (type === 'reject') {
        showModalFlag.value = true
      } else {
        onConfirm()
      }
    }
    if (type === 'init') {
      vm.self = res.data.fgaiAppVo
    }
  })
}
onMounted(() => {
  if (isNotEmpty(refcode)) {
    getInvoiceDetail('init')
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
.inputValueClass {
  min-height: 160rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
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
</style>
