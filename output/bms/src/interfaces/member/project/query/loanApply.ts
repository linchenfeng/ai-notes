/*
 * @Author       : Charon.Lin
 * @Date         : 2025-12-11 17:52:22
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-11 17:54:03
 * @Description  : 融资申请查询
 */
export interface LoanApplyCount {
  /**
   * 审批中
   */
  auditCount: number
  /**
   * 总数
   */
  count: number
  /**
   * 已通过
   */
  passedCount: number
  /**
   * 已拒绝
   */
  refuseCount: number
  /**
   * 已退回
   */
  returnCount: number
}
export interface SearchData {
  /**
   * 查询条件，客户经理/客户名称/业务主管
   */
  approvalQuery?: string
  /**
   * 融资状态，不传查全部
   */
  loanStatus?: string
  /**
   * 默认查所有，[11=查自己/12=查下级]
   */
  queryType: string
}
// 定义整个search对象的类型接口
export interface Search {
  data: SearchData
  pageNum: number
  pageSize: number
}
export interface FintLoaList {
  /**
   * 申请日期
   */
  applyDate: Date
  /**
   * 客户经理名称
   */
  applyUsername: string
  /**
   * 业务编号
   */
  businessNo: string
  /**
   * 授信产品（可多选），1=天e贸/2=天e贷
   */
  creditProducts: string
  /**
   * 融资状态，0=已保存/1=审核中/2=已退回/3=已拒绝/4=已撤回/9=已审核
   */
  loanStatus: string
  /**
   * 客户名称
   */
  orgname: string
  /**
   * 流水号
   */
  refcode: number
  /**
   * 业务主管名称
   */
  superiorUsername: string
  /**
   * 当前层级审批人，审批中展示
   */
  currentHandler: string
}
