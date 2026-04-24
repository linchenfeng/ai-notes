/*
 * @Author       : longcan.Yang
 * @Date         : 2023-05-10 15:03:06
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-24 15:42:57
 * @Description  : 微信公众号消息跳转存储的参数
 */
export interface ChatMessageInfo {
  /**
   * 微信公众号需要跳转的目标路径
   */
  path: string
  /**
   * 是否需要跳转到目标页面跳转
   */
  isNotSkip: boolean
  /**
   * 跳转存在异常提示描述
   */
  toastString?: string
  /**
   * 是否展示toast弹窗
   */
  showToastFlag?: boolean
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-05-11 10:54:18
 * @return {*}
 * @description: 公众号消息链接信息
 */
export interface ChatRouteParams {
  /**
   * 企业流水号
   */
  orgRefcode: string
  /**
   * 模块权限
   */
  funid: string
  /**
   * 企业状态
   */
  authStatus: string
  /**
   * 公众号消息标识
   */
  moduleId: string
  /**
   * 合同签约状态[A=待签约/B=完成签约]
   */
  queryType: string
  /**
   * 当前业务模块名称
   */
  moduleName: string
  /**
   * 交易对手名称
   */
  cpOrgname: string
  /**
   * 专项融资申请日期
   */
  applyDate: string
  /**
   * 签约信息收集合同流水号
   */
  makeRefcode: number
  /**
   * 企业类型
   */
  subOrgtype: string
  /**
   * 提醒类型
   */
  remindTpye: string
  /**
   * 业务申请流水号
   */
  refcode: number
  /**
   * 用户Userid
   */
  wxUserid: string
  /**
   * 企业名称
   */
  orgname: string
  /**
   * 币种
   */
  ctyid: string
  /**
   * 申请状态
   */
  applyStatus: string
  /**
   * 审批层级
   */
  approveLevel: string
  /**
   * 特批审批层级
   */
  nodeLevel: string
  /**
   * 特批审批模式
   */
  nodeMode: string
  /**
   * 节点通过逻辑【O=OR/A=AND（未实现）】
   */
  nodePassLogic: string
  /**
   * 特批任务流水号
   */
  taskRefcode: number
  /**
   * 报价提交申请书流水号
   */
  appRefcode: number
  /**
   * 业务类型【1=国内业务/2=国际业务】
   */
  crossBorderType: string
  /**
   * 尽调流水号
   */
  cddRefcode: number
  /**
   * 尽调人员流水号
   */
  cddUserRefcode: number
  /**
   * 是否调往业务准入审批页面
   */
  jumpFlag?: string
}
