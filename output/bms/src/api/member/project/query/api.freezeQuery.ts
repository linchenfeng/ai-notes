/*
 * @Author       : Mingchun.Cheng
 * @Date         : 2025-08-11 14:36:55
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2025-08-11 14:38:08
 * @Description  : 冻结/解冻审批查询
 */
import { request } from '@/api/api.request'
import { FreezeAuditCount, FreezeItem } from '@/interfaces/member/project/audit/freezeApprovalAudit'
export default {
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询冻结/解冻申请审批统计数据
   */
  getFreezeAppCount(data: object) {
    return request<FreezeAuditCount>('POST', '/api-sme/freezeApprovalQuery/getFreezeAppCount', data)
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
    return request<FreezeList>('POST', '/api-sme/freezeApprovalQuery/findFreezeAppPage', data)
  }
}
