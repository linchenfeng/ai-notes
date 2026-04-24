/*
 * @Author       : Codex
 * @Date         : 2026-04-24 17:04:00
 * @LastEditors  : Codex
 * @LastEditTime : 2026-04-24 17:04:00
 * @Description  : 开票审核新增列表相关api
 */
import { request } from '@/api/api.request'
import { InvoiceReviewCount, InvoiceReviewListItem, Search } from '@/interfaces/member/project/audit/invoiceReview'

export default {
  /**
   * @description: 获取开票审核列表统计
   */
  getInvoiceReviewCount(data: Pick<Search['data'], 'queryCondition'>) {
    return request<InvoiceReviewCount>('POST', '/api-sme/invoiceReview/getInvoiceReviewCount', data)
  },
  /**
   * @description: 获取开票审核列表
   */
  findInvoiceReviewPage(data: Search) {
    return request<{ invoiceReviewList: InvoiceReviewListItem[] }>('POST', '/api-sme/invoiceReview/findInvoiceReviewPage', data)
  }
}
