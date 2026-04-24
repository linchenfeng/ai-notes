<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-23 14:17:44
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-07 11:21:55
 * @Description  : 项目-业务审核-上会结果复核详情页 member/project/meetingReview/detail
-->
<template>
  <NavBar></NavBar>
  <view class="meeting-review-detail">
    <!-- 基本信息 -->
    <BasicInfo type="review" :meeting-info="vm.meetingInfo"></BasicInfo>
    <ty-info-card title="概要说明">
      <view class="content pre-wrap">{{ vm.meetingInfo.summaryRemark }}</view>
    </ty-info-card>
    <!-- 委员意见 -->
    <OpinionList
      v-if="vm.meetingInfo.refcode && (!['3', '8'].includes(sourceStatus) || vm.meetingInfo.fintMemList.length > 0)"
      ref="opinionList"
      :source="['3', '8'].includes(sourceStatus) ? 'cancel' : ''"
      type="review"
      :refcode="refcode"
      :meeting-info="vm.meetingInfo"
      class="opinion-list"
    ></OpinionList>
    <ty-info-card title="复核意见">
      <template #subtitle>
        <view v-if="showHistory" class="history" @click="toHistory">审核历程</view>
      </template>
      <!-- 已提交撤回 -->
      <view v-if="['3', '8'].includes(sourceStatus)" class="head-box">
        <!-- <text class="iconfont-bms-colorful bms-color-drxx66"></text> -->
        <view class="left">
          <view class="out">
            <view class="in"></view>
          </view>
        </view>
        <view class="right-box">
          <view class="review-name-box">
            <view>{{ vm.meetingInfo.reviewUserName }}：</view>
            <view class="reviewTime">{{ vm.meetingInfo.reviewTime ? dateFormat(vm.meetingInfo.reviewTime, 2) : '' }}</view>
          </view>
          <view class="content review-remark">
            <text class="pre-wrap remark">{{ vm.meetingInfo.reviewRemark || '复核通过' }}</text>
          </view>
        </view>
      </view>
      <!-- 待复核 -->
      <u-textarea
        v-if="sourceStatus == '1'"
        v-model="reviewRemark"
        class="inputValueClass"
        :confirm-type="null"
        maxlength="200"
        placeholder-style="font-size: 28rpx;"
        auto-height
        count
        :focus="focusFlag"
        placeholder="请输入复核意见"
      ></u-textarea>
    </ty-info-card>
  </view>
  <view v-if="getHasPermissionsById('member:project:audit:meetingReview:audit')" class="button-fixed-bottom">
    <view class="placeholder"></view>
    <view class="fixed">
      <!-- 待复核 -->
      <u-button v-if="sourceStatus === '1'" :loading="loading" block type="error" native-type="submit" @click="checkMetStatus('2')">退回</u-button>
      <u-button v-if="sourceStatus === '1'" :loading="loading" block type="primary" native-type="submit" @click="checkMetStatus('3')">通过</u-button>
      <!-- 已提交撤回 -->
      <u-button v-if="['3', '8'].includes(sourceStatus)" :loading="loading" block type="primary" native-type="submit" @click="cancelShow = true">
        撤回
      </u-button>
    </view>
  </view>
  <u-modal :show="dialogShow" mode="center" :round="10" confirm-text="确定" :show-cancel-button="false" show-confirm-button @confirm="onConfirm">
    <view class="slot-content">
      <view class="title">{{ '温馨提示' }}</view>
      <view>数据已被更新，请刷新页面获取最新信息</view>
    </view>
  </u-modal>
  <u-modal
    :show="cancelShow"
    title="温馨提示"
    confirm-text="确认"
    show-cancel-button="true"
    class="accessModal"
    @confirm="onConfirmCancel"
    @cancel="cancelShow = false"
  >
    <view class="slot-content">
      <view>请确认是否撤回？</view>
    </view>
  </u-modal>
</template>

<script setup lang="ts">
import OpinionList from '@/pages/member/project/audit/meetingReview/components/OpinionList.vue'
import BasicInfo from '@/pages/member/project/audit/meetingReview/components/BasicInfo.vue'
import { MeetingInfo } from '@/interfaces/member/project/audit/meetingReview'
import apiMeetingReview from '@/api/member/project/audit/api.meetingReview'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
import { useRoute, useRouter } from '@/uni-simple-router'
import NavBar from '@/layout/NavBar.vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import { getPlatform } from '@/utils/uniapp'
import { doWxConfig } from '@/utils/weixin/wxConfig'
import { dateFormat } from '@/utils/format'
import wx from 'jweixin-1.6.0'
const router = useRouter()
const route = useRoute()
const reviewRemark = ref('') // 复核意见
const loading = ref(false)
const opinionList = ref()
const dialogShow = ref(false)
const cancelShow = ref(false)
const focusFlag = ref(false)
const showHistory = ref(false) // 是否展示历史记录
let refcode = ref('') // 入会结果流水号
let sourceStatus = ref('') // 1待复核|3已提交
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
  reviewUserName: '',
  reviewTime: '',
  reviewRemark: '',
  applyConditionDesc: '',
  counterpartyOrgname: '',
  bizScene: '',
  factoringType: '',
  businessNo: ''
}

let vm = reactive({
  meetingInfo: meetingInfo
})

/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-25 15:08:40
 * @description: 设置分享菜单
 */
const doShareInfo = () => {
  // H5端分享
  if (getPlatform() === 'H5') {
    // #ifdef H5
    const jsApiList = ['updateAppMessageShareData', 'hideMenuItems', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem', 'showMenuItems']
    // 要展示的菜单项
    doWxConfig(jsApiList).then(() => {
      wx.hideAllNonBaseMenuItem()
      wx.showMenuItems({ menuList: ['menuItem:share:appMessage'] })
    })
    // #endif
  }
}

/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-25 15:40:44
 * @param {*} metStatus 【2=退回/3=通过】
 * @description:提交复核
 */
const doSubmitReview = (metStatus: string) => {
  focusFlag.value = false
  if (opinionList.value) {
    vm.meetingInfo.fintMemList = opinionList.value.getFintMemList()
  }
  if (metStatus === '2' && !reviewRemark.value) {
    scrollTo(0, 99999)
    showToast('请输入复核意见')
    let dom = document.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
    if (dom) {
      dom.focus()
    }
    focusFlag.value = true
    loading.value = false
    return
  }
  if (metStatus === '3') {
    for (let item of vm.meetingInfo.fintMemList) {
      for (let obj of item.groupList) {
        if (!obj.reviewRemark) {
          showToast(`${obj.memberName}未补充意见`)
          scrollTo(0, 99999)
          loading.value = false
          return
        }
      }
    }
  }
  const data = {
    refcode: refcode.value,
    metStatus: metStatus,
    reviewRemark: reviewRemark.value
  }
  loading.value = true
  apiMeetingReview.doSubmitReview(data).then(
    () => {
      if (metStatus === '3') {
        // 客户经理提交成功
        uni.redirectTo({
          url: '/member/project/audit/meetingReview/success',
          success: () => {
            loading.value = false
          }
        })
      } else {
        showToast('操作成功')
        setTimeout(() => {
          loading.value = false
          router.back(1)
        }, 1000)
      }
    },
    () => {
      loading.value = false
    }
  )
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-28 10:14:57
 * @param {*} type
 * @description: 提交校验状态以及数据是否最新
 */
const checkMetStatus = (type: string) => {
  loading.value = true
  apiMeetingReview.getMeetingInfo(refcode.value).then(
    res => {
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
      if (opinionList && opinionList.value) {
        let pageFintMemList = opinionList.value.getFintMemList() // 页面展示的委员意见列表
        let newestFintMemList = res.data.fintMemList // 数据库最新委员意见列表
        if (pageFintMemList.length !== newestFintMemList.length) {
          dialogShow.value = true
          loading.value = false
          return
        }
        let pageNoreplyCount = 0 // 页面上未回复的委员数量
        let newestNoreplyCount = 0 // 数据库最新未回复的数量
        pageFintMemList.forEach(item => {
          item.groupList.forEach(obj => {
            if (!obj.reviewRemark) {
              pageNoreplyCount++
            }
          })
        })
        newestFintMemList.forEach(item => {
          item.groupList.forEach(obj => {
            if (!obj.reviewRemark) {
              newestNoreplyCount++
            }
          })
        })
        // 对比页面与最新数据未回复数量
        if (pageNoreplyCount !== newestNoreplyCount) {
          dialogShow.value = true
          loading.value = false
          return
        }
      }
      // 【ARM-10401】先校验必填，解决IOS必须交互才能弹出键盘的保护机制，若先调接口，异步导致键盘不弹出
      if (type === '2' && !reviewRemark.value) {
        scrollTo(0, 99999)
        showToast('请输入复核意见')
        let dom = document.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
        if (dom) {
          dom.focus()
        }
        focusFlag.value = true
        loading.value = false
        return
      }
      doSubmitReview(type)
    },
    () => {
      loading.value = false
    }
  )
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-27 10:53:05
 * @description: 查询详情
 */
const getMeetingInfo = () => {
  apiMeetingReview.getMeetingInfo(refcode.value).then(res => {
    if (!['1', '3', '8'].includes(res.data.metStatus)) {
      showToast('当前上会结果已被复核')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    vm.meetingInfo = res.data
    reviewRemark.value = res.data.reviewRemark || ''
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-28 11:03:15
 * @description: 数据存在变更，点击确定获取最新信息
 */
const onConfirm = () => {
  dialogShow.value = false
  if (opinionList && opinionList.value) {
    opinionList.value.getMeetingInfo()
  }
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
const onConfirmCancel = () => {
  let data = { refcode: refcode.value }
  loading.value = true
  apiMeetingReview.doRevokeReviewStatus(data).then(
    () => {
      loading.value = false
      cancelShow.value = false
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
onMounted(() => {
  // 路由带参
  if (route.value.params) {
    refcode.value = decodeBase64(route.value.params.refcode) // 上会结果流水号
    sourceStatus.value = decodeBase64(route.value.params.type) // 1待复核|3已提交|8已过会
  }
  getMeetingInfo()
  getHistoryList()
  doShareInfo()
})
</script>

<style lang="scss" scoped>
@import './style/meeting.scss';
.meeting-review-detail {
  background: #f6f6f6;
  margin-bottom: 20rpx;
}
.history {
  font-size: 26rpx;
  color: $primary;
  font-weight: normal;
  flex: 1;
  text-align: right;
}
.content {
  padding-bottom: 30rpx;
  line-height: 48rpx;
}
.slot-content {
  color: #646566;
  .title {
    font-size: 28rpx;
    margin-bottom: 30rpx;
  }
}
.head-box {
  display: flex;
  // align-items: center;
  .right-box {
    width: 100%;
  }

  .left {
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
      margin-top: 4rpx;
      margin-right: 20rpx;
      .in {
        width: 20rpx;
        height: 20rpx;
        background: #138bec;
        border-radius: 50%;
      }
    }
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
.remark {
  color: #666;
}
.review-remark {
  margin-top: 20rpx;
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
