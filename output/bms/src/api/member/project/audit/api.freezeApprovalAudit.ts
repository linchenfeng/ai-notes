/*
 * @Author       : Mingchun.Cheng
 * @Date         : 2025-07-31 17:35:19
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2025-08-11 14:02:29
 * @Description  : 冻结/解冻审批
 */
import { request } from '@/api/api.request'
import { FreezeAuditCount, FreezeItem, FreezeAuditInfo, GetFreezeAppInfo, HistoryItem } from '@/interfaces/member/project/audit/freezeApprovalAudit'
export default {
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询冻结/解冻申请审批统计数据
   */
  getFreezeAppCount(data: object) {
    return request<FreezeAuditCount>('POST', '/api-sme/freezeApprovalAudit/getFreezeAppCount', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询冻结/解冻申请审批列表
   */
  findFreezeAppPage(data: object) {
    type FreezeList = {
      freezeList: FreezeItem[]
    }
    return request<FreezeList>('POST', '/api-sme/freezeApprovalAudit/findFreezeAppPage', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {WarningAuditInfo} data
   * @description: 审批冻结/解冻申请
   */
  doHandleFreezeApp(data: FreezeAuditInfo) {
    return request('POST', '/api-sme/freezeApprovalAudit/doHandleFreezeApp', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询冻结/解冻申请详细信息
   */
  getFreezeAppInfo(data: object) {
    return request<GetFreezeAppInfo>('POST', '/api-sme/freezeApprovalQuery/getFreezeAppInfo', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询冻结/解冻申请审批历程
   */
  getFreezeAppHistoryInfo(data: object) {
    type HistoryList = {
      historyList: HistoryItem[]
    }
    return request<HistoryList>('POST', '/api-sme/freezeApprovalQuery/getFreezeAppHistoryInfo', data)
  }
}
