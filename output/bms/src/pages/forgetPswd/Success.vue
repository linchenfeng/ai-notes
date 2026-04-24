<template>
  <view class="main-bg">
    <view><cover-image class="bg" src="@/assets/member/myinfo/collect/bg.png"></cover-image></view>
    <NavBar />
    <view class="white-bg">
      <cover-image class="image-ok" src="@/assets/login/ok.png" alt="OK" />
      <view class="title">密码重置成功</view>
      <u-button class="button" :disabled="disabled" type="primary" @click="onSubmit">{{ buttonTitle }}</u-button>
    </view>
    <view class="trademark"><cover-image src="@/assets/login/trademark.png" class="logo" alt="商标" /></view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'Success'
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import { redirectTo } from '@/utils/uniapp'
const disabled = ref(true)
const countdown = ref(5)
const buttonTitle = ref('重新登录（5s）')
const onSubmit = () => {
  redirectTo('/wap/login')
}
const startCountdown = (): void => {
  setTimeout(() => {
    if (countdown.value > 1) {
      countdown.value--
      buttonTitle.value = '重新登录（' + countdown.value + 's）'
      disabled.value = true
      startCountdown()
    } else {
      buttonTitle.value = '重新登录'
      disabled.value = false
    }
  }, 1000)
}
onMounted(() => {
  startCountdown()
})
</script>
<style lang="scss" scoped>
:deep(.u-navbar__content) {
  background-color: transparent !important;
}
:deep(.u-navbar__placeholder) {
  background-color: transparent !important;
}

.main-bg {
  background-color: #fafbfd;
  min-height: 100vh;
  width: 100%;
  position: relative;
  z-index: 0;
  .bg {
    position: absolute;
    width: 100%;
    height: 365rpx;
    z-index: 1;
  }
  .white-bg {
    position: relative;
    width: 90%;
    height: 800rpx;
    margin: 50rpx 5%;
    z-index: 1;
    background-color: #fff;
    border-radius: 20rpx;
    box-sizing: border-box;
    text-align: center;
    .image-ok {
      margin: 50rpx 0;
      width: 100rpx;
      height: 100rpx;
    }
    .title {
      font-size: 36rpx;
    }
    .button {
      width: 300rpx;
      margin: 50px auto;
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
}
</style>
