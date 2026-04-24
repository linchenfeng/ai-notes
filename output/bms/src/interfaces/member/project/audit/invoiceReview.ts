/*
 * @Author       : Codex
 * @Date         : 2026-04-24 17:04:00
 * @LastEditors  : Codex
 * @LastEditTime : 2026-04-24 17:04:00
 * @Description  : 开票审核新增列表 interface
 */
export interface InvoiceReviewCount {
  /**
   * 待审核
   */
  ingCount: number
  /**
   * 已退回
   */
  returnCount: number
  /**
   * 已通过
   */
  passedCount: number
  /**
   * 已拒绝
   */
  refuseCount: number
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

export interface InvoiceReviewListItem {
  /**
   * 申请书编号
   */
  applyNo: string
  /**
   * 开票企业名称
   */
  appOrgName: string
  /**
   * 币种
   */
  ccyid: string
  /**
   * 开票类型
   */
  generateType: string
  /**
   * 申请开票金额
   */
  generateAmt: number
  /**
   * 流水号
   */
  refcode: number
  /**
   * 展示状态
   */
  showStatus: string
}
