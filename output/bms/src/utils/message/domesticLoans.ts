/*
 * @Author       : MingChun.Cheng
 * @Date         : 2023-09-26 15:47:13
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2023-11-01 09:52:44
 * @Description  : 微信公众号消息跳转，国内贷后
 */
import { redirectTo } from '../uniapp'
import { setStorage } from '../storages'
import { ChatMessageInfo } from '@/interfaces/message/chatMessage'
/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 跳转至预计回款反馈
 */
export function paymentInfoFeedbackPage(): void {
  const messageInfo = {
    path: '/member/myinfo/paymentInfoFeedback',
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member`)
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 跳转至首页
 */
export function homePage(): void {
  const messageInfo = {
    path: '/member/customer',
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member`)
}
