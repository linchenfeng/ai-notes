<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-17 10:08:27
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-02-09 09:34:19
 * @Description  : 委员补充意见 /additionalComments
-->

<template>
  <view class="box">
    <view class="head">
      <view><cover-image class="bg" src="@/assets/member/myinfo/collect/bg.png"></cover-image></view>
      <view><cover-image class="logo" src="@/assets/member/myinfo/collect/logo.png"></cover-image></view>
      <view><cover-image class="gather" src="@/assets/member/myinfo/collect/gather.png"></cover-image></view>
      <view class="head-text">
        <view class="title">嗨，我正在邀请您补充意见</view>
        <view class="desc">
          <text>邀请人：</text>
          {{ vm.shareDataObj.userName }}
        </view>
        <view class="desc">
          <text>被邀请人：</text>
          {{ vm.opinionInfo.memberName }}
        </view>
      </view>
    </view>
    <!-- 正常录入 -->
    <view v-if="applyStatus === '0'">
      <view class="meeting-review-detail collect-body">
        <!-- 基本信息 -->
        <BasicInfo type="share" :meeting-info="vm.opinionInfo" class="baseinfo"></BasicInfo>
        <ty-info-card title="概要说明">
          <view class="content pre-wrap">{{ vm.opinionInfo.summaryRemark }}</view>
        </ty-info-card>
        <ty-info-card title="条件说明">
          <view class="content pre-wrap">{{ vm.opinionInfo.conditionRemark }}</view>
        </ty-info-card>
        <ty-info-card v-if="!isEmpty(vm.opinionInfo.groupList)" title="历史审批意见">
          <view v-for="(item, index) in vm.opinionInfo.groupList" :key="index" class="node-card">
            <view class="node-header">
              <view class="left">
                <view class="out">
                  <view class="in"></view>
                </view>
              </view>
              <view class="reviewTime">{{ dateFormat(item.reviewTime, 2) }}</view>
            </view>
            <view class="node-content">
              <view v-if="isNotEmpty(item.reviewRemark)" class="text-folding">
                <ty-text-folding :rows="4">
                  {{ item.reviewRemark }}
                </ty-text-folding>
              </view>
            </view>
          </view>
        </ty-info-card>
        <ty-info-card title="审批意见">
          <u-form>
            <view class="radio-group">
              <template v-for="obj in getConstant('fintMemResult')" :key="obj.key">
                <u-button class="check-button" :class="reviewResult === obj.key ? 'active' : ''" round size="mini" @click="resultChange(obj.key)">
                  {{ obj.value }}
                </u-button>
              </template>
            </view>
            <u-form-item label="补充说明" label-width="55%"></u-form-item>
            <view class="content pre-wrap">
              <u-textarea
                v-model="reviewRemark"
                :confirm-type="null"
                auto-height
                maxlength="200"
                count
                :focus="focusFlag"
                class="inputValueClass"
                placeholder="请输入补充说明"
              ></u-textarea>
            </view>
          </u-form>
        </ty-info-card>
      </view>
    </view>
    <view v-else-if="applyStatus" class="collect-body">
      <view class="no-need-collect">
        <view class="icon">
          <text v-if="applyStatus === '2'" class="iconfont icon-jinggao"></text>
          <text v-else class="iconfont icon-yiwancheng"></text>
        </view>
        <view class="content">
          <view class="contentInfo">{{ linkrotText }}</view>
        </view>
      </view>
    </view>
  </view>
  <view v-if="applyStatus === '0'" class="button-fixed-bottom">
    <view class="placeholder"></view>
    <view class="fixed">
      <u-button :loading="loading" block type="success" native-type="submit" @click="doSave()">保存</u-button>
      <u-button :loading="loading" block type="primary" native-type="submit" @click="checkMetStatus">提交</u-button>
    </view>
  </view>
  <u-modal :show="dialogShow" mode="center" :round="10" confirm-text="确定" :show-cancel-button="false" show-confirm-button @confirm="onConfirm">
    <view class="slot-content">
      <view class="title">{{ '温馨提示' }}</view>
      <view>数据已被更新，请刷新页面获取最新信息</view>
    </view>
  </u-modal>
  <!-- <AuthorizeMask :show-loading="showLoading"></AuthorizeMask> -->
</template>

<script setup lang="ts">
import BasicInfo from '@/pages/member/project/audit/meetingReview/components/BasicInfo.vue'
import { decodeBase64, getUrlParam } from '@/utils/crypto'
import { ShareDataObj, OpinionInfo } from '@/interfaces/member/project/audit/meetingReview'
import apiMeetingReview from '@/api/member/project/audit/api.meetingReview'
import { showToast } from '@/utils/uniapp/toast'
import { getPlatform } from '@/utils/uniapp'
import tyInfoCard from '@/plugins/infoCard/index.vue'
import { isEmpty } from '@/utils/validate'
import { dateFormat } from '@/utils/format'
import { isNotEmpty } from '@/utils/validate'
import { getConstant } from '@/utils/constant'
const applyStatus = ref('') // 【0=正常录入/1=提交成功/2=链接已过期】
const linkrotText = ref('')
const reviewRemark = ref('') // 审批意见
const reviewResult = ref('') // 审批结果
const loading = ref(false)
const focusFlag = ref(false)
const dialogShow = ref(false)
// const showLoading = ref(false)
let shareDataObj: ShareDataObj = {
  refcode: '',
  userName: ''
}
const opinionInfo: OpinionInfo = {
  clientManager: '',
  conditionRemark: '',
  memberName: '',
  metRefcode: 0,
  metStatus: '',
  sellerOrgName: '',
  metDate: '',
  bizType: '',
  bizTypeDesc: '',
  userName: '',
  managerUserName: '',
  summaryRemark: '',
  fullPdfUuid: '',
  reviewRemark: '',
  reviewResult: '',
  applyConditionDesc: '',
  counterpartyOrgname: '',
  bizScene: '',
  factoringType: '',
  businessNo: ''
}
let vm = reactive({
  shareDataObj: shareDataObj,
  opinionInfo: opinionInfo
})

/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-25 17:00:43
 * @description:查详情
 */
const getOpinionInfo = () => {
  apiMeetingReview.getOpinionInfo(vm.shareDataObj.refcode).then(res => {
    vm.opinionInfo = res.data
    reviewRemark.value = vm.opinionInfo.reviewRemark || ''
    if (getPlatform() === 'H5') {
      sessionStorage.pdfLoginId = vm.opinionInfo.clientManager || vm.opinionInfo.memberName // 用户工号存储，没有则展示委员名称，用于pdf预览水印,仅H5
    }
  })
}
const onConfirm = () => {
  dialogShow.value = false
  getOpinionInfo()
}

const doSubmitOpinion = () => {
  focusFlag.value = false
  if (isEmpty(reviewResult.value)) {
    showToast('请输入审批意见')
    return
  }
  if (['2', '3'].includes(reviewResult.value) && isEmpty(reviewRemark.value)) {
    scrollTo(0, 99999)
    showToast('请输入补充说明')
    focusFlag.value = true
    let dom = document.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
    if (dom) {
      dom.focus()
    }
    loading.value = false
    return
  }
  const data = {
    refcode: vm.shareDataObj.refcode,
    reviewRemark: reviewRemark.value,
    reviewResult: reviewResult.value
  }
  loading.value = true
  apiMeetingReview.doSubmitOpinion(data).then(
    () => {
      loading.value = false
      linkrotText.value = '提交成功'
      applyStatus.value = '1'
    },
    () => {
      loading.value = false
    }
  )
}
const doSubmitOpinionTemporary = () => {
  const data = {
    refcode: vm.shareDataObj.refcode,
    reviewRemark: reviewRemark.value,
    reviewResult: reviewResult.value
  }
  loading.value = true
  apiMeetingReview.doSubmitOpinionTemporary(data).then(
    () => {
      loading.value = false
      showToast('保存成功')
    },
    () => {
      loading.value = false
    }
  )
}
const checkStatus = (type: string) => {
  loading.value = true
  apiMeetingReview.getOpinionInfo(vm.shareDataObj.refcode).then(
    res => {
      loading.value = false
      if (!res.data.metStatus) {
        linkrotText.value = '数据已被删除，链接已失效'
        applyStatus.value = '2'
        vm.opinionInfo.memberName = res.data.memberName
        return
      } else if (res.data.metStatus === '9') {
        linkrotText.value = '数据已被撤回，链接已失效'
        applyStatus.value = '2'
        vm.opinionInfo.memberName = res.data.memberName
        return
      } else if (res.data.metStatus === '2') {
        linkrotText.value = '数据已被复核退回，链接已失效'
        applyStatus.value = '2'
        vm.opinionInfo.memberName = res.data.memberName
        return
      } else if (res.data.reviewTime) {
        linkrotText.value = '提交成功'
        applyStatus.value = '1'
        vm.opinionInfo.memberName = res.data.memberName
        return
      }
      applyStatus.value = '0'
      if (type === 'save') {
        doSubmitOpinionTemporary()
      } else if (type === 'submit') {
        doSubmitOpinion()
      } else if (type === 'init') {
        vm.opinionInfo = res.data
        reviewRemark.value = vm.opinionInfo.reviewRemark || ''
        reviewResult.value = vm.opinionInfo.reviewResult || ''
        if (getPlatform() === 'H5') {
          sessionStorage.pdfLoginId = vm.opinionInfo.clientManager || vm.opinionInfo.memberName // 用户工号存储，没有则展示委员名称，用于pdf预览水印,仅H5
        }
      }
    },
    () => {
      loading.value = false
    }
  )
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-28 10:56:30
 * @description: 校验数据状态
 */
const checkMetStatus = () => {
  // 【ARM-10401】先校验必填，解决IOS必须交互才能弹出键盘的保护机制，若先调接口，异步导致键盘不弹出
  if (isEmpty(reviewResult.value)) {
    showToast('请输入审批意见')
    return
  }
  if (['2', '3'].includes(reviewResult.value) && isEmpty(reviewRemark.value)) {
    scrollTo(0, 99999)
    showToast('请输入补充说明')
    focusFlag.value = true
    let dom = document.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
    if (dom) {
      dom.focus()
    }
    loading.value = false
    return
  }
  checkStatus('submit')
}

/**
 * @Author: Charon.Lin
 * @Date: 2025-01-02 16:08:02
 * @return {*}
 * @description: 保存审批意见
 */
const doSave = () => {
  focusFlag.value = false
  if (isEmpty(reviewResult.value)) {
    showToast('请输入审批意见')
    return
  }
  if (['2', '3'].includes(reviewResult.value) && isEmpty(reviewRemark.value)) {
    scrollTo(0, 99999)
    showToast('请输入补充说明')
    focusFlag.value = true
    let dom = document.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
    if (dom) {
      dom.focus()
    }
    loading.value = false
    return
  }
  checkStatus('save')
}
const resultChange = (status: string) => {
  reviewResult.value = status
}
onMounted(() => {
  // if (getPlatform() === 'H5' && systemConfig && systemConfig.P_WX_OPEN === '1') {
  //   // 开启了授权
  //   const code = getUrlParam('code')
  //   if (!code) {
  //     // 第一次进入无code
  //     removeStorage('additional-comments-data') // 先清除缓存数据
  //     if (getUrlParam('data')) {
  //       // 获取并缓存链接数据
  //       vm.shareDataObj = JSON.parse(decodeBase64(getUrlParam('data'))) as ShareDataObj
  //       setStorage('additional-comments-data', JSON.stringify(vm.shareDataObj))
  //     }
  //   } else {
  //     // 已授权直接获取链接数据
  //     vm.shareDataObj = JSON.parse(getStorage('additional-comments-data') as string) as ShareDataObj
  //     getOpinionInfo()
  //   }
  //   // 微信权限登录
  //   // 返回true=关闭自定义loading
  //   showLoading.value = !$wxLogin('/additionalComments')
  // } else
  if (getUrlParam('data')) {
    vm.shareDataObj = JSON.parse(decodeBase64(getUrlParam('data'))) as ShareDataObj
    checkStatus('init')
  }
})
</script>

<style lang="scss" scoped>
.box {
  min-height: calc(100vh - 60px);
  // background-color: rgba(242, 242, 242);
}

.head {
  width: 100%;
  position: relative;
  height: 365rpx;
  .bg {
    position: absolute;
    width: 100%;
    height: 365rpx;
    // z-index: -1;
  }
  .logo {
    position: absolute;
    width: 76rpx;
    height: 76rpx;
    top: 60rpx;
    left: 30rpx;
  }
  .gather {
    position: absolute;
    width: 271rpx;
    height: 158rpx;
    top: 115rpx;
    right: 0;
    // opacity: 0.3;
  }
  .head-text {
    position: relative;
    color: #fff;
    padding-top: 56rpx;
    padding-left: 126rpx;
    .title {
      font-size: 28rpx;
    }
    .desc {
      margin-top: 16rpx;
      line-height: 38rpx;
      font-size: 28rpx;
    }
  }
}

.collect-body {
  margin: -90rpx 0 0;
  background: #ffffff;
  position: relative;
  &.meeting-review-detail {
    padding-top: 22rpx;
    :deep(.u-cell-group__title) {
      background-color: #fff;
      margin-bottom: 10rpx;
      .u-cell-group__title__text {
        span {
          font-size: 32rpx;
          font-weight: bold;
        }
      }
    }
    .line {
      width: 100%;
      height: 20rpx;
      background-color: #f6f6f6;
    }
    .title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 30rpx;
    }
    .content {
      font-size: 28rpx;
      line-height: 46rpx;
      margin-bottom: 30rpx;
    }
    .u-textarea {
      min-height: 160rpx;
      // padding-bottom: 40rpx;
      :deep(.u-textarea__field) {
        height: auto !important;
        min-height: 160rpx !important;
      }
    }
  }
  .no-need-collect {
    padding: 90rpx 30rpx 300rpx;
    height: 750rpx;
    box-sizing: border-box;
    text-align: center;
    .icon {
      .iconfont {
        font-size: 90rpx;
      }
      .icon-jinggao {
        color: $danger;
      }
      .icon-yiwancheng {
        color: $primary;
      }
    }
    .contentInfo {
      margin-top: 50rpx;
      font-weight: bold;
      font-size: 36rpx;
    }
    .contentDesc {
      margin-top: 30rpx;
      font-size: 30rpx;
      color: $sub-color;
    }
  }
}
.slot-content {
  color: #646566;
  .title {
    margin-bottom: 30rpx;
  }
}
.baseinfo {
  margin-top: -20rpx;
}
.reviewTime {
  font-size: 24rpx;
  color: $remark-color;
  margin-left: 20rpx;
}
.node-card:last-of-type {
  .node-content {
    border-left: none;
  }
}
.nodes > .node-card:first-of-type {
  padding-top: 0;
}
.node-card {
  padding-top: 10rpx;
}
.node-header {
  display: flex;
  align-items: center;
  position: relative;
  & .left {
    flex-shrink: 0;
    .out {
      width: 28rpx;
      height: 28rpx;
      border: 1rpx solid #395fee;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      border-radius: 50%;
      box-sizing: border-box;
      .in {
        width: 20rpx;
        height: 20rpx;
        background: #395fee;
        border-radius: 50%;
      }
    }
  }
  .title-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .title {
    height: 34rpx;
    color: #333333;
    font-weight: 700;
    font-size: 28rpx;
    line-height: 34rpx;
    margin-left: 20rpx;
    margin-top: 2rpx;
  }
  .status {
    border: 1rpx solid $warning;
    color: $warning;
    border-radius: 5rpx;
    padding: 4rpx 16rpx;
    text-align: center;
    font-size: 24rpx;
    &.success {
      border: 1rpx solid $u-success;
      color: $u-success;
    }
    &.error {
      border: 1rpx solid $u-error;
      color: $u-error;
    }
  }
}
.node-content {
  margin-left: 14rpx;
  margin-top: 14rpx;
  padding-bottom: 20rpx;
  border-left: solid 1rpx #395fee;
  padding-left: 34rpx;
  padding-top: 4rpx;
  .name-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    margin-bottom: 14rpx;
    color: #333;
    .reviewTime {
      font-size: 24rpx;
      color: $remark-color;
    }
  }
}
.text-folding {
  padding: 30rpx 20rpx;
  border-radius: 4px;
  background: #f7f7f7;
}
.review-opinion-box {
  &.condition-list {
    padding-bottom: 0rpx;
  }
  &:last-of-type {
    margin-bottom: 0rpx;
  }
  .title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
  }
  .content {
    margin-top: 10rpx;
    font-size: 28rpx;
    line-height: 46rpx;
    color: $sub-color;
    word-break: break-all;
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
  .condition-box {
    // padding: 0 30rpx;
    // border-bottom: 2rpx solid #dedede;
    margin-bottom: 20rpx;
    &:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
    }
    .condition-content {
      width: 100%;
      word-break: break-all;
    }
    .condition {
      border-radius: 5rpx;
      padding: 10rpx 0 10rpx 0;
      color: $sub-color;
      font-size: 26rpx;
      margin-bottom: 10rpx;
      line-height: 40rpx;
      display: flex;
      align-items: baseline;
      .condition-title {
        font-weight: bold;
      }
      .iconfont {
        font-size: 28rpx;
        color: #008cd6;
        margin-right: 10rpx;
        vertical-align: bottom;
      }
    }

    .group-box {
      display: flex;
      .left-box {
        margin-right: 18rpx;
        padding-top: 2rpx;
        .color-line {
          margin-top: 2rpx;
          width: 4rpx;
          height: calc(100% - 46rpx);
          margin-left: 50%;
          transform: translateX(-50%);
          border-left: 2rpx dashed #d3e3fc;
          // color: #d3e3fc;
        }
      }
      .right-box {
        width: 100%;
        margin-bottom: 20rpx;
        background: #f7f7f7;
        padding: 30rpx 20rpx;
        .head {
          display: flex;
          justify-content: space-between;
          .memberName {
            font-size: 28rpx;
            color: $default-color;
          }
          .reviewTime {
            font-size: 24rpx;
            color: $remark-color;
          }
          .btn-box {
            font-size: 24rpx;
            color: $remark-color;
          }
        }
        .reviewRemarkBox {
          color: $sub-color;
          line-height: 46rpx;
          font-size: 28rpx;
          margin-top: 10rpx;
        }
      }
    }
  }
}
.radio-group {
  justify-content: flex-start !important;
  margin-bottom: 30rpx;
}
.radio-group .check-button:first-child {
  margin-left: 0 !important;
}
</style>
