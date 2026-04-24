/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-30 11:27:57
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-07-11 11:08:52
 * @Description  : 项目-业务审核-业务报价api
 */
import { request } from '@/api/api.request'
import { QuotaItem, QuotationCount, QuotaInfo, QuotationSubmit } from '@/interfaces/member/project/audit/quotation'
export default {
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 额度审核统计数据
   */
  getQuotaStatisticsCount(data: object) {
    return request<QuotationCount>('POST', '/api-sme/applicationQuotation/getQuotaStatisticsCount', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description:业务报价列表
   */
  findQuotaReviewPage(data: object) {
    type QuotaList = {
      quotaList: QuotaItem[]
    }
    return request<QuotaList>('POST', '/api-sme/applicationQuotation/findQuotaReviewPage', data)
  },
  //获取报价详情
  getQuotaInfo(refcode) {
    type ReqQuotaInfo = {
      quotaInfo: QuotaInfo
    }
    return request<ReqQuotaInfo>('GET', `/api-sme/applicationQuotation/getQuotaInfo/${refcode}`)
  },
  // 提交报价
  doSubmitQuotation(data: QuotationSubmit) {
    return request('POST', '/api-sme/applicationQuotation/doSubmitQuotation', data)
  }
}
