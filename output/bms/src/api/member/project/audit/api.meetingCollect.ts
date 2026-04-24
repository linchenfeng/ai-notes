/*
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-23 16:03:09
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:19:28
 * @Description  : 上会结果意见汇整
 */
import { request } from '@/api/api.request'
import { MetList } from '@/interfaces/member/project/audit/meetingReview'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 上会结果意见汇整列表
   */
  findMeetingPage(data: object) {
    type MetListVo = {
      metList: MetList[]
    }
    return request<MetListVo>('POST', '/api-sme/meetingCollectAudit/findMeetingPage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 核贷书意见汇整复核
   */
  doSubmitCollectAudit(data: object) {
    return request('POST', '/api-sme/meetingCollectAudit/doSubmitCollectAudit', data)
  }
}
