<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-27 14:06:05
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-02-09 10:53:00
 * @Description  : 信审委员意见 组件
-->
<template>
  <div class="main">
    <u-collapse ref="sellerCollapseRef" :value="opinionActive" :border="false">
      <u-collapse-item title="信审委员意见" name="1" :border="false">
        <template #title>
          <view class="collapse-item-title">
            <text class="u-cell__title-text">信审委员意见</text>
            <view v-if="props.type === 'review' && props.source !== 'cancel'" class="showInviteGroup" @click.stop="showInviteGroup">
              邀请委员补充意见
            </view>
          </view>
        </template>
        <view v-for="(item, i) in vm.meetingInfo.fintMemList" :key="i" class="condition-box">
          <view class="condition">
            <text class="iconfont icon-jinggao"></text>
            <view class="condition-content">
              <text class="condition-title">条件说明：</text>
              <text class="pre-wrap">{{ item.conditionRemark }}</text>
            </view>
          </view>
          <view v-for="(subItem, j) in item.groupList" :key="j" class="node-card">
            <view class="node-header">
              <view class="left">
                <view class="out">
                  <view class="in"></view>
                </view>
              </view>
              <view class="title-box">
                <view class="title">
                  {{ subItem.memberName }}：
                  <text v-if="!subItem.reviewTime" class="wait-reply">待回复</text>
                </view>
                <text v-if="subItem.reviewTime" class="reviewTime">{{ dateFormat(subItem.reviewTime, 2) }}</text>
              </view>
            </view>
            <view class="node-content">
              <view v-if="subItem.reviewResult" :class="['1', '2'].includes(subItem.reviewResult) ? 'success-status' : 'error-status'">
                <text class="pre-wrap">{{ getValueByKey(subItem.reviewResult, 'fintMemResult') }}</text>
              </view>
              <view v-if="subItem.reviewRemark" class="reviewRemarkBox">
                <text class="pre-wrap">{{ subItem.reviewRemark }}</text>
              </view>
              <view v-if="props.type === 'review' && source !== 'cancel'" :class="!subItem.reviewRemark ? 'btn-top' : ''" class="btn-box">
                <view class="del-btn" @click="delUser(subItem)">删除</view>
                <view v-if="!subItem.reviewTime" class="invite-btn" @click="directInviteUser(subItem)">邀请</view>
              </view>
            </view>
          </view>
          <!--      <view v-for="(subItem, j) in item.groupList" :key="j" class="group-box" :class="{ lastOne: j === item.groupList.length - 1 }">
            <view class="right-box">
              <view class="head">
                <text class="memberName">
                  {{ subItem.memberName }}：
                  <view v-if="!subItem.reviewTime" class="wait-reply">待回复</view>
                </text>
                <text v-if="subItem.reviewTime" class="reviewTime">{{ dateFormat(subItem.reviewTime, 2) }}</text>
                <view v-else class="btn-box">
                  <view v-if="props.type === 'review'" class="del-btn" @click="delUser(subItem)">删除</view>
                  <view v-if="props.type === 'review'" class="invite-btn" @click="directInviteUser(subItem)">邀请</view>
                </view>
              </view>
              <view v-if="subItem.reviewRemark" class="reviewRemarkBox">
                <text class="pre-wrap">{{ subItem.reviewRemark }}</text>
              </view>
            </view>
          </view> -->
        </view>
      </u-collapse-item>
    </u-collapse>
    <up-popup :show="showPopup" :round="14" @close="closePopup">
      <view class="popup-box">
        <view class="title-box">
          <view class="title">条件说明</view>
          <text class="iconfont icon-guanbi2" @click="closePopup"></text>
        </view>
        <u-textarea
          v-model="conditionRemark"
          :confirm-type="null"
          maxlength="200"
          auto-height
          placeholder-style="font-size: 28rpx;"
          count
          placeholder="请输入条件说明"
        ></u-textarea>
        <scroll-view v-if="vm.groupList.length" class="list-wrap" scroll-y="true" scroll-with-animation="true">
          <view class="userName-list">
            <view v-for="(item, i) in vm.groupList" :key="i" class="item-box">
              <text>{{ item.memberName }}</text>
              <text class="invite" @click="inviteUser(item)">邀请</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </up-popup>
    <u-modal
      :show="showModalFlag"
      title="温馨提示"
      confirm-text="确认"
      show-cancel-button="true"
      class="accessModal"
      @confirm="onConfirmDel"
      @cancel="showModalFlag = false"
    >
      <view class="slot-content">
        <view>请确认是否删除？</view>
      </view>
    </u-modal>
    <view v-if="isGuideFlag" class="guide-group">
      <cover-image class="guide-arrows" src="@/assets/member/myinfo/collect/guide-arrows.png" alt="指引" />
      <cover-image class="guide-tip" src="@/assets/member/project/meeting/guide-tip.png" alt="提示" />
      <cover-image class="guide-know" src="@/assets/member/myinfo/collect/guide-know.png" alt="知道了" @click="isGuideFlag = false" />
    </view>
    <u-overlay class="guide-overlay" :show="isGuideFlag" @click="isGuideFlag = false"></u-overlay>
  </div>
</template>

<script setup lang="ts">
import { MeetingInfo, CommitteeGroupList } from '@/interfaces/member/project/audit/meetingReview'
import { dateFormat } from '@/utils/format'
import { PropType } from 'vue'
import { encodeBase64 } from '@/utils/crypto'
import apiMeetingReview from '@/api/member/project/audit/api.meetingReview'
import wx from 'jweixin-1.6.0'
import { showToast } from '@/utils/uniapp/toast'
import apiMyInfo from '@/api/member/api.myinfo'
import { useRouter } from '@/uni-simple-router'
import { getValueByKey } from '@/utils/constant'
const opinionActive = ref(['1'])
const conditionRemark = ref('') // 条件说明
const isGuideFlag = ref(false) // 是否展示分享指引
const showPopup = ref(false)
const showModalFlag = ref(false) // 是否展示删除弹窗
const sellerCollapseRef = ref()
const router = useRouter()
let userName = '' // 当前登录用户
const userRefoce = ref('')
let groupList: CommitteeGroupList[] = [] // 审查委员组集合
// 上会结果复核详情
let meetingInfo: MeetingInfo = {
  fintMemList: [],
  fullPdfUuid: '',
  managerUserName: '',
  metDate: '',
  refcode: 0,
  sellerOrgName: '',
  userName: '',
  metStatus: '',
  bizType: '',
  bizTypeDesc: '',
  summaryRemark: '',
  applyConditionDesc: '',
  counterpartyOrgname: '',
  bizScene: '',
  factoringType: '',
  businessNo: ''
}
let vm = reactive({
  meetingInfo: meetingInfo,
  groupList: groupList
})
const props = defineProps({
  refcode: {
    type: [Number, String] as PropType<number | string>,
    default: ''
  },
  // 【review=上会结果复核/approval=上会结果审批】
  type: {
    type: String,
    default: 'review'
  },
  meetingInfo: {
    type: Object as PropType<MeetingInfo>,
    default: () => ({})
  },
  // 【来源 cancel|撤回】
  source: {
    type: String,
    default: ''
  }
})
const getFintMemList = () => {
  return vm.meetingInfo.fintMemList
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-27 10:53:05
 * @description: 查询详情
 */
const getMeetingInfo = () => {
  apiMeetingReview.getMeetingInfo(props.refcode).then(res => {
    vm.meetingInfo = res.data
    setTimeout(() => {
      sellerCollapseRef.value.init()
    }, 200)
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-25 10:43:09
 * @description: 获取审查委员组
 */
const getCommitteeGroup = () => {
  apiMeetingReview.getCommitteeGroup(props.refcode).then(res => {
    vm.groupList = res.data
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-25 15:33:41
 * @param {*} shareData
 * @description: 设置分享链接
 */
const setMessageLink = shareData => {
  // 解决PC端分享链接title、描述不生效
  wx.onMenuShareAppMessage({
    title: '补充审核意见', // 分享标题
    desc: '邀请您补充审核意见', // 分享描述
    link: `${window.location.origin}/additionalComments?data=${encodeBase64(JSON.stringify(shareData))}`, // 分享链接
    imgUrl: `${window.location.origin}/static/img/head.png` // 分享图标
  })
  wx.updateAppMessageShareData({
    title: '补充审核意见', // 分享标题
    desc: '邀请您补充审核意见', // 分享描述
    link: `${window.location.origin}/additionalComments?data=${encodeBase64(JSON.stringify(shareData))}`, // 分享链接
    imgUrl: `${window.location.origin}/static/img/head.png` // 分享图标
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-25 14:34:39
 * @param {*} data
 * @description: 邀请意见补充
 */
const doInvitationSupplement = data => {
  apiMeetingReview.doInvitationSupplement(data).then(res => {
    const shareData = {
      userName,
      refcode: res.data.refcode // 审查意见流水号
    }
    setMessageLink(shareData)
    getMeetingInfo()
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-25 10:05:50
 * @description: 邀请弹出委员组
 */
const showInviteGroup = () => {
  apiMeetingReview.getMeetingInfo(props.refcode).then(res => {
    // 校验最新状态
    if (['2', '3'].includes(res.data.metStatus)) {
      showToast('当前上会结果已被复核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    //运营端删除
    if (!res.data.metStatus) {
      showToast('当前上会结果已被录入人删除，暂无法复核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    //运营端撤回
    if (res.data.metStatus === '9') {
      showToast('当前上会结果已被录入人撤回，暂无法复核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    showPopup.value = true
  })
}

/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-26 17:48:14
 * @param {*} item
 * @description: 直接生成链接、邀请客户
 */
const directInviteUser = item => {
  apiMeetingReview.getMeetingInfo(props.refcode).then(res => {
    // 校验最新状态
    if (['2', '3'].includes(res.data.metStatus)) {
      showToast('当前上会结果已被复核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    //运营端删除
    if (!res.data.metStatus) {
      showToast('当前上会结果已被录入人删除，暂无法复核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    //运营端撤回
    if (res.data.metStatus === '9') {
      showToast('当前上会结果已被录入人撤回，暂无法复核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    const shareData = {
      userName,
      refcode: item.refcode // 审查意见流水号
    }
    isGuideFlag.value = true
    setMessageLink(shareData)
  })
}
// 删除委员
const delUser = item => {
  apiMeetingReview.getMeetingInfo(props.refcode).then(res => {
    // 校验最新状态
    if (['2', '3'].includes(res.data.metStatus)) {
      showToast('当前上会结果已被复核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    //运营端删除
    if (!res.data.metStatus) {
      showToast('当前上会结果已被录入人删除，暂无法复核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    //运营端撤回
    if (res.data.metStatus === '9') {
      showToast('当前上会结果已被录入人撤回，暂无法复核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    userRefoce.value = item.refcode
    showModalFlag.value = true
  })
}
const onConfirmDel = () => {
  const data = {
    refcode: userRefoce.value
  }
  apiMeetingReview.doRemoveSupplement(data).then(
    () => {
      showToast('删除成功')
      getMeetingInfo()
      showModalFlag.value = false
    },
    () => {
      getMeetingInfo()
      showModalFlag.value = false
    }
  )
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-25 14:31:31
 * @description: 邀请指定委员
 */
const inviteUser = item => {
  apiMeetingReview.getMeetingInfo(props.refcode).then(res => {
    // 校验最新状态
    if (['2', '3'].includes(res.data.metStatus)) {
      showToast('当前上会结果已被复核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    //运营端删除
    if (!res.data.metStatus) {
      showToast('当前上会结果已被录入人删除，暂无法复核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    //运营端撤回
    if (res.data.metStatus === '9') {
      showToast('当前上会结果已被录入人撤回，暂无法复核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    if (!conditionRemark.value) {
      showToast('请输入条件说明')
      return
    }
    isGuideFlag.value = true
    const data = {
      metRefcode: props.refcode, // 上会结果流水号
      conditionRemark: conditionRemark.value,
      mitRefcode: item.refcode, // 委员流水号
      memberName: item.memberName, // 委员名称
      clientManager: item.clientManager // 委员工号
    }
    doInvitationSupplement(data)
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-25 10:22:50
 * @description: 关闭弹出层
 */
const closePopup = () => {
  showPopup.value = false
}
const getUserInfo = () => {
  apiMyInfo.getUserInfo().then(res => {
    userName = res.data.loginUser.userName
  })
}
onMounted(() => {
  vm.meetingInfo = props.meetingInfo

  if (props.type === 'review') {
    getCommitteeGroup()
    if (vm.meetingInfo.fintMemList && vm.meetingInfo.fintMemList.length) {
      conditionRemark.value = vm.meetingInfo.fintMemList[0].conditionRemark
    }
  }
  getUserInfo()
})
defineExpose({ getFintMemList, getMeetingInfo })
</script>

<style lang="scss" scoped>
.main {
  background: #fff;
}
:deep(.u-collapse-item) {
  box-shadow: none;
  margin-bottom: 0;
  .u-cell__title-text {
    margin-left: -8rpx;
    font-size: 28rpx !important;
    font-weight: bold;
  }
  .u-cell--clickable.u-cell {
    background-color: #fff;
  }
  .u-collapse-item__content__text {
    padding: 0;
  }
  .u-cell__body {
    padding: 27rpx 29rpx !important;
  }
}
.collapse-item-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 24rpx;
  .showInviteGroup {
    margin-left: 20rpx;
    background-color: #e4f2fd;
    border-color: #e4f2fd;
    color: #138bec;
    padding: 8rpx 20rpx;
    border-radius: 6rpx;
    font-weight: normal;
    font-size: 26rpx;
  }
}
.condition-box {
  padding: 0 30rpx;
  border-bottom: 2rpx solid #dedede;
  margin-bottom: 50rpx;
  &:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
  }
  .condition-content {
    width: 100%;
    word-break: break-all;
  }
  .condition {
    background: #f6fafd;
    border-radius: 5rpx;
    padding: 30rpx 30rpx 28rpx 18rpx;
    color: $sub-color;
    font-size: 26rpx;
    margin-bottom: 29rpx;
    line-height: 40rpx;
    display: flex;
    align-items: baseline;
    .condition-title {
      font-weight: bold;
    }
    .iconfont {
      font-size: 28rpx;
      color: #1394d8;
      margin-right: 10rpx;
      vertical-align: bottom;
    }
  }

  .group-box {
    display: flex;
    &.lastOne {
      .right-box {
        padding-bottom: 50rpx;
      }
    }
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
      padding-bottom: 60rpx;
      .head {
        display: flex;
        justify-content: space-between;
        .memberName {
          font-size: 28rpx;
          color: $default-color;
          position: relative;
        }
      }
    }
  }
}
.guide-overlay {
  z-index: 10080 !important;
}
.guide-group {
  position: relative;
  z-index: 10081;
  .guide-arrows {
    position: fixed;
    z-index: 10072;
    width: 117rpx;
    height: 101rpx;
    top: 8rpx;
    right: 66rpx;
  }
  .guide-tip {
    position: fixed;
    z-index: 10072;
    width: 255rpx;
    height: 71rpx;
    top: 86rpx;
    right: 170rpx;
  }
  .guide-know {
    position: fixed;
    z-index: 10072;
    width: 194rpx;
    height: 78rpx;
    top: 600rpx;
    right: 290rpx;
  }
}
.popup-box {
  // padding: 30rpx;
  .title-box {
    padding: 50rpx 32rpx 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 36rpx;
    }
    .icon-guanbi2 {
      color: $remark-color;
      font-size: 36rpx;
    }
  }

  .u-textarea {
    min-height: 160rpx;
    margin: 0 30rpx;
    // padding-bottom: 40rpx;
    // margin-bottom: 16rpx;
    :deep(.u-textarea__field) {
      height: auto !important;
      min-height: 160rpx !important;
    }
  }
  .list-wrap {
    max-height: calc(100vh - 540rpx);
  }
  .userName-list {
    .item-box {
      padding: 0 32rpx;
      display: flex;
      justify-content: space-between;
      height: 100rpx;
      line-height: 100rpx;
      border-bottom: 2rpx solid #ededed;
      font-size: 28rpx;
      &:last-of-type {
        border-bottom: none;
        margin-bottom: 40rpx;
      }
      .invite {
        color: $primary;
      }
    }
  }
}
:deep(.u-transition) {
  max-height: 100vh;
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
      border: 1rpx solid #138bec;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      border-radius: 50%;
      box-sizing: border-box;
      .in {
        width: 20rpx;
        height: 20rpx;
        background: #138bec;
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
  .reviewTime {
    font-size: 26rpx;
    color: $remark-color;
  }
  .title {
    height: 34rpx;
    color: #333333;
    font-weight: 700;
    font-size: 26rpx;
    line-height: 34rpx;
    margin-left: 20rpx;
  }
  .wait-reply {
    font-size: 20rpx;
    background: $warning;
    padding: 8rpx 12rpx;
    color: #fff;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    position: relative;
    top: -5rpx;
  }
}
.node-content {
  margin-left: 14rpx;
  margin-top: 8rpx;
  padding-bottom: 20rpx;
  border-left: solid 1rpx #138bec;
  padding-left: 34rpx;
  .reviewRemarkBox {
    color: $sub-color;
    line-height: 40rpx;
    font-size: 24rpx;
  }
  .btn-top {
    margin-top: 24rpx;
  }
  .btn-box {
    display: flex;
    font-size: 26rpx;
    margin-top: 10rpx;
    margin-bottom: 2rpx;
    justify-content: end;
    .del-btn {
      background: #fff !important;
      padding: 8rpx 16rpx;
      border: 1rpx solid #ed4343;
      border-radius: 6rpx;
      color: #ed4343;
    }

    .invite-btn {
      background: #fff !important;
      padding: 8rpx 16rpx;
      border: 1rpx solid #138bec;
      color: #138bec;
      border-radius: 6rpx;
      margin-left: 16rpx;
    }
  }
}
.condition-box > .node-card:last-of-type > .node-content {
  border-left: none;
}
.success-status {
  color: $success;
}
.error-status {
  color: $danger;
}
</style>
