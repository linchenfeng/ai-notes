/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-16 09:32:40
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-29 11:27:31
 * @Description  : 特批公众号消息跳转
 */
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { redirectTo } from '../uniapp'
import { ChatRouteParams, ChatMessageInfo } from '@/interfaces/message/chatMessage'
import apiSpecialApprovalQuery from '@/api/member/project/query/api.specialApprovalQuery'
import { errorToast } from './index'

/**
 * 授信审核通过 直接跳转到特批申请页面
 */
export function toSpecialApply(): void {
  const temPath = `/member/project/apply/special/apply`
  const messageInfo = {
    path: temPath,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member/project`)
}
/**
 * @Author: Longcan.Yang
 * @Date: 2025-06-16 10:03:25
 * @param {ChatRouteParams} routeParams
 * @description:进入申请修改页面
 */
export function specialApply(routeParams: ChatRouteParams): void {
  const data = {
    refcode: routeParams.refcode
  }
  let temPath = ''
  apiSpecialApprovalQuery.getSpecialAppInfo(data).then(res => {
    if (res.data.nodata === '1') {
      // 数据被删除
      errorToast('当前业务状态已变更，请关注最新消息')
      return
    }

    if (['2'].includes(res.data.saaVo.applyStatus)) {
      // 已退回  跳入申请修改页面
      temPath = `/member/project/apply/special/apply/${encodeBase64(routeParams.refcode)}`
    } else {
      // 其他状态跳入详情
      temPath = `/member/project/query/special/detail/${encodeBase64(routeParams.refcode)}`
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
export function specialAudit(routeParams: ChatRouteParams): void {
  const data = {
    refcode: routeParams.refcode
  }
  let temPath = ''
  apiSpecialApprovalQuery.getSpecialAppInfo(data).then(res => {
    if (res.data.nodata === '1') {
      // 数据被删除
      errorToast('当前业务状态已变更，请关注最新消息')
      return
    }
    if (['1', '2'].includes(res.data.saaVo.applyStatus) && res.data.flowNodeVo.nodeLevel === routeParams.nodeLevel) {
      // 审批中、已退回 && 当前审批层级一致 跳入审批页面
      // 1-待审批tab页
      temPath = `/member/project/audit/special/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64(routeParams.taskRefcode)}/${encodeBase64(
        '1'
      )}`
    } else {
      // 其他状态跳入详情
      temPath = `/member/project/query/special/detail/${encodeBase64(routeParams.refcode)}`
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
export function specialQuery(routeParams: ChatRouteParams): void {
  const data = {
    refcode: routeParams.refcode
  }
  apiSpecialApprovalQuery.getSpecialAppInfo(data).then(res => {
    if (res.data.nodata === '1') {
      // 数据被删除
      errorToast('当前业务状态已变更，请关注最新消息')
      return
    }
    const temPath = `/member/project/query/special/detail/${encodeBase64(routeParams.refcode)}`
    const messageInfo = {
      path: temPath,
      isNotSkip: true
    }
    setStorage('messageInfo', messageInfo as ChatMessageInfo)
    redirectTo(`/member/project`)
  })
}
