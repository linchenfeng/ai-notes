<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-26 10:55:10
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-31 11:36:20
 * @Description  : 项目-业务审核-业务准入-审核成功 /member/project/audit/access/audit/success
-->
<template>
  <NavBar></NavBar>
  <view class="success">
    <view class="choose-list">
      <cover-image class="top-bg" :src="bgPic" alt="background" />
      <view class="view-content vteam-card">
        <text class="iconfont icon-yiwancheng"></text>
        <view class="text">业务准入审核成功</view>
        <u-button class="button" type="primary" shape="circle" @click="backToHome">{{ '返回首页' }}</u-button>
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
// import { decodeBase64 } from '@/utils/crypto'
// import { onLoad } from '@dcloudio/uni-app'
import NavBar from '@/layout/NavBar.vue'
import { useRouter } from '@/uni-simple-router'
const router = useRouter()
// let productName = ref('')
// onLoad(option => {
//   productName.value = decodeBase64(option?.productName)
// })
const backToHome = () => {
  router.push('/member/project')
}
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
    padding: 80rpx 0 260rpx 0;
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
      padding: 30rpx 30rpx 0;
      text-align: center;
      color: $remark-color;
      line-height: 58rpx;
    }
    .button {
      margin: 120rpx auto 0;
      width: 310rpx;
    }
  }
}
</style>
