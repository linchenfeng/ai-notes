/*
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-18 14:35:40
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:05:36
 * @Description  : 申请书查询相关api
 */
import { request } from '@/api/api.request'
import { ApplicationInfo, ApplicationCount, ApplicationList } from '@/interfaces/member/project/apply/fillingApplication'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 申请书申请总数
   */
  getApplicationCount(data: object) {
    return request<ApplicationCount>('POST', '/api-sme/applicationQuery/getApplicationCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 申请书申请列表
   */
  findApplicationPage(data: object) {
    return request<ApplicationList[]>('POST', '/api-sme/applicationQuery/findApplicationPage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 申请书申请详情
   */
  getApplicationInfo(refcode) {
    return request<ApplicationInfo>('GET', `/api-sme/applicationQuery/getApplicationInfo/${refcode}`)
  }
}
