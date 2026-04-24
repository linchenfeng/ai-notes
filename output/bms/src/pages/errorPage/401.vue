<!--
 * @Author       : may.ruan
 * @Date         : 2022-10-26 16:46:38
 * @LastEditors  : may.ruan
 * @LastEditTime : 2023-08-16 09:34:31
 * @Description  : 401无权限页面
-->
<template>
  <view class="NoPermissions">
    <cover-image :src="noPermission" alt="401" />
    <view class="main-title">抱歉，您没有访问权限</view>
    <u-button class="button-primary" type="primary" @click="goHome">返回首页</u-button>
  </view>
</template>
<script lang="ts">
export default {
  name: 'NoPermissions'
}
</script>
<script lang="ts" setup>
import noPermission from '@/assets/error/noPermission.png'
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
.NoPermissions {
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
