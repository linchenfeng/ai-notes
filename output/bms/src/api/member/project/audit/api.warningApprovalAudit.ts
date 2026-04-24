/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-30 11:28:13
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:26:32
 * @Description  : 预警解除审批
 */
import { request } from '@/api/api.request'
import { WarningAuditCount, WarningItem, WarningAuditInfo } from '@/interfaces/member/project/audit/warningApprovalAudit'
export default {
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询预警解除申请审批统计数据
   */
  getWarningAppCount(data: object) {
    return request<WarningAuditCount>('POST', '/api-sme/warningApprovalAudit/getWarningAppCount', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询特批申请审批列表
   */
  findWarningAppPage(data: object) {
    type WarningList = {
      warningList: WarningItem[]
    }
    return request<WarningList>('POST', '/api-sme/warningApprovalAudit/findWarningAppPage', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {WarningAuditInfo} data
   * @description: 审批预警解除申请
   */
  doHandleWarningApp(data: WarningAuditInfo) {
    return request('POST', '/api-sme/warningApprovalAudit/doHandleWarningApp', data)
  }
}
