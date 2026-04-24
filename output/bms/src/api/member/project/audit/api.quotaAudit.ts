/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-30 11:27:57
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-07-21 15:50:04
 * @Description  : 项目-业务审核-额度审核api
 */
import { request } from '@/api/api.request'
import { ClListItem, QuotaAuditCount, QuotaInfo, WaitAuditCount, QuotaSubmit } from '@/interfaces/member/project/audit/quotaAudit'
export default {
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 额度审核统计数据
   */
  getQuotaStatisticsCount(data: object) {
    return request<QuotaAuditCount>('POST', '/api-sme/applicationQuoApply/getQuotaStatisticsCount', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description:额度审核列表
   */
  findQuotaReviewPage(data: object) {
    type ClList = {
      clList: ClListItem[]
    }
    return request<ClList>('POST', '/api-sme/applicationQuoApply/findQuotaReviewPage', data)
  },
  //获取额度详情
  getQuotaInfo(refcode) {
    type ReqQuotaInfo = {
      fintAppClVo: QuotaInfo
    }
    return request<ReqQuotaInfo>('GET', `/api-sme/applicationQuoApply/getQuotaInfo/${refcode}`)
  },
  //额度审核提交
  doSubmitReview(data: QuotaSubmit) {
    return request('POST', '/api-sme/applicationQuoApply/doSubmitReview', data)
  },
  //额度审核首页待审核数据
  getApplicationQuotaCount() {
    return request<WaitAuditCount>('GET', '/api-sme/applicationQuoApply/getApplicationQuotaCount')
  },
  //获取额度详情
  getQuotaResultInfo(refcode) {
    type ReqQuotaInfo = {
      fintAppClVo: QuotaInfo
    }
    return request<ReqQuotaInfo>('GET', `/api-sme/applicationQuoApply/getQuotaResultInfo/${refcode}`)
  }
}
