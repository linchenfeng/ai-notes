/*
 * @Author       : longcan.Yang
 * @Date         : 2023-02-23 13:06:42
 * @LastEditors  : longcan.Yang
 * @LastEditTime : 2023-02-23 17:24:46
 * @Description  :客户经理上次登录的账号密码
 */
export interface UserLoginInfo {
  /**
   * 上次登录得账号
   */
  loginId: string
  /**
   * 用户名称
   */
  userName: string
  /**
   * 上次登录得密码
   */
  password: string
  /**
   * 是否自动登录
   */
  voluntarilyFlag: boolean
}
