export interface LoanApplyCount {
  /**
   * 待审批
   */
  approvalCount: number
  /**
   * 已审批
   */
  approvedCount: number
}
export interface SearchData {
  /**
   * 兼容多参数，模糊搜索
   */
  approvalQuery?: string
  /**
   * 操作类型[1=待审批/2=已审批]
   */
  processedFlag: string
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
}
export interface SubmitData {
  /**
   * 审批意见，拒绝/退回必填
   */
  handleReason?: string
  /**
   * 处理结果，A=拒绝/B=打回/C=通过
   */
  handleResult: string
  /**
   * 业务流水号
   */
  refcode: number | string
}
export interface HistoryList {
  /**
   * 操作节点备注
   */
  applyRemark: string
  /**
   * 操作人名称，复用字段名
   */
  applyUsername: string
  /**
   * 操作时间
   */
  lastModDate: string
  /**
   * 节点状态[0=已保存/1=审核中/2=已退回/3=已拒绝/4=已撤回/9=已审核]
   */
  loanStatus: string
  /**
   * 是否自动审批标记[0=非自动审批/1=自动审批]
   */
  automaticFlag: string
}
