<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-17 10:08:27
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-29 11:25:46
 * @Description  : 客户填报申请书链接异常失效页面 /member/project/apply/application/failure
-->

<template>
  <view class="box">
    <view class="head">
      <view><cover-image class="bg" src="@/assets/member/myinfo/collect/bg.png"></cover-image></view>
      <view><cover-image class="logo" src="@/assets/member/myinfo/collect/logo.png"></cover-image></view>
      <view><cover-image class="gather" src="@/assets/member/myinfo/collect/gather.png"></cover-image></view>
      <!--   <view class="head-text">
        <view class="title">嗨，我是{{ userName }}</view>
        <view class="desc">
          <view>邀请您填写业务申请书</view>
        </view>
      </view> -->
    </view>
    <view class="collect-body">
      <view class="no-need-collect">
        <view class="icon">
          <text class="iconfont icon-jinggao"></text>
        </view>
        <view class="content">
          <view class="contentInfo">链接已失效</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts"></script>

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
