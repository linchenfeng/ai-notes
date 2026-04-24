<!--
 * @Author       : jacky.cai
 * @Date         : 2023-12-25 17:11:53
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-03-26 09:58:29
 * @Description  : 忘记密码-选择验证方式
-->
<template>
  <NavBar />
  <view class="title">为了您的账号安全，请选择一种方式验证您的身份。推荐使用手机号码验证。</view>
  <u-form>
    <view class="select-type">请选择一种验证方式</view>
    <u-cell title="通过手机号码验证" :is-link="true" @click="onSelect(0)"></u-cell>
    <u-cell title="通过电子邮箱验证" :is-link="true" @click="onSelect(1)"></u-cell>
  </u-form>
  <view class="trademark"><cover-image src="@/assets/login/trademark.png" class="logo" alt="商标" /></view>
</template>
<script lang="ts">
export default {
  name: 'SelectType'
}
</script>
<script lang="ts" setup>
import { useRouter, useRoute } from '@/uni-simple-router'
// import { decodeBase64, encodeBase64 } from '@/utils/crypto'

import NavBar from '@/layout/NavBar.vue'
const router = useRouter()
let route = useRoute()
// let loginId = decodeBase64(String(route.value.params.loginId))
// let email = decodeBase64(String(route.value.params.email))
// let mobilephone = decodeBase64(String(route.value.params.mobilephone))

const onSelect = (type: number): void => {
  if (type === 0) {
    router.push(`/forgetPswd/phoneAuth/${route.value.params.loginId}/${route.value.params.mobilephone}`)
  } else if (type === 1) {
    router.push(`/forgetPswd/emailAuth/${route.value.params.loginId}/${route.value.params.email}`)
  }
}
</script>
<style lang="scss" scoped>
.title {
  background: #fbe7e7;
  padding: 20rpx;
  font-size: 24rpx;
  color: $sub-color;
}
:deep(.u-cell__body) {
  padding: 30rpx 0;
}
:deep(.u-cell__title-text) {
  font-size: 28rpx;
  color: $remark-color;
}
.u-form {
  width: 96%;
  margin: auto;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx 16rpx 52rpx 16rpx;
  box-sizing: border-box;
  .select-type {
    padding: 10rpx 0;
    font-size: 32rpx;
  }
}
.trademark {
  position: absolute;
  // bottom: 120rpx;
  top: 1200rpx;
  margin: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  .logo {
    width: 294rpx;
    height: 44rpx;
  }
}
</style>
