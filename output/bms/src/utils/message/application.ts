/*
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-22 09:22:11
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-05-15 16:41:46
 * @Description  : 微信公众号跳转 填报申请书跳转
 */
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { redirectTo } from '../uniapp'
import { ChatRouteParams, ChatMessageInfo } from '@/interfaces/message/chatMessage'
import apiFillingApplication from '@/api/member/project/apply/api.fillingApplication'
import { errorToast } from './index'
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-22 10:02:56
 * @param {ChatRouteParams} routeParams
 * @description: 运营端审核完成，客户经理进入详情查看
 */
export function applicationAudit(routeParams: ChatRouteParams): void {
  const data = {
    refcode: routeParams.refcode,
    orgname: routeParams.orgname
  }
  let temPath = ''
  apiFillingApplication.getApplicationInfo(data, false).then(res => {
    if (['7', '8'].includes(res.data.fintAppM.applyStatus)) {
      // 跳入填报申请书
      temPath = `/member/project/apply/application/apply/${encodeBase64(routeParams.refcode)}/${encodeBase64(routeParams.orgname)}/${encodeBase64(
        routeParams.ctyid
      )}`
    } else {
      // 跳入详情
      temPath = `/member/project/query/application/detail/${encodeBase64(routeParams.refcode)}`
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
 * @Date: 2024-10-22 10:03:08
 * @param {ChatRouteParams} routeParams
 * @description: 客户提交申请，客户经理处理
 */
export function applicationCustomerSubmit(routeParams: ChatRouteParams): void {
  const data = {
    refcode: routeParams.refcode,
    orgname: routeParams.orgname
  }
  let temPath = ''
  apiFillingApplication.getApplicationInfo(data, false).then(res => {
    if (['1', '2', '3', '7', '8'].includes(res.data.fintAppM.applyStatus)) {
      // 跳入填报申请书
      temPath = `/member/project/apply/application/apply/${encodeBase64(routeParams.refcode)}/${encodeBase64(routeParams.orgname)}/${encodeBase64(
        routeParams.ctyid
      )}`
    } else {
      // 跳入详情
      temPath = `/member/project/query/application/detail/${encodeBase64(routeParams.refcode)}`
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
 * @Date: 2024-10-22 10:03:08
 * @param {ChatRouteParams} routeParams userName客户经理名称
 * @description: 客户提交申请，客户经理处理
 */
export function applicationConfirmQuery(routeParams: ChatRouteParams, userName: string): void {
  const data = {
    refcode: routeParams.refcode,
    orgname: routeParams.orgname
  }
  let temPath = ''
  apiFillingApplication.getApplicationInfo(data, false).then(res => {
    if (['1', '2', '3', '7', '8'].includes(res.data.fintAppM.applyStatus) && res.data.userName === userName) {
      // 客户经理且状态是待填报跳入填报申请书
      temPath = `/member/project/apply/application/apply/${encodeBase64(routeParams.refcode)}/${encodeBase64(routeParams.orgname)}/${encodeBase64(
        routeParams.ctyid
      )}`
    } else {
      // 非客户经理或非待填报跳入详情
      temPath = `/member/project/query/application/detail/${encodeBase64(routeParams.refcode)}`
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
 * @Date: 2024-10-22 10:03:08
 * @param {ChatRouteParams} routeParams userName客户经理名称
 * @description: 运营端申请书审核退回
 */
export function applicationReturnQuery(routeParams: ChatRouteParams): void {
  const data = {
    refcode: routeParams.refcode,
    orgname: routeParams.orgname
  }
  let temPath = ''
  apiFillingApplication.getApplicationInfo(data, false).then(res => {
    if (res.data.fintAppM.applyStatus === routeParams.applyStatus) {
      // 状态未发生变化跳入详情
      temPath = `/member/project/query/application/detail/${encodeBase64(routeParams.refcode)}`
      const messageInfo = {
        path: temPath,
        isNotSkip: true
      }
      setStorage('messageInfo', messageInfo as ChatMessageInfo)
      redirectTo(`/member/project`)
    } else {
      errorToast('当前业务状态已变更，请关注最新消息')
    }
  })
}

/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-22 10:02:56
 * @param {ChatRouteParams} routeParams
 * @description: // 客户经理提交了申请书||到账确认通过后||客户经理在BMS提交申请书财务到账确认时审核退回||运营端申请书审核通过||运营端申请书审核拒绝
 */
export function applicationQuery(routeParams: ChatRouteParams): void {
  // 跳入详情
  const temPath = `/member/project/query/application/detail/${encodeBase64(routeParams.refcode)}`
  const messageInfo = {
    path: temPath,
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member/project`)
}
