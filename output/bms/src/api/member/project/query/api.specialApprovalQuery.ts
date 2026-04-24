/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-09 09:56:37
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:18:38
 * @Description  : 特批查询
 */

import { request } from '@/api/api.request'
import { SpecialQueryCount, SpecialAppInfo } from '@/interfaces/member/project/apply/specialApproval'
import { HistoryList, SaaListItem } from '@/interfaces/member/project/audit/specialApprovalAudit'
export default {
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询特批申请统计数据
   */
  getSpecialAppCount(data: object) {
    return request<SpecialQueryCount>('POST', '/api-sme/specialApprovalQuery/getSpecialAppCount', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询特批申请列表
   */
  findSpecialAppPage(data: object) {
    type SaaList = {
      saaList: SaaListItem[]
    }
    return request<SaaList>('POST', '/api-sme/specialApprovalQuery/findSpecialAppPage', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 获取特批申请详细信息
   */
  getSpecialAppInfo(data: object) {
    return request<SpecialAppInfo>('POST', '/api-sme/specialApprovalQuery/getSpecialAppInfo', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 获取特批申请审批历程
   */
  getSpecialAppHistoryInfo(data: object) {
    type TemHistoryList = {
      historyList: HistoryList[]
    }
    return request<TemHistoryList>('POST', '/api-sme/specialApprovalQuery/getSpecialAppHistoryInfo', data)
  }
}
