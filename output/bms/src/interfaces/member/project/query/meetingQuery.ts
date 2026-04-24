/*
 * @Author       : Charon.Lin
 * @Date         : 2024-12-26 16:11:52
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:46:03
 * @Description  : 上会结果查询
 */
export interface StatusCount {
  /**
   * 审核中数
   */
  approvalCount: number
  /**
   * 总数
   */
  count: number
  /**
   * 通过总数
   */
  passCount: number
  /**
   * 退回总数
   */
  returnCount: number
  /**
   * 已撤回
   */
  revokeCount: number
}
export interface MeetingList {
  /**
   * 业务类型，1=国际供应链/2=离岸供应链/3=国际出口保理/4=离岸出口保理
   */
  bizType: string
  /**
   * 业务编号
   */
  businessNo: string
  /**
   * 上会日期
   */
  metDate: string
  /**
   * 上会状态，1=待复核/2=复核待补充/3=待审核/4=审核待补充/5=审核通过
   */
  metStatus: string
  /**
   * 流水号
   */
  refcode: number
  /**
   * 卖方名称
   */
  sellerOrgName: string
  /**
   * 客户经理
   */
  userName: string
  /**
   * 业务类型描述
   */
  bizTypeDesc: string
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
}
