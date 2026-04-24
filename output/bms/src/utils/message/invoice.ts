/*
 * @Author       : Charon.Lin
 * @Date         : 2025-09-18 18:58:16
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-12 13:49:10
 * @Description  : 开票管理公众号消息跳转
 */
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { redirectTo } from '../uniapp'
import { ChatRouteParams, ChatMessageInfo } from '@/interfaces/message/chatMessage'
import apiInvoice from '@/api/member/myinfo/api.invoice'
import { errorToast } from './index'
/**
 * @Author: Charon.Lin
 * @Date: 2025-06-16 09:47:40
 * @param {ChatRouteParams} routeParams
 * @description: 跳转开票审核
 */
export function invoiceAudit(routeParams: ChatRouteParams): void {
  let temPath = ''
  apiInvoice.getInvoiceDetail(routeParams.refcode).then(res => {
    // 非待审核提示业务变更
    const fgaiAppVo = res.data.fgaiAppVo
    if (fgaiAppVo.appStatus !== '11') {
      errorToast('当前业务状态已变更，请关注最新消息')
    } else {
      //待审核跳转到审核详情
      temPath = `/member/project/audit/invoice/audit/${encodeBase64(routeParams.refcode)}`
      const messageInfo = {
        path: temPath,
        isNotSkip: true
      }
      setStorage('messageInfo', messageInfo as ChatMessageInfo)
      redirectTo(`/member/project`)
    }
  })
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-06-16 09:47:40
 * @param {ChatRouteParams} routeParams
 * @description: 跳转开票管理查询详情页
 */
export function invoiceQuery(routeParams: ChatRouteParams): void {
  const temPath = `/member/myinfo/invoice/detail/${encodeBase64(routeParams.refcode)}`
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
 * @description: 跳转开票管理退回重新提交详情页
 */
export function invoiceReturnQuery(routeParams: ChatRouteParams): void {
  let temPath = ''
  apiInvoice.getInvoiceDetail(routeParams.refcode).then(res => {
    // 非待审核提示业务变更
    const fgaiAppVo = res.data.fgaiAppVo
    // eslint-disable-next-line no-extra-parens
    if (fgaiAppVo.appStatus === '12' || (fgaiAppVo.appStatus === '4' && fgaiAppVo.confirmStatus === '3')) {
      temPath = `/member/myinfo/invoice/apply/${encodeBase64('apply')}/${encodeBase64(routeParams.refcode)}`
    } else {
      //待审核跳转到审核详情
      temPath = `/member/myinfo/invoice/detail/${encodeBase64(routeParams.refcode)}`
    }
    const messageInfo = {
      path: temPath,
      isNotSkip: true
    }
    setStorage('messageInfo', messageInfo as ChatMessageInfo)
    redirectTo(`/member/project`)
  })
}
