/*
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-29 10:55:15
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-29 14:53:46
 * @Description  : 上会结果审批公众号消息跳转
 */
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { ChatMessageInfo } from '@/interfaces/message/chatMessage'
import { redirectTo } from '../uniapp'
import apiMeetingReview from '@/api/member/project/audit/api.meetingReview'
import apiMeetingApproval from '@/api/member/project/audit/api.meetingApproval'
import { errorToast } from './index'
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-29 11:14:27
 * @param {ChatRouteParams} routeParams
 * @description: 跳入上会结果复核详情
 */
export function meetingReview(refcode): void {
  apiMeetingReview.getMeetingInfo(refcode).then(res => {
    //已撤回或删除的跳到项目页
    if (!res.data.metStatus || res.data.metStatus === '9') {
      errorToast('当前业务状态已变更，请关注最新消息')
    } else if (res.data.metStatus === '1') {
      // 待复核跳入详情
      const temPath = `/member/project/audit/meetingReview/detail/${encodeBase64(refcode)}/${encodeBase64('1')}`
      const messageInfo = {
        path: temPath,
        isNotSkip: true
      }
      setStorage('messageInfo', messageInfo as ChatMessageInfo)
      redirectTo(`/member/project`)
    } else {
      // 待复核跳入详情
      const temPath = `/member/project/query/meeting/detail/${encodeBase64(refcode)}`
      const messageInfo = {
        path: temPath,
        isNotSkip: true
      }
      setStorage('messageInfo', messageInfo as ChatMessageInfo)
      redirectTo(`/member/project`)
    }
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-29 11:18:33
 * @param {*} refcode
 * @description: 跳入上会结果审批详情
 */
export function meetingApproval(refcode): void {
  apiMeetingApproval.getMeetingInfo(refcode).then(res => {
    //复核撤回或运营端撤回或删除的跳到项目页
    if (!res.data.metStatus || ['1', '9'].includes(res.data.metStatus)) {
      errorToast('当前业务状态已变更，请关注最新消息')
    } else if (res.data.metStatus === '3') {
      // 待审核跳入详情
      const temPath = `/member/project/audit/meetingApproval/detail/${encodeBase64(refcode)}`
      const messageInfo = {
        path: temPath,
        isNotSkip: true
      }
      setStorage('messageInfo', messageInfo as ChatMessageInfo)
      redirectTo(`/member/project`)
    } else {
      const temPath = `/member/project/query/meeting/detail/${encodeBase64(refcode)}`
      const messageInfo = {
        path: temPath,
        isNotSkip: true
      }
      setStorage('messageInfo', messageInfo as ChatMessageInfo)
      redirectTo(`/member/project`)
    }
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-11-29 11:18:33
 * @param {*} refcode
 * @description: 跳入上会结果查询详情
 */
export function meetingQuery(routeParams): void {
  apiMeetingApproval.getMeetingInfo(routeParams.refcode).then(res => {
    //已撤回或删除的跳到项目页
    if (!res.data.metStatus || res.data.metStatus === '9') {
      errorToast('当前业务状态已变更，请关注最新消息')
    } else {
      const temPath = `/member/project/query/meeting/detail/${encodeBase64(routeParams.refcode)}`
      const messageInfo = {
        path: temPath,
        isNotSkip: true
      }
      setStorage('messageInfo', messageInfo as ChatMessageInfo)
      redirectTo(`/member/project`)
    }
  })
}
export function meetingCollectAdit(refcode): void {
  apiMeetingApproval.getMeetingInfo(refcode).then(res => {
    if (!res.data.metStatus) {
      errorToast('当前业务状态已变更，请关注最新消息')
    } else if (res.data.metStatus === '6') {
      // 待复核跳入详情
      const temPath = `/member/project/audit/meetingCollect/detail/${encodeBase64(refcode)}`
      const messageInfo = {
        path: temPath,
        isNotSkip: true
      }
      setStorage('messageInfo', messageInfo as ChatMessageInfo)
      redirectTo(`/member/project`)
    } else {
      const temPath = `/member/project/query/meeting/detail/${encodeBase64(refcode)}`
      const messageInfo = {
        path: temPath,
        isNotSkip: true
      }
      setStorage('messageInfo', messageInfo as ChatMessageInfo)
      redirectTo(`/member/project`)
    }
  })
}
