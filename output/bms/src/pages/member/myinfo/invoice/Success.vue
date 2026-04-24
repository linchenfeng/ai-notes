<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-15 14:30:39
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-02-25 17:17:37
 * @Description  : 我的-开票管理-开具发票-提交成功 /member/project/apply/application/success
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
import { useRouter, useRoute } from '@/uni-simple-router'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
const route = useRoute()
const router = useRouter()
const type = decodeBase64(route.value.params.type) //1候补发票|2掀开发票

// 返回首页
const backToHome = () => {
  router.push(`/member/project`)
}
const doContinue = () => {
  if (type === '1') {
    router.push('/member/myinfo/invoice/generate')
  } else if (type === '2') {
    router.push(`/member/myinfo/invoice/apply/${encodeBase64('apply')}`)
  }
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
