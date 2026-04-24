/*
 * @Author       : may.ruan
 * @Date         : 2022-10-12 15:39:05
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-18 10:14:00
 * @Description  : 客户接口类型
 */
/**
 * @Author: may.ruan
 * @Date: 2022-10-13 09:41:25
 * @description: 客户信息
 */
export interface CustomerInfo {
  /**
   * 流水号
   */
  refcode: number
  /**
   * 企业名称
   */
  orgname: string
  /**
   * 客户类型 1.认证客户、2.注册客户、3.潜在客户
   */
  customType: string
  /**
   * 企业规模 1.大型、2.中型、3.小型
   */
  managementScale: string
  /**
   * 企业类型名称
   */
  oaIndustry: string
  /**
   * 认证状态[0=未入驻/1=未认证/2=审核中/3=审核打回/8=审核拒绝/9=已认证]
   */
  authStatus: string
  /**
   * 入驻邀请状态
   * [1=待邀请/2=已邀请]
   */
  entryInvitationStatus: string
  /**
   * 平台注册企业名，当注册企业名与企业名一致时，此字段不返回
   */
  registOrgname?: string
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-13 11:31:51
 * @return {*}
 * @description: 我的客户列表返回的数据
 */
export interface FbpaOrgMVoList {
  /**
   * 我的客户列表返回的数据
   */
  fbpaOrgMVoList: Array<CustomerInfo>
}
