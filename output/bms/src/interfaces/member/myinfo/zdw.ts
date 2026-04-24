/*
 * @Author       : ran.zhu
 * @Date         : 2026-01-19 13:24:38
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2026-01-29 11:21:33
 * @Description  : 中登网接口封装
 */

/**
 * 登录信息
 */

export interface LoginInfo {
  /**
   * 登录账号
   */
  loginId: string
}
export interface LoginData {
  loginInfo: LoginInfo
}

export interface CommonData {
  result: string
  loginStatus: string
}
