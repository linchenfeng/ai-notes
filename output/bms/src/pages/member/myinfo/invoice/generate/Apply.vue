<!--
 * @Author       : Charon.Lin
 * @Date         : 2026-02-11 14:04:19
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-17 11:07:18
 * @Description  : 项目-我的-开票管理-开具发票-开票详情 /member/myinfo/invoice/generate/apply
-->

<template>
  <NavBar />
  <view class="main">
    <!-- 基本信息 -->
    <base-info :self="vm.self" title="基本信息" />
    <!-- 开票信息 -->
    <ty-info-card title="收款账户信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell title="收款企业名称" :value="vm.self.bankrollOrgName" />
          <u-cell title="缴费币种" :value="fbpaAcc.ccyidDesc" />
          <u-cell title="户名" :value="fbpaAcc.factoringMerchant" />
          <u-cell title="账号" :value="fbpaAcc.factoringAccountNo" />
          <u-cell title="开户行" :value="fbpaAcc.factoringBank" />
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="开票信息">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell v-if="fbpaAcc.invoiceType !== '1'" title="发票类型" :value="getValueByKey(vm.self.billType, 'billType')" />
          <u-cell title="开票类型" :value="getValueByKey(vm.self.generateType, 'generateType')" />
          <u-cell title="开票币种" :value="vm.self.ccyidDesc" />
          <u-cell :title="'申请开票金额(元)'" :value="moneyFormat(vm.self.generateAmt)" />
          <u-cell title="开票企业名称" :value="vm.self.appOrgName" />
          <u-cell v-if="fbpaAcc.invoiceType !== '1'" title="开票企业税号" :value="vm.self.appCreditCode" />
        </u-cell-group>
        <u-form label-width="40%">
          <u-form-item label="开票企业邮箱" required>
            <u-input v-model="submitData.email" maxlength="120" placeholder="请输入开票企业邮箱" />
          </u-form-item>
        </u-form>
      </view>
    </ty-info-card>
    <view v-if="getHasPermissionsById('member:myinfo:invoice')" class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button :loading="loading" block type="primary" class="submit" native-type="submit" @click="doSubmitInfo()">提交</u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { FgaiAppVo, FactoringListFactoringList, QueryFbpaAccList } from '@/interfaces/member/myinfo/invoice'
import { useRoute, useRouter } from '@/uni-simple-router'
import apiInvoice from '@/api/member/myinfo/api.invoice'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
import BaseInfo from '../components/BaseInfo.vue'
import { getValueByKey } from '@/utils/constant'
import { moneyFormat } from '@/utils/format'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import { isEmpty, checkEmail, isNotEmpty } from '@/utils/validate'
let loading = ref(false)
const route = useRoute()
const router = useRouter()
const refcode = Number(decodeBase64(route.value.params.refcode))
const self: FgaiAppVo = {
  refcode: refcode
} as FgaiAppVo
// 业务申请信息
let vm = reactive({
  self: self
})
// 征信非账户信息查询条件
let queryFbpaAccList = reactive<QueryFbpaAccList>({
  bankrollAccRefcode: ''
})
// 征信费账户列表
let fbpaAccList = ref<FactoringListFactoringList[]>([])
// 当前选中征信费账户
let fbpaAcc = ref<FactoringListFactoringList>({} as FactoringListFactoringList)
// 征信非账户信息查询条件
let submitData = reactive({
  refcode: '',
  applyNo: '',
  email: ''
})

const getCreditAccountInfo = () => {
  queryFbpaAccList.bankrollAccRefcode = vm.self.bankrollAccRefcode as string
  apiInvoice.getCreditAccountInfo(queryFbpaAccList).then(res => {
    fbpaAccList.value = res.data.factoringList
    if (res.data.factoringList && res.data.factoringList.length === 1) {
      fbpaAcc.value = res.data.factoringList[0]
    }
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 16:53:32
 * @description: 获取发票详情
 */
const getReserveDetail = () => {
  apiInvoice.getInvoiceDetail(refcode).then(res => {
    vm.self = res.data.fgaiAppVo
    submitData.email = res.data.fgaiAppVo.email || ''
    getCreditAccountInfo()
  })
}
const doSubmitInfo = () => {
  if (isEmpty(submitData.email)) {
    showToast('请填写开票企业邮箱')
    return
  }
  if (isNotEmpty(submitData.email) && !checkEmail(submitData.email)) {
    showToast('请输入正确的开票企业邮箱')
    return
  }
  submitData.refcode = vm.self.refcode as string
  submitData.applyNo = vm.self.applyNo as string
  loading.value = true
  apiInvoice.doSubmitReserve(submitData).then(
    () => {
      router.push(`/member/myinfo/invoice/success/${encodeBase64('1')}`)
    },
    () => {
      loading.value = false
    }
  )
}

onMounted(() => {
  getReserveDetail()
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
