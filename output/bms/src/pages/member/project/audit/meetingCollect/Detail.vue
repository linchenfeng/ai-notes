<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-23 14:17:36
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-29 15:02:07
 * @Description  : 项目-业务审核-上会结果意见汇整详情 /member/project/audit/meetingCollect/detail
-->
<template>
  <NavBar></NavBar>
  <view class="meeting-approval-detail">
    <!-- 基本信息 -->
    <BasicInfo type="approval" :meeting-info="vm.meetingInfo"></BasicInfo>
    <ty-info-card title="概要说明">
      <view class="content pre-wrap summaryRemark">{{ vm.meetingInfo.summaryRemark }}</view>
    </ty-info-card>
    <OpinionList
      v-if="vm.meetingInfo.fintMemList && vm.meetingInfo.fintMemList.length"
      ref="opinionList"
      :refcode="refcode"
      type="approval"
      :meeting-info="vm.meetingInfo"
      class="opinion-list"
    ></OpinionList>
    <ty-info-card title="复核意见">
      <view class="content pre-wrap summaryRemark">{{ vm.meetingInfo.reviewRemark || '复核通过' }}</view>
    </ty-info-card>
    <ty-info-card title="审批意见">
      <view class="content pre-wrap summaryRemark">{{ vm.meetingInfo.approveRemark || '审批通过' }}</view>
    </ty-info-card>
    <ty-info-card title="意见汇整">
      <view class="content pre-wrap summaryRemark">{{ vm.meetingInfo.collectOpinionRemark }}</view>
    </ty-info-card>

    <ty-info-card title="意见汇整复核意见">
      <template #subtitle>
        <view v-if="showHistory" class="history" @click="toHistory">审核历程</view>
      </template>
      <u-textarea
        v-model="collectRemark"
        :confirm-type="null"
        maxlength="300"
        placeholder-style="font-size: 28rpx;"
        class="inputValueClass"
        count
        :focus="focusFlag"
        auto-height
        placeholder="请输入意见汇整复核意见"
      ></u-textarea>
    </ty-info-card>
    <view v-if="getHasPermissionsById('member:project:audit:meetingCollect:audit')" class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button :loading="loading" block type="error" native-type="submit" @click="doSendVerificationCode('7')">退回</u-button>
        <u-button :loading="loading" block type="primary" native-type="submit" @click="doSendVerificationCode('8')">通过</u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import BasicInfo from '@/pages/member/project/audit/meetingReview/components/BasicInfo.vue'
import NavBar from '@/layout/NavBar.vue'
import OpinionList from '@/pages/member/project/audit/meetingReview/components/OpinionList.vue'
import apiMeetingApproval from '@/api/member/project/audit/api.meetingApproval'
import apiMeetingCollect from '@/api/member/project/audit/api.meetingCollect'
import { getHasPermissionsById } from '@/utils/permissions'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
import { MeetingInfo } from '@/interfaces/member/project/audit/meetingAproval'
import { useRoute, useRouter } from '@/uni-simple-router'
import { showToast } from '@/utils/uniapp/toast'
import apiMeetingReview from '@/api/member/project/audit/api.meetingReview'
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const submitType = ref('')
const collectRemark = ref('') // 复核意见
const showHistory = ref(false) // // 是否展示历史记录
const focusFlag = ref(false)
let refcode = ref('') // 入会结果流水号
let meetingInfo: MeetingInfo = {
  fintMemList: [],
  managerUserName: '',
  metDate: '',
  refcode: 0,
  sellerOrgName: '',
  userName: '',
  metStatus: '',
  partPdfUuid: '',
  reviewRemark: '',
  reviewTime: '',
  bizType: '',
  bizTypeDesc: '',
  reviewUserName: '',
  summaryRemark: '',
  approveTime: '',
  isOperator: '',
  encryptUuid: '',
  fullPdfUuid: '',
  applyConditionDesc: '',
  counterpartyOrgname: '',
  bizScene: '',
  factoringType: '',
  businessNo: '',
  collectOpinionRemark: ''
}
let vm = reactive({
  meetingInfo: meetingInfo
})
const getMeetingInfo = () => {
  apiMeetingApproval.getMeetingInfo(refcode.value).then(res => {
    vm.meetingInfo = res.data
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-27 15:33:21
 * @param {*} type 【7=退回/8=通过】
 * @description: 提交审批
 */
const doSubmitCollectAudit = () => {
  loading.value = true
  const data = {
    refcode: refcode.value,
    metStatus: submitType.value,
    approveRemark: collectRemark.value
  }
  apiMeetingCollect.doSubmitCollectAudit(data).then(
    () => {
      showToast('操作成功')
      setTimeout(() => {
        router.back(1)
      }, 1000)
    },
    () => {
      loading.value = false
    }
  )
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-27 15:32:52
 * @param {*} type 【4=退回/5=通过】
 * @description: 发送验证码
 */
const doSendVerificationCode = (type?: string) => {
  submitType.value = type || ''
  if (type === '7' && !collectRemark.value) {
    scrollTo(0, 99999)
    showToast('请输入意见汇整复核意见')
    let dom = document.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
    if (dom) {
      dom.focus()
    }
    focusFlag.value = true
    return
  }
  doSubmitCollectAudit()
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-12-10 10:25:44
 * @description: 历史审核意见
 */
const toHistory = () => {
  router.push(`/member/project/audit/meetingReview/detail/history/${encodeBase64(refcode.value)}`)
}

/**
 * @Author: Longcan.Yang
 * @Date: 2024-12-10 14:46:36
 * @description: 查询历史审核记录
 */
const getHistoryList = () => {
  apiMeetingReview.getHistoryList(refcode.value).then(res => {
    if (res.data.length) {
      showHistory.value = true
    }
  })
}
onMounted(() => {
  // 路由带参
  if (route.value.params) {
    refcode.value = decodeBase64(route.value.params.refcode) // 上会结果流水号
  }
  getMeetingInfo()
  getHistoryList()
})
</script>

<style lang="scss" scoped>
@import '../meetingReview/style/meeting.scss';
.meeting-approval-detail {
  background: #f6f6f6;
  margin-bottom: 20rpx;
  .history {
    font-size: 26rpx;
    color: $primary;
    font-weight: normal;
    flex: 1;
    text-align: right;
  }
  .title {
    font-size: 28rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
  }
  .title-box {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  .review-remark {
    margin-top: 20rpx;
  }
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
  .head-box {
    display: flex;
    // align-items: center;
    .right-box {
      width: 100%;
    }
    .review-name-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 28rpx;
      .reviewTime {
        font-size: 24rpx;
        color: $remark-color;
      }
    }
    .iconfont-bms-colorful {
      margin: 4rpx 18rpx 0 0;
    }
  }
}

.forget-code {
  font-size: 26rpx;
  margin-bottom: 20rpx;
  color: #138bec;
}
.password {
  margin-top: 60rpx;
}
.modal-box {
  width: 100%;
  .title {
    width: 100%;
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
  }
  .text-box {
    margin: 34rpx auto 46rpx;
    font-size: 26rpx;
    text-align: center;
    .mobilephone {
      margin-left: 6rpx;
    }
    .seconds {
      margin-left: 10rpx;
      color: #c9cacc;
    }
    .regain {
      color: $primary;
      margin-left: 10rpx;
    }
  }
  .code-box {
    display: flex;
    justify-content: center;
    margin-bottom: 40rpx;
    :deep(.u-code-input__item) {
      background-color: #f8f9ff;
      border-radius: 14rpx;
      &.u-code-input__item--current {
        border-color: #138bec !important;
      }
    }
  }
  .u-button {
    height: 88rpx;
    background: #138bec, #ffffff;
    border-radius: 15rpx;
    font-size: 32rpx;
  }
  .submit {
    margin-top: 40rpx;
  }
  .cancel {
    margin-top: 10rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    color: $sub-color;
    font-size: 32rpx;
  }
}
:deep(.u-modal__content) {
  padding: 24rpx 50rpx;
}
:deep(.u-modal__button-group) {
  display: none;
}
.inputValueClass {
  min-height: 160rpx;
  // margin-bottom: 30rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
  }
}
.opinion-list {
  margin-top: 20rpx;
}
</style>
