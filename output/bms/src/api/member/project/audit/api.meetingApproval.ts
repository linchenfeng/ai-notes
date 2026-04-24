/*
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-23 16:03:09
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:19:13
 * @Description  : 上会结果审批interface
 */
import { request } from '@/api/api.request'
import { MetList } from '@/interfaces/member/project/audit/meetingReview'
import { MeetingInfo } from '@/interfaces/member/project/audit/meetingAproval'
export default {
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 上会结果复核列表
   */
  findMeetingPage(data: object) {
    type MetListVo = {
      metList: MetList[]
    }
    return request<MetListVo>('POST', '/api-sme/meetingApproval/findMeetingPage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 上会结果审批详情
   */
  getMeetingInfo(refcode) {
    return request<MeetingInfo>('GET', `/api-sme/meetingApproval/getMeetingInfo/${refcode}`)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 获取操作短信验证码
   */
  doSendVerificationCode() {
    type VerificationCodeVo = {
      uuid: string
      mobilephone: string
    }
    return request<VerificationCodeVo>('GET', '/api-sme/meetingApproval/doSendVerificationCode')
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 上会结果审批（验证短信验证码）
   */
  doSubmitApproval(data: object) {
    return request('POST', '/api-sme/meetingApproval/doSubmitApproval', data)
  },
  /**
   * @Author: Charon.Lin
   * @Date: 2025-01-17 11:34:15
   * @param {*} refcode
   * @description: 上会状态检查

   */
  checkStatus(refcode) {
    type CheckStatus = {
      metStatus: string
    }
    return request<CheckStatus>('GET', `/api-sme/meetingReview/checkStatus/${refcode}`)
  }
}
