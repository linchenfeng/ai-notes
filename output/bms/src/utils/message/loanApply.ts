/*
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-16 09:32:40
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-12 16:13:12
 * @Description  : 申请融资公众号消息跳转
 */
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { redirectTo } from '../uniapp'
import { ChatRouteParams, ChatMessageInfo } from '@/interfaces/message/chatMessage'
import apiLoanApply from '@/api/member/project/apply/api.loanApply'
import { errorToast } from './index'
/**
 * @Author: Longcan.Yang
 * @Date: 2025-06-16 10:03:25
 * @param {ChatRouteParams} routeParams
 * @description:进入融资申请修改页面
 */
export function loanToApply(routeParams: ChatRouteParams): void {
  let temPath = ''
  apiLoanApply.getLoanDetail(routeParams.refcode).then(res => {
    if (!res.data.fintLoaVo) {
      // 数据被删除
      errorToast('当前业务状态已变更，请关注最新消息')
      return
    }

    if (['2'].includes(res.data.fintLoaVo.loanStatus)) {
      // 已退回  跳入申请修改页面
      temPath = `/member/project/apply/loanApply/apply/${encodeBase64(routeParams.refcode)}`
    } else {
      // 其他状态跳入详情
      temPath = `/member/project/query/loanApply/detail/${encodeBase64(routeParams.refcode)}`
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
 * @description:进入申请审核提交页面
 */
export function loanApplyApproval(routeParams: ChatRouteParams): void {
  let temPath = ''
  apiLoanApply.getLoanDetail(routeParams.refcode).then(res => {
    if (!res.data.fintLoaVo) {
      // 数据被删除
      errorToast('当前业务状态已变更，请关注最新消息')
      return
    }
    if (['1', '2'].includes(res.data.fintLoaVo.loanStatus) && res.data.fintLoaVo.currentOperatorLevel === routeParams.nodeLevel) {
      // 审批中、已退回 && 当前审批层级一致 跳入审批页面
      if (res.data.fintLoaVo.approverFlag === '1') {
        temPath = `/member/project/audit/loanApply/audit/${encodeBase64(routeParams.refcode)}`
      } else {
        temPath = `/member/project/query/loanApply/detail/${encodeBase64(routeParams.refcode)}`
      }
      // 1-待审批tab页
    } else {
      // 其他状态跳入详情
      temPath = `/member/project/query/loanApply/detail/${encodeBase64(routeParams.refcode)}`
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
 * @description:进入贷前查询-融资申请查询详情页
 */
export function loanApplyQuery(routeParams: ChatRouteParams): void {
  apiLoanApply.getLoanDetail(routeParams.refcode).then(res => {
    if (!res.data.fintLoaVo) {
      // 数据被删除
      errorToast('当前业务状态已变更，请关注最新消息')
      return
    }
    const temPath = `/member/project/query/loanApply/detail/${encodeBase64(routeParams.refcode)}`
    const messageInfo = {
      path: temPath,
      isNotSkip: true
    }
    setStorage('messageInfo', messageInfo as ChatMessageInfo)
    redirectTo(`/member/project`)
  })
}
