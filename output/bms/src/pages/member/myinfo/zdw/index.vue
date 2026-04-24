<!--
 * @Author       : ran.zhu
 * @Date         : 2026-01-16 15:58:24
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2026-01-29 16:34:33
 * @Description  : /member/myinfo/zdw 中登网授权
-->
<template>
  <NavBar />
  <view class="basicInfo">
    <u-form ref="uForm" :model="form" label-width="200rpx">
      <u-form-item label="登录名" border-bottom="1" required>
        <u-input v-model="form.loginId" placeholder="请输入登录名" maxlength="30" />
      </u-form-item>

      <u-form-item label="登录密码" border-bottom="1" required>
        <u-input v-model="form.password" password placeholder="请输入登录密码" maxlength="30" />
      </u-form-item>

      <u-button block type="primary" :loading="loading" native-type="submit" @click="onSubmit">下一步</u-button>
    </u-form>
  </view>

  <u-modal :show="dialogShow" title="验证手机号码" cancel-text="取消" confirm-text="登录" show-cancel-button @confirm="toLogin" @cancel="doCancel">
    <view class="slot-content">
      <view class="warmPrompt">验证码会发送至中登网账号绑定的手机号</view>
      <u-input
        v-model="form.verifyCode"
        v-insert-clear:[form.verifyCode]="() => (form.verifyCode = '')"
        border="bottom"
        maxlength="20"
        name="验证码"
        placeholder="请输入验证码"
      >
        <template #suffix>
          <u-code ref="uCodeRef" :seconds="120" unique-key="phone" start-text="获取验证码" @change="codeChange"></u-code>
          <text :text="tips" class="u-page__code-text" @tap="getCode">{{ tips }}</text>
        </template>
      </u-input>
    </view>
  </u-modal>
</template>
<script lang="ts">
export default {
  name: 'ZdwAuth'
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'

import { useRouter } from '@/uni-simple-router'
import apiZdw from '@/api/member/api.zdw'
import { webLoading, showToast } from '@/utils/uniapp/toast'

let timer: ReturnType<typeof setInterval> | null = null
const miniLoading = ref<any>({}) // webloading
const router = useRouter()
const uCodeRef = ref()
const loading = ref(false)
const dialogShow = ref(false)
const tips = ref('获取验证码')
let form = reactive({
  loginId: '',
  password: '',
  verifyCode: ''
})

onMounted(() => {
  getZdwLoginInfo()
})

onBeforeMount(async () => {
  miniLoading.value = await webLoading()
})

const getZdwLoginInfo = (): void => {
  loading.value = true
  apiZdw.getZdwLoginInfo().then(
    res => {
      loading.value = false
      if (res.data.loginInfo) {
        form.loginId = res.data.loginInfo.loginId || ''
      }
    },
    () => {
      loading.value = false
    }
  )
}
const codeChange = (text: string): void => {
  tips.value = text
}

const getCode = (): void => {
  doQueryLoginStatus()
}

const doGetZdwVerifyCode = (): void => {
  if (!uCodeRef.value.canGetCode) {
    return
  }
  loading.value = true
  let rData = {
    loginId: form.loginId
  }
  apiZdw.doGetZdwVerifyCode(rData).then(
    res => {
      loading.value = false
      uCodeRef.value.start()
    },
    () => {
      loading.value = false
    }
  )
}

const doQueryLoginStatus = (): void => {
  loading.value = true
  let rData = {
    loginId: form.loginId
  }
  apiZdw.doQueryLoginStatus(rData).then(
    res => {
      loading.value = false
      doGetZdwVerifyCode()
    },
    () => {
      loading.value = false
    }
  )
}

const onSubmit = (): void => {
  if (!form.loginId) {
    showToast('请输入登录名')
    return
  }
  if (!form.password) {
    showToast('请输入登录密码')
    return
  }

  loading.value = true
  let rData = {
    loginId: form.loginId,
    password: form.password
  }
  apiZdw.doZdwLogin(rData).then(
    res => {
      loading.value = false
      dialogShow.value = true
    },
    () => {
      loading.value = false
    }
  )
}

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

const toLogin = (): void => {
  if (!form.verifyCode) {
    showToast('请输入验证码')
    return
  }

  loading.value = true
  miniLoading.value.loading()
  let rData = {
    loginId: form.loginId,
    verifyCode: form.verifyCode
  }
  apiZdw.doZdwVerifyCode(rData).then(
    res => {
      setTimeout(() => {
        timer = setInterval(() => {
          doQueryLoginStatusAfterVerify()
        }, 2000)
      }, 2000)
    },
    () => {
      loading.value = false
      dialogShow.value = false
    }
  )
}

const doCancel = (): void => {
  dialogShow.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const doQueryLoginStatusAfterVerify = (): void => {
  let rData = {
    loginId: form.loginId
  }
  apiZdw.doQueryLoginStatusAfterVerify(rData).then(
    res => {
      if (res.data.loginStatus === '00') {
        showToast('登入中，等待校验账户密码 ')
      } else if (res.data.loginStatus === '01') {
        showToast('登入中，账户密码校验完毕')
      } else if (res.data.loginStatus === '02') {
        showToast('登录成功')
        if (timer) {
          clearInterval(timer)
          timer = null
        }
        dialogShow.value = false

        setTimeout(() => {
          router.back(1)
        }, 2000)
      } else if (res.data.loginStatus === '03') {
        showToast('离线')
        if (timer) {
          clearInterval(timer)
          timer = null
        }
      } else if (res.data.loginStatus === '04') {
        showToast('验证码错误')
        if (timer) {
          clearInterval(timer)
          timer = null
        }
        form.verifyCode = ''
      }
      loading.value = false
      miniLoading.value.close()
    },
    () => {
      loading.value = false
    }
  )
}
</script>
<style lang="scss" scoped>
.u-page {
  &__code-text {
    color: $u-primary;
    font-size: 30rpx;
  }
}
.title {
  background: #fbe7e7;
  padding: 20rpx;
  font-size: 24rpx;
  color: $sub-color;
}

.u-form {
  width: 96%;
  margin: auto;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx 16rpx 52rpx 16rpx;
  box-sizing: border-box;
}

.u-button {
  margin: 64rpx 0 0;
}

.warmPrompt {
  margin-bottom: 20rpx;
}
</style>
