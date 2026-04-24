<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-25 16:39:05
 * @LastEditors  : may.ruan
 * @LastEditTime : 2026-02-05 20:33:20
 * @Description  : 项目-业务审核-业务准入审核 /member/project/audit/access/audit
-->
<template>
  <NavBar />
  <view class="main">
    <up-sticky bg-color="#fff">
      <state-module
        v-if="vm.self.intLoanStatus"
        :state-name="['1'].includes(vm.self.intLoanStatus) ? applyStateName[vm.self.applyStatus] : stateName[vm.self.intLoanStatus]"
        :state-color="['1'].includes(vm.self.intLoanStatus) ? applyStateColor[vm.self.applyStatus] : stateColor[vm.self.intLoanStatus]"
      ></state-module>
    </up-sticky>
    <view class="topCell">
      <view v-if="vm.self.postponeRemark" class="returnReason">
        <view>
          <text>暂缓原因：</text>
          <text class="reasonValue">
            {{ vm.self.postponeRemark }}
          </text>
        </view>
      </view>
      <u-cell-group>
        <u-cell title="客户经理" :value="vm.self.userName" />
        <u-cell title="业务主管" :value="vm.self.superiorName" />
        <u-cell title="申请日期" :value="vm.self.applyDate ? dateFormat(vm.self.applyDate, 1) : ''" />
      </u-cell-group>
    </view>
    <view class="business-access-audit">
      <!-- 买方基本信息、贸易基本信息 -->
      <BasicInfo v-if="!isEmpty(vm.self.refcode)" :self="vm.self" type="audit" :refcode="submitData.refcode" :task-type="taskType"></BasicInfo>
      <!-- 本次准入买方和历史准入买方 -->
      <AccessInfo v-if="!isEmpty(vm.self.refcode)" :self="vm.self" />
      <!-- 问答列表 -->
      <QaList
        ref="qaListRef"
        :refcode="submitData.refcode"
        type="audit"
        :answer-flag="['1', '2', '3', '7', '8', '10'].includes(taskType) && vm.self.intLoanStatus !== '4' ? '1' : '0'"
      ></QaList>
      <!--待终审或已终审人点查看历程 -->
      <!-- <ty-info-card
        v-if="
          isNotEmpty(vm.approveItem.nodeOperatorName) &&
          ((vm.self.examineType === 'F' && vm.self.approvalFlag === '1') || Number(vm.self.operationLevel) > 0)
        "
        title="准入历程"
      >
        <view class="one-levlel-card">
          <text class="user-name">{{ cutEnStr(vm.approveItem.nodeOperatorName) }}</text>
          {{ `于${vm.approveItem.handleTime ? dateFormat(vm.approveItem.handleTime, 2) : ''}准入通过` }}
          <view v-if="!isEmpty(vm.approveItem.handleReason)" class="content review-remark">
            <view class="pre-wrap">准入说明：{{ vm.approveItem.handleReason }}</view>
          </view>
        </view>
      </ty-info-card> -->
      <!-- 已申请|已提问|已回复页签进入且当前节点是审批或批注时展示备注输入框 -->
      <ty-info-card v-if="['1', '2', '3'].includes(taskType) && vm.self.examineType && ['A', 'B'].includes(vm.self.examineType)" title="备注说明">
        <u-textarea
          v-model="submitData.approveRemark"
          :confirm-type="null"
          maxlength="300"
          placeholder-style="font-size: 28rpx;"
          class="inputValueClass"
          count
          auto-height
          placeholder="请输入备注说明"
        ></u-textarea>
      </ty-info-card>
      <!-- 准入历程 -->
      <History />
      <!-- 已申请,已准入,已回复，已暂缓展示操作按钮 -->
      <view
        v-if="getHasPermissionsById('member:project:audit:access:approve') && ['1', '2', '3', '10'].includes(taskType)"
        class="button-fixed-bottom"
      >
        <view class="placeholder"></view>
        <view class="fixed">
          <!-- 终审|审批|批注拥有提问权限 -->
          <view v-if="vm.self.examineType && ['A', 'B', 'F'].includes(vm.self.examineType)" class="vteam-button" @click="onQuestion">
            <view class="vteam-button-icon">
              <text class="iconfont icon-tiwen1"></text>
            </view>
            <view class="vteam-button-text">
              <text>{{ '提问' }}</text>
            </view>
          </view>
          <!-- 终审|审批|拥有拒绝权限 -->
          <u-button
            v-if="vm.self.examineType && ['A', 'F'].includes(vm.self.examineType)"
            :loading="loading"
            block
            type="error"
            native-type="submit"
            @click="getOverseasBusinessInfo('onRefuse')"
          >
            拒绝
          </u-button>
          <!-- 终审拥有暂缓权限 -->
          <u-button
            v-if="vm.self.examineType && ['F'].includes(vm.self.examineType) && taskType !== '10'"
            :loading="loading"
            block
            native-type="submit"
            type="warning"
            @click="getOverseasBusinessInfo('postpone')"
          >
            暂缓
          </u-button>
          <!-- 终审|审批|批注|确认拥有通过权限 -->
          <u-button
            v-if="vm.self.examineType && ['A', 'B', 'F', 'C'].includes(vm.self.examineType)"
            :loading="loading"
            block
            type="primary"
            class="submit"
            native-type="submit"
            @click="getOverseasBusinessInfo('pass')"
          >
            {{ ['B', 'C'].includes(vm.self.examineType) ? '提交' : '通过' }}
          </u-button>
          <!-- 终审拥有有条件通过权限 -->
          <u-button
            v-if="vm.self.examineType && ['F'].includes(vm.self.examineType)"
            :loading="loading"
            block
            native-type="submit"
            type="primary"
            @click="getOverseasBusinessInfo('condition')"
          >
            有条件通过
          </u-button>
        </view>
      </view>
    </view>
    <u-modal
      :show="showModalFlag"
      title="温馨提示"
      :confirm-text="['1', '3', '4', '9'].includes(modalType) ? '确定' : '提交'"
      :show-cancel-button="true"
      class="accessModal"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
      <view class="slot-content">
        <view v-if="modalType === '1'">是否确认拒绝？</view>
        <view v-else-if="['3', '4', '9'].includes(modalType)">
          {{ vm.self.fintAplDtcVoList[0].counterpartyName }}待核查信息未反馈，请确认是否提交？
        </view>
      </view>
    </u-modal>
    <!-- 提问 -->
    <ty-pop-text-area v-model:model-value="questions" :show-popup="showPopup" placeholder="请输入提问的内容" @close="showPopup = false">
      <template #btn>
        <u-button type="primary" :loading="loading" @click="submitQuestion()">发送</u-button>
      </template>
    </ty-pop-text-area>
    <!-- 有条件通过说明 -->
    <ty-pop-text-area v-model:model-value="conditionRemark" :show-popup="showCondition" placeholder="请输入条件说明" @close="showCondition = false">
      <template #btn>
        <u-button type="primary" :loading="loading" @click="doApproveOverseasBusinessInfo">提交</u-button>
      </template>
    </ty-pop-text-area>
    <!-- 点击暂缓时展示 -->
    <ty-pop-text-area
      v-model:model-value="postponeRemark"
      :show-popup="showPostponeRemark"
      placeholder="请输入暂缓原因"
      @close="showPostponeRemark = false"
    >
      <template #btn>
        <u-button type="primary" :loading="loading" @click="doApproveOverseasBusinessInfo">提交</u-button>
      </template>
    </ty-pop-text-area>
  </view>
</template>

<script setup lang="ts">
import StateModule from '@/plugins/StateModule.vue'
import BasicInfo from './components/BasicInfo.vue'
import AccessInfo from './components/AccessInfo.vue'
import QaList from './components/QaList.vue'
import { getHasPermissionsById } from '@/utils/permissions'
import NavBar from '@/layout/NavBar.vue'
import { getValueByKey } from '@/utils/constant'
import { FintAplMVo } from '@/interfaces/member/project/apply/businessApply'
import { useRoute, useRouter } from '@/uni-simple-router'
import apiBusinessApply from '@/api/member/project/apply/api.businessApply'
import apiBusinessAccess from '@/api/member/project/audit/api.businessAccess'
import { decodeBase64 } from '@/utils/crypto'
import { onMounted, reactive, ref } from 'vue'
import { showToast } from '@/utils/uniapp/toast'
import { dateFormat } from '@/utils/format'
import { isEmpty, isNotEmpty } from '@/utils/validate'
import apiCheck from '@/api/member/project/audit/api.check'
import { ApproveList } from '@/interfaces/member/project/audit/businessAccess'
import History from '@/pages/member/project/query/access/History.vue'
const router = useRouter()
let loading = ref(false)
let showModalFlag = ref(false) // 展示提示框
let showPopup = ref(false) // 展示提问框
let showCondition = ref(false) // 展示条件框
let showPostponeRemark = ref(false) // 展示暂缓原因框
const qaListRef = ref()
let modalType = ref('') // 弹窗类型【1=拒绝提示/3=确定提交/4有条件通过/9暂缓存】
let questions = ref('') // 提问的内容
let conditionRemark = ref('') // 条件备注
let postponeRemark = ref('') // 暂缓原因
const route = useRoute()
/**
 * 路由参数 1-已申请 2-已提问 3-已回复 10-已暂缓 8-已准入 9 已拒绝 7 已提交
 */
const taskType = decodeBase64(route.value.params.taskType) as string
const stateColor = {
  '1': 'warning',
  '3': 'success',
  '4': 'error',
  '6': 'warning',
  '5': 'warning',
  '0': 'warning',
  '2': 'error',
  '7': 'warning',
  '8': 'error',
  '9': 'warning',
  '10': 'warning'
}
const applyStateName = {
  '1': '已申请',
  '2': '已提问',
  '3': '已回复'
}
const applyStateColor = {
  '1': 'warning',
  '2': 'warning',
  '3': 'warning'
}
const self: FintAplMVo = {
  intLoanStatus: '',
  returnReason: '',
  rejectReason: '',
  annualTurnover: '',
  ccyid: '',
  counterpartyName: '',
  ctyid: '',
  futureAnnualTurnover: '',
  orgctyid: '',
  orgname: '',
  productName: '',
  projectSource: '',
  tenor: '',
  ctyDesc: '',
  orgctyDesc: '',
  ccyidDesc: '',
  superiorName: '',
  superior: '',
  userName: '',
  applyStatus: '',
  referFlag: '',
  applyDate: '',
  tenorStartType: '',
  tenorStartDesc: '',
  transactionYears: '',
  productType: '',
  isSubmit: '',
  finalApproval: '',
  approveLevel: 0,
  oneLevelUserName: '',
  oneLevelApproveDate: '',
  customType: '',
  examineType: '',
  fintAplDtcVoList: []
}
// 提交的数据
const submitData = {
  refcode: Number(decodeBase64(route.value.params.refcode)),
  intLoanStatus: '', // 【3=准入/4=拒绝】
  conditionFlag: '', // 是否有条件通过【0=无/1=有】
  conditionRemark: '', //条件说明
  approveRemark: '', //第一准入人备注说明
  postponeRemark: '' // 暂缓原因
}
const approveItem: ApproveList = {
  handleNodeLevel: '',
  handleReason: '',
  handleResult: '',
  handleTime: '',
  nodeOperatorName: ''
}
// 业务申请信息
let vm = reactive({
  self: self,
  approveItem: approveItem
})
const stateName = computed(() => ({
  '1': '待准入',
  '3': vm.self.conditionFlag === '1' ? '有条件准入' : '已准入',
  '4': '已拒绝',
  '6': '待受理',
  '5': '已撤回',
  '0': '已保存',
  '2': '已退回',
  '7': '受理退回',
  '8': '已拒绝',
  '9': '已暂缓',
  '10': '解除暂缓'
}))

// 准入历程
const getApproveHistory = () => {
  apiBusinessAccess.getApproveHistory(submitData.refcode).then(res => {
    //取第一条记录
    if (res.data.approveList && res.data.approveList.length) {
      vm.approveItem = res.data.approveList[0]
    }
  })
}
//提交或拒绝准入
const doApproveOverseasBusinessInfo = () => {
  if (modalType.value === '4') {
    submitData.conditionRemark = conditionRemark.value
  } else if (modalType.value === '9') {
    submitData.postponeRemark = postponeRemark.value
  }
  loading.value = true
  apiBusinessAccess.doApproveOverseasBusinessInfo(submitData).then(
    () => {
      showToast('操作成功')
      setTimeout(() => {
        router.back(1)
        loading.value = false
      }, 1500)
    },
    () => {
      loading.value = false
    }
  )
}
// 校验是否存在在途核查记录
const getVerifyStatus = type => {
  loading.value = true
  apiCheck.getVerifyStatus(submitData.refcode).then(
    res => {
      loading.value = false
      if (res.data.checkStatus === '1') {
        modalType.value = type === '4' ? '4' : type === '9' ? '9' : '3'
        showModalFlag.value = true
      } else if (type === '0') {
        modalType.value = '1'
        showModalFlag.value = true
      } else if (type === '4') {
        // 没有在途业务有条件通过
        modalType.value = '4'
        showCondition.value = true
      } else if (type === '9') {
        // 没有在途业务暂缓
        modalType.value = '9'
        showPostponeRemark.value = true
      } else {
        doApproveOverseasBusinessInfo()
      }
    },
    () => {
      loading.value = false
    }
  )
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 17:44:57
 * @param {*} type 类型【0=拒绝/1=同意/4=有条件通过/9=暂缓存】
 * @description: 提交数据
 */
const onSubmit = (type: string) => {
  if (type === '0') {
    submitData.intLoanStatus = '4'
  } else if (type === '4') {
    submitData.intLoanStatus = '3'
    submitData.conditionFlag = '1'
  } else if (type === '9') {
    submitData.intLoanStatus = '9'
  } else {
    submitData.intLoanStatus = '3'
  }
  // 最后核查人才校验核准状态
  if (vm.self.finalApproval === '1') {
    getVerifyStatus(type)
  } else if (type === '0') {
    modalType.value = '1'
    showModalFlag.value = true
  } else {
    doApproveOverseasBusinessInfo()
  }
}

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 16:53:32
 * @description: 获取境外业务申请详情
 */
const getOverseasBusinessInfo = (type?) => {
  apiBusinessApply.getOverseasBusinessInfo(submitData.refcode).then(res => {
    if (type) {
      if (!res.data.intLoanStatus) {
        showToast('当前业务申请已删除')
        setTimeout(() => {
          router.back(1)
        }, 1000)
        return
      }
      if (res.data.intLoanStatus === '5') {
        showToast('当前业务申请已撤回')
        setTimeout(() => {
          router.back(1)
        }, 1000)
        return
      }
      if (type === 'onQuestion') {
        // 提问获取最新信息
        showPopup.value = true
      }
      if (type === 'onRefuse') {
        onSubmit('0')
      }
      if (type === 'pass') {
        onSubmit('1')
      }
      if (type === 'condition') {
        onSubmit('4')
      }
      if (type === 'postpone') {
        onSubmit('9')
      }
    } else {
      vm.self = res.data
      getApproveHistory()
      // 若字典项存在则展示字典项，不存在则选的其他,自己手填
      vm.self.ccyidDesc = getValueByKey(vm.self.ccyid, 'applyCcyid') ? getValueByKey(vm.self.ccyid, 'applyCcyid') : vm.self.ccyid
    }
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 17:35:12
 * @description: 提问
 */
const onQuestion = () => {
  if (loading.value) {
    return
  }
  getOverseasBusinessInfo('onQuestion')
}

const onCancel = () => {
  showModalFlag.value = false
  loading.value = false
}
const onConfirm = () => {
  if (modalType.value === '1') {
    // 拒绝
    doApproveOverseasBusinessInfo()
  } else if (modalType.value === '3') {
    //确认核查提交
    doApproveOverseasBusinessInfo()
  } else if (modalType.value === '4') {
    //有条件通过
    showModalFlag.value = false
    loading.value = false
    showCondition.value = true
  } else if (modalType.value === '9') {
    // 暂缓
    showModalFlag.value = false
    loading.value = false
    showPostponeRemark.value = true
  } else {
    if (!questions.value) {
      showToast('请输入提问内容')
      return
    }
    // 提问
    const data = {
      aplRefcode: submitData.refcode,
      questions: questions.value
    }
    apiBusinessAccess.doQuiz(data).then(() => {
      showToast('提问成功')
      questions.value = ''
      showModalFlag.value = false
    })
  }
}

// 提问提交
const submitQuestion = () => {
  if (!questions.value) {
    showToast('请输入提问的内容')
    return
  }
  // 提问
  const data = {
    aplRefcode: Number(decodeBase64(route.value.params.refcode)),
    questions: questions.value
  }
  loading.value = true
  apiBusinessAccess.doQuiz(data).then(
    () => {
      showToast('提问成功')
      loading.value = false
      showPopup.value = false
      questions.value = ''
      if (qaListRef.value) {
        qaListRef.value.findQuizPage()
      }
      getOverseasBusinessInfo()
    },
    () => {
      loading.value = false
    }
  )
}
const cutEnStr = str => {
  if (!str) {
    return
  }
  const regex = /\([^()]*?\)/g
  const result = str.replace(regex, '')
  return result
}
onMounted(() => {
  getOverseasBusinessInfo()
})
</script>

<style lang="scss" scoped>
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}
.topCell {
  background: #fff;
  padding-top: 70rpx;
  .returnReason {
    min-height: 20rpx;
    padding: 48rpx 50rpx 0 30rpx;
    font-size: 28rpx;
    .reasonValue {
      color: $danger;
      word-break: break-all;
      & :first-child {
        word-break: break-all;
      }
    }
  }
}
.submit {
  background: #3197ea;
  color: #fff;
  border-color: #3197ea;
}
.one-levlel-card {
  padding-bottom: 30rpx;
  font-size: 26rpx;
  color: #666;
  .user-name {
    font-weight: bold;
    color: #333;
  }
}
.inputValueClass {
  min-height: 160rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
  }
}
.review-remark {
  margin-top: 20rpx;
}
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  padding-bottom: 10rpx;
  color: #333;
}
.fixed {
  gap: 20rpx 20rpx !important;
}
</style>
