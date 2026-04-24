/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-03 20:47:12
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-04 09:33:17
 * @Description  : 税票授权成功
 */
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { redirectTo } from '../uniapp'
import { ChatRouteParams, ChatMessageInfo } from '@/interfaces/message/chatMessage'
// 税票授权成功，公众号跳转到客户详情(发送客户经理)
export function orgTaxAuthDetail(routeParams: ChatRouteParams): void {
  const messageInfo = {
    path: `/member/customer/detail/${encodeBase64(routeParams.orgRefcode)}`,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member/customer`)
}
// 税票授权失败，公众号跳转到客户详情(发送客户经理)
export function orgTaxAuthFail(routeParams: ChatRouteParams): void {
  const messageInfo = {
    path: `/member/customer/detail/${encodeBase64(routeParams.orgRefcode)}`,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member/customer`)
}
