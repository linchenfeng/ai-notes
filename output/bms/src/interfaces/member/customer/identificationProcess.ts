/*
 * @Author       : jacky.cai
 * @Date         : 2022-10-13 11:23:15
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-18 09:17:28
 * @Description  :认证详情bean
 */

export interface Detail {
  /**
   * 客户类型[认证客户/注册客户/潜在客户]
   * 若是潜在客户则展示未注册；
   * 若是注册客户或认证客户，则展示对应认证进度的节点
   * 客户类型[1=认证客户/2=注册客户/3=潜在客户]
   */
  customType: string

  /**
   * 客户名称
   */
  orgname: string
  /**
   * 描述
   */
  orgDesc: string
  /**
   * 规模
   */
  managementScale: string

  /**
   * OA企业类型
   */
  oaOrgtype: string
  /**
   * 企业类型名称
   */
  oaIndustry: string
  /**
   * 地址(所在地区编号)
   */
  inarea
  /**
   * 地址
   */
  oaAddress: string
  /**
   * OA联系人姓名
   */
  oaLinkman: string
  /**
   * OA联系人电话
   */
  oaLinkmanphone: string
  /**
   * 统一社会信用代码
   */
  companyCreditCode?: string
  /**
   * 法定代表人
   */
  legalPerson?: string
  /**
   * 详细地址
   */
  address?: string
  /**
   * 被授权人姓名
   */
  linkman: string
  /**
   * 被授权人手机号码
   */
  linkmanphone: string
  /**
   * 申请认证日期
   */
  applyDate?: string
  /**
   * 认证审核日期
   */
  reviewDate?: string
  /**
   *认证状态[0=未入驻/1=未认证/2=审核中/3=审核打回/8=审核拒绝/9=已认证]
   */
  authStatus: string
  /**
   *签章状态[0=未申请/1=申请中/2=已生效/3=已寄送/4=已签收]
   */
  sigStatus: string
  /**
   * 联系人电子邮箱
   */
  linkmanemail: string
  /**
   * 入驻邀请状态[1=待邀请/2=已邀请]
   */
  entryInvitationStatus: string
  /**
   * 入驻邀请电子邮箱
   */
  entryInvitationEmail: string
  /**
   * 企业认证类型 [1=企业/2=个人/9=海外企业]
   */
  authOrgtype: string
  /**
   * 海外企业所属区域
   */
  region: string
  /**
   * 注册地址
   */
  registeredAddress: string
  /**
   * 平台注册企业名，当注册企业名与企业名一致时，此字段不返回
   */
  registOrgname?: string
}

/*
 * @Author       : jacky.cai
 * @Date         : 2022-10-13 11:23:15
 * @LastEditors  : jacky.cai
 * @LastEditTime : 2022-10-24 14:28:23
 * @Description  :认证详情外层
 */

export interface IdenfyDetail {
  /**
   *详情内层
   */
  fbpaOrgMVo: Detail
}
