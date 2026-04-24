<!--
 * @Author       : jacky.cai
 * @Date         : 2023-12-25 14:31:58
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2025-12-02 14:25:56
 * @Description  : 忘记密码首页
-->
<template>
  <NavBar />
  <u-form>
    <u-input
      v-model="data.userid"
      v-insert-clear:[data.userid]="() => (data.userid = '')"
      border="bottom"
      maxlength="20"
      name="用户名"
      placeholder="请输入用户名"
    />
    <u-button block type="primary" :loading="loading" native-type="submit" @click="onNext">下一步</u-button>
  </u-form>
  <view v-if="bottomVisible" class="trademark"><cover-image src="@/assets/login/trademark.png" class="logo" alt="商标" /></view>
</template>
<script lang="ts">
export default {
  name: 'FogetPswd'
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import { showToast } from '@/utils/uniapp/toast'
import apiCommon from '@/api/common/api.common'
import { LoginidData } from '@/interfaces/common/common'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import { useUserLoginInfoStore } from '@/store/user/userLoginInfo'
import { storeToRefs } from 'pinia'
// import { onLoad } from '@dcloudio/uni-app'

const loginStore = useUserLoginInfoStore()
const { userLoginInfo } = storeToRefs(loginStore)
const router = useRouter()
const loading = ref(false)
const bottomVisible = ref(true)
// const windowHeight = ref(0)
let data = reactive({
  userid: '' // 工号
})

const onNext = (): void => {
  if (!data.userid) {
    showToast('请输入用户名')
    return
  }

  loading.value = true
  apiCommon.loginidIsFlag(data).then(
    res => {
      loading.value = false
      let loginidData: LoginidData = res.data.sipaBurMVo

      let loginId = encodeBase64(data.userid)
      let email = encodeBase64(loginidData.email)
      let mobilephone = encodeBase64(loginidData.mobilephone)

      if (loginidData.email && loginidData.mobilephone) {
        router.push(`/forgetPswd/selectType/${loginId}/${email}/${mobilephone}`)
      } else if (loginidData.email && !loginidData.mobilephone) {
        router.push(`/forgetPswd/emailAuth/${loginId}/${email}`)
      } else if (!loginidData.email && loginidData.mobilephone) {
        router.push(`/forgetPswd/phoneAuth/${loginId}/${mobilephone}`)
      }
    },
    () => {
      loading.value = false
    }
  )
}

onMounted(() => {
  data.userid = userLoginInfo.value?.loginId
})
// onLoad(() => {
//   uni.getSystemInfo({
//     success: res => {
//       windowHeight.value = res.windowHeight
//     }
//   })
//   uni.onWindowResize(res => {
//     if (res.size.windowHeight < windowHeight.value) {
//       bottomVisible.value = false
//     } else {
//       bottomVisible.value = true
//     }
//   })
// })
</script>
<style lang="scss" scoped>
.u-form {
  width: 96%;
  margin: auto;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx 16rpx 52rpx 16rpx;
  box-sizing: border-box;
}
.u-button {
  box-shadow: -2rpx 0rpx 13rpx 2rpx rgba(9, 150, 197, 0.55);
  border-radius: 5rpx;
  box-sizing: border-box;
  margin: 64rpx 0 0;
}
.trademark {
  position: absolute;
  // bottom: 120rpx;
  // top: calc(100vh - 160rpx);
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
