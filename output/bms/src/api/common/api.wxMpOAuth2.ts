/*
 * @Author       : oscar.yu
 * @Date         : 2023-1-16 09:12:09
 * @LastEditors: oscar.yu
 * @LastEditTime: 2023-01-17 10:21:39
 * @Description  : 微信公众号授权控制类
 */
import { request } from '@/api/api.request'
import { AuthorizeUrl, AccessToken, Signinfo } from '@/interfaces/common/wxMpOAuth2'
export default {
  /**
   * @Author: oscar.yu
   * @Date: 2023-1-16 09:12:09
   * @param {*} redirectUri 微信授权后回调链接地址
   * @description: 密码登录
   */
  getWxOAuth2AuthorizeUrl(redirectUri: string) {
    const data = {
      redirectUri: redirectUri
    }
    return request<AuthorizeUrl>('POST', `/api-sme/wxMpOAuth2/getWxOAuth2AuthorizeUrl`, data)
  },
  /**
   * @Author: oscar.yu
   * @Date: 2023-1-16 09:12:09
   * @return {*} code 微信授权code
   * @description: 获取微信网页授权用户信息
   */
  doGetWxOAuth2AccessToken(code: string) {
    // 偶尔接口较慢，不展示loading【ARM-12268】
    return request<AccessToken>('GET', `/api-sme/wxMpOAuth2/doGetWxOAuth2AccessToken/${code}`, {}, true, false)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2023-11-28 09:03:43
   * @return {*}url 域名
   * @description: 获取JS-SDK使用权限签名
   */
  doGetWxOAuth2Signinfo(data: { url: string }) {
    return request<Signinfo>('POST', `/api-sme/wxMpOAuth2/doGetWxOAuth2Signinfo`, data, false)
  }
}
