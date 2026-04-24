<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-23 14:17:36
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-11-07 16:28:09
 * @Description  : 项目-业务审核-上会结果审批详情 /member/project/audit/meetingApproval/detail
-->
<template>
  <NavBar></NavBar>
  <view class="meeting-approval-detail">
    <!-- 基本信息 -->
    <view :style="{ marginBottom: `${isTextareaFocused ? cardHeight : 0}px` }">
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
      <ty-info-card v-if="vm.meetingInfo.reviewUserName" title="复核意见">
        <view class="head-box">
          <view class="left">
            <view class="out">
              <view class="in"></view>
            </view>
          </view>
          <view class="right-box">
            <view class="review-name-box">
              <view>{{ vm.meetingInfo.reviewUserName }}：</view>
              <view class="reviewTime">{{ dateFormat(vm.meetingInfo.reviewTime, 2) }}</view>
            </view>
            <view class="content review-remark">
              <view class="pre-wrap">{{ vm.meetingInfo.reviewRemark || '复核通过' }}</view>
            </view>
          </view>
        </view>
      </ty-info-card>
    </view>

    <ty-info-card ref="approveRemarkCardRef" title="审批意见" :class="{ 'fixed-bottom-card': isTextareaFocused }">
      <template v-if="showHistory" #subtitle>
        <view class="history">
          <text @touchstart="toHistory" @mousedown="toHistory">审核历程</text>
        </view>
      </template>
      <u-textarea
        v-model="approveRemark"
        :confirm-type="null"
        maxlength="200"
        placeholder-style="font-size: 28rpx;"
        class="inputValueClass"
        count
        :focus="focusFlag"
        auto-height
        placeholder="请输入审批意见"
        @focus="textfocus"
        @blur="textblur"
      ></u-textarea>
    </ty-info-card>
    <view v-if="getHasPermissionsById('member:project:audit:meetingApproval:audit')" class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button :loading="loading" block type="error" native-type="submit" @click="doSendVerificationCode('4')">退回</u-button>
        <u-button :loading="loading" block type="primary" native-type="submit" @click="doSendVerificationCode('5')">通过</u-button>
      </view>
    </view>
  </view>
  <u-modal :show="showModal" :round="10">
    <view v-if="checkType === 'code'" class="modal-box">
      <view class="title">请输入验证码</view>
      <view class="text-box">
        已发送至+86
        <text class="mobilephone">{{ mobilephone }}</text>
        <text v-if="seconds" class="seconds">{{ seconds }}s后重新获取</text>
        <text v-else class="regain" @click="doSendVerificationCode()">重新获取</text>
      </view>
      <view class="code-box">
        <up-code-input
          v-model="verificationCode"
          border-color="#efeff0"
          :focus="true"
          :size="78"
          :font-size="48"
          @change="changeCode"
          @finish="checkMetStatus"
        ></up-code-input>
      </view>
      <view class="forget-code" @click="changeCheckType('password')">没有收到验证码？请输入预设密码>></view>
      <!-- <u-button :loading="loading" block type="primary" native-type="submit" @click="checkMetStatus">确定</u-button> -->
      <view class="cancel" @click="showModal = false">取消</view>
    </view>
    <view v-if="checkType === 'password'" class="modal-box">
      <view class="title">请输入预设密码</view>
      <view class="code-box password">
        <u-input
          v-model="verificationCode"
          v-insert-clear:[verificationCode]="() => (verificationCode = '')"
          :focus="true"
          :type="showPasswordFlag ? '' : 'password'"
          border="bottom"
          maxlength="20"
          placeholder="请输入预设密码"
        >
          <template #suffix>
            <i v-if="!showPasswordFlag" class="icon-yincang iconfont" @click="changePassword"></i>
            <i v-if="showPasswordFlag" class="icon-Eyesopen iconfont" @click="changePassword"></i>
          </template>
        </u-input>
      </view>
      <!-- <view class="forget-code" @click="changeCheckType('code')">预设密码不正确？请输入短信验证码>></view> -->
      <u-button class="submit" :loading="loading" block type="primary" native-type="submit" @click="checkPassword">确定</u-button>
      <view class="cancel" @click="showModal = false">取消</view>
    </view>
  </u-modal>
</template>

<script setup lang="ts">
import BasicInfo from '@/pages/member/project/audit/meetingReview/components/BasicInfo.vue'
import NavBar from '@/layout/NavBar.vue'
import OpinionList from '@/pages/member/project/audit/meetingReview/components/OpinionList.vue'
import apiMeetingApproval from '@/api/member/project/audit/api.meetingApproval'
import { getHasPermissionsById } from '@/utils/permissions'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
import { MeetingInfo } from '@/interfaces/member/project/audit/meetingAproval'
import { useRoute, useRouter } from '@/uni-simple-router'
import { dateFormat } from '@/utils/format'
import { showToast } from '@/utils/uniapp/toast'
import apiMeetingReview from '@/api/member/project/audit/api.meetingReview'
import apiCommon from '@/api/common/api.common'
const isTextareaFocused = ref(false)
let cardHeight = ref<number>(0) // 审批意见模块高度
const approveRemarkCardRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null // 新增：ResizeObserver实例
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const submitType = ref('')
const showModal = ref(false) // 展示
const approveRemark = ref('') // 审批意见
const verificationCode = ref('') // 验证码
const showHistory = ref(false) // // 是否展示历史记录
const seconds = ref(0)
const focusFlag = ref(false)
let showPasswordFlag = ref(false)
let uuid = '' // 验证码uuid
const mobilephone = ref('') // 被发送验证码的手机号
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
  businessNo: ''
}
const checkType = ref('password')
let vm = reactive({
  meetingInfo: meetingInfo
})
// 新增：初始化监听
const initResizeObserver = () => {
  // 销毁已有实例
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  // 确保元素存在
  const getTargetElement = () => {
    if (!approveRemarkCardRef.value) {
      return null
    }
    // 若ref绑定的是Vue组件，需获取其根DOM元素（$el）
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return approveRemarkCardRef.value.$el || approveRemarkCardRef.value
  }
  const target = getTargetElement()
  if (!target) {
    return
  }

  // 创建监听实例
  resizeObserver = new ResizeObserver(entries => {
    const entry = entries[0]
    if (entry) {
      cardHeight.value = Math.round(entry.contentRect.height)
    }
  })

  // 开始监听
  resizeObserver.observe(target)
}
const getMeetingInfo = () => {
  apiMeetingApproval.getMeetingInfo(refcode.value).then(res => {
    if (res.data.metStatus !== '3') {
      showToast('当前上会结果已被审批')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    vm.meetingInfo = res.data
    approveRemark.value = res.data.approveRemark || ''
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-28 18:00:00
 * @param {*} index
 * @description: 设置验证码高亮边框
 */
const setBorderColor = index => {
  let domList = document.querySelectorAll('.u-code-input__item')
  if (domList && domList.length) {
    domList.forEach((item, i) => {
      if (index === i) {
        item.classList.add('u-code-input__item--current')
      } else {
        item.classList.remove('u-code-input__item--current')
      }
    })
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-27 15:33:21
 * @param {*} type 【4=退回/5=通过】
 * @description: 提交审批
 */
const doSubmitApproval = () => {
  loading.value = true
  if (checkType.value === 'code') {
    if (!verificationCode.value) {
      showToast('请输入验证码')
      loading.value = false
      return
    }
    if (verificationCode.value.length !== 6) {
      showToast('请输入六位验证码')
      loading.value = false
      return
    }
  }

  const data = {
    refcode: refcode.value,
    uuid: uuid,
    verificationCode: verificationCode.value,
    metStatus: submitType.value,
    approveRemark: approveRemark.value,
    //是否预设密码校验
    isCheckPassword: checkType.value === 'password' ? '1' : '0'
  }
  apiMeetingApproval.doSubmitApproval(data).then(
    () => {
      showModal.value = false
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
 * @Date: 2024-11-28 15:20:02
 * @description: 校验状态
 */
const checkMetStatus = () => {
  if (loading.value) {
    return
  }
  loading.value = true
  apiMeetingApproval.checkStatus(refcode.value).then(
    res => {
      //运营端删除
      if (!res.data.metStatus) {
        showToast('当前上会结果已被录入人删除，暂无法审批')
        setTimeout(() => {
          router.back(1)
        }, 1000)
        return
      }
      //运营端撤回
      if (res.data.metStatus === '9') {
        showToast('当前上会结果已被录入人撤回，暂无法审批')
        setTimeout(() => {
          router.back(1)
        }, 1000)
        return
      }
      //复核人撤回
      if (res.data.metStatus === '1') {
        showToast('当前上会结果已被复核人撤回，暂无法审批')
        setTimeout(() => {
          router.back(1)
        }, 1000)
        return
      }
      //审批通过或审批退回
      if (['4', '5'].includes(res.data.metStatus)) {
        showToast('当前上会结果已被审批')
        setTimeout(() => {
          router.back(1)
        }, 1000)
        return
      }
      doSubmitApproval()
    },
    () => {
      loading.value = false
    }
  )
}
/* const checkPass = () => {
  if (seconds.value) {
    // 已获取验证码正在读秒，未满60s，直接展示弹窗
    showModal.value = true
    nextTick(() => {
      setBorderColor(verificationCode.value.length || 0)
    })
  } else {
    loading.value = true
    apiMeetingApproval.doSendVerificationCode().then(
      res => {
        loading.value = false
        uuid = res.data.uuid
        mobilephone.value = encryptMobile(res.data.mobilephone)
        seconds.value = 90
        const timer = setInterval(() => {
          seconds.value--
          if (seconds.value <= 0) {
            clearInterval(timer)
            seconds.value = 0
          }
        }, 1000)
        showModal.value = true
        nextTick(() => {
          setBorderColor(verificationCode.value.length || 0)
        })
      },
      () => {
        loading.value = false
      }
    )
  }
} */
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-27 15:32:52
 * @param {*} type 【4=退回/5=通过】
 * @description: 发送验证码
 */
const doSendVerificationCode = (type?: string) => {
  apiMeetingApproval.checkStatus(refcode.value).then(res => {
    //运营端删除
    if (!res.data.metStatus) {
      showToast('当前上会结果已被录入人删除，暂无法审批')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    //运营端撤回
    if (res.data.metStatus === '9') {
      showToast('当前上会结果已被录入人撤回，暂无法审批')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    //复核人撤回
    if (res.data.metStatus === '1') {
      showToast('当前上会结果已被复核人撤回，暂无法审批')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    //审批通过或审批退回
    if (['4', '5'].includes(res.data.metStatus)) {
      showToast('当前上会结果已被审批')
      setTimeout(() => {
        router.back(1)
      }, 1000)
      return
    }
    focusFlag.value = false
    submitType.value = type || submitType.value
    // 默认预设密码
    checkType.value = 'password'
    if (submitType.value === '4' && !approveRemark.value) {
      scrollTo(0, 99999)
      showToast('请输入审批意见')
      let dom = document.querySelector('.uni-textarea-textarea') as HTMLTextAreaElement
      if (dom) {
        dom.focus()
      }
      focusFlag.value = true
      return
    }
    showModal.value = true
    // checkPass()
  })
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
 * @Date: 2024-11-28 17:42:05
 * @description: 改变验证码
 */
const changeCode = val => {
  setBorderColor(val.length)
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
const changeCheckType = (type: string) => {
  checkType.value = type
  verificationCode.value = ''
}
const checkPassword = () => {
  if (!verificationCode.value) {
    showToast('请输入预设密码')
    return
  }
  loading.value = true
  const data = { password: verificationCode.value }
  apiCommon.checkPassword(data).then(
    () => {
      doSubmitApproval()
    },
    () => {
      loading.value = false
    }
  )
}
const changePassword = () => {
  showPasswordFlag.value = !showPasswordFlag.value
}
const textfocus = () => {
  isTextareaFocused.value = true
  scrollTo(0, 99999)
}
const textblur = () => {
  isTextareaFocused.value = false
}
onMounted(() => {
  // 路由带参
  if (route.value.params) {
    refcode.value = decodeBase64(route.value.params.refcode) // 上会结果流水号
  }
  getMeetingInfo()
  getHistoryList()
  nextTick(() => {
    // 双重确认元素存在
    if (approveRemarkCardRef.value) {
      initResizeObserver()
    } else {
      // 延迟重试（防止元素渲染延迟）
      setTimeout(() => {
        nextTick(initResizeObserver)
      }, 300)
    }
  })
})
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
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
.pre-wrap {
  word-break: break-all !important;
}
.fixed-bottom-card {
  position: fixed;
  bottom: 60px;
  z-index: 99999;
}
</style>
