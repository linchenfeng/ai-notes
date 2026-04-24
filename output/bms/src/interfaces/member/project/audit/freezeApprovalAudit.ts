/*
 * @Author       : Mingchun.Cheng
 * @Date         : 2025-07-31 17:32:27
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2025-08-11 14:29:43
 * @Description  : 冻结/解冻申请审批 interface
 */
// 冻结/解冻申请审批统计数据
export interface FreezeAuditCount {
  /**
   * 待审批笔数
   */
  auditCount: number
  /**
   * 已退回笔数
   */
  returnedCount: number
  /**
   * 已拒绝笔数
   */
  rejectCount: number
  /**
   * 已经通过笔数
   */
  passCount: number
  /**
   * 全部
   */
  totalCount: number
}

/**
 *
 * 冻结/解冻申请审批列表项
 */
export interface FreezeItem {
  /**
   * 申请日期
   */
  applyDate: string
  /**
   * 申请编号
   */
  applyNo: string
  /**
   * 申请状态，申请状态[0=保存/1=审批中/2=已退回/3=已通过/4=已拒绝/9=待处理]
   */
  applyStatus: string
  /**
   * 申请类型，1=额度冻结/2=额度解冻
   */
  applyType: string
  /**
   * 申请人
   */
  createUser: string
  /**
   * 客户经理
   */
  clmUserName: string
  /**
   * 授信产品，1=天e贸/2=天e贷
   */
  creditProduct: string
  /**
   * 当前审批人
   */
  curApproverName?: string
  /**
   * 业务主管
   */
  managerUserName: string
  /**
   * 客户名称
   */
  orgname: string
  /**
   * 申请流水号
   */
  refcode: number
  /**
   * 解除原因
   */
  remark: string
  /**
   * 任务流水号
   */
  taskRefcode: number
}

export interface FreezeAuditInfo {
  /**
   * 审批意见，拒绝/打回时必填
   */
  handleReason?: string
  /**
   * 处理结果，处理结果，【A=拒绝/B=打回/C=通过/D=批注】
   */
  handleResult: string
  /**
   * 申请流水号
   */
  refcode: number
  /**
   * 任务流水号
   */
  taskRefcode: number
}
// 冻结/解冻查询列表数量
export interface FreezeQueryCount {
  /**
   * 审批中笔数
   */
  auditCount: number
  /**
   * 已通过笔数
   */
  passCount: number
  /**
   * 已拒绝笔数
   */
  rejectCount: number
  /**
   * 已退回笔数
   */
  returnedCount: number
  /**
   * 全部笔数
   */
  totalCount: number
}
// 冻结/解冻
export interface HistoryItem {
  /**
   * 是否自动审批标记，1=自动/0=非自动
   */
  automaticFlag?: string
  /**
   * 审批描述
   */
  handleDesc: string
  /**
   * 审批说明
   */
  handleReason?: string
  /**
   * 处理结果，【A=拒绝/B=打回/C=通过/D=批注】
   */
  handleResult: string
  /**
   * 审批时间
   */
  handleTime: string
  /**
   * 操作人代号
   */
  handleUserid: string
  /**
   * 操作人名称，经办人/审批人
   */
  nodeOperatorName: string
  /**
   * 接收人名称
   */
  receiveNodeOperatorNames?: string
}
/**
 * 授信列表
 */
export interface FreezeCreditItem {
  /**
   * 授信币种
   */
  ccyid: string
  /**
   * 额度状态，1=生效/2=失效
   */
  creditStatus: string
  /**
   * 授信性质，1=综合额度/2=区间额度/3=特批额度
   */
  creditType: string
  /**
   * 额度冻结/解冻申请流水号
   */
  freezeRefcode: number
  /**
   * 核贷类型，1=新贷/2=增贷/3=年审/4=条件变更
   */
  loanType: string
  /**
   * 授信额度(万元)
   */
  predictAmt: string
}

/**
 * 当前任务节点信息
 */
export interface FlowNodeVo {
  /**
   * 审批类型，用于区分审批和批注操作，见枚举值定义
   */
  examineType: string
  /**
   * 节点顺序
   */
  nodeLevel: string
  /**
   * 节点模式，A=角色（未实现）/B=用户/C=业务主管
   */
  nodeMode: string
  /**
   * 节点通过逻辑，O=OR/A=AND（未实现）
   */
  nodePassLogic: string
}

/**
 * 冻结/解冻申请信息
 */
export interface FreezeAppInfo {
  /**
   * 申请日期
   */
  applyDate: string
  /**
   * 申请编号
   */
  applyNo: string
  /**
   * 申请状态，申请状态[0=保存/1=审批中/2=已退回/3=已通过/4=已拒绝/9=待处理]
   */
  applyStatus: string
  /**
   * 申请类型，1=额度冻结/2=额度解冻
   */
  applyType: string
  /**
   * 申请人
   */
  createUser: string
  /**
   * 客户经理
   */
  clmUserName: string
  /**
   * 授信产品，1=天e贸/2=天e贷
   */
  creditProduct: string
  /**
   * 当前审批人
   */
  curApproverName?: string
  /**
   * 业务主管
   */
  managerUserName: string
  /**
   * 客户名称
   */
  orgname: string
  /**
   * 申请流水号
   */
  refcode: number
  /**
   * 解除原因
   */
  remark: string
  /**
   * 任务流水号
   */
  taskRefcode?: number
}

/**
 * 冻结/解冻审批详情
 */
export interface GetFreezeAppInfo {
  /**
   * 无申请数据，无数据时返回1，有数据时无此属性
   */
  nodata?: string
  /**
   * 当前任务节点信息
   */
  flowNodeVo: FlowNodeVo
  /**
   * 授信列表信息
   */
  freezeCreditList: FreezeCreditItem[]
  /**
   * 冻结/解冻申请信息
   */
  fintFreezeMVo?: FreezeAppInfo
}
