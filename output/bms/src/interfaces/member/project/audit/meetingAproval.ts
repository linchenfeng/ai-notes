/*
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-23 15:18:32
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:45:47
 * @Description  : 上会结果审批
 */

// 委员意见列表
export interface FintMemListFintMemList {
  /**
   * 委员工号
   */
  clientManager?: string
  /**
   * 条件说明
   */
  conditionRemark: string
  /**
   * 邀请时间
   */
  createDate: string
  /**
   * 委员名称
   */
  memberName: string
  /**
   * 流水号
   */
  refcode: number
  /**
   * 审查意见
   */
  reviewRemark?: string
  /**
   * 审查时间，通过是否存在填写时间判断是否待补充
   */
  reviewTime?: string
}
export interface DataFintMemList {
  /**
   * 条件说明
   */
  conditionRemark: string
  /**
   * 委员意见
   */
  groupList: FintMemListFintMemList[]
}
export interface MeetingInfo {
  /**
   * 概要说明
   */
  summaryRemark: string
  /**
   * 委员意见
   */
  fintMemList: DataFintMemList[]
  /**
   * 主管名称
   */
  managerUserName: string
  /**
   * 上会日期
   */
  metDate: string
  /**
   * 上会状态，1=待复核/2=复核待补充/3=待审核/4=审核待补充/5=审核通过
   */
  metStatus: string
  /**
   * PDF UUID，截取后的PDF附件
   */
  partPdfUuid: string
  /**
   * 流水号
   */
  refcode: number
  /**
   * 复核意见
   */
  reviewRemark: string
  /**
   * 复核时间
   */
  reviewTime: string
  /**
   * 卖方名称
   */
  sellerOrgName: string
  /**
   * 客户经理
   */
  userName: string
  /**
   * 业务类型[1=国际出口保理/2=离岸出口保理]
   */
  bizType: string
  /**
   * 业务类型描述
   */
  bizTypeDesc: string
  /**
   * 复核人名称
   */
  reviewUserName: string
  /**
   * 审批意见
   */
  approveRemark?: string
  /**
   * 审批时间
   */
  approveTime: string
  /**
   * 审批人名称
   */
  approveUserName?: string
  /**
   * 是否操作人查询，1=是/0=否
   */
  isOperator: string
  /**
   * 加密PDF
   */
  encryptUuid?: string
  /**
   * PDF UUID，完整PDF
   */
  fullPdfUuid: string
  /**
   * 申请条件
   */
  applyConditionDesc: string
  /**
   * 交易对手名称
   */
  counterpartyOrgname: string
  /**
   * 业务大类，1=国内/2=国际/3=跨境
   */
  bizScene: string
  /**
   * 保理类型，1=正向/2=方向
   */
  factoringType: string
  /**
   * 业务申请编号
   */
  businessNo: string
  /**
   * 汇整复核时间
   */
  collectAuditDate?: string
  /**
   * 汇整复核意见
   */
  collectAuditRemark?: string
  /**
   * 汇整复核人
   */
  collectAuditUserid?: string
  /**
   * 汇整复核人名称
   */
  collectAuditUserName?: string
  /**
   * 汇整提交时间
   */
  collectOpinionDate?: string
  /**
   * 汇整意见
   */
  collectOpinionRemark?: string
  /**
   * 汇整提交人
   */
  collectOpinionUserid?: string
  /**
   * 汇整人，审批流带入
   */
  collectUsers?: string
}
