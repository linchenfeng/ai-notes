/*
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-23 15:18:32
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-02-09 10:50:47
 * @Description  : 上会结果复核
 */

// 待复核列表
export interface MetList {
  /**
   * 上会日期
   */
  metDate: string
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
   * 业务类型[1=国际出口保理/2=离岸出口保理]
   */
  bizType: string
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
  /**
   * 业务申请编号
   */
  businessNo: string
}

// 审查委员意见集合
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
  /**
   * 审查结果[1=同意/2=有条件同意/3=不同意]
   */
  reviewResult?: string
}
// 条件说明委员意见集合
export interface DataFintMemList {
  /**
   * 条件说明
   */
  conditionRemark: string
  /**
   * 委员意见集合
   */
  groupList: FintMemListFintMemList[]
}

// 上会结果复核详情
export interface MeetingInfo {
  /**
   * 概要说明
   */
  summaryRemark: string
  /**
   * 条件说明委员意见集合
   */
  fintMemList: DataFintMemList[]
  /**
   * PDF UUID
   */
  fullPdfUuid?: string
  /**
   * 主管名称
   */
  managerUserName: string
  /**
   * 上会日期
   */
  metDate: string
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
   * 上会状态【1=待复核/2=复核待补充/3=待审核/4=审核待补充/5=审核通过】
   */
  metStatus: string
  /**
   * 业务类型[1=国际出口保理/2=离岸出口保理]
   */
  bizType: string
  /**
   * 业务类型描述
   */
  bizTypeDesc: string
  /**
   * 复核意见
   */
  reviewRemark?: string
  /**
   * 复核时间
   */
  reviewTime?: string
  /**
   * 复核人名称
   */
  reviewUserName?: string
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
}
// 审查委员组集合
export interface CommitteeGroupList {
  /**
   * 委员流水号
   */
  refcode: number
  /**
   * 委员名称
   */
  memberName: string
  /**
   * 委员工号
   */
  clientManager: string
}
export interface HisGroupList {
  /**
   * 审查意见
   */
  reviewRemark: string
  /**
   * 审查时间
   */
  reviewTime: string
}
// 委员意见详情(分享的链接进入)
export interface OpinionInfo {
  /**
   * 1=待复核/2=复核待补充/3=待审核/4=审核待补充/5=审核通过
   */
  metStatus: string
  /**
   * 委员工号，（当前信审委员由客户经理指定角色配置）
   */
  clientManager: string
  /**
   * 业务主管
   */
  managerUserName: string
  /**
   * 概要说明
   */
  summaryRemark: string
  /**
   * 核贷书uuid
   */
  fullPdfUuid: string
  /**
   * 条件说明
   */
  conditionRemark: string
  /**
   * 委员名称，客户经理名称
   */
  memberName: string
  /**
   * 上会结果流水号
   */
  metRefcode: number
  /**
   * 审查意见，如果已经提交了则有值
   */
  reviewRemark?: string
  /**
   * 审查时间，如果已经提交了则有值
   */
  reviewTime?: string
  /**
   * 审查结果[1=同意/2=有条件同意/3=不同意]，如果已经提交了则有值（包括临时保存）
   */
  reviewResult?: string
  /**
   * 卖方名称
   */
  sellerOrgName: string
  /**
   * 上会日期
   */
  metDate: string
  /**
   * 业务类型[1=国际出口保理/2=离岸出口保理]
   */
  bizType: string
  /**
   * 业务类型描述
   */
  bizTypeDesc: string
  /**
   * 客户经理名称
   */
  userName: string
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
   * 历史审查意见
   */
  historyReviewRemark?: string
  /**
   * 历史审查意见时间
   */
  historyReviewDate?: string
  /**
   * 历史审查
   */
  groupList?: HisGroupList[]
}

/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-25 16:54:30
 * @description: 分享链接携带信息
 */
export interface ShareDataObj {
  /**
   * 分享人
   */
  userName: string
  /**
   * 信审委员意见流水号
   */
  refcode: number | string
}

export interface GroupList {
  /**
   * 委员名称
   */
  memberName: string
  /**
   * 委员审查意见
   */
  reviewRemark: string
  /**
   * 审查时间
   */
  reviewTime: string
}
export interface FintMemList {
  /**
   * 条件说明
   */
  conditionRemark: string
  /**
   * 指定问题答复
   */
  groupList: GroupList[]
}

// 业务历程
export interface HistoryListItem {
  /**
   * 意见，metStatus=1代表概要说明 / =6代表意见汇整 / =234578代表审批意见
   */
  approveRemark?: string
  /**
   * 操作人
   */
  approveUserName: string
  /**
   * 委员回复清单，仅复核操作前有值
   */
  fintMemList?: FintMemList[]
  /**
   * 操作时间
   */
  lastModDate: Date
  /**
   * 上会状态，0=待补充/1=待复核/2=复核退回(复核待补充)/3=待审核/4=审批退回(审批待补充)/5=已过会待汇整/6=汇整待复核/7=汇整复核退回/8=汇整通过/9=已撤回
   */
  metStatus: string
  /**
   * 场景标记，1=标记复核撤回场景
   */
  operationScene?: string
}
export interface MeetingReviewCount {
  /**
   * 待复核
   */
  countReview: number
  /**
   * 已提交
   */
  countSubmit: number
  /**
   * 已过会
   */
  countPassed: number
}
