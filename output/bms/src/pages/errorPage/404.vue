<!--
 * @Author       : may.ruan
 * @Date         : 2022-10-26 16:46:35
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-01-09 14:36:30
 * @Description  : 404未找到页面
-->
<template>
  <view class="NoFound">
    <cover-image :src="noPage" alt="404" />
    <view class="main-title">抱歉，您访问的页面不存在</view>
    <u-button class="button-primary" type="primary" @click="goHome">返回首页</u-button>
  </view>
</template>
<script lang="ts">
export default {
  name: 'NoFound'
}
</script>
<script lang="ts" setup>
import noPage from '@/assets/error/noPage.png'
import { getHasPermissionsById } from '@/utils/permissions'
import { redirectTo } from '@/utils/uniapp'
const goHome = (): void => {
  if (getHasPermissionsById('member:project')) {
    redirectTo('/member/project')
  } else if (getHasPermissionsById('member:customer')) {
    redirectTo('/member/customer')
  } else {
    redirectTo('/member/myinfo')
  }
}
</script>
<style lang="scss" scoped>
.NoFound {
  text-align: center;
  cover-image {
    margin-top: 172rpx;
    width: 415rpx;
    height: 261rpx;
  }

  :deep(.u-button) {
    font-size: 32rpx;
    width: 90%;
    margin: auto;
    height: 80rpx;
    background: $primary;
    border-radius: 5rpx;
    box-shadow: -2rpx 0rpx 13rpx 2rpx rgba(9, 150, 197, 0.55);
  }
  .main-title {
    font-size: 30rpx;
    margin-top: 61rpx;
    margin-bottom: 178rpx;
  }
}
</style>
