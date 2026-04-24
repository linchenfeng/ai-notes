/*
 * @Author       : Charon.Lin
 * @Date         : 2026-02-26 09:16:13
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-02-26 09:16:13
 * @Description  : 开票审核相关api
 */
import { request } from '@/api/api.request'
import { InvoiceCount, FgaiAppList, Search, SubmitData } from '@/interfaces/member/project/audit/invoice'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取待审批发票统计
   */
  getInvoiceCount(data: Pick<Search['data'], 'queryCondition'>) {
    return request<InvoiceCount>('POST', '/api-sme/invoiceAudit/getInvoiceCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {Search} data
   * @description: 获取待审批发票列表
   */
  findInvoicePage(data: Search) {
    return request<{ fgaiAppList: FgaiAppList[] }>('POST', '/api-sme/invoiceAudit/findInvoicePage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {SubmitData} data
   * @description: 提交发票审批结果
   */
  doSubmitAudit(data: SubmitData) {
    return request('POST', '/api-sme/invoiceAudit/doSubmitAudit', data)
  }
}
