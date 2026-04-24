/*
 * @Author       : ran.zhu
 * @Date         : 2026-01-19 13:38:57
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2026-01-29 16:25:43
 * @Description  : 中登网接口
 */
import { request } from '@/api/api.request'
import { CommonData, LoginData } from '@/interfaces/member/myinfo/zdw'
export default {
  /**
   * @Author: ran.zhu
   * @Date: 2026-01-19 13:44:34
   * @return {*}
   * @description: 登录信息展示
   */
  getZdwLoginInfo() {
    return request<LoginData>('GET', '/api-sme/zdwLogin/getZdwLoginInfo')
  },

  /**
   * @Author: ran.zhu
   * @Date: 2026-01-19 13:45:35
   * @param {*} data
   * @return {*}
   * @description: 验证码提交

   */
  doZdwVerifyCode(data) {
    return request<CommonData>('POST', `/api-sme/zdwLogin/doZdwVerifyCode`, data, true, false)
  },

  /**
   * @Author: ran.zhu
   * @Date: 2026-01-19 13:46:09
   * @param {*} data
   * @return {*}
   * @description: 中登网登录
   */
  doZdwLogin(data) {
    return request<CommonData>('POST', `/api-sme/zdwLogin/doZdwLogin`, data)
  },

  /**
   * @Author: ran.zhu
   * @Date: 2026-01-19 13:47:12
   * @return {*}
   * @description: 获取验证码
   */

  doGetZdwVerifyCode(data) {
    return request<CommonData>('POST', `/api-sme/zdwLogin/doGetZdwVerifyCode`, data)
  },

  /**
   * @Author: ran.zhu
   * @Date: 2026-01-28 11:08:58
   * @return {*}
   * @description: 获取用户状态
   */
  doQueryLoginStatus(data) {
    return request<CommonData>('POST', '/api-sme/zdwLogin/doQueryLoginStatus', data)
  },

  /**
   * @Author: ran.zhu
   * @Date: 2026-01-29 11:19:17
   * @param {*} data
   * @return {*}
   * @description: 验证码提交后-获取用户状态
   */
  doQueryLoginStatusAfterVerify(data) {
    return request<CommonData>('POST', '/api-sme/zdwLogin/doQueryLoginStatusAfterVerify', data, true, false)
  }
}
