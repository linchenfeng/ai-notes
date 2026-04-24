/*
 * @Author       : ran.zhu
 * @Date         : 2022-10-18 15:32:22
 * @LastEditors  : longcan.Yang
 * @LastEditTime : 2023-01-12 14:53:35
 * @Description  : 我的界面接口
 */
import { request } from '@/api/api.request'
import { MyInfo } from '@/interfaces/member/myinfo/myinfo'
export default {
  /**
   * 获取个人信息
   */
  getUserInfo() {
    return request<MyInfo>('GET', '/api-sme/personal/getUserInfo')
  },

  /**
   * 退出登录
   */
  getLogout() {
    return request<MyInfo>('GET', '/api-sme/sys/logout')
  }
}
