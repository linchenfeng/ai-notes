<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-17 16:58:52
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-30 17:22:53
 * @Description  : 现场尽调详情  /member/project/apply/siteDueDiligence/detail/:cddRefcode
-->
<template>
  <NavBar></NavBar>
  <view>
    <!-- 客户信息 -->
    <CusInformation :org-info="vm.customerInfo.orgInfo" :org-his-trade-list="vm.customerInfo.orgHisTradeList"></CusInformation>
    <ty-info-card title="尽调任务要求">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell :stop="false" title="尽调截止日" :value="dateFormat(vm.customerInfo.orgInfo.endDate)" :border="false" />
          <u-cell :stop="false" title="尽调要求" :border="false" />
          <view class="remark-box">{{ vm.customerInfo.orgInfo.remark }}</view>
        </u-cell-group>
      </view>
    </ty-info-card>
    <!-- 尽调结果查询 -->
    <DueDiligenceResult :refcode="refcode" :first-show-line="true"></DueDiligenceResult>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { useRoute } from '@/uni-simple-router'
import CusInformation from './components/CusInformation.vue'
import { decodeBase64 } from '@/utils/crypto'
import apiSiteDueDiligence from '@/api/member/project/apply/api.siteDueDiligence'
import { CustomerInfo } from '@/interfaces/member/project/apply/siteDueDiligence'
import DueDiligenceResult from '@/pages/member/project/audit/assignDueDiligence/components/DueDiligenceResult.vue'
import { dateFormat } from '@/utils/format'
const route = useRoute()
let refcode = ref(0)
// 尽调客户详情
const customerInfo: CustomerInfo = {
  orgHisTradeList: [],
  orgInfo: {
    applyDate: '',
    applyUser: '',
    appointStatus: '',
    businessNo: '',
    businessScope: '',
    cddSuperior: '',
    cddSuperiorName: '',
    companyCreditCode: '',
    completionDate: '',
    ctyDesc: '',
    ctyid: '',
    endDate: '',
    legalLinkman: '',
    legalLinkmanPhone: '',
    legalPerson: '',
    legalPhone: '',
    operateAddress: '',
    optionalCddUsers: '',
    orgname: '',
    refcode: 0,
    regDate: '',
    remark: ''
  }
}
const vm = reactive({
  customerInfo
})
// 现场尽调客户详情查询
const queryCddCustomerInfo = () => {
  apiSiteDueDiligence.queryCddCustomerInfo(refcode.value).then(res => {
    vm.customerInfo = res.data
    vm.customerInfo.orgInfo.regDate = dateFormat(res.data.orgInfo.regDate || '')
  })
}
onBeforeMount(() => {
  refcode.value = Number(decodeBase64(route.value.params.cddRefcode)) // 尽调流水号
  queryCddCustomerInfo()
})
</script>

<style lang="scss" scoped>
.remark-box {
  margin: -24rpx 0 34rpx;
}
.task-require {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 34rpx;
}
</style>
