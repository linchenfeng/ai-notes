/*
 * @Author       : longcan.Yang
 * @Date         : 2022-10-12 17:33:34
 * @LastEditors  : longcan.Yang
 * @LastEditTime : 2022-10-19 16:51:29
 * @Description  :客户详情审批进度接口返回
 */
export interface ApprovalProcess {
  /**
   * 客户详情融资进度申请数量
   */
  financingTotal: number
  /**
   * 客户详情运营审核数量
   */
  operationAuditTotal: number
  /**
   * 客户详情财务审核数量
   */
  financialAuditTotal: number
  /**
   * 客户详情财务放款数量
   */
  financialLoanTotal: number
}
