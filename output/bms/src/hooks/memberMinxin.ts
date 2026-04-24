/*
 * @Author       : may.ruan
 * @Date         : 2022-11-21 11:35:59
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-08-28 14:32:05
 * @Description  : 初始化会员中心(登录后)minxin
 */
import { useSystemConfigstore } from '@/store/systemConfig'
import { getStorage, setStorage } from '@/utils/storages'
import { ChatMessageInfo } from '@/interfaces/message/chatMessage'
import { useRouter } from '@/uni-simple-router'
import { getUrlParam } from '@/utils/crypto'
import { getPlatform } from '@/utils/uniapp'
import apiWxMpOAuth2 from '@/api/common/api.wxMpOAuth2'
import { showToast } from '@/utils/uniapp/toast'
// 系统设置
const systemConfigStore = useSystemConfigstore()
const { systemConfig } = systemConfigStore
/**
 * @Author: may.ruan
 * @Date: 2023-12-19 10:47:34
 * @description: 若是公众号消息则跳入真正路径,跳转后isNotSkip置false、中转跳转，解决从微信公众号跳转进来后，导航栏返回功能点击无效问题
 */
export function $messageSkip() {
  const router = useRouter()
  const temMessageInfo = getStorage('messageInfo') as ChatMessageInfo
  if (temMessageInfo) {
    if (temMessageInfo.showToastFlag) {
      // 存在异常，如无权限、企业信息不匹配等，跳入页面后toast提示
      const messageInfo = {
        path: '',
        isNotSkip: false,
        showToastFlag: false
      }
      setStorage('messageInfo', messageInfo)
      setTimeout(() => {
        showToast(temMessageInfo.toastString as string)
        // 跳转到首页提示
      }, 300)
    }
    if (temMessageInfo.isNotSkip) {
      // 跳转至目标页面
      const messageInfo = {
        path: temMessageInfo.path,
        isNotSkip: false
      }
      setStorage('messageInfo', messageInfo)
      router.push(temMessageInfo.path)
    }
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-12-26 13:58:33
 * @param {string} redirectPath 授权完成后重定向返回的页面
 * @description: 获取授权页面地址进行授权
 */
const toWeixinAuthorize = (redirectPath: string) => {
  // 跳转至微信授权页面
  const redirectUri = window.location.origin + redirectPath
  apiWxMpOAuth2.getWxOAuth2AuthorizeUrl(redirectUri).then(res => {
    const authorizeUrl = res.data.authorizeUrl
    // 跳转至微信授权页面
    window.location.replace(authorizeUrl)
  })
}

/**
 * @Author: may.ruan
 * @Date: 2023-12-19 11:09:43
 * @param {string} code 微信code
 * @description: 获取微信网页授权用户信息
 */
const doGetWxOAuth2AccessToken = (code: string) => {
  apiWxMpOAuth2.doGetWxOAuth2AccessToken(code).then(res => {
    // 保存用户的openId
    const weixinInfo = {
      openId: res.data.openId,
      nickname: res.data.nickname
    }
    // 存储用户微信信息
    setStorage('weixinInfo', weixinInfo)
  })
}
/**
 * @Author: may.ruan
 * @Date: 2023-12-19 11:09:58
 * @param {string} redirectPath 授权完成后重定向返回的页面
 * @description: 微信认证授权登录，用于获取用户openid
 */
export function $wxLogin(redirectPath: string) {
  // 获取系统参数-微信公众号开关
  if (getPlatform() === 'H5' && systemConfig && systemConfig.P_WX_OPEN === '1') {
    // 获取用户微信openid
    // const weixinOpenId = getStorage('weixinOpenId')
    // if (!weixinOpenId) {
    // 优先获取code，若获取到code则说明是授权后跳回到此页面
    const code = getUrlParam('code')
    if (!code) {
      // 跳转至微信授权页面
      toWeixinAuthorize(redirectPath)
    } else {
      // 通过code获取openid
      doGetWxOAuth2AccessToken(code)
      setStorage('needBindFlag', false) // 绑定完成置false
      return true
    }
    // }
  } else {
    return true
  }
}
