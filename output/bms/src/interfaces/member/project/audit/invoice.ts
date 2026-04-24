/*
 * @Author       : Charon.Lin
 * @Date         : 2026-02-26 09:17:32
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-03-02 17:07:54
 * @Description  : 开票审核interface
 */
export interface InvoiceCount {
  /**
   * 待审核
   */
  ingCount: number
  /**
   * 已提交
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
   * 查询条件：开票企业名称/申请书编号
   */
  queryCondition: string
  /**
   * 列表状态：11=待审核/2=已退回/1=已通过/0=已拒绝
   */
  tabStatus: string
}
export interface Search {
  data: SearchData
  pageNum: number
  pageSize: number
}
export interface FgaiAppList {
  /**
   * 申请书编号
   */
  applyNo?: string
  /**
   * 申请编号
   */
  appNo: string
  /**
   * 开票企业名称
   */
  appOrgName: string
  /**
   * 币种
   */
  ccyid: string
  /**
   * 开票金额
   */
  generateAmt: number
  /**
   * 开票类型，2=征信费
   */
  generateType: string
  /**
   * 流水号
   */
  refcode: number
  /**
   * 标记状态
   */
  tabStatus: string
  /**
   * 标记状态
   */
  showStatus: string
}
export interface SubmitData {
  /**
   * 审批意见，0=拒绝/1=通过/2=退回
   */
  auditOpinion: string
  /**
   * 备注
   */
  auditRemark: string
  /**
   * 流水号
   */
  refcode: number | string
}
