<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-26 10:55:10
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-31 11:14:18
 * @Description  : 业务申请成功 /member/project/apply/access/success
-->
<template>
  <NavBar></NavBar>
  <view class="success">
    <view class="choose-list">
      <cover-image class="top-bg" :src="bgPic" alt="background" />
      <view class="view-content vteam-card">
        <text class="iconfont icon-yiwancheng"></text>
        <view class="text">提交成功，请等待审核！</view>
        <view class="success-button-box">
          <u-button class="returnHome" type="primary" shape="circle" @click="backToHome">{{ '返回首页' }}</u-button>
          <u-button class="button" type="primary" shape="circle" @click="doContinue">{{ '继续申请' }}</u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: 'Success'
}
</script>
<script lang="ts" setup>
import bgPic from '@/assets/member/project/business/bg_top.png'
import NavBar from '@/layout/NavBar.vue'
import { useRouter } from '@/uni-simple-router'
const router = useRouter()
// 返回首页
const backToHome = () => {
  router.push(`/member/project`)
}
const doContinue = () => {
  router.back(1)
}

// 继续申请
</script>
<style lang="scss" scoped>
.success {
  // background-color: $bg-color;
  width: 100%;
  min-height: inherit;

  .top-bg {
    width: 100%;
    height: 265rpx;
  }

  .view-content {
    position: relative;
    margin: -200rpx 30rpx 0 30rpx;
    padding: 120rpx 0 180rpx 0;
    text-align: center;
    border-radius: 20rpx;
    background-color: #fff;
    box-shadow: -1rpx 0px 20rpx 1rpx rgba(0, 0, 0, 0.1);
    .icon-yiwancheng {
      margin: 50rpx 0 30rpx 0;
      font-size: 120rpx !important;
      color: $primary;
    }
    // .successText {
    //   margin-top: 20rpx;
    //   font-size: 36rpx;
    //   color: #22242a;
    //   line-height: 58rpx;
    // }
    .text {
      font-size: 28rpx;
      padding: 40rpx 30rpx 0;
      text-align: center;
      color: $remark-color;
      line-height: 58rpx;
    }
    .success-button-box {
      margin: 110rpx auto 0;
      padding: 0 60rpx;
      display: flex;
      justify-content: space-around;
      .u-button {
        width: 220rpx;
        &.returnHome {
          background-color: #f5f5f5;
          border-color: #f5f5f5;
          color: $default-color;
        }
      }
    }
  }
}
</style>
