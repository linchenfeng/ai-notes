/*
 * @Author       : may.ruan
 * @Date         : 2022-10-20 09:19:53
 * @LastEditors  : longcan.Yang
 * @LastEditTime : 2023-05-05 13:51:43
 * @Description  : 登录
 */
export interface LoginUser {
  /**
   * 用户流水号
   */
  refcode: number
  /**
   * 用户登陆时是否要求修改密码[0=否/1=是]
   */
  chgpwdFlag
  /**
   * 用户代号
   */
  userid
  /**
   * 用户账号
   */
  loginId
  /**
   *用户名
   */
  userName
  /**
   * 用户微信openId
   */
  weixinOpenId
}
export interface Login {
  /**
   * 用户token
   */
  access_token: string
  /**
   * 用户信息
   */
  loginUser: LoginUser
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-21 10:12:03
 * @return {*}
 * @description: 重置密码接口返回
 */
export interface ResetPassword {
  /**
   * 重置密码状态[1=成功/0=失败]
   */
  result: string
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-25 16:21:36
 * @return {*}
 * @description: 获取用户权限id
 */
export interface Funids {
  funids: string
}
