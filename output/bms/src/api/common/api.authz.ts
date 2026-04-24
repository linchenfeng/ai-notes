/*
 * @Author       : may.ruan
 * @Date         : 2022-10-20 09:12:09
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-23 15:58:37
 * @Description  : 公共安控
 */
import { request } from '@/api/api.request'
import { Login, ResetPassword, Funids } from '@/interfaces/login'
import { MenuList, TodoData } from '@/interfaces/common/menu'
export default {
  /**
   * @Author: may.ruan
   * @Date: 2022-10-20 09:23:20
   * @param {*} data {userid:"用户名20",password:"密码50"}
   * @description: 密码登录
   */
  login(data: object) {
    return request<Login>('POST', '/api-sme/sys/login', data)
  },
  /**
   * @Author: may.ruan
   * @Date: 2022-10-20 09:23:13
   * @description: 登出系统
   */
  logout() {
    return request<object>('GET', '/api-sme/sys/logout')
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-21 10:10:05
   * @return {*}
   * @description: 首次登录需重置密码
   */
  doResetPassword(data) {
    return request<ResetPassword>('POST', '/api-sme/sys/doResetPassword', data)
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-25 16:19:46
   * @return {*}
   * @description: 获取用户权限id
   */
  getFunidList() {
    return request<Funids>('GET', '/api-sme/authz/getFunidList')
  },
  /**
   * @Author: longcan.Yang
   * @Date: 2022-10-25 16:19:46
   * @return {*}
   * @description: 获取用户权限id
   */
  getMenuList(topFunid) {
    return request<MenuList>('GET', `/api-sme//authz/getMenuList/${topFunid}`)
  },
  // 项目——待办统计
  getMyTodoDataStatistics() {
    return request<TodoData>('GET', '/api-sme/projectCommon/getMyTodoDataStatistics')
  }
}
