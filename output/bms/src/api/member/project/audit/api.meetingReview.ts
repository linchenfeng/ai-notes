/*
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-23 15:14:55
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-30 16:22:01
 * @Description  : 上会结果复核接口
 */
import { request } from '@/api/api.request'
import {
  MetList,
  MeetingInfo,
  CommitteeGroupList,
  OpinionInfo,
  HistoryListItem,
  MeetingReviewCount
} from '@/interfaces/member/project/audit/meetingReview'
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
    return request<MetListVo>('POST', '/api-sme/meetingReview/findMeetingPage', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 上会结果详情
   */
  getMeetingInfo(refcode) {
    return request<MeetingInfo>('GET', `/api-sme/meetingReview/getMeetingInfo/${refcode}`)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 获取审查委员组
   */
  getCommitteeGroup(refcode) {
    return request<CommitteeGroupList[]>('GET', `/api-sme/meetingReview/getCommitteeGroup/${refcode}`)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 邀请意见补充
   */
  doInvitationSupplement(data: object) {
    type TemData = {
      refcode: number
    }
    return request<TemData>('POST', '/api-sme/meetingReview/doInvitationSupplement', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 提交上会结果复核
   */
  doSubmitReview(data: object) {
    return request('POST', '/api-sme/meetingReview/doSubmitReview', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 获取委员意见详情(邀请链接查询)
   */
  getOpinionInfo(refcode) {
    return request<OpinionInfo>('GET', `/api-sme/meetingReview/getOpinionInfo/${refcode}`, {}, false)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 提交委员意见
   */
  doSubmitOpinion(data: object) {
    return request('POST', '/api-sme/meetingReview/doSubmitOpinion', data, false)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 获取业务历程
   */
  getHistoryList(refcode) {
    return request<HistoryListItem[]>('GET', `/api-sme/meetingReview/getHistoryList/${refcode}`)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 项目首页功能代办数量
   */
  countPendingProcessing() {
    type Count = {
      /**
       * 待审批总数
       */
      approveCount: number
      /**
       * 待复核总数
       */
      reviewCount: number
      /**
       * 待汇整审批数
       */
      collectAuditCount: number
    }
    return request<Count>('GET', `/api-sme/meetingReview/countPendingProcessing`)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 暂存委员意见
   */
  doSubmitOpinionTemporary(data: object) {
    return request('POST', '/api-sme/meetingReview/doSubmitOpinionTemporary', data, false)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 获取复核结果总数
   */
  countMeetingReview(data: object) {
    return request<MeetingReviewCount>('POST', '/api-sme/meetingReview/countMeetingReview', data)
  },
  /**
   * @Author: LongCan.Yang
   * @Date: 2024-10-12 10:32:22
   * @param {object} data
   * @description: 撤回复核状态
   */
  doRevokeReviewStatus(data: object) {
    return request('POST', '/api-sme/meetingReview/doRevokeReviewStatus', data)
  },
  //删除意见补充
  doRemoveSupplement(data: object) {
    return request('POST', '/api-sme/meetingReview/doRemoveSupplement', data)
  }
}
