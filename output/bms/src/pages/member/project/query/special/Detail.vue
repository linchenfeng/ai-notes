<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-25 16:39:05
 * @LastEditors  : xujie.yu
 * @LastEditTime : 2025-09-04 15:27:56
 * @Description  : 项目-业务查询-特批详情 /member/project/query/special/detail
-->
<template>
  <NavBar />
  <view class="main">
    <u-sticky bg-color="#fff">
      <state-module
        v-if="vm.self.applyStatus"
        :state-name="stateName[vm.self.applyStatus]"
        :state-color="stateColor[vm.self.applyStatus]"
      ></state-module>
    </u-sticky>
    <view class="special-audit">
      <!-- 特批基本信息 -->
      <BasicInfo :self="vm.self" identity="query"></BasicInfo>
      <!-- 问答列表 -->
      <QaList ref="qaListRef" :refcode="submitData.refcode" :answer-flag="getHasPermissionsById('member:project:query:special')"></QaList>
      <!-- 特批审批历程 -->
      <History></History>
    </view>
  </view>
</template>

<script setup lang="ts">
import StateModule from '@/plugins/StateModule.vue'
import BasicInfo from '@/pages/member/project/audit/special/components/BasicInfo.vue'
import History from '@/pages/member/project/audit/special/History.vue'
import { getHasPermissionsById } from '@/utils/permissions'
import NavBar from '@/layout/NavBar.vue'
import { SaveSpecialVo } from '@/interfaces/member/project/apply/specialApproval'
import { useRoute, useRouter } from '@/uni-simple-router'
import apiSpecialApprovalQuery from '@/api/member/project/query/api.specialApprovalQuery'
import { /* encodeBase64, */ decodeBase64 } from '@/utils/crypto'
import { showToast } from '@/utils/uniapp/toast'
import QaList from '@/pages/member/project/audit/special/components/QaList.vue'
// import { onPageScroll } from '@dcloudio/uni-app'
// import { dateFormat } from '@/utils/format'
// import router from '@/router'
const router = useRouter()
const route = useRoute()
// let showFixed = ref(false)
const stateName = {
  '0': '已保存',
  '1': '审批中',
  '2': '已退回',
  '3': '已通过',
  '4': '已拒绝'
}
const stateColor = {
  '0': 'primary',
  '1': 'warning',
  '2': 'warning',
  '3': 'success',
  '4': 'error'
}
const self: SaveSpecialVo = {
  applyRemark: '',
  applyType: '',
  applyTypeDesc: '',
  apxList: [],
  bizScene: '',
  orgname: '',
  productType: '',
  applyDate: '',
  orgLocList: [],
  legalPerson: '',
  jointBorrower: '',
  guarantor: '',
  shopList: [],
  applyTemporaryAmt: 0,
  applyCcyid: '',
  creditApplyProduct: '',
  buyerName: '',
  applySpecialAmt: 0,
  applyValidType: '',
  applyValidStartDate: '',
  applyValidPeriod: '',
  handleSummary: '',
  applyValidTypeDesc: '',
  creditPlatform: '',
  creditPlatformDesc: ''
}

// 提交的数据
const submitData = {
  refcode: Number(decodeBase64(route.value.params.refcode)), // 申请流水号
  taskRefcode: Number(decodeBase64(route.value.params.taskRefcode)), // 任务流水号
  handleResult: '', // 【A=拒绝/B=打回/C=通过/D=批注】
  handleReason: '' // 审批意见
}

// 业务申请信息
let vm = reactive({
  self: self
})

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 16:53:32
 * @description: 获取特批申请详情
 */
const getSpecialAppInfo = () => {
  const data = {
    refcode: submitData.refcode
  }
  apiSpecialApprovalQuery.getSpecialAppInfo(data).then(res => {
    if (res.data.nodata === '1') {
      showToast('当前业务申请已删除')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    vm.self = res.data.saaVo as unknown as SaveSpecialVo
    vm.self.apxList = res.data.apxList
    vm.self.orgLocList = res.data.orgLocList
  })
}
onMounted(() => {
  getSpecialAppInfo()
})
</script>

<style lang="scss" scoped>
.main {
  background: #f6f6f6;
  padding: 0;
}
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}
</style>
