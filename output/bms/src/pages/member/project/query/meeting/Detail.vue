<!--
 * @Author       : Charon.Lin
 * @Date         : 2024-12-26 17:06:35
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-10-27 09:55:17
 * @Description  : 项目-业务查询-上会结果查询 /member/project/query/meeting/detail
-->
<template>
  <NavBar />
  <view class="meeting-approval-detail">
    <view v-if="['2', '4', '7'].includes(vm.meetingInfo.metStatus)" class="returnReason">
      <view>
        <text>退回原因：</text>
        <text class="reasonValue">
          {{
            vm.meetingInfo.metStatus === '2'
              ? vm.meetingInfo.reviewRemark
              : vm.meetingInfo.metStatus === '4'
              ? vm.meetingInfo.approveRemark
              : vm.meetingInfo.collectOpinionRemark
          }}
        </text>
      </view>
    </view>
    <!-- 基本信息 -->
    <BasicInfo :meeting-info="vm.meetingInfo" type="search"></BasicInfo>
    <!--   <ty-info-card title="概要说明">
      <view class="content pre-wrap summaryRemark">{{ vm.meetingInfo.summaryRemark }}</view>
    </ty-info-card> -->
    <ty-info-card v-if="!isEmpty(vm.meetingInfo.collectOpinionRemark)" title="汇整意见">
      <view class="content pre-wrap summaryRemark">{{ vm.meetingInfo.collectOpinionRemark }}</view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import BasicInfo from '@/pages/member/project/audit/meetingReview/components/BasicInfo.vue'
import apiMeetingApproval from '@/api/member/project/audit/api.meetingApproval'
import { MeetingInfo } from '@/interfaces/member/project/audit/meetingAproval'
import { decodeBase64 } from '@/utils/crypto'
import { useRoute } from '@/uni-simple-router'
import apiMeetingReview from '@/api/member/project/audit/api.meetingReview'
import { isEmpty } from '@/utils/validate'
const route = useRoute()
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
  approveUserName: '',
  approveTime: '',
  approveRemark: '',
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
const showHistory = ref(false) // // 是否展示历史记录
const getMeetingInfo = () => {
  apiMeetingApproval.getMeetingInfo(refcode.value).then(res => {
    vm.meetingInfo = res.data
  })
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
@import '../../audit/meetingReview//style/meeting.scss';
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
  .content {
    margin-top: 10rpx;
    font-size: 28rpx;
    line-height: 46rpx;
    color: $sub-color;
    padding-bottom: 30rpx;
    &.summaryRemark {
      color: #333;
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
    margin-bottom: 60rpx;
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
.opinion-list {
  margin-top: 20rpx;
}
.returnReason {
  min-height: 20rpx;
  padding: 28rpx 50rpx 0 30rpx;
  font-size: 28rpx;
  background: #fff;
  .reasonValue {
    color: $danger;
    word-break: break-all;
    & :first-child {
      word-break: break-all;
    }
  }
}
</style>
