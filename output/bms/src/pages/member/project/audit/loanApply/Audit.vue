<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-12-03 14:04:09
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-05 15:03:56
 * @Description  : 项目-业务审核-融资申请审核-审核 /member/project/audit/loanApply/audit
-->
<template>
  <NavBar />
  <view>
    <view class="businessApply-internation">
      <apply-info :fint-loa-vo="vm.fintLoaVo" />
      <ty-info-card title="审批意见">
        <template #subtitle>
          <view class="history">
            <text @touchstart="toHistory" @mousedown="toHistory">审批历程</text>
          </view>
        </template>
        <view class="content pre-wrap">
          <u-textarea
            ref="conditionRemarkRef"
            v-model="submitData.handleReason"
            :confirm-type="null"
            auto-height
            maxlength="1000"
            count
            class="inputValueClass"
            placeholder="请输入审批意见"
          ></u-textarea>
        </view>
      </ty-info-card>
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
          <view v-if="modalType === '1'">是否确认拒绝？</view>
          <view v-else-if="modalType === '2'">是否确认退回？</view>
        </view>
      </u-modal>
      <view v-if="getHasPermissionsById('member:project:audit:loanApply:audit')" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button :loading="loading" block type="error" native-type="submit" @click="onRefuse()">拒绝</u-button>
          <u-button :loading="loading" block type="warning" native-type="submit" @click="onReturn()">退回</u-button>
          <u-button :loading="loading" block type="primary" native-type="submit" @click="getLoanDetail('onSubmit')">通过</u-button>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { FintLoaVo } from '@/interfaces/member/project/apply/loanApply'
import { SubmitData } from '@/interfaces/member/project/audit/loanApply'
import NavBar from '@/layout/NavBar.vue'
import { reactive } from 'vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import apiLoanApply from '@/api/member/project/apply/api.loanApply'
import apiLoanAudit from '@/api/member/project/audit/api.loanApply'
import { isNotEmpty, isEmpty } from '@/utils/validate'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
import { useRouter, useRoute } from '@/uni-simple-router'
import ApplyInfo from '@/pages/member/project/apply/loanApply/components/ApplyInfo.vue'
const router = useRouter()
const route = useRoute()
let loading = ref(false)
const conditionRemarkRef = ref()
let showModalFlag = ref(false) //提示弹窗
let modalType = ref('') //弹窗类型 1拒绝2退回
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
const onSubmit = () => {
  loading.value = true
  apiLoanAudit.doSubmitApproval(submitData).then(
    () => {
      showToast('操作成功')
      setTimeout(() => {
        router.back(1)
        loading.value = false
      }, 1500)
    },
    () => {
      showModalFlag.value = false
      loading.value = false
    }
  )
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:53:51
 * @param {*}
 * @description: 获取融资详情
 */
const getLoanDetail = (type?) => {
  apiLoanApply.getLoanDetail(refcode).then(res => {
    vm.fintLoaVo = res.data.fintLoaVo
    vm.fintLoaVo.guaList = vm.fintLoaVo.guaList || []
    if (vm.fintLoaVo.loanStatus !== '1') {
      showToast('当前融资申请状态已变更')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    if (type === 'onRefuse') {
      modalType.value = '1'
      showModalFlag.value = true
    } else if (type === 'onReturn') {
      modalType.value = '2'
      showModalFlag.value = true
    } else if (type === 'onSubmit') {
      modalType.value = '3'
      submitData.handleResult = 'C'
      onSubmit()
    }
  })
}
// 拒绝
const onRefuse = () => {
  if (isEmpty(submitData.handleReason)) {
    scrollTo(0, 99999)
    showToast('请输入审批意见')
    if (conditionRemarkRef.value && conditionRemarkRef.value.$el) {
      const textarea = conditionRemarkRef.value.$el.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
      }
    }
    return
  }
  getLoanDetail('onRefuse')
}
// 退回
const onReturn = () => {
  if (isEmpty(submitData.handleReason)) {
    scrollTo(0, 99999)
    showToast('请输入审批意见')
    if (conditionRemarkRef.value && conditionRemarkRef.value.$el) {
      const textarea = conditionRemarkRef.value.$el.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
      }
    }
    return
  }
  getLoanDetail('onReturn')
}
const onConfirm = () => {
  if (modalType.value === '1') {
    submitData.handleResult = 'A'
    onSubmit()
  } else if (modalType.value === '2') {
    submitData.handleResult = 'B'
    onSubmit()
  }
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
.inputValueClass {
  min-height: 160rpx;
  max-height: 320rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
    max-height: 320rpx;
    .uni-textarea-wrapper {
      max-height: 320rpx !important;
    }
    .uni-textarea-textarea {
      overflow-y: scroll !important;
    }
  }
}
.history {
  font-size: 26rpx;
  color: $primary;
  font-weight: normal;
  flex: 1;
  text-align: right;
}
</style>
