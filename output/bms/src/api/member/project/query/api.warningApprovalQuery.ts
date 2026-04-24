/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-30 11:28:13
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:25:59
 * @Description  : 预警解除申请查询
 */
import { request } from '@/api/api.request'
import { WarningQueryCount, WarningItem, HistoryItem } from '@/interfaces/member/project/audit/warningApprovalAudit'
import { GetWarningAppInfo } from '@/interfaces/member/project/apply/warningApproval'
export default {
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询预警解除申请查询功能统计数据
   */
  getWarningAppCount(data: object) {
    return request<WarningQueryCount>('POST', '/api-sme/warningApprovalQuery/getWarningAppCount', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询预警解除申请列表
   */
  findWarningAppPage(data: object) {
    type WarningList = {
      warningList: WarningItem[]
    }
    return request<WarningList>('POST', '/api-sme/warningApprovalQuery/findWarningAppPage', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询预警解除申请详细信息
   */
  getWarningAppInfo(data: object) {
    return request<GetWarningAppInfo>('POST', '/api-sme/warningApprovalQuery/getWarningAppInfo', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询预警解除申请审批历程
   */
  getWarningAppHistoryInfo(data: object) {
    type HistoryList = {
      historyList: HistoryItem[]
    }
    return request<HistoryList>('POST', '/api-sme/warningApprovalQuery/getWarningAppHistoryInfo', data)
  }
}
