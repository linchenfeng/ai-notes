/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-24 15:34:03
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-05 17:01:45
 * @Description  : 尽调公众号消息跳转
 */
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { redirectTo } from '../uniapp'
import { ChatRouteParams, ChatMessageInfo } from '@/interfaces/message/chatMessage'
import apiSiteDueDiligence from '@/api/member/project/apply/api.siteDueDiligence'
import apiAssignDueDiligence from '@/api/member/project/audit/api.assignDueDiligence'
import { errorToast } from './index'
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-22 10:02:56
 * @param {ChatRouteParams} routeParams
 * @description: 尽调人员跳转进入开始尽调页面
 */
export function dueDiligence(routeParams: ChatRouteParams): void {
  let temPath = ''
  apiSiteDueDiligence.queryCddInfo(routeParams.cddUserRefcode).then(res => {
    if (res.data && res.data.userCddInfo) {
      // 正常查询到数据
      if (res.data.userCddInfo.appointStatus === '4') {
        // 已取消指派
        errorToast('当前业务状态已变更，请关注最新消息')
        return
      }
      if (res.data.userCddInfo.surveyStatus === '9') {
        // 已完成尽调，跳入详情页面
        temPath = `/member/project/apply/siteDueDiligence/detail/${encodeBase64(routeParams.cddRefcode)}`
      } else {
        // 跳入开始尽调页面
        temPath = `/member/project/apply/siteDueDiligence/edit/${encodeBase64(routeParams.cddRefcode)}/${encodeBase64(routeParams.cddUserRefcode)}`
      }
    } else {
      errorToast('当前业务状态已变更，请关注最新消息')
      return
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
 * @Author: Longcan.Yang
 * @Date: 2024-10-22 10:02:56
 * @param {ChatRouteParams} routeParams
 * @description: 协销主管跳转指派详情页面
 */
export function dueDiligenceAssign(routeParams: ChatRouteParams): void {
  let temPath = ''
  apiAssignDueDiligence.queryDueDiligenceInfo(routeParams.cddRefcode).then(res => {
    if (res.data && res.data.orgInfo) {
      if (res.data.orgInfo.appointStatus === '9') {
        // 已完成尽调，跳入详情页面
        temPath = `/member/project/audit/assignDueDiligence/detail/${encodeBase64(routeParams.cddRefcode)}`
      } else {
        // 跳入指派尽调页面
        temPath = `/member/project/audit/assignDueDiligence/edit/${encodeBase64(routeParams.cddRefcode)}`
      }
    } else {
      errorToast('当前业务状态已变更，请关注最新消息')
      return
    }

    const messageInfo = {
      path: temPath,
      isNotSkip: true
    }
    setStorage('messageInfo', messageInfo as ChatMessageInfo)
    redirectTo(`/member/project`)
  })
}
