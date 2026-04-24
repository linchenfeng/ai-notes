<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-02 18:58:02
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-31 09:56:25
 * @Description  : 项目-业务申请-预警解除申请-企业风险信息 member/project/apply/warning/riskDetail
-->
<template>
  <NavBar></NavBar>
  <view class="detail-group">
    <u-cell-group :border="false" :stop="true">
      <u-cell title="企业名称" :value="vm.qccListVo.orgname" :border="false" />
      <u-cell title="统一社会信用代码" :value="vm.qccListVo.companyCreditCode" :border="false" />
      <u-cell title="风险级别名称（企查查定义）" :value="vm.qccListVo.categoryName" :border="false" />
      <u-cell title="主分类名称" :value="vm.qccListVo.mainTypeName" :border="false" />
      <u-cell title="子分类名称" :value="vm.qccListVo.typeName" :border="false" />
      <u-cell title="变动方式名称" :value="vm.qccListVo.changeWayName" :border="false" />
      <u-cell title="变动内容" :value="vm.qccListVo.changeContent" :border="false" />
      <u-cell title="变动前内容" :value="vm.qccListVo.beforeValue" :border="false" />
      <u-cell title="变动后内容" :value="vm.qccListVo.afterValue" :border="false" />
      <u-cell title="变动日期" :value="dateFormat(vm.qccListVo.changeDate)" :border="false" />
      <u-cell title="数据获取时间" :value="dateFormat(vm.qccListVo.pushDate, 2)" :border="false" />
    </u-cell-group>
  </view>
</template>

<script setup lang="ts">
import { QccList } from '@/interfaces/member/project/apply/warningApproval'
import NavBar from '@/layout/NavBar.vue'
import { getStorage } from '@/utils/storages'
import { dateFormat } from '@/utils/format'
let qccListVo: QccList = {
  afterValue: '',
  beforeValue: '',
  categoryName: '',
  changeContent: '',
  changeDate: '',
  changeWayName: '',
  mainTypeName: '',
  orgname: '',
  pushDate: '',
  typeName: ''
}
let vm = reactive({
  qccListVo
})
onMounted(() => {
  vm.qccListVo = getStorage('business-risk-data') as QccList
})
</script>

<style scoped></style>
