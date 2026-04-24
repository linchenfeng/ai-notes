/*
 * @Author       : LongCan.Yang
 * @Date         : 2023-11-27 15:49:54
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-12 13:31:26
 * @Description  :通过config接口注入权限验证配置
 */
import wx from 'jweixin-1.6.0'
import apiWxMpOAuth2 from '@/api/common/api.wxMpOAuth2'
// import { showToast } from '../uniapp/toast'
/**
 * @Author: LongCan.Yang
 * @Date: 2023-12-05 13:23:50
 * @param {*} jsApiList
 * @return {*}
 * @description: 调用方法获取签名
 */
export function doWxConfig(jsApiList: string[]) {
  return new Promise(function (resolve, reject) {
    const u = navigator.userAgent
    const isIOS = Boolean(u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) //ios终端
    const data = {
      url: isIOS ? window.entryUrl : window.location.href
    }
    // showToast('获取jsapi参数:' + data.url)
    apiWxMpOAuth2.doGetWxOAuth2Signinfo(data).then(
      res => {
        const wxConfig = res.data
        wx.config({
          debug: false,
          appId: wxConfig.appId, // 公众号唯一标识
          timestamp: wxConfig.timestamp, // 生成签名的时间戳
          nonceStr: wxConfig.nonceStr, // 生成签名的随机串
          signature: wxConfig.signature, // 签名
          jsApiList: jsApiList // 需要使用的JS接口列表
        })
        wx.ready(function () {
          resolve(true)
        })
        wx.error(function (error) {
          reject(error)
        })
      },
      error => {
        reject(error)
      }
    )
  })
}
