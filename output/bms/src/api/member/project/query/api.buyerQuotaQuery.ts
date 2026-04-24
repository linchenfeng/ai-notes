/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-30 11:27:57
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:18:06
 * @Description  : 项目-业务审核-额度审核api
 */
import { request } from '@/api/api.request'
import { ClList, StatusCount, QuotaInfo } from '@/interfaces/member/project/query/buyerQuotaQuery'
export default {
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 额度查询统计数据
   */
  getQuotaStatisticsCount(data: object) {
    return request<StatusCount>('POST', '/api-sme/applicationQuoQuery/getQuotaStatisticsCount', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description:额度查询列表
   */
  findQuotaPage(data: object) {
    type QuotaList = {
      clList: ClList[]
    }
    return request<QuotaList>('POST', '/api-sme/applicationQuoQuery/findQuotaPage', data)
  },
  //获取额度详情
  getQuotaInfo(refcode) {
    type ReqQuotaInfo = {
      fintAppClVo: QuotaInfo
    }
    return request<ReqQuotaInfo>('GET', `/api-sme/applicationQuoQuery/getQuotaInfo/${refcode}`)
  }
}
