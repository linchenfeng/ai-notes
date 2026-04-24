<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-17 10:08:27
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-29 11:25:46
 * @Description  : 客户填报申请书页面
-->

<template>
  <view class="box">
    <view class="head">
      <view><cover-image class="bg" src="@/assets/member/myinfo/collect/bg.png"></cover-image></view>
      <view><cover-image class="logo" src="@/assets/member/myinfo/collect/logo.png"></cover-image></view>
      <view><cover-image class="gather" src="@/assets/member/myinfo/collect/gather.png"></cover-image></view>
      <view class="head-text">
        <view class="title">嗨，我是{{ userName }}</view>
        <view class="desc">
          <view>邀请您填写业务申请书</view>
          <!-- <view>以下信息吧</view> -->
        </view>
      </view>
    </view>
    <!-- <view class="collect-body"> -->
    <view v-if="['0', '7'].includes(applyStatus)" class="collect-body">
      <!-- 填报申请书模块 -->
      <ApplicationApply :share-time="vm.shareDataObj.shareTime" @get-apply-status="getApplyStatus" @get-user-name="getUserName"></ApplicationApply>
    </view>
    <view v-else class="collect-body">
      <view class="no-need-collect">
        <view class="icon">
          <text v-if="['2', '3', '9'].includes(applyStatus)" class="iconfont icon-jinggao"></text>
          <text v-else class="iconfont icon-yiwancheng"></text>
        </view>
        <view class="content">
          <view class="contentInfo">{{ linkrotText }}</view>
          <view v-if="applyStatus === '9'" class="contentDesc">可联系客户经理重新发起邀请</view>
        </view>
      </view>
    </view>
  </view>
  <!-- </view> -->
</template>

<script setup lang="ts">
import ApplicationApply from '@/pages/member/project/apply/application/Apply.vue'
import { decodeBase64, getUrlParam } from '@/utils/crypto'
import { ShareDataObj } from '@/interfaces/member/project/apply/fillingApplication'
// import { onShow } from '@dcloudio/uni-app'
// import { getStorage, removeStorage } from '@/utils/storages'
import apiFillingApplication from '@/api/member/project/apply/api.fillingApplication'
import { onBeforeRouteLeave } from '@/uni-simple-router'
import dayjs from 'dayjs'
const applyStatus = ref('0') // 【0=正常录入/1=提交成功/2=客户经理已提交/3=邀请已过期/7=运营退回之后分享/9买方信息已被删除】
const linkrotText = ref('')
const userName = ref('')
let shareDataObj: ShareDataObj = {
  // 融资企业通过分享链接跳入带入的参数
  refcode: '',
  orgname: '',
  operator: '',
  ctyid: '',
  shareTime: 0
}
let vm = reactive({
  shareDataObj: shareDataObj
})
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-08 14:59:46
 * @param {*} status
 * @param {*} examineDate 运营端操作时间
 * @description: 根据状态返回状态文字
 */
const getApplyStatus = (status: string, examineDate?: number) => {
  applyStatus.value = status
  // 分享链接的时间在运营退回之后，链接则在有效期内
  if (applyStatus.value === '7' && examineDate && dayjs(vm.shareDataObj.shareTime).isBefore(dayjs(examineDate))) {
    linkrotText.value = '邀请已过期'
    applyStatus.value = '3'
  } else if (applyStatus.value === '1') {
    linkrotText.value = '提交成功'
  } else if (applyStatus.value === '2') {
    linkrotText.value = '客户经理已完善信息'
  } else if (applyStatus.value === '9') {
    linkrotText.value = '链接已失效'
  } else {
    apiFillingApplication.doSendInviteLink({ refcode: vm.shareDataObj.refcode })
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-17 15:12:36
 * @param {*} userName
 * @description: 获取客户经理名称
 */
const getUserName = (name: string) => {
  userName.value = name
}

if (getUrlParam('data')) {
  vm.shareDataObj = JSON.parse(decodeBase64(getUrlParam('data'))) as ShareDataObj
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-10 14:17:08
 * @return {*}
 * @description: 前往子页面补录信息，缓存数据,跳转至列表页时清除缓存数据
 */
onBeforeRouteLeave(() => {
  if (['1', '2', '3'].includes(applyStatus.value)) {
    return false
  }
})
</script>

<style lang="scss" scoped>
.box {
  min-height: 100vh;
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
      font-size: 34rpx;
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
  // padding-top: 30rpx;
  background: #ffffff;
  // border-radius: 20rpx;
  // box-shadow: 2rpx 2rpx 6rpx 6rpx rgba(0, 0, 0, 0.1);
  position: relative;
  .count-down {
    font-size: 32rpx;
    margin-bottom: 30rpx;
    text-align: center;
    height: 48rpx;
    .danger {
      color: $danger;
    }
  }
  // :deep(.button-fixed-bottom .placeholder) {
  //   height: 0;
  // }
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
</style>
