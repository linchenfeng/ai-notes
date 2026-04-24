/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-09 09:51:12
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-06-27 14:06:15
 * @Description  : 特批申请审批api
 */

import { request } from '@/api/api.request'
import { SpecialAuditCount, SaaListItem, QaListItem } from '@/interfaces/member/project/audit/specialApprovalAudit'
export default {
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询特批申请审批统计数据
   */
  getSpecialAppCount(data: object) {
    return request<SpecialAuditCount>('POST', '/api-sme/specialApprovalAudit/getSpecialAppCount', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 查询特批申请审批列表
   */
  findSpecialAppPage(data: object) {
    type SaaList = {
      saaList: SaaListItem[]
    }
    return request<SaaList>('POST', '/api-sme/specialApprovalAudit/findSpecialAppPage', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 审批特批申请
   */
  doHandleSpecialApp(data: object) {
    return request('POST', '/api-sme/specialApprovalAudit/doHandleSpecialApp', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 特批申请提问
   */
  doQuiz(data: object) {
    return request('POST', '/api-sme/specialApprovalAudit/doQuiz', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 特批申请回复
   */
  doReply(data: object) {
    return request('POST', '/api-sme/specialApprovalAudit/doReply', data)
  },
  /**
   * @Author: Longcan.Yang
   * @Date: 2025-06-09 09:35:15
   * @param {object} data
   * @description: 特批申请问答列表查询
   */
  findQuizPage(data: object) {
    type QaList = {
      qaList: QaListItem[]
    }
    return request<QaList>('POST', '/api-sme/specialApprovalAudit/findQuizPage', data)
  }
}
