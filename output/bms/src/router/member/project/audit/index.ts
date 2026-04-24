/*
 * @Author       : may.ruan
 * @Date         : 2022-10-08 11:39:40
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-23 15:46:10
 * @Description  : 项目审核路由
 */
import quotaAudit from './quotaAudit' // 额度审核路由
import quotation from './quotation' // 业务报价
import access from './access' // 业务准入
import meetingReview from './meetingReview' // 上会复核
import meetingApproval from './meetingApproval' // 上会审批
import meetingCollect from './meetingCollect' // 核贷书意见汇整复核
import special from './special' // 特批审批
import warning from './warning' // 预警解除审批
import freeze from './freeze' // 额度冻结/解冻审批
import assistAppoint from './assistAppoint' // 指派协销/征信
import documentReview from './documentReview' //资料复核
import assignDueDiligence from './assignDueDiligence' // 指派尽调
import check from './check' // 核查企业信息
import loanApply from './loanApply' // 融資申請審核
import invoice from './invoice' // 开票审核
export default [
  ...quotaAudit,
  ...quotation,
  ...access,
  ...meetingReview,
  ...meetingApproval,
  ...meetingCollect,
  ...special,
  ...warning,
  ...freeze,
  ...assistAppoint,
  ...documentReview,
  ...assignDueDiligence,
  ...check,
  ...loanApply,
  ...invoice
]
