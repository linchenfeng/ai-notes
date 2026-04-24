/*
 * @Author       : Mingchun.Cheng
 * @Date         : 2025-08-08 10:27:21
 * @LastEditors  : Mingchun.Cheng
 * @LastEditTime : 2025-08-11 17:11:05
 * @Description  : 冻结/解冻公众号跳转
 */
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { redirectTo } from '../uniapp'
import { ChatRouteParams, ChatMessageInfo } from '@/interfaces/message/chatMessage'
import apiFreezeApprovalAudit from '@/api/member/project/audit/api.freezeApprovalAudit'
import { errorToast } from './index'
/**
 * @Author: Mingchun.Cheng
 * @Date: 2025-06-16 09:47:40
 * @param {ChatRouteParams} routeParams
 * @description: 跳入审批详情页面进行审批
 */
export function freezeAudit(routeParams: ChatRouteParams): void {
  const data = {
    refcode: routeParams.refcode,
    queryFlag: '0'
  }
  let temPath = ''
  apiFreezeApprovalAudit.getFreezeAppInfo(data).then(res => {
    if (res.data.nodata === '1') {
      // 数据被删除
      errorToast('当前业务状态已变更，请关注最新消息')
      return
    }
    if (res.data.fintFreezeMVo && ['1'].includes(res.data.fintFreezeMVo.applyStatus) && res.data.flowNodeVo.nodeLevel === routeParams.nodeLevel) {
      // 审批中 && 当前审批层级一致 跳入审批页面
      temPath = `/member/project/audit/freeze/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64(routeParams.taskRefcode)}`
    } else if (res.data.fintFreezeMVo && ['1', '2', '3', '4'].includes(res.data.fintFreezeMVo.applyStatus)) {
      // 其他情况
      temPath = `/member/project/query/freeze/detail/${encodeBase64(routeParams.refcode)}}`
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
 * @Author: Mingchun.Cheng
 * @Date: 2025-07-15 14:52:04
 * @param {ChatRouteParams} routeParams
 * @description: 跳转到待处理列表页
 */
export function freezeTrigger(): void {
  const temPath = `/member/project/apply/warning`
  const messageInfo = {
    path: temPath,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member/project`)
}
