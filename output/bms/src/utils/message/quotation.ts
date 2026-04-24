/*
 * @Author       : Charon.Lin
 * @Date         : 2025-07-18 13:35:55
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-07-21 09:47:44
 * @Description  : 业务报价公众号消息跳转
 */
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { redirectTo } from '../uniapp'
import { ChatRouteParams, ChatMessageInfo } from '@/interfaces/message/chatMessage'
import apiQuotation from '@/api/member/project/audit/api.quotation'
/**
 * @Author: Longcan.Yang
 * @Date: 2025-06-16 10:03:25
 * @param {ChatRouteParams} routeParams
 * @description:进入审核页面
 */
export function toAppQuotation(routeParams: ChatRouteParams): void {
  let temPath = ''
  apiQuotation.getQuotaInfo(routeParams.refcode).then(res => {
    if (res.data.quotaInfo.quotaStatus === '1') {
      // 待报价跳转到报价审核页
      temPath = `/member/project/audit/quotation/audit/${encodeBase64(routeParams.refcode)}`
    } else {
      // 其他状态跳入报价详情
      temPath = `/member/project/audit/quotation/detail/${encodeBase64(routeParams.refcode)}`
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
 * @description:进入申请书详情页
 */
export function appClQuotationQuery(routeParams: ChatRouteParams): void {
  const temPath = `/member/project/query/application/detail/${encodeBase64(routeParams.appRefcode)}`
  const messageInfo = {
    path: temPath,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member/project`)
}
