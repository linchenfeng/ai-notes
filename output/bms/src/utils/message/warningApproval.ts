/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-07-04 11:20:13
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-12-29 16:15:19
 * @Description  : 预警申请公众号跳转
 */

import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { redirectTo } from '../uniapp'
import { ChatRouteParams, ChatMessageInfo } from '@/interfaces/message/chatMessage'
import apiWarningApprovalQuery from '@/api/member/project/query/api.warningApprovalQuery'
import { errorToast } from './index'
/**
 * @Author: Longcan.Yang
 * @Date: 2025-06-16 10:03:25
 * @param {ChatRouteParams} routeParams
 * @description:进入申请修改页面
 */
export function warningApply(routeParams: ChatRouteParams): void {
  const data = {
    refcode: routeParams.refcode,
    queryFlag: '0'
  }
  let temPath = ''
  apiWarningApprovalQuery.getWarningAppInfo(data).then(res => {
    if (res.data.nodata === '1') {
      // 数据被删除
      errorToast('当前业务状态已变更，请关注最新消息')
      return
    }
    if (['2'].includes(res.data.warningVo.applyStatus)) {
      // 已退回  跳入申请修改页面
      temPath = `/member/project/apply/warning/apply/${encodeBase64(routeParams.refcode)}`
    } else {
      // 其他状态跳入详情
      temPath = `/member/project/query/warning/detail/${encodeBase64(routeParams.refcode)}`
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
 * @Date: 2025-06-16 09:47:40
 * @param {ChatRouteParams} routeParams
 * @description: 跳入审批详情页面进行审批
 */
export function warningAudit(routeParams: ChatRouteParams): void {
  const data = {
    refcode: routeParams.refcode,
    queryFlag: '0'
  }
  let temPath = ''
  apiWarningApprovalQuery.getWarningAppInfo(data).then(res => {
    if (res.data.nodata === '1') {
      // 数据被删除
      errorToast('当前业务状态已变更，请关注最新消息')
      return
    }
    if (['1', '2'].includes(res.data.warningVo.applyStatus) && res.data.flowNodeVo.nodeLevel === routeParams.nodeLevel) {
      // 审批中、已退回 && 当前审批层级一致 跳入审批页面
      temPath = `/member/project/audit/warning/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64(routeParams.taskRefcode)}`
    } else {
      // 其他状态跳入详情
      temPath = `/member/project/query/warning/detail/${encodeBase64(routeParams.refcode)}`
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
 * @Date: 2025-06-16 09:52:13
 * @param {ChatRouteParams} routeParams
 * @description: 公众号消息接收人跳入详情页面
 */
export function warningQuery(routeParams: ChatRouteParams): void {
  const data = {
    refcode: routeParams.refcode,
    queryFlag: '0'
  }
  apiWarningApprovalQuery.getWarningAppInfo(data).then(res => {
    if (res.data.nodata === '1') {
      // 数据被删除
      errorToast('当前业务状态已变更，请关注最新消息')
      return
    }
    const temPath = `/member/project/query/warning/detail/${encodeBase64(routeParams.refcode)}`
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
 * @Date: 2025-07-15 14:52:04
 * @param {ChatRouteParams} routeParams
 * @description: 跳转到待处理列表页
 */
export function warningTrigger(): void {
  const temPath = `/member/project/apply/warning`
  const messageInfo = {
    path: temPath,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member/project`)
}
