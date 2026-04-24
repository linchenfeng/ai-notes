/*
 * @Author       : Charon.Lin
 * @Date         : 2025-07-18 13:35:55
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-07-18 16:10:57
 * @Description  : 买方额度审核公众号消息跳转
 */

import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { redirectTo } from '../uniapp'
import { ChatRouteParams, ChatMessageInfo } from '@/interfaces/message/chatMessage'
import apiQuotaAudit from '@/api/member/project/audit/api.quotaAudit'
/**
 * @Author: Longcan.Yang
 * @Date: 2025-06-16 10:03:25
 * @param {ChatRouteParams} routeParams
 * @description:进入审核页面
 */
export function toAppClReview(routeParams: ChatRouteParams): void {
  let temPath = ''
  apiQuotaAudit.getQuotaInfo(routeParams.refcode).then(res => {
    if (res.data.fintAppClVo.applyStatus === '21') {
      // 待审核跳转到审核页面
      temPath = `/member/project/audit/quotaAudit/audit/${encodeBase64(routeParams.refcode)}`
    } else {
      // 其他状态跳入详情
      temPath = `/member/project/query/buyerQuota/detail/${encodeBase64(routeParams.refcode)}`
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
 * @Date: 2025-06-16 10:03:25
 * @param {ChatRouteParams} routeParams
 * @description:进入买方额度
 */
export function appClQuery(routeParams: ChatRouteParams): void {
  const temPath = `/member/project/query/buyerQuota/detail/${encodeBase64(routeParams.refcode)}`
  const messageInfo = {
    path: temPath,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member/project`)
}
