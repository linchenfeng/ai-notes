/*
 * @Author       : ran.zhu
 * @Date         : 2022-10-18 15:26:27
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2024-09-29 15:38:16
 * @Description  : 我的界面 数据
 */
export interface LoginUser {
  /**
   * 客户经理对象
   */
  userName: string

  /**
   * 图片UUID
   */
  imageUuid: string

  /**
   * 职位描述
   */
  position: string

  /**
   * 状态 1=在职/0=离职
   */
  clmStatus: string

  /**
   * 部门
   */
  department: string
  /**
   * 主管名称
   */
  superiorName: string
  /**
   * 主管userid
   */
  superior: string
  /**
   * 用户userid
   */
  userid: string
}

export interface MyInfo {
  loginUser: LoginUser
}
