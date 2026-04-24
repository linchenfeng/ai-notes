/*
 * @Author       : longcan.Yang
 * @Date         : 2023-05-10 13:16:32
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2023-12-18 17:53:48
 * @Description  : 微信公众号消息跳转，专项融资
 */
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { redirectTo } from '../uniapp'
import { ChatRouteParams, ChatMessageInfo } from '@/interfaces/message/chatMessage'
// 专项融资发起申请、放款成功、拒绝
export function baoyaFinancingDetail(routeParams: ChatRouteParams): void {
  const messageInfo = {
    path: `/member/customer/projectStatistics/detail/${encodeBase64(routeParams.orgRefcode)}/${encodeBase64(routeParams.cpOrgname)}/${encodeBase64(
      routeParams.applyDate
    )}`,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member`)
}
// 宝亚通过融资额度到期提醒
export function baoyaClDueRemind(orgRefcode): void {
  const messageInfo = {
    path: `/member/customer/detail/${encodeBase64(orgRefcode)}/${encodeBase64('2')}`,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member`)
}
