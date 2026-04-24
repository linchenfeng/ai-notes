<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-12-03 14:04:09
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-03 16:29:53
 * @Description  : 项目-业务审核-融资申请审核-详情 /member/project/audit/loanApply/detail
-->
<template>
  <NavBar />
  <view>
    <view class="businessApply-internation">
      <apply-info :fint-loa-vo="vm.fintLoaVo" />
      <ty-info-card title="审批意见" class="history-card">
        <template #subtitle>
          <view class="history">
            <text @touchstart="toHistory" @mousedown="toHistory">审批历程</text>
          </view>
        </template>
      </ty-info-card>
    </view>
  </view>
</template>
<script setup lang="ts">
import { FintLoaVo } from '@/interfaces/member/project/apply/loanApply'
import { SubmitData } from '@/interfaces/member/project/audit/loanApply'
import NavBar from '@/layout/NavBar.vue'
import { reactive } from 'vue'
import apiLoanApply from '@/api/member/project/apply/api.loanApply'
import { isNotEmpty } from '@/utils/validate'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
import { useRouter, useRoute } from '@/uni-simple-router'
import ApplyInfo from '@/pages/member/project/apply/loanApply/components/ApplyInfo.vue'
const router = useRouter()
const route = useRoute()
let refcode = '' // 融资申请流水号
let fintLoaVo: FintLoaVo = {
  /**
   * 申请日期，【未传递流水号自动初始化】
   */
  applyDate: '',
  /**
   * 申请备注说明
   */
  applyRemark: '',
  /**
   * 客户经理，【未传递流水号自动初始化】
   */
  applyUser: '',
  /**
   * 客户经理名称，【未传递流水号自动初始化】
   */
  applyUsername: '',
  /**
   * 业务大类，3=跨境电商（前端不传后端默认）
   */
  bizScene: '',
  /**
   * 共借人法人名称
   */
  borrowerLegalPerson: '',
  /**
   * 共借人名称
   */
  borrowerPerson: '',
  /**
   * 过桥对手方
   */
  bridgeCounterparty: '',
  /**
   * 是否需要过桥[0=否/1=是]
   */
  bridgeLoanFlag: '',
  /**
   * 过桥类型[1=单锁过桥/2=双锁过桥]
   */
  bridgeLoanType: '',
  /**
   * 字符渠道名称，第三方获取
   */
  channelName: '',
  /**
   * 用户编号
   */
  companyCreditCode: '',
  /**
   * 授信产品[1=天e贸/2=天e贷]，可多选（逗号拼接）
   */
  creditProducts: '',
  guaList: [],
  /**
   * 法人名称
   */
  legalPerson: '',
  /**
   * 币种
   */
  loanCcyid: '',
  /**
   * 月利率%，天e贸必填
   */
  loanMonthRate: '',
  /**
   * 年利率%，天e贷必填
   */
  loanYearRate: '',
  /**
   * 客户名称
   */
  orgname: '',
  /**
   * 产品类型
   */
  productType: '',
  /**
   * 预估额度说明
   */
  quotaRemark: '',
  /**
   * 流水号，保存后存在
   */
  refcode: '',
  /**
   * 业务主管，【未传递流水号自动初始化】
   */
  superiorUserid: '',
  /**
   * 业务主管名称，【未传递流水号自动初始化】
   */
  superiorUsername: '',
  /**
   * 融资状态，[0=已保存/1=审核中/2=已退回/3=已拒绝/4=已撤回/9=已审核]
   */
  loanStatus: ''
}
let submitData: SubmitData = {
  /**
   * 审批意见，拒绝/退回必填
   */
  handleReason: '',
  /**
   * 处理结果，A=拒绝/B=打回/C=通过
   */
  handleResult: '',
  /**
   * 业务流水号
   */
  refcode: ''
}
let vm = reactive({
  fintLoaVo: fintLoaVo, // 申请信息
  submitData: submitData //提交信息
})

const getLoanDetail = () => {
  apiLoanApply.getLoanDetail(refcode).then(res => {
    vm.fintLoaVo = res.data.fintLoaVo
    vm.fintLoaVo.guaList = vm.fintLoaVo.guaList || []
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-12-10 10:25:44
 * @description: 历史审批历程
 */
const toHistory = () => {
  router.push(`/member/project/audit/loanApply/history/${encodeBase64(refcode)}`)
}
onMounted(() => {
  if (route.value.params) {
    if (isNotEmpty(route.value.params.refcode)) {
      refcode = decodeBase64(route.value.params.refcode)
      vm.submitData.refcode = refcode
      getLoanDetail()
    }
  }
})
</script>

<style lang="scss" scoped>
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
.history-card {
  padding-bottom: 20rpx;
}
.history {
  font-size: 26rpx;
  color: $primary;
  font-weight: normal;
  flex: 1;
  text-align: right;
}
</style>
