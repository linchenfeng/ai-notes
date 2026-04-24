/*
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 16:49:41
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-08-26 15:32:04
 * @Description  : 业务申请相关api
 */
import { request } from '@/api/api.request'
import { QuotaCount, QuotaList, QuotaInfo, SelectBuyerList, ReqGetBuyerInfo } from '@/interfaces/member/project/apply/quota'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取国内业务统计
   */
  getQuotaStatisticsCount(data: object) {
    return request<QuotaCount>('POST', '/api-sme/fillingAppQuota/getQuotaStatisticsCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取国内业务列表
   */
  findWaitQuotaPage(data: object) {
    type ReqQuotaList = {
      quotaList: QuotaList[]
    }
    return request<ReqQuotaList>('POST', '/api-sme/fillingAppQuota/findWaitQuotaPage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取申请买方额度详情
   */
  getQuotaInfo(data: object) {
    type ReqQuotaInfo = {
      quotaInfo: QuotaInfo
    }
    return request<ReqQuotaInfo>('POST', '/api-sme/fillingAppQuota/getQuotaInfo', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 获取获取可选买方列表
   */
  getBuyerList(data: ReqGetBuyerInfo) {
    type ReqBuyerList = {
      buyerList: SelectBuyerList[]
    }
    return request<ReqBuyerList>('POST', '/api-sme/fillingAppQuota/getBuyerList', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @description: 删除已添加买方
   */
  doDeleteBuyer(refcode: string) {
    return request('GET', `/api-sme/fillingAppQuota/doDeleteBuyer/${refcode}`)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-06-21 16:56:39
   * @param {object} data
   * @description: 买方额度暂存/提交
   */
  doSubmitApply(data: QuotaInfo) {
    type TemData = {
      refcode: number
    }
    return request<TemData>('POST', '/api-sme/fillingAppQuota/doSubmitApply', data)
  }
}
