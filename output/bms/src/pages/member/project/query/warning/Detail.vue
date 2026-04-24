<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-25 16:39:05
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2025-08-11 13:56:37
 * @Description  : 项目-业务查询-预警解除申请详情 /member/project/query/warning/detail
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
    <view class="topCell">
      <u-cell-group :border="false" :stop="true">
        <view class="item-title">
          <u-cell title="客户经理" :value="vm.self.clmUserName" :border="false" />
        </view>
        <view class="item-title">
          <u-cell title="业务主管" :value="vm.self.managerUserName" :border="false" />
        </view>
        <view class="item-title">
          <u-cell title="申请人" :value="vm.self.applyUserName" :border="false" />
        </view>
        <view class="item-title">
          <u-cell title="申请日期" :value="vm.self.applyDate ? dateFormat(vm.self.applyDate, 1) : ''" :border="false" />
        </view>
      </u-cell-group>
    </view>

    <view class="special-audit">
      <!-- 特批基本信息 -->
      <BasicInfo :self="vm.self" type="audit"></BasicInfo>

      <!-- 特批审批历程 -->
      <History></History>
    </view>
  </view>
</template>

<script setup lang="ts">
import StateModule from '@/plugins/StateModule.vue'
import BasicInfo from '@/pages/member/project/audit/warning/components/BasicInfo.vue'
import History from '@/pages/member/project/audit/warning/History.vue'
import NavBar from '@/layout/NavBar.vue'
import { WarningAppInfo } from '@/interfaces/member/project/apply/warningApproval'
import { useRoute, useRouter } from '@/uni-simple-router'
import apiWarningApprovalQuery from '@/api/member/project/query/api.warningApprovalQuery'
import { /* encodeBase64, */ decodeBase64 } from '@/utils/crypto'
import { showToast } from '@/utils/uniapp/toast'
// import { onPageScroll } from '@dcloudio/uni-app'
import { dateFormat } from '@/utils/format'
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
const self: WarningAppInfo = {
  applyStatus: '',
  applyDate: '',
  applyNo: '',
  apxList: [],
  qccList: [],
  clmUserName: '',
  monitorObjectId: '',
  customerName: '',
  managerUserName: '',
  monitorObjectName: '',
  monitorObjectType: '',
  monitorOrgType: '',
  remark: '',
  warningLevel: '',
  ruleName: '',
  warningTriggerTime: '',
  serialRefcode: '',
  warningNextLogic: '',
  applyUser: '',
  applyUserName: ''
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
const getWarningAppInfo = () => {
  const data = {
    refcode: submitData.refcode,
    queryFlag: '0'
  }
  apiWarningApprovalQuery.getWarningAppInfo(data).then(res => {
    if (res.data.nodata === '1') {
      showToast('当前业务申请已删除')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    vm.self = res.data.warningVo as unknown as WarningAppInfo
    vm.self.apxList = res.data.apxList
    vm.self.qccList = res.data.qccList
  })
}
onMounted(() => {
  getWarningAppInfo()
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
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}
</style>
