<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-25 17:48:54
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-07 11:23:00
 * @Description  : 预警解除申请审批 /member/project/audit/warning/audit/:refcode/:taskRefcode
-->

<template>
  <NavBar />
  <view class="main">
    <up-sticky bg-color="#fff">
      <state-module
        v-if="vm.self.applyStatus"
        :state-name="stateName[vm.self.applyStatus]"
        :state-color="stateColor[vm.self.applyStatus]"
      ></state-module>
    </up-sticky>
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
      <!-- 预警解除基本信息 -->
      <BasicInfo ref="basicRef" :self="vm.self" type="audit"></BasicInfo>
      <History></History>
      <ty-info-card title="审批意见">
        <!-- <u-form> -->
          <view class="content pre-wrap">
            <u-textarea
              v-model="conditionRemark"
              :confirm-type="null"
              auto-height
              maxlength="1000"
              count
              class="inputValueClass"
              placeholder="请输入审批意见"
            ></u-textarea>
          </view>
        <!-- </u-form> -->
      </ty-info-card>
      <view v-if="getHasPermissionsById('member:project:audit:warning:audit')" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <!-- <view class="vteam-button" @click="onQuestion">
            <view class="vteam-button-icon">
              <text class="iconfont icon-tiwen1"></text>
            </view>
            <view class="vteam-button-text">
              <text>{{ '提问' }}</text>
            </view>
          </view> -->
          <!-- 审批展示拒绝和退回 -->
          <u-button :loading="loading" block type="error" native-type="submit" @click="onRefuse">拒绝</u-button>
          <u-button :loading="loading" block type="warning" native-type="submit" @click="onReturn">退回</u-button>
          <u-button :loading="loading" block type="primary" class="submit" native-type="submit" @click="toSubmit()">通过</u-button>
        </view>
      </view>
    </view>
    <u-modal
      :show="showModalFlag"
      title="温馨提示"
      :confirm-text="['1', '3'].includes(modalType) ? '确定' : '提交'"
      :show-cancel-button="true"
      class="accessModal"
      @confirm="onConfirm"
      @cancel="showModalFlag = false"
    >
      <view class="slot-content">
        <view v-if="modalType === '1'">是否确认拒绝？</view>
        <view v-else-if="modalType === '3'">是否确认退回？</view>
      </view>
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import StateModule from '@/plugins/StateModule.vue'
import BasicInfo from './components/BasicInfo.vue'
import { getHasPermissionsById } from '@/utils/permissions'
import NavBar from '@/layout/NavBar.vue'
import History from './History.vue'
import { WarningAppInfo, FlowNodeVo } from '@/interfaces/member/project/apply/warningApproval'
import { useRoute, useRouter } from '@/uni-simple-router'
import apiWarningApprovalAudit from '@/api/member/project/audit/api.warningApprovalAudit'
import apiWarningApprovalQuery from '@/api/member/project/query/api.warningApprovalQuery'
import { /*  encodeBase64,  */ decodeBase64 } from '@/utils/crypto'
import { onMounted, reactive, ref } from 'vue'
import { showToast } from '@/utils/uniapp/toast'
// import { onPageScroll } from '@dcloudio/uni-app'
import { dateFormat } from '@/utils/format'
// import router from '@/router'
const router = useRouter()
let loading = ref(false)
let showModalFlag = ref(false) // 展示提示框
// let showPopup = ref(false) // 展示提问框
const basicRef = ref()
let modalType = ref('') // 弹窗类型【1=拒绝提示/2=提问/3=退回】
// let questions = ref('') // 提问的内容
let conditionRemark = ref('') // 审批意见
let disabledFlag = ref(false)
const route = useRoute()
// let showFixed = ref(false)
const stateName = {
  '1': '审批中',
  '2': '已退回'
}
const stateColor = {
  '1': 'warning',
  '2': 'warning'
}
const flowNodeVo: FlowNodeVo = {
  examineType: '',
  nodeMode: '',
  nodeLevel: '',
  nodePassLogic: ''
}
const self: WarningAppInfo = {
  applyStatus: '',
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
  warningNextLogic: '',
  applyDate: '',
  serialRefcode: '',
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
  self: self,
  flowNodeVo
})

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 17:44:57
 * @param {*} type 类型【A=拒绝/B=打回/C=通过/D=批注】
 * @description: 提交数据
 */
const onSubmit = (type: string) => {
  submitData.handleResult = type
  submitData.handleReason = conditionRemark.value
  loading.value = true
  apiWarningApprovalAudit.doHandleWarningApp(submitData).then(
    () => {
      showToast('操作成功')
      setTimeout(() => {
        router.back(1)
        loading.value = false
        disabledFlag.value = false
      }, 1500)
    },
    () => {
      loading.value = false
      disabledFlag.value = false
    }
  )
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 16:53:32
 * @description: 获取特批申请详情
 */
const getWarningAppInfo = (type?) => {
  const data = {
    refcode: submitData.refcode,
    queryFlag: '0' // 是否为待处理数据列表查询标记
  }
  apiWarningApprovalQuery.getWarningAppInfo(data).then(res => {
    if (type) {
      if (res.data.nodata === '1') {
        showToast('当前预警解除申请已删除')
        setTimeout(() => {
          router.back(1)
        }, 1000)
        return
      }
      if (!['1', '2'].includes(res.data.warningVo.applyStatus)) {
        showToast('当前预警解除申请状态已变更')
        setTimeout(() => {
          router.back(1)
        }, 1000)
        return
      }
      // if (type === 'onQuestion') {
      //   // 提问获取最新信息
      //   showPopup.value = true
      // }
      if (type === 'onRefuse') {
        // 拒绝获取最新信息
        showModalFlag.value = true
        modalType.value = '1'
      }
      if (type === 'onReturn') {
        // 退回操作先获取最新信息
        showModalFlag.value = true
        modalType.value = '3'
      }
      if (type === 'doSubmit') {
        onSubmit('C')
      }
    } else {
      vm.self = res.data.warningVo as unknown as WarningAppInfo
      vm.self.apxList = res.data.apxList
      vm.self.qccList = res.data.qccList
      vm.flowNodeVo = res.data.flowNodeVo || {}
    }
  })
}
// 审批历程
// const toHistory = () => {
//   router.push(`/member/project/specialAudit/history/${encodeBase64(submitData.refcode)}`)
// }
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 17:35:12
 * @description: 提问
 */
// const onQuestion = () => {
//   if (loading.value) {
//     return
//   }
//   getWarningAppInfo('onQuestion')
// }
// 退回
const onReturn = () => {
  if (!conditionRemark.value) {
    scrollTo(0, 99999)
    showToast('请输入审批意见')
    let dom = document.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
    if (dom) {
      dom.focus()
    }
    return
  }
  if (!conditionRemark.value) {
    showToast('请输入审批意见')
    return
  }
  getWarningAppInfo('onReturn')
}
// 拒绝
const onRefuse = () => {
  if (!conditionRemark.value) {
    scrollTo(0, 99999)
    showToast('请输入审批意见')
    let dom = document.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
    if (dom) {
      dom.focus()
    }
    return
  }
  if (!conditionRemark.value) {
    showToast('请输入审批意见')
    return
  }
  getWarningAppInfo('onRefuse')
}
// 提交
const toSubmit = () => {
  getWarningAppInfo('doSubmit')
}

const onConfirm = () => {
  // 操作成功按钮不允许点击
  if (disabledFlag.value) {
    return
  }
  disabledFlag.value = true
  if (modalType.value === '1') {
    // 拒绝
    onSubmit('A')
  } else if (modalType.value === '3') {
    // 退回
    onSubmit('B')
  }
  //  else {
  //   if (!questions.value) {
  //     showToast('请输入提问内容')
  //     return
  //   }
  //   // 提问
  //   const data = {
  //     aplRefcode: submitData.refcode,
  //     questions: questions.value
  //   }
  //   apiBusinessAccess.doQuiz(data).then(() => {
  //     showToast('提问成功')
  //     questions.value = ''
  //     showModalFlag.value = false
  //   })
  // }
}

onMounted(() => {
  getWarningAppInfo()
})
// onPageScroll(e => {
//   if (e.scrollTop >= 10) {
//     showFixed.value = true
//   } else {
//     showFixed.value = false
//   }
// })
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

.topCell {
  background-color: #fff;
  padding-top: 70rpx;
}
.u-textarea {
  min-height: 160rpx;
  // padding-bottom: 40rpx;
  // margin-bottom: 15px;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
    .input-placeholder {
      font-size: 28rpx;
    }
  }
}
.special-audit {
  background: #f6f6f6;
  padding: 0;
  .history {
    margin-left: auto;
    font-size: 24rpx;
    color: $primary;
    font-weight: normal;
  }
  .button-fixed-bottom {
    .vteam-button {
      padding: 0 30rpx;
      color: $default-color;
      .vteam-button-text {
        font-weight: bold;
      }
    }
    .u-button--error {
      width: 360rpx;
      background-color: #ef4142;
      border-color: #ef4142;
      // color: #fe0101;
    }
    .u-button--warning {
      width: 360rpx;
    }
  }
}
:deep(.accessModal) {
  .slot-content {
    .fieldBox {
      border: 1rpx solid #d5d5d5;
      background-color: rgb(252, 252, 252);
      text-align: right;
      padding-bottom: 10rpx;
      .u-textarea {
        text-align: left;
        padding: 20rpx;
        height: 280rpx;
        background: #fcfcfc;
        border: none;
        .u-textarea__field {
          height: auto !important;
        }
        .uni-textarea-placeholder {
          font-size: 28rpx;
          line-height: 38rpx;
          color: $remark-color;
          word-break: break-all;
        }
      }
    }
  }
}

.submit {
  background: #3197ea;
  color: #fff;
  border-color: #3197ea;
}
</style>
