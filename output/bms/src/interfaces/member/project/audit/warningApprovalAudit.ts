/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-30 13:11:21
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:55:15
 * @Description  : 预警解除审批 interface
 */

// 预警解除申请审批统计数据
export interface WarningAuditCount {
  /**
   * 待审批笔数
   */
  auditCount: number
  /**
   * 已退回笔数
   */
  returnedCount: number
}

/**
 *
 * 预警解除申请审批列表项
 */
export interface WarningItem {
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
   * 客户经理
   */
  clmUserName: string
  /**
   * 统一社会信用代码
   */
  customerId: string
  /**
   * 客户名称
   */
  customerName: string
  /**
   * 业务主管
   */
  managerUserName: string
  /**
   * 监控对象
   */
  monitorObjectName: string
  /**
   * 监控对象类型，1=授信主体/2=共借人/3=担保企业/4=担保个人/5=店铺/6=其他
   */
  monitorObjectType: string
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
  /**
   * 风险等级，1=Ⅰ级/2=Ⅱ级/3=Ⅲ级
   */
  warningLevel: string
  /**
   * 预警规则
   */
  ruleName: string
  /**
   * 预警日期
   */
  warningTriggerTime: string
  /**
   * 当前审批人
   */
  curApproverName: string
}

export interface WarningAuditInfo {
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
// 预警解除查询列表数量
export interface WarningQueryCount {
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
// 预警解除
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
