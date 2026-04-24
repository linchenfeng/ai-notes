/*
 * @Author       : longcan.Yang
 * @Date         : 2023-05-10 13:17:50
 * @LastEditors  : may.ruan
 * @LastEditTime : 2023-08-16 09:21:52
 * @Description  :微信公众号消息跳转，实名认证
 */
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { ChatMessageInfo } from '@/interfaces/message/chatMessage'
import { redirectTo } from '../uniapp'
// 实名认证审核通过
export function authReview(orgRefcode: string): void {
  const messageInfo = {
    path: `/member/customer/detail/${encodeBase64(orgRefcode)}/${encodeBase64('1')}`,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member`)
}
// 证书寄送
// export function certificate(orgRefcode) {
//   const messageInfo = {
//     path: `/member/customer/${encodeBase64(orgRefcode)}/${encodeBase64('1')}`,
//     isNotSkip: true
//   }
//   setStorage('messageInfo', messageInfo as ChatMessageInfo)
//   redirectTo(`/member/home`)
// }
