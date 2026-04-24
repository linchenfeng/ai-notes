<!--
 * @Author       : may.ruan
 * @Date         : 2022-09-26 13:43:34
 * @LastEditors: oscar.yu
 * @LastEditTime: 2023-01-17 11:07:00
 * @Description  : 登录页面 /login
-->
<template>
  <view class="login">
    <view class="login-bg">
      <cover-image class="bg" src="@/assets/login/loginBg.png" alt="背景图" />
    </view>
    <view class="login-form">
      <u-form>
        <view class="headPortrait">
          <cover-image class="head-image" src="@/assets/login/headPortrait.png" alt="头像" />
        </view>
        <view class="text-align-left">
          <u-input
            v-model="self.loginId"
            v-insert-clear:[self.loginId]="() => (self.loginId = '')"
            border="bottom"
            maxlength="20"
            name="用户名"
            placeholder="请输入用户名"
          />
          <u-input
            v-model="self.password"
            v-insert-clear:[self.password]="() => (self.password = '')"
            border="bottom"
            maxlength="50"
            :type="showPasswordFlag ? '' : 'password'"
            name="密码"
            placeholder="请输入登录密码"
          >
            <template #suffix>
              <i v-if="!showPasswordFlag" class="icon-yincang iconfont" @click="changePassword"></i>
              <i v-if="showPasswordFlag" class="icon-Eyesopen iconfont" @click="changePassword"></i>
            </template>
          </u-input>
        </view>
        <u-button class="login-btn" block type="primary" :loading="loading" native-type="submit" @click="onSubmit">立即登录</u-button>
        <view class="forgot-passwrod" @click="forgetPswd">忘记密码</view>
        <view class="trademark"><cover-image src="@/assets/login/trademark.png" class="logo" alt="商标" /></view>
      </u-form>
    </view>
    <view class="lastVersion">{{ lastVersion }}</view>
  </view>
  <u-overlay :show="showOverlay">
    <view class="login-wrapper">
      <view class="block">
        <view class="bg">
          <view class="title">设置新密码</view>
          <view class="text">新密码由8-20位数字、字母大小写组成</view>
        </view>
        <view class="content">
          <u-row class="container">
            <u-col span="12">
              <u-input
                v-model="search.password"
                v-insert-clear:[search.password]="() => (search.password = '')"
                :type="showNewPasswordFlag ? '' : 'password'"
                maxlength="50"
                placeholder="新登录密码"
              >
                <template #suffix>
                  <i v-show="!showNewPasswordFlag" class="icon-yincang iconfont" @click="changeNewPassword"></i>
                  <i v-show="showNewPasswordFlag" class="icon-Eyesopen iconfont" @click="changeNewPassword"></i>
                </template>
              </u-input>
            </u-col>
          </u-row>
          <view class="line"></view>
          <u-row class="container">
            <u-col span="12">
              <u-input
                v-model="search.confirmPassword"
                v-insert-clear:[search.confirmPassword]="() => (search.confirmPassword = '')"
                :type="showNewConfirmPasswordFlag ? '' : 'password'"
                maxlength="50"
                placeholder="请再次确认新密码"
              >
                <template #suffix>
                  <i v-show="!showNewConfirmPasswordFlag" class="icon-yincang iconfont" @click="changeNewConfirmPassword"></i>
                  <i v-show="showNewConfirmPasswordFlag" class="icon-Eyesopen iconfont" @click="changeNewConfirmPassword"></i>
                </template>
              </u-input>
            </u-col>
          </u-row>
          <view class="line"></view>
          <u-row class="container btn">
            <u-col class="describe" span="12">
              <u-button type="primary" size="large" :loading="resetButton" native-type="submit" @click="doResetPassword">确认修改</u-button>
            </u-col>
          </u-row>
        </view>
      </view>
    </view>
  </u-overlay>
</template>
<script lang="ts">
export default {
  name: 'Login'
}
</script>
<script lang="ts" setup>
import { version } from '../../../package.json'
import { showToast } from '@/utils/uniapp/toast'
import { setStorage } from '@/utils/storages'
import apiAuthz from '@/api/common/api.authz'
// import apiCommon from '@/api/common/api.common'
import { useUserLoginInfoStore } from '@/store/user/userLoginInfo'
import { LoginUser } from '@/interfaces/login'
import { storeToRefs } from 'pinia'
import { routeJump } from '@/utils/message'
import { decodeBase64, getUrlParam } from '@/utils/crypto'
import { ChatRouteParams } from '@/interfaces/message/chatMessage'
// import { useRouter } from '@/uni-simple-router'
import { getPlatform } from '@/utils/uniapp'
import { redirectTo } from '@/utils/uniapp'
import { useRouter } from '@/uni-simple-router'
import { checkPassword } from '@/utils/validate'
import apiCommon from '@/api/common/api.common'
import { getHasPermissionsById } from '@/utils/permissions'
import { useFunidstore } from '@/store/user/funid'

// import { $wxLogin } from '@/hooks/memberMinxin'
const router = useRouter()
let lastVersion = 'V' + version
const loginStore = useUserLoginInfoStore()
const { userLoginInfo } = storeToRefs(loginStore)

let showOverlay = ref(false)
let showPasswordFlag = ref(false)
let showNewPasswordFlag = ref(false)
let showNewConfirmPasswordFlag = ref(false)
// const router = useRouter()
const self = reactive({
  loginId: '', //	20	用户名
  password: '' //	50	密码
})
//用于提交重置密码
const search = reactive({
  loginId: '', // 用户名
  password: '', //密码
  confirmPassword: '' //确认密码
})
// 通过公众号消息进入带进的参数
let routeParams: ChatRouteParams = reactive({
  refcode: 0,
  orgRefcode: '',
  funid: '',
  authStatus: '',
  moduleId: '',
  queryType: '',
  moduleName: '',
  cpOrgname: '',
  applyDate: '',
  makeRefcode: 0,
  subOrgtype: '',
  remindTpye: '',
  wxUserid: '',
  orgname: '',
  ctyid: '',
  applyStatus: '',
  approveLevel: '',
  nodeLevel: '',
  nodeMode: '',
  nodePassLogic: '',
  taskRefcode: 0
})
let loginUser: LoginUser = reactive({
  refcode: 0,
  chgpwdFlag: '',
  userid: '',
  loginId: '',
  userName: '',
  weixinOpenId: ''
})
onMounted(() => {
  // 获取系统参数
  // console.log(JSON.parse(decodeBase64(getUrlParam('data'))))
  // getServerSystemConfig()
  if (userLoginInfo.value) {
    self.loginId = userLoginInfo.value.loginId
    self.password = userLoginInfo.value.password
    // 是否自动登录，登录后置true，主动退出置否
    if (userLoginInfo.value.voluntarilyFlag) {
      onSubmit()
    }
  }
})
const changePassword = () => {
  showPasswordFlag.value = !showPasswordFlag.value
}

const changeNewPassword = () => {
  showNewPasswordFlag.value = !showNewPasswordFlag.value
}
const changeNewConfirmPassword = () => {
  showNewConfirmPasswordFlag.value = !showNewConfirmPasswordFlag.value
}
// /**
//  * 获取系统参数
//  */
// const getServerSystemConfig = () => {
//   apiCommon.getServerSystemConfig().then(res => {
//     setStorage('systemConfig', res.data)
//   })
// }
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-25 16:27:02
 * @return {*}
 * @description: 获取用户权限id
 */
const getFunidList = (isResetPassword: boolean) => {
  apiAuthz.getFunidList().then(res => {
    const userStore = useFunidstore()
    const { setFunids } = userStore
    setFunids(res.data.funids)
    setStorage('funids', res.data.funids)
    // 存储账号、密码,用于下次登录显示
    const { setUserLoginInfo } = loginStore

    let temUserLoginInfo = {
      loginId: '',
      password: '',
      userName: loginUser.userName,
      voluntarilyFlag: true
    }
    temUserLoginInfo.loginId = self.loginId
    if (isResetPassword) {
      // 第一次登录存储修改后的密码
      temUserLoginInfo.password = search.password
    } else {
      temUserLoginInfo.password = self.password
    }
    setUserLoginInfo(temUserLoginInfo)
    // 判断是否为公众号跳转
    if (decodeBase64(getUrlParam('data'))) {
      routeParams = JSON.parse(decodeBase64(getUrlParam('data'))) as ChatRouteParams
      routeJump(routeParams, loginUser.userid, loginUser.userName)
      return
    }
    setStorage('needBindFlag', true) // 每次登录都需重新获取openid
    // 根据权限判断跳转模块
    if (getHasPermissionsById('member:project')) {
      redirectTo('/member/project')
    } else if (getHasPermissionsById('member:customer')) {
      redirectTo('/member/customer')
    } else {
      redirectTo('/member/myinfo')
    }
  })
}
/**
 * @Author: may.ruan
 * @Date: 2022-10-09 14:51:30
 * @return {*}
 * @description: 提交登录
 */
const loading = ref(false) // button loading
const onSubmit = (): void => {
  if (!self.loginId) {
    showToast('请输入用户名')
    return
  }
  if (!self.password) {
    showToast('请输入密码')
    return
  }
  loading.value = true
  apiAuthz.login(self).then(
    res => {
      loading.value = false
      setStorage('token', res.data.access_token)
      loginUser = res.data.loginUser
      setStorage('userName', loginUser.userName)

      if (getPlatform() === 'H5') {
        sessionStorage.pdfLoginId = loginUser.loginId // 用户工号存储，用于pdf预览水印,仅H5
      }
      // 首次登录需修改密码，若选择跳过则每次登录均需弹窗
      if (loginUser.chgpwdFlag === '1') {
        search.loginId = self.loginId
        showOverlay.value = true
      } else {
        // 保存用户的openId
        setStorage('weixinOpenId', loginUser.weixinOpenId)
        // 获取用户权限id
        getFunidList(false)
      }
    },
    () => {
      loading.value = false
    }
  )
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-21 14:42:08
 * @return {*}
 * @description: 提交重置密码接口
 */
let resetButton = ref(false)
const doResetPassword = () => {
  if (!search.password) {
    showToast('请输入密码')
    return
  }
  if (!search.confirmPassword) {
    showToast('请输入确认密码')
    return
  }
  if (search.confirmPassword !== search.password) {
    showToast('两次输入的密码不一致')
    return
  }
  if (!checkPassword(search.password)) {
    showToast('密码由8-20位数字、字母大小写组成')
    return
  }

  validatePassword(search.password).then(result => {
    // result 为true，密码符合要求，为false，密码不符合要求
    if (result) {
      resetButton.value = true
      apiAuthz.doResetPassword(search).then(
        res => {
          resetButton.value = false
          if (res.data.result === '1') {
            showToast('密码修改成功')
            getFunidList(true)
          }
        },
        () => {
          resetButton.value = false
        }
      )
    } else {
      showToast('密码不能包含3个及以上相同或连续字母和数字')
    }
  })
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
const forgetPswd = () => {
  router.push('/forgetPswd')
  // router.push('/forgetPswd/success')
}
</script>
<style lang="scss">
.login {
  min-height: 100vh;
  text-align: center;
  background-color: #dbe8f4;
  position: relative;
  .login-bg {
    .bg {
      width: 100%;
      height: 520rpx;
    }
  }
  .login-form {
    position: absolute;
    top: 520rpx;
    left: 0;
    width: 100%;
    background: #dbe8f4;
    z-index: 2;
    .u-form {
      width: 92%;
      margin: auto;
      background-color: #fff;
      border-radius: 20rpx;
      padding: 0rpx 30rpx 52rpx;
      margin-top: -182rpx;
      box-sizing: border-box;
      .u-input {
        position: static;
        height: 96rpx;
        margin-bottom: 6rpx;
        padding-left: 2rpx;
        padding: 0;
        box-sizing: border-box;
      }
    }

    .u-button {
      width: calc(100% - 64rpx);
      // box-shadow: -2rpx 0rpx 13rpx 2rpx rgba(9, 150, 197, 0.55);
      border-radius: 5rpx;
      box-sizing: border-box;
      margin: 34rpx auto 0;
    }
    .forgot-passwrod {
      color: $primary;
      font-size: 30rpx;
      text-align: left;
      margin: 25rpx 0 0 27rpx;
      padding: 5rpx;
    }
    .headPortrait {
      width: 140rpx;
      background-color: #fff;
      margin-left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      .head-image {
        width: 140rpx;
        height: 140rpx;
        border-radius: 50%;
      }
    }
    .trademark {
      margin-top: 301rpx;
      .logo {
        width: 234rpx;
        height: 46rpx;
      }
    }
  }
}
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .block {
    width: 80%;
    background-color: #fff;
    border-radius: 20rpx;
    position: relative;

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: url(@/assets/login/safe.png) no-repeat;
      background-size: 100% 100%;
      height: calc(100vw * 0.8 * 226 / 540 - 40rpx);
      padding: 0 100rpx;
      .title {
        text-align: center;
        font-size: 32rpx;
        margin-top: 40rpx;
      }
      .text {
        margin-top: 30rpx;
        text-align: center;
        font-size: 26rpx;
        color: #304558;
      }
    }

    .content {
      margin-top: calc(100vw * 0.8 * 226 / 540 - 40rpx);
      padding: 10rpx 30rpx 30rpx;
      .uni-input-placeholder {
        font-size: 28rpx;
      }
      .container {
        margin-top: 30rpx;
        .describe {
          text-align: right;
          font-size: 28rpx;
          line-height: 34rpx;
        }
        :deep(.u-input) {
          border: 1rpx solid $border-color;
          border-radius: 10rpx;
          height: 34rpx;
          padding: 10rpx;
          // line-height: 68rpx;
        }
        :deep(.u-border) {
          border-width: 0rpx !important;
        }
        :deep(.u-button--large) {
          height: 80rpx;
        }
      }
      .line {
        height: 2rpx;
        background: $border-color;
        margin-top: 10rpx;
      }
      .btn {
        margin-top: 60rpx;
      }
    }
  }
}
.lastVersion {
  font-size: 24rpx;
  color: $remark-color;
  position: absolute;
  bottom: 14rpx;
  left: 50%;
  z-index: 1;
  transform: translateX(-50%);
}
</style>
