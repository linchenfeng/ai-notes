/*
 * @Author       : longcan.Yang
 * @Date         : 2023-05-10 13:17:00
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-02-05 14:13:53
 * @Description  : 微信公众号消息跳转，业务模块(业务申请、业务准入、业务查询)
 */
import apiBusinessApply from '@/api/member/project/apply/api.businessApply'
import { encodeBase64 } from '@/utils/crypto'
import { setStorage } from '../storages'
import { ChatMessageInfo } from '@/interfaces/message/chatMessage'
import { redirectTo } from '../uniapp'
import { errorToast } from './index'
import apiCheck from '@/api/member/project/audit/api.check'
// 1、用户提交了业务申请，通知审核人审核
// 2、客户经理回复了问题，通知审核人查看
export function intApplyAccess(routeParams) {
  apiBusinessApply.getOverseasBusinessInfo(routeParams.refcode).then(res => {
    let messageInfo = {}
    //准入被删除或撤回
    if (!res.data.intLoanStatus || res.data.intLoanStatus === '5' || res.data.intLoanStatus === '10') {
      errorToast('当前业务状态已变更，请关注最新消息', '/member/project/audit/access')
      return
    } else if (['1'].includes(res.data.intLoanStatus)) {
      if (res.data.approveLevel === routeParams.approveLevel) {
        // 审核中且是当前审核节点跳入审核页面
        messageInfo = {
          path: `/member/project/audit/access/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64('1')}`,
          isNotSkip: true
        }
      } else {
        // 审核中且非当前审核节点跳入审核详情页面
        messageInfo = {
          path: `/member/project/audit/access/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64('7')}`,
          isNotSkip: true
        }
      }
    } else if (res.data.approveLevel === 0) {
      // 未参与过审批提示业务变更
      errorToast('当前业务状态已变更，请关注最新消息', '/member/project/audit/access')
      return
    } else {
      messageInfo = {
        path: `/member/project/audit/access/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64('8')}`,
        isNotSkip: true
      }
    }
    setStorage('messageInfo', messageInfo as ChatMessageInfo)
    redirectTo(`/member/project`)
  })
}
// 1、用户提交了业务申请，通知主管查询
// 2、审批人审批了业务申请，通知客户经理、主管查看
// 3、审批人有新提问，通知客户经理处理问题
export function intApplyQuery(routeParams) {
  apiBusinessApply.getOverseasBusinessInfo(routeParams.refcode).then(res => {
    let messageInfo = {}
    //准入被删除或被撤回
    if (!res.data.intLoanStatus || ['5', '10'].includes(res.data.intLoanStatus)) {
      if (['1', '2'].includes(routeParams.jumpFlag)) {
        errorToast('当前业务状态已变更，请关注最新消息', '/member/project/audit/access')
      } else {
        errorToast('当前业务状态已变更，请关注最新消息', '/member/project/query/access')
      }
    } else {
      if (routeParams.jumpFlag === '1') {
        if (['1'].includes(res.data.intLoanStatus)) {
          // 运营端代撤回终审未审核跳准入审核页
          messageInfo = {
            path: `/member/project/audit/access/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64(1)}`,
            isNotSkip: true
          }
        } else {
          // 运营端代撤回终审已审核跳准入详情页
          messageInfo = {
            path: `/member/project/audit/access/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64(8)}`,
            isNotSkip: true
          }
        }
      } else if (routeParams.jumpFlag === '2') {
        // 运营端代撤回历史审批人跳准入详情页
        messageInfo = {
          path: `/member/project/audit/access/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64(8)}`,
          isNotSkip: true
        }
      } else {
        // 状态变更跳入查询详情
        messageInfo = {
          path: `/member/project/query/access/detail/${encodeBase64(routeParams.refcode)}`,
          isNotSkip: true
        }
      }
      setStorage('messageInfo', messageInfo as ChatMessageInfo)
      redirectTo(`/member/project`)
    }
  })
}
// 申请准入解除绑定发送消息有权人点击消息，跳转业务准入的列表页面
export function intApplyOverseasBusiness() {
  errorToast('当前业务状态已变更，请关注最新消息', '/member/project/audit/access')
}
// 受理申请
export function intApplyAccept(refcode) {
  apiBusinessApply.getOverseasBusinessInfo(refcode).then(res => {
    let messageInfo = {}
    //准入被删除
    if (!res.data.intLoanStatus) {
      errorToast('当前业务状态已变更，请关注最新消息', '/member/project/query/access')
      return
    } else if (res.data.intLoanStatus === '6') {
      // 待受理
      messageInfo = {
        path: `/member/project/apply/acceptCus/apply/${encodeBase64(refcode)}`,
        isNotSkip: true
      }
    } else {
      // 状态变更跳入查询详情
      messageInfo = {
        path: `/member/project/query/access/detail/${encodeBase64(refcode)}`,
        isNotSkip: true
      }
    }
    setStorage('messageInfo', messageInfo as ChatMessageInfo)
    redirectTo(`/member/project`)
  })
}
export function internationQuery() {
  const messageInfo = {
    path: '/member/project/query/access',
    isNotSkip: true
  }
  setStorage('messageInfo', messageInfo as ChatMessageInfo)
  redirectTo(`/member/project`)
}
// 审核超时提醒
export function intApproveReminder(routeParams) {
  apiBusinessApply.getOverseasBusinessInfo(routeParams.refcode).then(res => {
    let messageInfo = {}
    //准入被删除
    if (!res.data.intLoanStatus || ['5', '10'].includes(res.data.intLoanStatus)) {
      errorToast('当前业务状态已变更，请关注最新消息', '/member/project/audit/access')
      return
    } else if (['1'].includes(res.data.intLoanStatus)) {
      if (res.data.approveLevel === routeParams.approveLevel) {
        // 审核中且是当前审核节点跳入审核页面
        messageInfo = {
          path: `/member/project/audit/access/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64('1')}`,
          isNotSkip: true
        }
      } else {
        // 审核中且非当前审核节点跳入审核页面
        messageInfo = {
          path: `/member/project/audit/access/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64('7')}`,
          isNotSkip: true
        }
      }
    } else if (res.data.approveLevel === 0) {
      // 未参与过审批提示业务变更
      errorToast('当前业务状态已变更，请关注最新消息', '/member/project/audit/access')
      return
    } else {
      messageInfo = {
        path: `/member/project/audit/access/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64('8')}`,
        isNotSkip: true
      }
    }
    setStorage('messageInfo', messageInfo as ChatMessageInfo)
    redirectTo(`/member/project`)
  })
}
// 核查申请
export function intOrgVerify(routeParams) {
  apiCheck.getOrgVerifyInfo({ refcode: routeParams.refcode }).then(res => {
    let messageInfo = {}
    const { fintAplChkVo } = res.data
    if (!fintAplChkVo) {
      //准入已被撤回或删除
      errorToast('当前业务状态已变更，请关注最新消息', '/member/project/audit/check')
      return
    }
    const { checkSuperior = '', checkUsers } = fintAplChkVo
    //当前人员是核查主管或核查人员
    if (checkSuperior.includes(routeParams.wxUserid) || checkUsers.includes(routeParams.wxUserid)) {
      messageInfo = {
        path: `/member/project/audit/check/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64(res.data.fintAplChkVo.checkStatus)}`,
        isNotSkip: true
      }
      setStorage('messageInfo', messageInfo as ChatMessageInfo)
      redirectTo(`/member/project`)
    } else {
      //当前用户不是核查主管或核查人员
      errorToast('当前业务状态已变更，请关注最新消息', '/member/project/audit/check')
      return
    }
  })
}
// 核查人员填写完成核查企业信息提交成功后，公众号通知有权审批人
export function checkOrgVerified(routeParams) {
  apiCheck.getOrgVerifyInfo({ refcode: routeParams.refcode }).then(res => {
    let messageInfo = {}
    const { fintAplChkVo } = res.data
    if (!fintAplChkVo) {
      //准入已被撤回或删除
      errorToast('当前业务状态已变更，请关注最新消息', '/member/project/audit/check')
      return
    }
    messageInfo = {
      path: `/member/project/audit/check/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64(res.data.fintAplChkVo.checkStatus)}`,
      isNotSkip: true
    }
    setStorage('messageInfo', messageInfo as ChatMessageInfo)
    redirectTo(`/member/project`)
  })
}
export function intAccessWithVerify(routeParams) {
  apiBusinessApply.getOverseasBusinessInfo(routeParams.refcode).then(res => {
    let messageInfo = {}
    //准入被删除
    if (!res.data.intLoanStatus) {
      errorToast('当前业务状态已变更，请关注最新消息', '/member/project/audit/access')
      return
    } else if (['1'].includes(res.data.intLoanStatus)) {
      // 审核中且是当前审核节点跳入审核页面
      messageInfo = {
        path: `/member/project/audit/access/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64('1')}`,
        isNotSkip: true
      }
    } else if (res.data.approveLevel === 0) {
      // 未参与过审批提示业务变更
      errorToast('当前业务状态已变更，请关注最新消息', '/member/project/audit/access')
      return
    } else {
      messageInfo = {
        path: `/member/project/audit/access/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64('7')}`,
        isNotSkip: true
      }
    }
    setStorage('messageInfo', messageInfo as ChatMessageInfo)
    redirectTo(`/member/project`)
  })
}

// 准入提问通知历史审批人
export function intAccessQuizSubmitted(routeParams) {
  apiBusinessApply.getOverseasBusinessInfo(routeParams.refcode).then(res => {
    let messageInfo = {}
    //准入被删除
    if (!res.data.intLoanStatus || ['5', '10'].includes(res.data.intLoanStatus)) {
      errorToast('当前业务状态已变更，请关注最新消息', '/member/project/audit/access')
      return
    }
    messageInfo = {
      path: `/member/project/audit/access/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64(8)}`,
      isNotSkip: true
    }
    setStorage('messageInfo', messageInfo as ChatMessageInfo)
    redirectTo(`/member/project`)
  })
}
//准入通过/拒绝/有条件通过通知历史审批人|暂缓通知历史审批人
export function intAccessQueryAccess(routeParams) {
  apiBusinessApply.getOverseasBusinessInfo(routeParams.refcode).then(res => {
    let messageInfo = {}
    //准入被删除
    if (!res.data.intLoanStatus || ['5', '10'].includes(res.data.intLoanStatus)) {
      errorToast('当前业务状态已变更，请关注最新消息', '/member/project/audit/access')
      return
    }
    messageInfo = {
      path: `/member/project/audit/access/audit/${encodeBase64(routeParams.refcode)}/${encodeBase64(8)}`,
      isNotSkip: true
    }
    setStorage('messageInfo', messageInfo as ChatMessageInfo)
    redirectTo(`/member/project`)
  })
}
// 解除暂缓
export function projectHome() {
  errorToast('当前业务状态已变更，请关注最新消息', '/member/project')
}
