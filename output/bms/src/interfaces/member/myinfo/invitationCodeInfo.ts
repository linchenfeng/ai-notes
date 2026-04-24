/*
 * @Author       : ran.zhu
 * @Date         : 2022-10-18 15:26:27
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2024-10-16 09:22:04
 * @Description  : 我的界面 数据
 */
export interface invitationCode {
  /**
   * 移动端邀请码链接
   */
  appInvitationCodeLink: string

  /**
   * PC端邀请码链接
   */
  pcInvitationCodeLink: string

  /**
   * 客户经理工号
   */
  clientManager: string
}

export interface CodeInfo {
  invitationCodeInfo: invitationCode
}
