<!--
 * @Author       : jacky.cai
 * @Date         : 2023-12-26 11:49:53
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-03-31 16:59:36
 * @Description  : 忘记密码-邮箱验证
-->
<template>
  <NavBar />
  <u-form>
    <u-input v-model="data.email" disabled border="bottom" maxlength="20" name="工号" placeholder="请输入工号" />
    <u-input
      v-model="data.code"
      v-insert-clear:[data.code]="() => (data.code = '')"
      border="bottom"
      maxlength="20"
      name="验证码"
      placeholder="请输入获取的邮箱验证码"
    >
      <template #suffix>
        <u-code ref="uEmailCodeRef" unique-key="email" start-text="获取验证码" @change="codeChange"></u-code>
        <text :text="tips" class="u-page__code-text" @tap="getCode">{{ tips }}</text>
      </template>
    </u-input>
    <u-input
      v-model="data.pswd"
      v-insert-clear:[data.pswd]="() => (data.pswd = '')"
      type="password"
      border="bottom"
      maxlength="20"
      name="密码"
      placeholder="新密码由8-20位数字、字母大小写组成"
    />
    <u-input
      v-model="data.pswdAgain"
      v-insert-clear:[data.pswdAgain]="() => (data.pswdAgain = '')"
      type="password"
      border="bottom"
      maxlength="20"
      name="确认密码"
      placeholder="请再次输入新登录密码"
    />
    <u-button block type="primary" :loading="loading" native-type="submit" @click="onSubmit">提交</u-button>
  </u-form>
  <view class="trademark"><cover-image src="@/assets/login/trademark.png" class="logo" alt="商标" /></view>
</template>
<script lang="ts">
export default {
  name: 'EmailAuth'
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import { checkPassword } from '@/utils/validate'
import { useRouter, useRoute } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import apiCommon from '@/api/common/api.common'
import { showToast } from '@/utils/uniapp/toast'
import apiAuthz from '@/api/common/api.authz'

const router = useRouter()
let route = useRoute()
const uEmailCodeRef = ref()
const loading = ref(false)
const tips = ref('获取验证码')
let data = reactive({
  loginId: decodeBase64(String(route.value.params.loginId)),
  email: decodeBase64(String(route.value.params.email)),
  code: '',
  uuid: '',
  pswd: '',
  pswdAgain: ''
})
const codeChange = (text: string): void => {
  tips.value = text
}

const getCode = (): void => {
  if (!uEmailCodeRef.value.canGetCode) {
    return
  }
  loading.value = true
  let rData = {
    email: data.email,
    templateCode: '5'
  }
  apiCommon.doSendEmailCode(rData).then(
    res => {
      loading.value = false
      data.uuid = res.data.uuid
      uEmailCodeRef.value.start()
    },
    () => {
      loading.value = false
    }
  )
}

const onSubmit = (): void => {
  if (!data.uuid) {
    showToast('请获取邮箱验证码')
    return
  }
  if (!data.code) {
    showToast('请输入获取的邮箱验证码')
    return
  }
  if (!data.pswd) {
    showToast('请输入新登录密码')
    return
  }
  if (!data.pswdAgain) {
    showToast('请再次输入新登录密码')
    return
  }
  if (data.pswd !== data.pswdAgain) {
    showToast('两次输入的密码不一致')
    return
  }
  if (!checkPassword(data.pswd)) {
    showToast('密码由8-20位数字、字母大小写组成')
    return
  }

  validatePassword(data.pswd).then(result => {
    // result 为true，密码符合要求，为false，密码不符合要求
    if (result) {
      loading.value = true
      let rData = {
        email: data.email,
        verificationCode: data.code,
        uuid: data.uuid
      }
      apiCommon.doCheckEmailVerificationCode(rData).then(
        res => {
          loading.value = false
          doResetPassword()
        },
        () => {
          loading.value = false
        }
      )
    } else {
      showToast('密码不能包含3个及以上相同或连续字母和数字')
    }
  })
}
const doResetPassword = (): void => {
  loading.value = true
  const rData = reactive({
    loginId: data.loginId, // 用户名
    password: data.pswd, //密码
    confirmPassword: data.pswdAgain //确认密码
  })
  apiAuthz.doResetPassword(rData).then(
    res => {
      loading.value = false
      if (res.data.result === '1') {
        router.push('/forgetPswd/success')
      } else {
        showToast('修改密码失败，请稍后再试')
      }
    },
    () => {
      loading.value = false
    }
  )
}

/**
 * @Author: ran.zhu
 * @Date: 2024-10-18 17:49:38
 * @param {*} password
 * @return {*}
 * @description: 密码不能包含3个及以上相同或连续字母和数字
 */
const validatePassword = (password: string) => {
  return new Promise<boolean>((resolve, reject) => {
    let flag = true
    apiCommon.isPasswordValid({ password: password }).then(
      res => {
        flag = res.data.flag
        resolve(flag)
      },
      () => {
        reject(false)
      }
    )
  })
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
:deep(.u-input__content) {
  padding: 10rpx 0 5rpx;
}
.u-button {
  margin: 64rpx 0 0;
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
