/*
 * @Author       : Charon.Lin
 * @Date         : 2024-12-26 16:11:52
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2024-12-26 16:12:43
 * @Description  : 上会结果查询
 */
import { request } from '@/api/api.request'
import { StatusCount, MeetingList } from '@/interfaces/member/project/query/meetingQuery'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 获取上会业务各状态数据
   */
  getStatusCount(data: object) {
    return request<StatusCount>('POST', '/api-sme/meetingQuery/getStatusCount', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 上会结果查询列表
   */
  findApplicationPage(data: object) {
    return request<MeetingList[]>('POST', '/api-sme/meetingQuery/findMeetingPage', data)
  }
}
