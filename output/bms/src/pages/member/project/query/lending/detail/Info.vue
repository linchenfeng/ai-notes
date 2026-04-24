<!--
 * @Author       : longcan.Yang
 * @Date         : 2022-10-18 16:23:13
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-07-15 13:55:00
 * @Description  : 项目详情
-->
<template>
  <NavBar />
  <view class="projectInfo">
    <view class="detail">
      <view class="contain">
        <u-row>
          <u-col span="24" class="ellipsis">{{ vm.floaArpMVo.orgname }}</u-col>
        </u-row>
      </view>
      <u-cell-group inset>
        <view class="item-title">
          <u-cell title="交易对手名称" :value="vm.floaArpMVo.buyerName" />
          <u-cell title="融资申请日" :value="dateFormat(vm.floaArpMVo.applyDate)" />
          <u-cell title="融资申请编号" :value="vm.floaArpMVo.loanNo" />
          <u-cell title="状态" :value="getValueByKey(vm.floaArpMVo.approveStatus, 'approveStatus')" />
          <u-cell v-if="vm.floaArpMVo.loanStatus === '3'" title="拒绝原因" :value="vm.floaArpMVo.remark" />
          <u-cell title="申请融资金额(元)" :value="moneyFormat(vm.floaArpMVo.applyAmt)" />
          <u-cell v-if="vm.floaArpMVo.loanSource === '1'" title="应收账款金额(元)" :value="moneyFormat(vm.floaArpMVo.ttlInvoiceAmt)" />
          <u-cell title="交易币种" :value="getValueByKey(vm.floaArpMVo.ccyid, 'ccyid')" />

          <view v-if="vm.floaArpMVo.approveStatus === '4'">
            <u-cell title="融资金额(元)" :value="moneyFormat(vm.floaArpMVo.loanAmt)" />
            <u-cell title="实际放款日期" :value="dateFormat(vm.floaArpMVo.loanDate)" />
            <u-cell title="计息天数(天)" :value="vm.floaArpMVo.loanDays" />
            <u-cell title="利息金额(元)" :value="moneyFormat(vm.floaArpMVo.intAmt)" />
            <u-cell title="费用金额(元)" :value="moneyFormat(vm.floaArpMVo.feeAmt)" />
            <u-cell title="预缴后金额(元)" :value="moneyFormat(vm.floaArpMVo.actualLoanAmt)" />
          </view>
          <view v-if="vm.floaArpMVo.loanSource === '1'">
            <u-cell title="融资余额(元)" :value="moneyFormat(vm.floaArpMVo.financingAmt)" />
            <u-cell title="已还金额(元)" :value="moneyFormat(vm.floaArpMVo.totalRepayAmt)" />
            <u-cell title="结清状态" :value="getValueByKey(vm.floaArpMVo.repayStatus, 'repayStatus')" />
          </view>
          <u-cell title="融资到期日" :value="dateFormat(vm.floaArpMVo.loanEndDate)" />
        </view>
      </u-cell-group>
    </view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'ProjectInfo'
}
</script>
<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { FloaArpMVo } from '@/interfaces/member/project/query/projectStatistics'
import apiProject from '@/api/member/api.project'
import { decodeBase64 } from '@/utils/crypto'
import { moneyFormat } from '@/utils/format'
import { getValueByKey } from '@/utils/constant'
import { dateFormat } from '@/utils/format'
import { useRoute } from '@/uni-simple-router'
const data: FloaArpMVo = {
  orgname: '',
  buyerName: '',
  applyDate: '',
  loanEndDate: '',
  loanNo: '',
  approveStatus: '',
  applyAmt: 0,
  ttlInvoiceAmt: 0,
  loanAmt: 0,
  loanDays: 0,
  intAmt: 0,
  feeAmt: 0,
  actualLoanAmt: 0,
  loanSource: '',
  ccyid: '',
  loanDate: '',
  financingAmt: 0,
  totalRepayAmt: 0,
  repayStatus: '',
  loanStatus: '',
  remark: ''
}
const vm = reactive({
  floaArpMVo: data
})
const route = useRoute()
let refcode = Number(decodeBase64(route.value.params.refcode as string)) //客户流水号
const getProjectInfo = () => {
  apiProject.getProjectInfo(refcode).then(res => {
    vm.floaArpMVo = res.data
  })
}
onMounted(() => {
  getProjectInfo()
})
</script>

<style lang="scss" scoped>
.projectInfo {
  .contain {
    font-size: 32rpx;
    padding: 30rpx 30rpx 0 30rpx;

    .ellipsis {
      padding: 0 !important;
      font-weight: 700;
    }
  }
}
</style>
