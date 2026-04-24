/*
 * @Author       : Charon.Lin
 * @Date         : 2025-09-18 18:58:16
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-25 17:42:13
 * @Description  : 申请征信/指派征信公众号消息跳转
 */
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { redirectTo } from '../uniapp'
import { ChatRouteParams, ChatMessageInfo } from '@/interfaces/message/chatMessage'
import apiAssist from '@/api/member/project/apply/api.assist'
import { errorToast } from './index'
/**
 * @Author: Charon.Lin
 * @Date: 2025-06-16 09:47:40
 * @param {ChatRouteParams} routeParams
 * @description: 征信主管审核
 */
export function assistSubmit(routeParams: ChatRouteParams): void {
  let temPath = ''
  apiAssist.getApplyAssistInfo(routeParams.refcode).then(res => {
    // 待指派状态跳转到指派审核页
    const assistAppointM = res.data.assistAppointM
    if (assistAppointM.appointStatus === '1') {
      if (['3', '4', '5'].includes(assistAppointM.applyStatus)) {
        errorToast('当前业务状态已变更，请关注最新消息')
        return
      }
      temPath = `/member/project/audit/assistAppoint/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64(assistAppointM.appointStatus)}`
    } else {
      // 已指派跳转到指派详情页
      temPath = `/member/project/audit/assistAppoint/detail/${encodeBase64(routeParams.refcode)}`
    }
    const messageInfo = {
      path: temPath,
      isNotSkip: true
    }
    setStorage('messageInfo', messageInfo as ChatMessageInfo)
    redirectTo(`/member/project`)
  })
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-06-16 09:47:40
 * @param {ChatRouteParams} routeParams
 * @description: 跳转到申请征信详情页
 */
export function assistSupervisorSubmit(routeParams: ChatRouteParams): void {
  const temPath = `/member/project/apply/assist/detail/${encodeBase64(routeParams.refcode)}`
  const messageInfo = {
    path: temPath,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member/project`)
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-06-16 09:47:40
 * @param {ChatRouteParams} routeParams
 * @description: 协销主管指派征信主管
 */
export function appointSubmit(routeParams: ChatRouteParams): void {
  let temPath = ''
  apiAssist.getApplyAssistInfo(routeParams.refcode).then(res => {
    // 待征信指派状态跳转到指派审核页
    const assistAppointM = res.data.assistAppointM
    if (assistAppointM.appointStatus === '2') {
      if (['3', '4', '5'].includes(assistAppointM.applyStatus)) {
        errorToast('当前业务状态已变更，请关注最新消息')
        return
      }
      temPath = `/member/project/audit/assistAppoint/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64(assistAppointM.appointStatus)}`
    } else {
      // 已指派跳转到指派详情页
      temPath = `/member/project/audit/assistAppoint/detail/${encodeBase64(routeParams.refcode)}`
    }
    const messageInfo = {
      path: temPath,
      isNotSkip: true
    }
    setStorage('messageInfo', messageInfo as ChatMessageInfo)
    redirectTo(`/member/project`)
  })
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-06-16 09:47:40
 * @param {ChatRouteParams} routeParams
 * @description: 跳转到申请征信详情页 |appointAssistSameSubmit|appointAssistNotSameSubmitNoticeToAssist|appointAssistNotSameSubmitNoticeToCredit
 */
export function appointAssistSubmit(routeParams: ChatRouteParams): void {
  const temPath = `/member/project/apply/assist/detail/${encodeBase64(routeParams.refcode)}`
  const messageInfo = {
    path: temPath,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member/project`)
}
